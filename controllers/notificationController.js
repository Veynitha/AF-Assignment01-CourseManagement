const Notification = require('../models/notificationModel');
const Faculty = require('../models/facultyModel');

exports.createNotification = async (req, res) => {
    try {
        const {
            facultyId,
            message,
            type
        } = req.body

        const newNotification = new Notification({
            facultyId,
            message,
            type
        });

        const notificationCreated = await newNotification.save()

        res.status(201).json({data: {notificationCreated}, message: "Notification Created Successfully."})
    } catch (error) {
        console.log(error)
        res.status(400).json({data: {}, message: "Error Creating Notification."})
    }
}