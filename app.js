require('dotenv').config();
const express = require('express');
const cors = require('cors')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const authRoutes = require('./routers/auth');
const studentRoutes = require('./routers/student');
const courseRoutes = require('./routers/course');
const studyPlanCardRoutes = require('./routers/studyPlanCard')
const studentCoursesRoutes = require('./routers/studentCourses')


const app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ROUTERS
app.use("/auth", authRoutes)
app.use('/v1/students', studentRoutes);
app.use('/v1/courses', courseRoutes);
app.use('/v1/studyPlanCards', studyPlanCardRoutes);
app.use('/v1/studentCourses', studentCoursesRoutes);



module.exports = app;
