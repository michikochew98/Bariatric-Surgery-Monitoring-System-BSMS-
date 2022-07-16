const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const adminContoller = require('../controllers/c_admin');
const authContoller = require('../controllers/c_auth');

//localhost:5050/admin/...
//GET(admin/) before get page, must check user logged in

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});

//HEALTHCARE

router.get('/healthcare', authContoller.isLoggedIn, (req, res) => {

    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Admin") {

            db.query('SELECT * FROM healthcare', (error, rows) => {
                let removedHealthcare = req.query.removed; //if any healthcare is deleted, set alert 

                res.render('v_a_healthcare', { user: req.user, rows, removedHealthcare });
            })
        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }
});

router.get('/healthcare/add', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Admin") {

            db.query('SELECT * FROM healthcare', (err, rows) => {
                //when done with connection
                db.query('SELECT * FROM healthcare', (error, rows) => {
                    res.render('v_a_healthcare_add', { user: req.user, rows });
                })
            })
        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }
});


router.get('/healthcare/display/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token

    if (req.user) {
        if (req.user.role === "Admin") {
            db.query('SELECT * FROM healthcare', (err, row) => {
                //when done with connection

                if (!err) { //if not error

                    if (req.params.id) {

                        db.query('SELECT * FROM healthcare WHERE id = ?', [req.params.id], (error, rows) => {
                            if (!error) {
                                res.render('v_a_healthcare_display', { user: req.user, rows, alert: 'Your Selected Healthcare Displayed Below' });
                            } else {
                                console.log(error);
                            }
                        })

                    } else {
                        console.log(err);
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

router.get('/healthcare/update/:id', authContoller.isLoggedIn, (req, res) => {

    if (req.user) {
        if (req.user.role === "Admin") {

            db.query('SELECT * FROM healthcare WHERE id = ?', [req.params.id], (err, rows) => {
                //when done with connection

                if (!err) { //if not error
                    res.render('v_a_healthcare_edit', { user: req.user, rows, update: 'update' });
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

router.get('/healthcare/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Admin") {

            if (req.params.id) {
                db.query('DELETE FROM healthcare WHERE id = ?', [req.params.id], (err, rows) => {
                    //when done with connection

                    if (!err) { //if not error
                        let removedHealthcare = encodeURIComponent('Healthcare Successfully Removed');
                        res.redirect('/admin/healthcare?removed=' + removedHealthcare); //no need render just redirect to same page of current page dislaying
                        //res.redirect('/diet/view');
                    } else {
                        console.log(err);
                    }
                    console.log(rows);
                })
            }
        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }
});

//POST
router.post('/healthcare/search', adminContoller.find_healthcare); //function 2 - search healthcare by name of healthcare(pass req.body for searchterm)
router.post('/healthcare/add', adminContoller.add_healthcare); //function 4 - add new healthcare(pass req.body for all data)
router.post('/healthcare/update/:id', adminContoller.update_healthcare_id); //function 6 - update existing data using its id(pass req.body)






//PATIENT LIST (add new patient not include because userdetails-require password)

router.get('/patientlist', authContoller.isLoggedIn, (req, res) => {

    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Admin") {

            db.query('SELECT * FROM patientdetails', (error, rows) => {
                let removedPatientlist = req.query.removed; //if any patientlist is deleted, set alert 

                res.render('v_a_patientlist', { user: req.user, rows, removedPatientlist });
            })

        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }
});


router.get('/patientlist/display/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Admin") {

            db.query('SELECT * FROM patientdetails', (err, row) => {
                //when done with connection

                if (!err) { //if not error

                    if (req.params.id) {

                        db.query('SELECT * FROM patientdetails WHERE id = ?', [req.params.id], (error, rows) => {
                            if (!error) {
                                res.render('v_a_patientlist_display', { user: req.user, rows, alert: 'Your Selected Patient Displayed Below' });
                            } else {
                                console.log(error);
                            }
                        })

                    } else {
                        console.log(err);
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

router.get('/patientlist/update/:id', authContoller.isLoggedIn, (req, res) => {
    if (req.user) {
        if (req.user.role === "Admin") {

            db.query('SELECT * FROM patientdetails WHERE id = ?', [req.params.id], (err, rows) => {
                //when done with connection

                if (!err) { //if not error
                    res.render('v_a_patientlist_edit', { user: req.user, rows, update: 'update' });
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

router.get('/patientlist/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Admin") {

            if (req.params.id) {

                //get row from patientdetails
                db.query('SELECT * FROM patientdetails WHERE id = ?', [req.params.id], (err, rows) => {
                    //when done with connection

                    if (!err) { //if not error

                        //get row from userdetails
                        db.query('SELECT * FROM userdetails WHERE ic = ?', [rows[0].ic], (err, row) => {
                            //when done with connection

                            if (!err) { //if not error

                                //delete both patientdetails table and userdetails table
                                db.query('DELETE FROM patientdetails WHERE id = ?', [req.params.id], (err, del) => {
                                    //when done with connection

                                    if (!err) { //if not error


                                        db.query('DELETE FROM userdetails WHERE ic = ?', [rows[0].ic], (err, rows) => {
                                            //when done with connection

                                            if (!err) { //if not error
                                                let removedPatientlist = encodeURIComponent('Patient Successfully Removed');
                                                res.redirect('/admin/patientlist?removed=' + removedPatientlist); //no need render just redirect to same page of current page dislaying
                                                //res.redirect('/diet/view');
                                            } else {
                                                console.log(err);
                                            }
                                            console.log(rows);
                                        })


                                    } else {
                                        console.log(err);
                                    }
                                    console.log(rows);
                                })

                            } else {
                                console.log(err);
                            }
                            console.log(row);
                        })

                    } else {
                        console.log(err);
                    }
                    console.log(rows);
                })

            }

        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }
});

//POST
router.post('/patientlist/search', adminContoller.find_patientlist); //function 2 - search patient by name (pass req.body for searchterm)
router.post('/patientlist/update/:id', adminContoller.update_patientlist_id); //function 6 - update existing data using its id(pass req.body)



//DOCTOR LIST (add new doctor not include because userdetails-require password)

router.get('/doctorlist', authContoller.isLoggedIn, (req, res) => {

    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Admin") {

            db.query('SELECT * FROM doctordetails', (error, rows) => {
                let removedDoctorlist = req.query.removed; //if any doctorlist is deleted, set alert 

                res.render('v_a_doctorlist', { user: req.user, rows, removedDoctorlist });
            })

        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }
});


router.get('/doctorlist/display/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Admin") {

            db.query('SELECT * FROM doctordetails', (err, row) => {
                //when done with connection

                if (!err) { //if not error

                    if (req.params.id) {

                        db.query('SELECT * FROM doctordetails WHERE id = ?', [req.params.id], (error, rows) => {
                            if (!error) {
                                res.render('v_a_doctorlist_display', { user: req.user, rows, alert: 'Your Selected Doctor Displayed Below' });
                            } else {
                                console.log(error);
                            }
                        })

                    } else {
                        console.log(err);
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

router.get('/doctorlist/update/:id', authContoller.isLoggedIn, (req, res) => {
    if (req.user) {
        if (req.user.role === "Admin") {

            db.query('SELECT * FROM doctordetails WHERE id = ?', [req.params.id], (err, rows) => {
                //when done with connection

                if (!err) { //if not error
                    res.render('v_a_doctorlist_edit', { user: req.user, rows, update: 'update' });
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

router.get('/doctorlist/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Admin") {
            if (req.params.id) {

                //get row from doctordetails
                db.query('SELECT * FROM doctordetails WHERE id = ?', [req.params.id], (err, rows) => {
                    //when done with connection

                    if (!err) { //if not error

                        //get row from userdetails
                        db.query('SELECT * FROM userdetails WHERE ic = ?', [rows[0].ic], (err, row) => {
                            //when done with connection

                            if (!err) { //if not error

                                //delete both doctordetails table and userdetails table
                                db.query('DELETE FROM doctordetails WHERE id = ?', [req.params.id], (err, del) => {
                                    //when done with connection

                                    if (!err) { //if not error


                                        db.query('DELETE FROM userdetails WHERE ic = ?', [rows[0].ic], (err, rows) => {
                                            //when done with connection

                                            if (!err) { //if not error
                                                let removedDoctorlist = encodeURIComponent('Doctor Successfully Removed');
                                                res.redirect('/admin/doctorlist?removed=' + removedDoctorlist); //no need render just redirect to same page of current page dislaying
                                                //res.redirect('/diet/view');
                                            } else {
                                                console.log(err);
                                            }
                                            console.log(rows);
                                        })


                                    } else {
                                        console.log(err);
                                    }
                                    console.log(rows);
                                })

                            } else {
                                console.log(err);
                            }
                            console.log(row);
                        })

                    } else {
                        console.log(err);
                    }
                    console.log(rows);
                })

            }

        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }
});

//POST
router.post('/doctorlist/search', adminContoller.find_doctorlist); //function 2 - search doctor by name (pass req.body for searchterm)
router.post('/doctorlist/update/:id', adminContoller.update_doctorlist_id); //function 6 - update existing data using its id(pass req.body)



module.exports = router;