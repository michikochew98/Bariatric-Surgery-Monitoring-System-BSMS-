const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const exerciseContoller = require('../controllers/c_exercise');
const authContoller = require('../controllers/c_auth');

//localhost:5050/exercise/...
//GET(exercise/view) before get page, must check user logged in
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

            db.query('SELECT * FROM exercise WHERE ic = ?', [req.user.ic], (err, rows) => {
                //when done with connection

                if (!err) { //if not error
                    let removedExercise = req.query.removed; //if any exercise is deleted, set alert 

                    db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (error, row) => {
                        if (!error) {
                            if (row.length != 0) {
                                res.render('v_p_exercise', { user: req.user, rows, assignedTo: row[0].assignedTo, removedExercise: removedExercise });
                            } else {
                                res.render('v_p_exercise', { user: req.user, rows, removedExercise: removedExercise });
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

            db.query('SELECT * FROM exercise WHERE ic = ?', [req.user.ic], (err, rows) => {
                //when done with connection

                if (!err) { //if not error

                    db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (error, row) => {
                        if (!error) {
                            if (row.length != 0) {
                                res.render('v_p_exercise_add', { user: req.user, rows, assignedTo: row[0].assignedTo });
                            } else {
                                res.render('v_p_exercise_add', { user: req.user, rows });
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
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Patient") {

            db.query('SELECT * FROM exercise WHERE ic = ?', [req.user.ic], (err, row) => {
                //when done with connection

                if (!err) { //if not error

                    db.query('SELECT * FROM exercise WHERE id = ? AND ic = ?', [req.params.id, req.user.ic], (error, rows) => {
                        //when done with connection

                        if (!error) { //if not error

                            db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (error, row) => {
                                if (!error) {
                                    if (row.length != 0) {
                                        res.render('v_p_exercise_edit', { user: req.user, rows, assignedTo: row[0].assignedTo });
                                    } else {
                                        res.render('v_p_exercise_edit', { user: req.user, rows });
                                    }
                                } else {
                                    console.log(error);
                                }
                            })


                        } else {
                            console.log(error);
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

            db.query('SELECT * FROM exercise WHERE ic = ?', [req.user.ic], (err, row) => {
                //when done with connection

                if (!err) { //if not error

                    if (req.params.id) {
                        db.query('DELETE FROM exercise WHERE id = ? AND ic = ?', [req.params.id, req.user.ic], (err, rows) => {
                            //when done with connection

                            if (!err) { //if not error
                                let removedExercise = encodeURIComponent('Activity Successfully Removed');
                                res.redirect('/exercise/view?removed=' + removedExercise); //no need render just redirect to same page of current page dislaying
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

            db.query('SELECT * FROM exercise WHERE ic = ?', [req.user.ic], (err, row) => {
                //when done with connection

                if (!err) { //if not error

                    if (req.params.id) {
                        db.query('SELECT * FROM exercise WHERE id = ? AND ic = ?', [req.params.id, req.user.ic], (err, rows) => {
                            //when done with connection

                            if (!err) { //if not error

                                db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (error, row) => {
                                    if (!error) {
                                        if (row.length != 0) {
                                            res.render('v_p_exercise_display', { user: req.user, rows, assignedTo: row[0].assignedTo, alert: 'Your Selected Exercise Displayed Below' });
                                        } else {
                                            res.render('v_p_exercise_display', { user: req.user, rows, alert: 'Your Selected Exercise Displayed Below' });
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
router.post('/search', exerciseContoller.find_exercise); //function 2 - search exercise by name of exercise(pass req.body for searchterm)
router.post('/add', exerciseContoller.add_exercise); //function 4 - add new exercise(pass req.body for all data)
router.post('/update/:id', exerciseContoller.update_exercise_id); //function 6 - update existing data using its id(pass req.body)


module.exports = router;