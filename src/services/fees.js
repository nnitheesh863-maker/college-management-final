import api from './api';

export const getMyFees = () => api.get('/fees/my').then(r => r.data);
export const getAllFees = () => api.get('/fees').then(r => r.data);
export const createFee = (data) => api.post('/fees/create', data).then(r => r.data);
export const createOrder = (feeId, data) => api.post(`/fees/${feeId}/create-order`, data).then(r => r.data);
export const verifyPayment = (data) => api.post('/fees/verify', data).then(r => r.data);
export const getPaymentHistory = () => api.get('/fees/payments').then(r => r.data);
export const getAllPayments = () => api.get('/fees/payments/all').then(r => r.data);
export const getAnalytics = () => api.get('/fees/analytics').then(r => r.data);
export const sendReminder = (feeId) => api.post('/fees/remind', { feeId }).then(r => r.data);
export const sendBulkReminders = () => api.post('/fees/remind', {}).then(r => r.data);
export const setupInstallmentPlan = (feeId, totalInstallments) =>
  api.post(`/fees/${feeId}/installment-plan`, { totalInstallments }).then(r => r.data);
