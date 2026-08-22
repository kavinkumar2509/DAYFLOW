import { fetchApi } from './client';

export interface AppNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationsApi = {
  /**
   * Get all notifications for current user (GET /notifications/me)
   */
  async getMyNotifications(): Promise<AppNotification[]> {
    const raw = await fetchApi<any[]>('/notifications/me');
    if (!Array.isArray(raw)) return [];
    return raw;
  },

  /**
   * Mark a notification as read (PATCH /notifications/:id/read)
   */
  async markAsRead(notificationId: string): Promise<AppNotification> {
    return fetchApi<AppNotification>(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  },

  /**
   * Mark all notifications as read (PATCH /notifications/read-all)
   */
  async markAllAsRead(): Promise<{ count: number }> {
    return fetchApi<{ count: number }>('/notifications/read-all', {
      method: 'PATCH',
    });
  },
};
