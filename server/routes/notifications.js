import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import Notification from '../models/Notification.js';

const router = Router();
router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments({ userId: req.user.id }),
    ]);

    const unreadCount = await Notification.countDocuments({ userId: req.user.id, read: false });

    res.json({
      notifications,
      total,
      unreadCount,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/read-all', async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id, read: false }, { read: true });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
