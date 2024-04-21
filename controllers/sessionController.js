const Session = require('../models/sessionModel');
const Faculty = require('../models/facultyModel');
const TimeTable = require('../models/timeTableModel');
const Notification = require('../models/notificationModel');
const Course = require('../models/courseModel');
const ClassRoom = require('../models/classRoomModel');

const createSession = async (req, res) => {
    try {
        const {
            startTime,
            stopTime,
            location,
            course,
            type,
            name
        } = req.body;

        const newStartTime = new Date(startTime)
        const newStopTime = new Date(stopTime)

        const existingSessions = await Session.find({
            location,
            $or: [
                { startTime: { $lt: newStopTime }, stopTime: { $gt: newStartTime } },
                { startTime: { $gte: newStartTime, $lt: newStopTime } },
                { stopTime: { $gt: newStartTime, $lte: newStopTime } }
            ]
        });

        if (existingSessions.length > 0) {
            return res.status(400).json({ message: "Session overlaps with existing session(s) at the same location and/or course!" });
        }

        const newSession = new Session({
            startTime: newStartTime,
            stopTime: newStopTime,
            location,
            course,
            type
        });

        if(course === undefined || course === null || course === ""){
            //DB update
            const sessionCreated = await newSession.save()

            const locationData = ClassRoom.findById(location);
            if(locationData){
                const message = `An event has been organized for ${name} at ${locationData.name} from ${startTime} to ${stopTime}.`
                
                const newNotification = new Notification({
                    facultyId: "",
                    message: message,
                    type: "all"
                });

                const respData = {
                    session: sessionCreated,
                    notification: newNotification
                };

                return res.status(201).json({data: respData, message: "Session Created Successfully!"});
            }           
        }
        else{
            const faculty = await Faculty.findOne({courses: course});
            
            const timeTable = await TimeTable.findOne({faculty: faculty._id});

            //DB update
            const sessionCreated = await newSession.save()

            const timeTableUpdated = await TimeTable.findByIdAndUpdate(timeTable._id, {
                $push: {sessions: sessionCreated._id}
            }, {new: true});
    
            const respData = {
                session: sessionCreated,
                timeTable: timeTableUpdated
            };  

            if(sessionCreated && timeTableUpdated){
                res.status(201).json({data: respData, message: "Session Created Successfully!"});
            }
            else {
                throw new Error({data: respData, message: "Error creating session and updating timeTable!"});
            }
        }
        
    } catch (error) {
        console.log(error)
        res.status(400).json({data: {}, message: "Error Creating Session."})
    }
}

const updateSession = async (req, res) => {
    try {
        const {id} = req.params;
        
        const {
            startTime,
            stopTime,
            location,
            course,
            type
        } = req.body;

        // Validate startTime and stopTime
        if (startTime > stopTime) {
            return res.status(400).json({data: {}, message: "The Start Time cannot be greater than the Stop Time!" });
        }

        const newStartTime = new Date(startTime)
        const newStopTime = new Date(stopTime)

        const existingSessions = await Session.find({
            location,
            $or: [
                { startTime: { $lt: newStopTime }, stopTime: { $gt: newStartTime } },
                { startTime: { $gte: newStartTime, $lt: newStopTime } },
                { stopTime: { $gt: newStartTime, $lte: newStopTime } }
            ]
        });

        if (existingSessions.length > 0) {
            return res.status(400).json({ message: "Session overlaps with existing session(s) at the same location and/or course!" });
        }

        const updatedSession = await Session.findByIdAndUpdate(id, {
            startTime: newStartTime,
            stopTime: newStopTime,
            location,
            course,
            type
        }, { new: true });

        const respData = {
            session: updatedSession
        };

        if(updatedSession){
            const changedCourse = await Course.findById(course);
            if(changedCourse){
                const newNotification = new Notification({
                    facultyId: changedCourse.faculty,
                    message: `The Session for Course ${changedCourse.name} has been updated. Please Refer your timetable for more details.`,
                    type: "faculty"
                });
                await newNotification.save();
            }
            else{
                res.status(400).json({data: {}, message: "Course of Session does not exist."});
            }
        }

        if (updatedSession) {
            res.status(200).json({ data: respData, message: "Session Updated Successfully!" });
        } else {
            throw new Error({ data: respData, message: "Error updating session!" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({data: {}, message: "Error Updating Session."});
    }
}

const deleteSession = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedSession = await Session.findByIdAndDelete(id);

        if (!deletedSession) {
            throw new Error("Error deleting session!");
        }

        const timeTable = await TimeTable.findOneAndUpdate({ sessions: deletedSession._id }, {
            $pull: { sessions: deletedSession._id }
        }, { new: true });

        if (!timeTable) {
            throw new Error("Error updating timeTable!");
        }

        if(timeTable){
            const deletedCourse = await Course.findById(deletedSession.course);
            if(deletedCourse){
                const newNotification = new Notification({
                    facultyId: deletedCourse.faculty,
                    message: `The Session for Course ${deletedCourse.name} has been cancelled. Please Refer your timetable for more details.`,
                    type: "faculty"
                });
                await newNotification.save();
            }
            else{
                res.status(400).json({data: {}, message: "Course or Session does not exist."});
            }
        }

        const respData = {
            session: deletedSession,
            timeTable: timeTable
        };

        res.status(200).json({ data: respData, message: "Session Deleted Successfully!" });
    } catch (error) {
        console.log(error);
        res.status(400).json("Error Deleting Session.");
    }
}
module.exports = { createSession, updateSession, deleteSession };
