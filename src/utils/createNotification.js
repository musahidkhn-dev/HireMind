import Notification from "../models/notificationModel.js";


const createNotification = async ({ recipient, type, title, message, data = {}, }) => {
        try {
            const notification = await Notification.create({ recipient, type, title, message, data, });

            return notification;
        } catch (error) {
            console.error('createNotification error: ', error.message);
            //Don't throw - notification should never block main flow
        }
};

export default createNotification;