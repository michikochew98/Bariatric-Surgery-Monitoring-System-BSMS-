const e = require("express");
const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const analyticsContoller = require('../controllers/c_analytics');
const authContoller = require('../controllers/c_auth');

//localhost:5050/screening/...
//GET(screening/view) before get page, must check user logged in
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});

router.get('/', authContoller.isLoggedIn, (req, res) => {

    if (req.user) {
        if (req.user.role === "Patient") {
            db.query('SELECT * FROM diets WHERE ic = ?', [req.user.ic], (err, rows) => {

                if (!err) { //if not error

                    db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (error, row) => {
                        if (!error) {
                            db.query('SELECT * FROM exercise WHERE ic = ?', [req.user.ic], (err, result) => {

                                db.query('SELECT * FROM recommendation WHERE patientIC = ? AND title = ?', [req.user.ic, "diet"], (err, recom) => {
                                    if (recom.length === 0) {
                                        db.query('SELECT * FROM recommendation WHERE patientIC = ? AND title = ?', [req.user.ic, "exercise"], (err, recomex) => {
                                            if (recomex.length === 0) {
                                                if (!err) { //if not error
                                                    if (row.length != 0) {
                                                        res.render('v_p_analytics', { user: req.user, rows, row, result, assignedTo: row[0].assignedTo });
                                                    } else {
                                                        res.render('v_p_analytics', { user: req.user, rows, result });
                                                    }
                                                } else {
                                                    console.log(err);
                                                }
                                            } else {
                                                if (!err) { //if not error
                                                    if (row.length != 0) {
                                                        res.render('v_p_analytics', { user: req.user, rows, row, result, assignedTo: row[0].assignedTo, recomex });
                                                    } else {
                                                        res.render('v_p_analytics', { user: req.user, rows, result, recomex });
                                                    }
                                                } else {
                                                    console.log(err);
                                                }
                                            }
                                        })
                                    } else {
                                        db.query('SELECT * FROM recommendation WHERE patientIC = ? AND title = ?', [req.user.ic, "exercise"], (err, recomex) => {
                                            if (recomex.length === 0) {
                                                if (!err) { //if not error
                                                    if (row.length != 0) {
                                                        res.render('v_p_analytics', { user: req.user, rows, row, result, assignedTo: row[0].assignedTo, recom });
                                                    } else {
                                                        res.render('v_p_analytics', { user: req.user, rows, result, recom });
                                                    }
                                                } else {
                                                    console.log(err);
                                                }
                                            } else {
                                                if (!err) { //if not error
                                                    if (row.length != 0) {
                                                        res.render('v_p_analytics', { user: req.user, rows, row, result, assignedTo: row[0].assignedTo, recom, recomex });
                                                    } else {
                                                        res.render('v_p_analytics', { user: req.user, rows, result, recom, recomex });
                                                    }
                                                } else {
                                                    console.log(err);
                                                }
                                            }
                                        })
                                    }
                                })

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

module.exports = router;