const Resource = require('../models/resourceModel');
const ClassRoom = require('../models/classRoomModel');

exports.createResource = async (req, res) => {
    try {
        const {
            description
        } = req.body

        const newResource = new Resource({
            description,
            location: ""
        });

        const resourceCreated = await newResource.save()

        res.status(201).json({data: resourceCreated, Message: "Resource Created Successfully!"})
    } catch (error) {
        console.log(error)
        res.status(400).json({data: {} , message: "Error Creating Resource."})
    }
}

exports.updateResource = async (req, res) => {
    try {
        const {id} = req.params;
        
        const {
            description,
            location
        } = req.body

        //Removing the reourse from an exising classRoom
        const classRoomWithResource = await ClassRoom.findOne({resources: id});

        //Updating the classRoom with the new resource
        const classRoomToBeUpdated = await ClassRoom.findById(location);

        if (classRoomWithResource) {
            classRoomWithResource.resources = classRoomWithResource.resources.filter(resource => resource != id);
            await classRoomWithResource.save();
        }

        if (classRoomToBeUpdated) {
            classRoomToBeUpdated.resources.push(id);
            await classRoomToBeUpdated.save();
        }

        const updatedResource = await Resource.findByIdAndUpdate(id, {
            description,
            location
        }, { new: true });

        const respData = {
            resource: updatedResource,
            classRoom: classRoomToBeUpdated
        }

        if (updatedResource) {
            res.status(201).json({data: respData, message: "Resource Updated Successfully!"})
        }
        else {
            throw new Error({data: {}, message: "Error updating resource!"});
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({data: {}, message: "Error Updating Resource."})
    }
}