const Classroom = require('../models/classRoomModel');

exports.createClassRoom = async (req, res) => {
    try {
        const {
            name
        } = req.body

        const newClassRoom = new Classroom({
            name,
            resources : [],
            allocation : []
        });

        const classRoomCreated = await newClassRoom.save()

        res.status(201).json({ data:classRoomCreated, message: "ClassRoom Created Successfully!" })        
    } catch (error) {
        console.log(error)
        res.status(400).json("Error Creating ClassRoom.")
    }
}

exports.getAllClassRooms = async (req, res) => {
    try {
        const classRooms = await Classroom.find();
        if (classRooms) {
            return res.status(200).json({data: classRooms, message: "ClassRooms Retreived Successfully!"})
        }
    } catch (error) {
        return res.status(400).json("Error Retreiving ClassRooms.")
    }
}

exports.getClassRoomById = async (req, res) => {
    try {
        const classRoom = await Classroom.findById(req.params.id);
        if (classRoom) {
            return res.status(200).json({data: classRoom, message: "ClassRoom Retreived Successfully!"})
        }
    } catch (error) {
        return res.status(400).json("Error Retreiving ClassRoom.")
    }
}

exports.updateClassRoom = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name
        } = req.body

        const classRoom = await Classroom.findById(id);

        if (classRoom) {
            const updatedClassRoom = await Classroom.findByIdAndUpdate(id, {name}, {new: true})
            return res.status(200).json({data: updatedClassRoom, message: "ClassRoom Updated Successfully!"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).json("Error Updating ClassRoom.")
    }
}   
