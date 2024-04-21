const bcrypt = require('bcrypt');
const User = require('../models/usersModel');
const Student = require('../models/studentModel');
const Admin = require('../models/adminModel');
const Faculty = require('../models/facultyModel');
const TimeTable = require('../models/timeTableModel');

const registerStudent = async (req, res) => {
    const { email, password, name, faculty } = req.body;
    if (!email || !password) return res.status(400).json({ 'message': 'Email and password are required.' });
    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ email: email });
    const facultyExists = await Faculty.findById(faculty);

    if (duplicate) return res.status(400).json({data: {}, message: "User already exists."});' '
    if(!facultyExists) return res.status(400).json({data: {}, message: "Faculty does not exist."});
    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);
        
        //create the new user
        const newUser = {
            email: email,
            password: hashedPwd,
            role: "Student",
            refreshToken: "",
        };
        
        //store the new user
        const user = new User(newUser);
        await user.save();

        //create the student
        const newStudent = {
            name: name,
            email: email,
            userId: user._id,
            faculty: faculty,
            courses: []
        };

        //store the student
        const student = new Student(newStudent);
        await student.save();
       
        console.log("User created: ", user);
        console.log("Student created: ", student);

        if(student && user) {
            const respData = {
                user: user,
                student: student
            };

            res.status(201).json({ data: respData, message: "User Created Successfully!" });
        }
        else{
            throw new Error("Error creating user and student.");
        }	
    } catch (error) {
        res.status(500).json({ data : {}, message: error.message });
    }
}

const registerAdmin = async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ 'message': 'Email and password are required.' });
    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ email: email });
    if (duplicate) return res.sendStatus(409); //Conflict 
    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);
        
        //create the new user
        const newUser = {
            email: email,
            password: hashedPwd,
            role: "Admin",
            refreshToken: "",
        };
        
        //store the new user
        const user = new User(newUser);
        await user.save();

        //create the student
        const newAdmin = {
            name: name,
            email: email,
            userId: user._id
        };

        //store the student
        const admin = new Admin(newAdmin);
        await admin.save();
       
        console.log("User created: ", user);
        console.log("Admin created: ", admin);

        if(admin && user) {
            const respData = {
                user: user,
                admin: admin
            };

            res.status(201).json({ data: respData, message: "User Created Successfully!" });
        }
        else{
            throw new Error("Error creating user and admin.");
        }	
    } catch (error) {
        res.status(500).json({ data : {}, message: error.message });
    }
}

const registerFaculty = async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ 'message': 'Email and password are required.' });
    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ email: email });
    if (duplicate) return res.sendStatus(409); //Conflict 
    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);
        
        //create the new user
        const newUser = {
            email: email,
            password: hashedPwd,
            role: "Faculty",
            refreshToken: "",
        };
        
        //store the new user
        const user = new User(newUser);
        await user.save();

        //create the student
        const newFaculty = {
            name: name,
            email: email,
            userId: user._id,
            courses: []
        };

        //store the student
        const faculty = new Faculty(newFaculty);
        await faculty.save();

        const newTimeTable = new TimeTable({
            faculty: faculty._id,
            sessions: []
        });

        await newTimeTable.save();
       
        console.log("User created: ", user);
        console.log("Faculty created: ", faculty);
        console.log("TimeTable created: ", newTimeTable);        

        if(faculty && user && newTimeTable) {
            const respData = {
                user: user,
                faculty: faculty,
                timeTable: newTimeTable
            };
            res.status(201).json({ data: respData, message: "User Created Successfully!" });
        }
        else{
            throw new Error("Error creating user and faculty.");
        }	
    } catch (error) {
        res.status(500).json({ data : {}, message: error.message });
    }
}

module.exports = { registerStudent, registerAdmin, registerFaculty };