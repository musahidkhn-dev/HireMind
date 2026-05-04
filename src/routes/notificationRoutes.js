import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getUnreadCount,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.patch('/mark-all-read', protect, markAllAsRead);
router.delete('/all', protect, deleteAllNotifications);
router.patch('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteNotification);


export default router;
