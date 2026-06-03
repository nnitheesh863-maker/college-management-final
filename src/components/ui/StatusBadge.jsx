const STYLES = {
  present: 'badge-success',
  absent: 'badge-danger',
  paid: 'badge-success',
  partial: 'badge-warning',
  unpaid: 'badge-danger',
  active: 'badge-success',
  pending: 'badge-warning',
  submitted: 'badge-info',
  critical: 'badge-danger',
  warning: 'badge-warning',
  success: 'badge-success',
  info: 'badge-info',
  high: 'badge-success',
  medium: 'badge-warning',
  low: 'badge-danger',
  open: 'badge-warning',
  closed: 'badge-neutral',
  approved: 'badge-success',
  rejected: 'badge-danger',
};

export default function StatusBadge({ status, children, className = '' }) {
  const style = STYLES[status] || 'badge-neutral';
  return (
    <span className={`${style} ${className}`}>
      {children}
    </span>
  );
}
