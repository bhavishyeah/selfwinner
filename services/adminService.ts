import api from './api';

export const getAdminStats = async () => {
  const { data } = await api.get('/admin/stats');
  return data?.stats;
};

export const getAdminUsers = async (params?: { search?: string; role?: string; isActive?: boolean }) => {
  const { data } = await api.get('/admin/users', { params });
  return data?.users || [];
};

export const getAdminNotes = async (params?: { search?: string; status?: string; page?: number; limit?: number }) => {
  const { data } = await api.get('/admin/notes', { params });
  return data;
};

export const updateAdminNote = async (id: string, payload: Record<string, any>) => {
  const { data } = await api.patch(`/admin/notes/${id}`, payload);
  return data?.note;
};

export const getAdminTransactions = async (params?: { search?: string; status?: string }) => {
  const { data } = await api.get('/admin/transactions', { params });
  return data?.transactions || [];
};

export const getAdminSettings = async () => {
  const { data } = await api.get('/admin/settings');
  return data?.settings || {};
};

export const updateAdminSettings = async (payload: Record<string, any>) => {
  const { data } = await api.patch('/admin/settings', payload);
  return data?.settings || {};
};

export const refundAdminTransaction = async (id: string, payload: { reason: string; refundAmount?: number; refundType?: 'full' | 'partial' }) => {
  const { data } = await api.post(`/admin/transactions/${id}/refund`, payload);
  return data?.transaction;
};  
export const createAdminNotification = async (payload: Record<string, any>) => {
  const { data } = await api.post('/admin/notifications', payload);
  return data?.notification;
};

export const getAdminNotifications = async () => {
  const { data } = await api.get('/admin/notifications');
  return data?.notifications || [];
};
export const getAdminAuditLogs = async (params?: { actionType?: string; adminEmail?: string; dateFrom?: string; dateTo?: string }) => {
      const { data } = await api.get('/admin/audit-logs', { params });
  return data?.logs || [];
};
export const getAdminAuditLogsExportUrl = () => `${import.meta.env.VITE_API_URL}/api/admin/audit-logs/export`;

export const updateAdminNotification = async (id: string, payload: Record<string, any>) => {
  const { data } = await api.patch(`/admin/notifications/${id}`, payload);
  return data?.notification;
};