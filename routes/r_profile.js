const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const profileContoller = require('../controllers/c_profile');
const authContoller = require('../controllers/c_auth');

//localhost:5050/profile/...

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});


//GET
router.get('/display', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Patient") {

            db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (err, rows) => {

                if (!err) { //if not error

                    db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (error, row) => {
                        if (!error) {
                            if (row.length != 0) {
                                res.render('v_p_profile', { user: req.user, rows, assignedTo: row[0].assignedTo, display: 'display' });
                            } else {
                                res.render('v_p_profile', { user: req.user, rows, display: 'display' });
                            }
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

router.get('/add', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Patient") {

            db.query('SELECT * FROM userdetails', (err, rows) => {
                //when done with connection

                if (!err) { //if not error
                    const role = "Doctor";

                    //take the list of doctor working at same healthcare as the user
                    db.query('SELECT * FROM userdetails WHERE role = ? AND healthcare = ?', [role, req.user.healthcare], (error, result) => {

                        if (!error) {
                            console.log("select doctor" + result);

                            db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (error, row) => {
                                if (!error) {
                                    res.render('v_p_profile_add', { user: req.user, rows, result });
                                } else {
                                    console.log(error);
                                }
                            })

                        } else {
                            console.log(error);
                        }

                    });

                } else {
                    console.log(err);
                }
                console.log(rows);

            })

        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }
});

router.get('/update/:id', authContoller.isLoggedIn, (req, res) => {

    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Patient") {

            const role = "Doctor";

            //take the list of doctor working at same healthcare as the user
            db.query('SELECT * FROM userdetails WHERE healthcare = ? AND role = ?', [req.user.healthcare, role], (error, result) => {

                if (!error) {

                    db.query('SELECT * FROM patientdetails', (err, row) => {
                        //when done with connection

                        if (!err) { //if not error

                            db.query('SELECT * FROM patientdetails WHERE id = ?', [req.params.id], (error, rows) => {
                                if (!error) { //if not error
                                    // res.render('v_p_profile_edit', { user: req.user, rows });

                                    if (!error) {
                                        console.log("select doctor" + result);

                                        db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (error, row) => {
                                            if (!error) {
                                                if (row.length != 0) {
                                                    res.render('v_p_profile_edit', { user: req.user, rows, result, assignedTo: row[0].assignedTo });
                                                } else {
                                                    res.render('v_p_profile_edit', { user: req.user, rows, result });
                                                }
                                            } else {
                                                console.log(error);
                                            }
                                        })


                                    } else {
                                        console.log(error);
                                    }

                                } else {
                                    console.log(error);
                                }
                                console.log(rows);

                            })


                        } else {
                            console.log(err);
                        }
                        console.log(row);

                    });
                }
            });

        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }
});


//POST
router.post('/upload/:ic', profileContoller.add_upload_ic);
router.post('/add', profileContoller.add_profile); //function 2 - add new profile(pass req.body)
router.post('/update/:id', profileContoller.update_profile_id); //function 4 - update existing data using its id(pass req.body)


module.exports = router;