export interface Notification {
    notificationId: string | null;
    userId: string | null;
    title: string | null;
    message: string | null;
    type: string | null;
    createdAt: string | null;
    readStatus: boolean | null;
}
