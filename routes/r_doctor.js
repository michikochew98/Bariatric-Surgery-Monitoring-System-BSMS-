const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const doctorContoller = require('../controllers/c_doctor');
const authContoller = require('../controllers/c_auth');

//localhost:5050/doctor/...
//GET(doctor/) before get page, must check user logged in

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});

//GET
router.get('/profile', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Doctor") {

            db.query('SELECT * FROM doctordetails WHERE ic = ?', [req.user.ic], (err, rows) => {


                db.query('SELECT * FROM patientdetails WHERE assignedTo = ?', [req.user.fullname], (error, row) => {
                    if (!error) {

                        if (row.length === 0) {
                            db.query('SELECT * FROM userdetails', (error, result) => {
                                res.render('v_d_profile', { rows, user: req.user, result, display: 'display' });
                            })
                        } else {

                            //get patient details
                            if (!err) { //if not error
                                //get patient's name
                                console.log("number of patients" + row.length);
                                /*db.query('SELECT * FROM userdetails WHERE ic = ?', [row.ic], (error, patientdetails) => {
                                    res.render('v_d_profile', { rows, user: req.user, patientdetails, row });
                                })*/
                                res.render('v_d_profile', { rows, user: req.user, row, display: 'display' });



                            } else {
                                console.log(err);
                            }
                        }

                        console.log('the data from user table', rows);

                    } else {

                    }
                })

            })
        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }
});


router.get('/profile/add', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Doctor") {

            db.query('SELECT * FROM userdetails', (err, rows) => {
                //when done with connection

                if (!err) { //if not error


                    db.query('SELECT * FROM userdetails', (error, result) => {

                        if (!error) {

                            res.render('v_d_profile_add', { user: req.user, rows, result });

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

router.get('/profile/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Doctor") {

            db.query('SELECT * FROM userdetails', (error, result) => {


                if (!error) {

                    db.query('SELECT * FROM doctordetails', (err, row) => {
                        //when done with connection

                        if (!err) { //if not error

                            db.query('SELECT * FROM doctordetails WHERE id = ?', [req.params.id], (error, rows) => {
                                if (!error) { //if not error
                                    // res.render('v_p_profile_edit', { user: req.user, rows });

                                    if (!error) {

                                        res.render('v_d_profile_edit', { user: req.user, rows, result });

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

router.get('/dashboard', authContoller.isLoggedIn, (req, res) => {

    if (req.user) {
        if (req.user.role === "Doctor") {

            db.query('SELECT * FROM patientdetails WHERE assignedTo = ?', [req.user.fullname], (error, row) => {

                if (row.length === 0) {
                    if (!error) {
                        //get patient details

                        //get patient's name

                        db.query('SELECT * FROM userdetails', (error, result) => {
                            res.render('v_d_dashboard', { user: req.user, result });
                        })

                    } else {
                        console.log(err);
                    }

                    console.log('the data from user table', row);

                } else {

                    if (!error) {
                        //get patient details

                        //get patient's name
                        console.log("number of patients" + row.length);

                        res.render('v_d_dashboard', { user: req.user, row, patientnum: row.length });


                        /* if (!err) { //if not error
                             //get patient's name
                             console.log("number of patients" + row.length);
                             /*db.query('SELECT * FROM userdetails WHERE ic = ?', [row.ic], (error, patientdetails) => {
                                 res.render('v_d_profile', { rows, user: req.user, patientdetails, row });
                             })
                             res.render('v_d_profile', { rows, user: req.user, row });
                         }*/



                    } else {
                        console.log(err);
                    }

                    console.log('the data from user table', row);

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
        if (req.user.role === "Doctor") {
            db.query('SELECT * FROM patientdetails WHERE assignedTo = ? AND ic = ?', [req.user.fullname, req.params.ic], (error, row) => {

                if (row.length === 0) {
                    if (!error) {
                        //get patient details

                        //get patient's name

                        db.query('SELECT * FROM userdetails WHERE ic = ?', [req.params.ic], (error, result) => {
                            res.render('v_d_dashboard_edit', { user: req.user, result });
                        })

                    } else {
                        console.log(err);
                    }

                    console.log('the data from user table', row);

                } else {

                    if (!error) {
                        //get patient details

                        //get patient's name
                        console.log("number of patients" + row.length);

                        db.query('SELECT * FROM patientdetails WHERE assignedTo = ?', [req.user.fullname], (error, rowpatient) => {

                            db.query('SELECT * FROM userdetails WHERE ic = ?', [req.params.ic], (error, result) => {
                                res.render('v_d_dashboard_edit', { user: req.user, row, result, patientnum: rowpatient.length });
                            })


                        })

                    } else {
                        console.log(err);
                    }

                    console.log('the data from user table', row);

                }
            })
        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }
});


router.get('/analytics', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Doctor") {
            db.query('SELECT * FROM patientdetails WHERE assignedTo = ?', [req.user.fullname], (error, row) => {

                if (row.length === 0) {
                    if (!error) {
                        //get patient details

                        //get patient's name


                        db.query('SELECT * FROM diets', (error, result) => {
                            db.query('SELECT * FROM userdetails', (error, rows) => {
                                res.render('v_d_analytics', { user: req.user, rows, result });
                            })
                        })



                    } else {
                        console.log(err);
                    }

                    console.log('the data from user table', row);
                } else {
                    if (!error) {
                        //get patient details

                        //get patient's name
                        console.log("number of patients" + row.length);

                        db.query('SELECT * FROM patientdetails WHERE assignedTo = ?', [req.user.fullname], (error, patientanalytics) => {
                            res.render('v_d_analytics', { user: req.user, patientanalytics, row, patientnum: row.length });
                        })


                    } else {
                        console.log(err);
                    }

                    console.log('the data from user table', row);
                }


            })


        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }
});


router.get('/analytics/:ic', authContoller.isLoggedIn, (req, res) => {
    if (req.user) {
        if (req.user.role === "Doctor") {
            //if there is request from user with jwt token
            db.query('SELECT * FROM diets WHERE ic = ? AND assignedTo = ?', [req.params.ic, req.user.fullname], (err, rows) => {

                if (!err) { //if not error

                    db.query('SELECT * FROM patientdetails WHERE ic = ? AND assignedTo = ?', [req.params.ic, req.user.fullname], (error, row) => {
                        if (!error) {
                            db.query('SELECT * FROM exercise WHERE ic = ? AND assignedTo = ?', [req.params.ic, req.user.fullname], (err, result) => {

                                if (!err) { //if not error

                                    db.query('SELECT * FROM recommendation WHERE patientIC = ? AND title = ?', [req.params.ic, "diet"], (err, recom) => {
                                        if (recom.length === 0) {
                                            db.query('SELECT * FROM recommendation WHERE patientIC = ? AND title = ?', [req.params.ic, "exercise"], (err, recomex) => {
                                                if (recomex.length === 0) {
                                                    res.render('v_d_analytics_display', { user: req.user, rows, row, result, assignedTo: row[0].assignedTo });
                                                } else if (recomex.length > 0) {
                                                    res.render('v_d_analytics_display', { user: req.user, rows, row, result, assignedTo: row[0].assignedTo, recomex });
                                                } else {

                                                }
                                            })
                                        } else {
                                            db.query('SELECT * FROM recommendation WHERE patientIC = ? AND title = ?', [req.params.ic, "exercise"], (err, recomex) => {
                                                if (recomex.length === 0) {
                                                    res.render('v_d_analytics_display', { user: req.user, rows, row, result, assignedTo: row[0].assignedTo, recom });
                                                } else if (recomex.length > 0) {
                                                    res.render('v_d_analytics_display', { user: req.user, rows, row, result, assignedTo: row[0].assignedTo, recom, recomex });
                                                } else {

                                                }
                                            })
                                        }
                                    })
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

router.get('/diet', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Doctor") {
            db.query('SELECT * FROM patientdetails WHERE assignedTo = ?', [req.user.fullname], (error, row) => {

                if (row.length === 0) {
                    if (!error) {
                        //get patient details

                        //get patient's name


                        db.query('SELECT * FROM diets', (error, result) => {
                            db.query('SELECT * FROM userdetails', (error, rows) => {
                                res.render('v_d_diet', { user: req.user, result });
                            })
                        })



                    } else {
                        console.log(err);
                    }

                    console.log('the data from user table', row);
                } else {
                    if (!error) {
                        //get patient details

                        //get patient's name
                        console.log("number of patients" + row.length);

                        db.query('SELECT * FROM diets WHERE assignedTo = ?', [req.user.fullname], (error, patientdiet) => {
                            res.render('v_d_diet', { user: req.user, patientdiet, row, patientnum: row.length });
                        })


                    } else {
                        console.log(err);
                    }

                    console.log('the data from user table', row);
                }


            })
        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }
});

router.get('/diet/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Doctor") {

            db.query('SELECT * FROM diets', (err, row) => {
                //when done with connection

                if (!err) { //if not error

                    if (req.params.id) {
                        db.query('SELECT * FROM diets WHERE id = ?', [req.params.id], (err, rows) => {
                            //when done with connection

                            if (!err) { //if not error
                                res.render('v_d_diet_display', { user: req.user, rows, alert: 'Your Selected Food Displayed Below' });
                            } else {
                                console.log(err);
                            }
                            console.log(rows);
                        })
                    }


                } else {
                    console.log(err);
                }
                console.log(row);

            })

        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }
});

//router.get('/view', exerciseContoller.view_exercise); //function 1 - display ALL list food(no id is passed)
router.get('/exercise', authContoller.isLoggedIn, (req, res) => {

    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Doctor") {

            /*db.query('SELECT * FROM exercise', (err, rows) => {
                //when done with connection

                if (!err) { //if not error

                    res.render('v_d_exercise', { user: req.user, rows });
                    //res.render('v_p_exercise');
                } else {
                    console.log(err);
                }
                console.log(rows);
            })*/


            db.query('SELECT * FROM patientdetails WHERE assignedTo = ?', [req.user.fullname], (error, row) => {

                if (row.length === 0) {
                    if (!error) {
                        //get patient details

                        //get patient's name

                        db.query('SELECT * FROM exercise', (error, result) => {
                            db.query('SELECT * FROM userdetails', (error, rows) => {
                                res.render('v_d_exercise', { user: req.user, result });
                            })
                        })

                    } else {
                        console.log(err);
                    }

                    console.log('the data from user table', row);
                } else {
                    if (!error) {
                        //get patient details

                        //get patient's name
                        console.log("number of patients" + row.length);

                        db.query('SELECT * FROM exercise WHERE assignedTo = ?', [req.user.fullname], (error, patientexercise) => {
                            res.render('v_d_exercise', { user: req.user, patientexercise, row, patientnum: row.length });
                        })

                    } else {
                        console.log(err);
                    }

                    console.log('the data from user table', row);
                }


            })

        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }
});

router.get('/exercise/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Doctor") {

            db.query('SELECT * FROM exercise', (err, row) => {
                //when done with connection

                if (!err) { //if not error

                    if (req.params.id) {
                        db.query('SELECT * FROM exercise WHERE id = ?', [req.params.id], (err, rows) => {
                            //when done with connection

                            if (!err) { //if not error
                                res.render('v_d_exercise_display', { user: req.user, rows, alert: 'Your Selected Exercise Displayed Below' });
                            } else {
                                console.log(err);
                            }
                            console.log(rows);
                        })
                    }


                } else {
                    console.log(err);
                }
                console.log(row);

            })

        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }
});


router.get('/screening', authContoller.isLoggedIn, (req, res) => {

    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Doctor") {

            /*db.query('SELECT * FROM screening', (err, rows) => {
                //when done with connection

                if (!err) { //if not error
                    res.render('v_d_screening', { user: req.user, rows });
                    //res.render('v_p_screening');
                } else {
                    console.log(err);
                }
                console.log(rows);
            })*/

            db.query('SELECT * FROM patientdetails WHERE assignedTo = ?', [req.user.fullname], (error, row) => {

                if (row.length === 0) {
                    if (!error) {
                        //get patient details

                        //get patient's name


                        db.query('SELECT * FROM screening', (error, result) => {
                            db.query('SELECT * FROM userdetails', (error, rows) => {
                                res.render('v_d_screening', { user: req.user, result });
                            })
                        })

                    } else {
                        console.log(err);
                    }

                    console.log('the data from user table', row);
                } else {
                    if (!error) {
                        //get patient details

                        //get patient's name
                        console.log("number of patients" + row.length);

                        db.query('SELECT * FROM screening WHERE assignedTo = ?', [req.user.fullname], (error, patientscreening) => {
                            res.render('v_d_screening', { user: req.user, patientscreening, row, patientnum: row.length });
                        })

                    } else {
                        console.log(err);
                    }

                    console.log('the data from user table', row);
                }

            })

        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }
});

router.get('/screening/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Doctor") {

            db.query('SELECT * FROM screening', (err, row) => {
                //when done with connection

                if (!err) { //if not error

                    if (req.params.id) {

                        db.query('SELECT * FROM screening WHERE id = ?', [req.params.id], (err, rows) => {
                            //when done with connection

                            if (!err) { //if not error
                                res.render('v_d_screening_display', { user: req.user, rows, alert: 'Your Selected Screening Displayed Below' });
                            } else {
                                console.log(err);
                            }
                            console.log(rows);
                        })
                    }


                } else {
                    console.log(err);
                }
                console.log(row);

            })

        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }
});


//POST
router.post('/analytics/diet/:ic', doctorContoller.add_analytics_diet_ic);
router.post('/analytics/exercise/:ic', doctorContoller.add_analytics_exercise_ic);

router.post('/upload/:ic', doctorContoller.add_upload_ic);
router.post('/diet/search', doctorContoller.find_diet); //function 3 - search database food(req.body passed)
router.post('/exercise/search', doctorContoller.find_exercise); //function 5 - search database exercise(req.body passed)
router.post('/screening/search', doctorContoller.find_screening); //function 8 - search database screening(req.body passed)
router.post('/profile/add', doctorContoller.add_profile); //function 10 - add doctor profile
router.post('/profile/:id', doctorContoller.update_profile_id); //function 11 - edit doctor profile
router.post('/dashboard/:ic', doctorContoller.update_dashboard_ic); //function 12 - edit patient profile

module.exports = router;