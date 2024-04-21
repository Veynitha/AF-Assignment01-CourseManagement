const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const verifyJWT = require("./middlewares/verifyJWT");
const cors = require("cors");

const connectDB = require("./db/index");

const app = express();
const PORT = process.env.PORT;

//Middleware
app.use(bodyParser.json());
//middleware for cookies
app.use(cookieParser());
app.use(cors());
//Routes
app.use("/api/user", require("./routes/registerRouter"));
app.use("/api/auth", require("./routes/authRoutes"));

//Protected Routes
app.use(verifyJWT);
app.use("/api/course", require("./routes/courseRoutes"));
app.use("/api/classroom", require("./routes/classRoomRoute"));
app.use("/api/session", require("./routes/sessionRoutes"));
app.use("/api/resource", require("./routes/resourceRoute"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/notification", require("./routes/notificationRoute"));

connectDB();

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
