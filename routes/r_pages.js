const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const authContoller = require('../controllers/c_auth');
const schedule = require('node-schedule');

//add db connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});

//localhost:5050/

//GET define routes and its view

//localhost/

router.get('/dashboard', authContoller.isLoggedIn, (req, res) => {
    if (req.user) {
        if (req.user.role === "Patient") {
            db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (err, row) => {
                if (!err) {

                    if (row.length != 0) {
                        db.query('SELECT * FROM doctordetails WHERE fullname = ?', [row[0].assignedTo], (err, rows) => {
                            if (!err) {

                                db.query('SELECT * FROM userdetails WHERE fullname = ?', [row[0].assignedTo], (err, result) => {
                                    if (!err) {
                                        res.render('v_p_dashboard', { user: req.user, assignedTo: row[0].assignedTo, rows, result });
                                    } else {
                                        console.log(err);
                                    }
                                })


                            } else {
                                console.log(err);
                            }
                        })
                    } else {

                        res.render('v_p_dashboard', { user: req.user });

                    }
                } else {
                    console.log(err);
                }
            })
        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }

});


router.get('/dashboard/:ic', authContoller.isLoggedIn, (req, res) => {

    if (req.user) {
        if (req.user.role === "Patient") {
            db.query('SELECT * FROM doctordetails WHERE ic = ?', [req.params.ic], (err, rows) => {
                if (!err) {
                    db.query('SELECT * FROM userdetails WHERE ic = ?', [req.params.ic], (err, result) => {
                        if (!err) {
                            if (result.length != 0) {
                                res.render('v_p_dashboard_edit', { user: req.user, assignedTo: result[0].fullname, rows, result });
                            } else {
                                res.render('v_p_dashboard_edit', { user: req.user, rows, result });
                            }
                        } else {
                            console.log(err);
                        }
                    })


                } else {
                    console.log(err);
                }
            })
        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }

});




/*router.get('/calendar', (req, res) => {


    db.query('SELECT * FROM train_food', (err, rows) => {


        if (!err) { //if not error

            var send = "";

            if (rows.length > 0) {
                for (let i = 0; i < rows.length; i++) {
                    var base = Buffer.from(rows[i].data);
                    var conversion = base.toString('base64');
                    send = send + '<div class="imgContainer"><img class="flexibleImg" src="data:' + rows[i].mime + ';base64,' + conversion + '" width="400" height="400"/></div>';
                }
            }

            var today = new Date(Date.now());
            var todayDate = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();

            res.render('v_p_calendar', { send, todayDate });
        } else {
            console.log(err);
        }

    })


});*/

router.get('/calendar', authContoller.isLoggedIn, (req, res) => {

    if (req.user) {
        if (req.user.role === "Patient") {

            var today = new Date(Date.now());
            var todayDate = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();

            db.query('SELECT * FROM diets WHERE ic = ?', [req.user.ic], (err, rows) => {

                if (!err) { //if not error

                    db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (error, row) => {
                        if (!error) {
                            db.query('SELECT * FROM exercise WHERE ic = ?', [req.user.ic], (err, result) => {

                                if (!err) { //if not error
                                    if (row.length != 0) {
                                        res.render('v_p_calendar', { user: req.user, rows, row, result, assignedTo: row[0].assignedTo, todayDate });
                                    } else {
                                        res.render('v_p_calendar', { user: req.user, rows, result, todayDate });
                                    }
                                } else {
                                    console.log(err);
                                }

                            })

                        } else {
                            console.log(error);
                        }
                    })

                } else {
                    console.log(err);
                }

                console.log('the data from user table', rows);
            })
        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }

});




router.get('/train', (req, res) => {


    db.query('SELECT * FROM train_food WHERE newrow = ?', 0, (err, rows) => {


        if (!err) { //if not error

            res.render('v_p_train', { rows });

        } else {
            console.log(err);
        }

    })


});

router.get('/registerpatient', (req, res) => {
    res.render('v_p_register');


});

router.get('/register', (req, res) => {

    db.query('SELECT * FROM healthcare', (err, rows) => {

        if (!err) { //if not error
            res.render('v_register', { rows });
        } else {
            console.log(err);
        }

        console.log('the data from user table', rows);
    })

});


router.get('/login', (req, res) => {
    res.render('v_login');
});

router.get('/', (req, res) => {

    res.render('v_p_dashboard');
});

//check whether user has already login using jwt -> c_auth(isLoggedIn function)
router.get('/profile', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Patient") {

            db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (err, rows) => {

                if (!err) { //if not error
                    res.render('v_p_profile', { rows, user: req.user });
                } else {
                    console.log(err);
                }

                console.log('the data from user table', rows);
            })

        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }


});

router.get('/profilepatient', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Patient") {

            db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (err, rows) => {

                if (!err) { //if not error
                    res.render('v_p_profile_edit', { rows, user: req.user });
                } else {
                    console.log(err);
                }

                console.log('the data from user table', rows);
            })

        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }


});

module.exports = router;