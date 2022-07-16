const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const screeningContoller = require('../controllers/c_screening');
const authContoller = require('../controllers/c_auth');

//localhost:5050/screening/...
//GET(screening/view) before get page, must check user logged in
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});

//GET
router.get('/view', authContoller.isLoggedIn, (req, res) => {

    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Patient") {

            db.query('SELECT * FROM screening WHERE ic = ?', [req.user.ic], (err, rows) => {
                //when done with connection

                if (!err) { //if not error
                    let removedScreening = req.query.removed; //if any screening is deleted, set alert 
                    db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (error, row) => {
                        if (!error) {
                            if (row.length != 0) {
                                res.render('v_p_screening', { user: req.user, rows, removedScreening: removedScreening, assignedTo: row[0].assignedTo });
                            } else {
                                res.render('v_p_screening', { user: req.user, rows, removedScreening: removedScreening });
                            }
                        } else {
                            console.log(error);
                        }
                    })


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


router.get('/add', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Patient") {

            db.query('SELECT * FROM screening WHERE ic = ?', [req.user.ic], (err, rows) => {
                //when done with connection

                if (!err) { //if not error

                    db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (error, row) => {
                        if (!error) {
                            if (row.length != 0) {
                                res.render('v_p_screening_add', { user: req.user, rows, assignedTo: row[0].assignedTo });
                            } else {
                                res.render('v_p_screening_add', { user: req.user, rows });
                            }
                        } else {
                            console.log(error);
                        }
                    })


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
    if (req.user) {
        if (req.user.role === "Patient") {

            //if there is request from user with jwt token
            db.query('SELECT * FROM screening WHERE ic = ?', [req.user.ic], (err, row) => {
                //when done with connection

                if (!err) { //if not error

                    db.query('SELECT * FROM screening WHERE id = ? AND ic = ?', [req.params.id, req.user.ic], (err, rows) => {
                        //when done with connection

                        if (!err) { //if not error

                            db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (error, row) => {
                                if (!error) {
                                    if (row.length != 0) {
                                        res.render('v_p_screening_edit', { user: req.user, rows, update: 'update', assignedTo: row[0].assignedTo });
                                    } else {
                                        res.render('v_p_screening_edit', { user: req.user, rows, update: 'update' });
                                    }
                                } else {
                                    console.log(error);
                                }
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
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }
});

router.get('/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Patient") {

            db.query('SELECT * FROM screening WHERE ic = ?', [req.user.ic], (err, row) => {
                //when done with connection

                if (!err) { //if not error

                    if (req.params.id) {
                        db.query('DELETE FROM screening WHERE id = ? AND ic = ?', [req.params.id, req.user.ic], (err, rows) => {
                            //when done with connection

                            if (!err) { //if not error
                                let removedScreening = encodeURIComponent('Screening Successfully Removed');
                                res.redirect('/screening/view?removed=' + removedScreening); //no need render just redirect to same page of current page dislaying
                                //res.redirect('/diet/view');
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

router.get('/display/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Patient") {

            db.query('SELECT * FROM screening', (err, row) => {
                //when done with connection

                if (!err) { //if not error

                    if (req.params.id) {

                        db.query('SELECT * FROM screening WHERE id = ? AND ic = ?', [req.params.id, req.user.ic], (err, rows) => {
                            //when done with connection

                            if (!err) { //if not error

                                db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (error, row) => {
                                    if (!error) {
                                        if (row.length != 0) {
                                            res.render('v_p_screening_display', { user: req.user, rows, alert: 'Your Selected Screening Displayed Below', assignedTo: row[0].assignedTo });
                                        } else {
                                            res.render('v_p_screening_display', { user: req.user, rows, alert: 'Your Selected Screening Displayed Below' });
                                        }
                                    } else {
                                        console.log(error);
                                    }
                                })


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
router.post('/search', screeningContoller.find_screening); //function 2 - search screening by score(pass req.body)
router.post('/add', screeningContoller.add_screening); //function 4 - add new screening(pass req.body)
router.post('/update/:id', screeningContoller.update_screening_id); //function 6 - update existing data using its id(pass req.body)


module.exports = router;