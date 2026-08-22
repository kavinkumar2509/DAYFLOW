import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationRecord, NotificationType } from '@dayflow/shared-types';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  private formatNotification(record: any): NotificationRecord {
    return {
      id: record.id,
      userId: record.userId,
      title: record.title,
      message: record.message,
      type: record.type as NotificationType,
      isRead: record.isRead,
      metadata: record.metadata || undefined,
      createdAt: record.createdAt.toISOString(),
    };
  }

  async getMyNotifications(userId: string): Promise<NotificationRecord[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return notifications.map((n) => this.formatNotification(n));
  }

  async markAsRead(id: string, userId: string): Promise<NotificationRecord> {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException(`Notification "${id}" not found.`);
    }

    const updated = await this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return this.formatNotification(updated);
  }

  async markAllAsRead(userId: string): Promise<{ success: boolean; count: number }> {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return { success: true, count: result.count };
  }

  async sendNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = NotificationType.SYSTEM_ALERT,
    metadata?: Record<string, any>,
  ): Promise<NotificationRecord> {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        metadata: metadata ? metadata : undefined,
      },
    });

    return this.formatNotification(notification);
  }
}
