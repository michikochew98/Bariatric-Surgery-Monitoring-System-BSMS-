const express = require("express");
const mysql = require("mysql");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const expresshbs = require('express-handlebars');
const fileUpload = require('express-fileupload');


dotenv.config({ path: "./.env" });

const app = express();

//set db connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});

//define the static folder(image/css)
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));


//define hbs extension and engine folder(layouts and partial folder)
app.engine('hbs', expresshbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: 'views/layouts',
    partialsDir: 'views/partial',
    helpers: { todaysDate: () => new Date() } //can use {{todaysDate}} in any file
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

//set handlebars
app.set('view engine', 'hbs');

//connect to db
db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Mysql Connected');
    }
})

//define routes (r_pages and r_routes)
app.use('/', require('./routes/r_pages'));
app.use('/analytics', require('./routes/r_analytics'));
app.use('/profile', require('./routes/r_profile'));

app.use('/screening', require('./routes/r_screening'));
app.use('/exercise', require('./routes/r_exercise'));
app.use('/diet', require('./routes/r_diet'));
app.use('/auth', require('./routes/r_auth'));

app.use('/doctor', require('./routes/r_doctor'));
app.use('/admin', require('./routes/r_admin'));

app.listen(5050, () => {
    console.log("Server started on Port 5050");
})