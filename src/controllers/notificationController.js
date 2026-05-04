import Notification from "../models/notificationModel.js";


// --------- Get all notification for current user ----------------------------------------------------------
export const getNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 20, unreadOnly } = req.query;

        const filter = { recipient: req.user._id };
        if(unreadOnly === 'true') filter.isRead = false;

        const skip = (page -1 ) * limit;
        
        const [ notifications, total, unreadCount] = await Promise.all([
            Notification.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Notification.countDocuments(filter),
            Notification.countDocuments({
                recipient: req.user._id,
                isRead: false,
            }),
        ]) ;

        return res.status(200).json({
            notifications,
            unreadCount,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total/ limit),
            },
        });
    } catch (error) {
        console.error('getNotification Error: ', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};


//----- Mark single notification as read -------------------------------------------------


export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            recipient: req.user._id,
        });
    
        
        if(!notification) {
            return res.status(404).json({ message: 'Notification not found!' });
        }
        
        notification.isRead = true;
        await notification.save();

        return res.status(200).json({ message: 'Marked as read', notification });
    } catch (error) {
        console.error('markAsRead error: ', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};


//--------- Mark all notification as read-------------------------------------------------------------------------

export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { isRead: true },
        );

        return res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('markAllAsRead Error: ', error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
};


//------ Delete Single Notification ---------------------------------------------------------------------

export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            recipient: req.user._id,
        });



        if(!notification) {
            return res.status(404).json({ message: 'Notification not found!'});
        }

        return res.status(200).json({ message: 'Notification Deleted' });
    } catch (error) {
        console.error('deleteNotification error: ', error.message);
        return res.status(500).json({ message: 'Server Error ' });
    }
};



//--------- Delete All Notification ----------------------------------------------------------------------

export const deleteAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ recipient: req.user._id });

        return res.status(200).json({ message: 'All notifications deleted'});
    } catch (error) {
        console.error('deleteAllNotifications error: ', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};



//---------- Get unread count only ---------------------------------------------------------

export const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            recipient: req.user._id,
            isRead: false,
        });

        return res.status(200).json({ unreadCount: count });
    } catch (error) {
        console.error('getUnreadCount error: ' ,error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};
