const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const async = require("hbs/lib/async");
const authContoller = require('./c_auth');
const { use } = require("browser-sync");

//add db connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});


//function 1 - display ALL list food(no id is passed)
exports.view_diet = (req, res) => {
    db.query('SELECT * FROM diets', (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_d_diet', { user: req.user, rows });
        } else {
            console.log(err);
        }
        console.log(rows);

    })
}


//function 2 - display specific diet(ID is passed)
exports.display_diet_id = (req, res) => {
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


//function 3 - search database food(req.body passed)
exports.find_diet = (req, res) => {

    let searchTerm = req.body.search; //get req.body.search from v_p_diet(name="search")
    console.log("searchterm", searchTerm);
    let fullname = req.body.user_fullname;
    console.log("fullname", fullname);

    db.query('SELECT * FROM diets WHERE fullname LIKE ? AND assignedTo = ?', ['%' + searchTerm + '%', fullname], (err, rows) => {
        //when done with connection
        if (!err) { //if not error

            db.query('SELECT * FROM doctordetails WHERE fullname = ?', [fullname], (error, row) => {
                if (!error) {
                    db.query('SELECT * FROM userdetails WHERE fullname = ?', [fullname], (err, getuser) => {

                        res.render('v_d_diet', { getuser, rows, row, alert: 'Display Searched Name' });
                    })
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

//function 4 - display ALL list exercise(no id is passed)
exports.view_exercise = (req, res) => {
    db.query('SELECT * FROM exercise', (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_d_exercise', { user: req.user, rows });
            //res.render('v_p_exercise');
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}

//function 5 - search database exercise(req.body passed)
exports.find_exercise = (req, res) => {

    let searchTerm = req.body.search; //get req.body.search from v_p_diet(name="search")
    let fullname = req.body.user_fullname;

    db.query('SELECT * FROM exercise WHERE fullname LIKE ? AND assignedTo = ?', ['%' + searchTerm + '%', fullname], (err, rows) => {
        //when done with connection
        if (!err) { //if not error

            db.query('SELECT * FROM doctordetails WHERE fullname = ?', [fullname], (error, row) => {
                if (!error) {
                    db.query('SELECT * FROM userdetails WHERE fullname = ?', [fullname], (err, getuser) => {

                        res.render('v_d_exercise', { getuser, rows, row, alert: 'Display Searched Name' });
                    })
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

//function 6 - display specific exercise(ID is passed)
exports.display_exercise_id = (req, res) => {

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

//function 7 - display ALL list screening(no id is passed)
exports.view_screening = (req, res) => {
    db.query('SELECT * FROM screening', (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_d_screening', { user: req.user, rows });
            //res.render('v_p_screening');
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}

//function 8 - search database screening(req.body passed)
exports.find_screening = (req, res) => {

    let searchTerm = req.body.search; //get req.body.search from v_p_diet(name="search")
    let fullname = req.body.user_fullname;

    db.query('SELECT * FROM screening WHERE fullname LIKE ? AND assignedTo = ?', ['%' + searchTerm + '%', fullname], (err, rows) => {
        //when done with connection
        if (!err) { //if not error

            db.query('SELECT * FROM doctordetails WHERE fullname = ?', [fullname], (error, row) => {
                if (!error) {
                    db.query('SELECT * FROM userdetails WHERE fullname = ?', [fullname], (err, getuser) => {

                        res.render('v_d_screening', { getuser, rows, row, alert: 'Display Searched Name' });
                    })
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


//function 9 - display specific screening based on its id(pass id)
exports.display_screening_id = (req, res) => {

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


//function 10 - add doctor profile
exports.add_profile = (req, res) => {

    const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());

    try {
        console.log(req.body);

        const { ic, fullname, home_address, phone_number } = req.body;

        if (!home_address || !phone_number) {
            //render back to edit and pass the data back

            db.query('SELECT * FROM doctordetails WHERE ic = ?', [ic], (error, row) => {
                if (!error) {
                    db.query('SELECT * FROM userdetails WHERE ic = ?', [ic], (err, getuser) => {

                        res.render('v_d_profile_add', { getuser, row, message: 'Incorrect Input Field' });
                    })
                } else {
                    console.log(error);
                }
            })
        } else {

            console.log(req.body);
            db.query('SELECT ic FROM userdetails WHERE ic = ?', [ic], async(error, results) => {
                if (error) {
                    console.log(error + "ic retrieve");
                } else {
                    //if there is no data for patient in patientdetails table, create new one
                    db.query('INSERT INTO doctordetails SET ?', { ic: ic, fullname: fullname, home_address: home_address, phone_number: phone_number, createdAt: createdAt, updatedAt: updatedAt }, (error, results) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(results);


                            db.query('SELECT * FROM doctordetails WHERE ic = ?', [ic], (error, row) => {
                                if (!error) {
                                    db.query('SELECT * FROM userdetails WHERE ic = ?', [ic], (err, getuser) => {

                                        res.render('v_d_profile_add', { getuser, row, alert: 'Successfully Update Doctor Profile' });
                                    })
                                } else {
                                    console.log(error);
                                }
                            })


                        }
                    })

                }

            })
        }
    } catch (error) {

    }
}

//function 11 - edit doctor profile
exports.update_profile_id = (req, res) => {

    const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());

    try {

        const { ic, fullname, home_address, phone_number } = req.body;

        if (!home_address || !phone_number) {
            //render back to edit and pass the data back

            db.query('SELECT * FROM doctordetails WHERE ic = ?', [ic], (error, row) => {
                if (!error) {
                    db.query('SELECT * FROM userdetails WHERE ic = ?', [ic], (err, getuser) => {

                        res.render('v_d_profile_edit', { getuser, row, message: 'Incorrect Input Field' });
                    })
                } else {
                    console.log(error);
                }
            })
        } else {

            //if there is data for patient in patientdetails table, update existing data
            db.query('SELECT ic FROM userdetails WHERE ic = ?', [ic], async(error, results) => {
                if (error) {
                    console.log(error + "ic retrieve");
                } else {

                    db.query('UPDATE doctordetails SET ic = ?, fullname = ?, home_address = ?, phone_number = ?, updatedAt = ? WHERE id = ?', [ic, fullname, home_address, phone_number, updatedAt, req.params.id], (error, results) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(results);
                            //display back updated version
                            db.query('SELECT * FROM doctordetails WHERE id = ?', [req.params.id], (err, rows) => {

                                //when done with connection
                                if (!err) { //if not error
                                    // res.render('v_p_profile_edit', { rows, success: `${fullname}'s Profile Has Been Updated` });

                                    db.query('SELECT * FROM doctordetails WHERE ic = ?', [ic], (error, row) => {
                                        if (!error) {
                                            db.query('SELECT * FROM userdetails WHERE ic = ?', [ic], (err, getuser) => {

                                                res.render('v_d_profile_edit', { getuser, rows, row, alert: 'Successfully Update Doctor Profile' });
                                            })
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
                    })
                }
            })
        }

    } catch (error) {

    }


}

//function 12 - edit patient profile
exports.update_dashboard_ic = (req, res) => {

    const { user_ic, daily_intake, weight_goal } = req.body;
    console.log("updatedashboardic", user_ic);


    if (!daily_intake || daily_intake < 100 || daily_intake > 100000 || !weight_goal || weight_goal < 10 || weight_goal > 100000) {

        db.query('SELECT * FROM doctordetails WHERE ic = ?', [user_ic], (error, row) => {
            if (!error) {
                db.query('SELECT * FROM userdetails WHERE ic = ?', [user_ic], (err, getuser) => {

                    res.render('v_d_dashboard_edit', { getuser, row, message: 'Incorrect Input Field' });
                })
            } else {
                console.log(error);
            }
        })


    } else {

        db.query('UPDATE patientdetails SET daily_intake = ?, weight_goal = ? WHERE ic = ?', [daily_intake, weight_goal, req.params.ic], (err, row) => {
            //when done with connection
            db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.params.ic], (err, row) => {
                db.query('SELECT * FROM userdetails WHERE ic = ?', [req.params.ic], (error, result) => {
                    db.query('SELECT * FROM userdetails WHERE ic = ?', [user_ic], (err, getuser) => {
                        res.render('v_d_dashboard_edit', { getuser, row, result, patientnum: row.length, alert: 'Patients Details Have Been Updated' });
                    })
                })
            })

        })
    }

}

exports.add_analytics_diet_ic = (req, res) => {

    const title = "diet";
    const patientIC = req.params.ic;

    const { description, createdBy } = req.body;
    const createdAt = new Date(Date.now());
    console.log("updatedashboardic", req.params.ic);


    if (!description) {

        //go back to page
        db.query('SELECT * FROM patientdetails WHERE ic = ?', [patientIC], (error, patient) => {
            db.query('SELECT * FROM doctordetails WHERE fullname = ?', [createdBy], (error, row) => {
                if (!error) {
                    db.query('SELECT * FROM userdetails WHERE fullname = ?', [createdBy], (err, getuser) => {

                        res.render('v_d_analytics_display_info', { getuser, patient, row, message: 'Incorrect Input Field' });
                    })
                } else {
                    console.log(error);
                }
            })
        })

    } else {
        db.query('SELECT * FROM recommendation WHERE title = ? AND patientIC = ?', [title, patientIC], (err, recomexist) => {
            if (recomexist.length === 0) {
                db.query('INSERT INTO recommendation SET title = ?, description = ?, createdBy = ?, createdAt = ?, patientIC = ?', [title, description, createdBy, createdAt, patientIC], (err, row) => {
                    //when done with connection
                    db.query('SELECT * FROM patientdetails WHERE ic = ?', [patientIC], (err, row) => {
                        db.query('SELECT * FROM userdetails WHERE ic = ?', [patientIC], (error, result) => {
                            db.query('SELECT * FROM userdetails WHERE fullname = ?', [createdBy], (err, getuser) => {
                                res.render('v_d_analytics_display_info', { getuser, row, result, patientnum: row.length, alert: 'Patients Recommendation Has Been Updated' });
                            })
                        })
                    })

                })
            } else {

                db.query('UPDATE recommendation SET title = ?, description = ?, createdBy = ?, createdAt = ?, patientIC = ? WHERE id = ?', [title, description, createdBy, createdAt, patientIC, recomexist[0].id], (err, row) => {
                    //when done with connection
                    db.query('SELECT * FROM patientdetails WHERE ic = ?', [patientIC], (err, row) => {
                        db.query('SELECT * FROM userdetails WHERE ic = ?', [patientIC], (error, result) => {
                            db.query('SELECT * FROM userdetails WHERE fullname = ?', [createdBy], (err, getuser) => {
                                res.render('v_d_analytics_display_info', { getuser, row, result, patientnum: row.length, alert: 'Patients Recommendation Has Been Updated' });

                            })
                        })
                    })

                })

            }

        })


    }

}

exports.add_analytics_exercise_ic = (req, res) => {

    const title = "exercise";
    const patientIC = req.params.ic;

    const { description, createdBy } = req.body;
    const createdAt = new Date(Date.now());
    console.log("updatedashboardic", req.params.ic);


    if (!description) {

        //go back to page
        db.query('SELECT * FROM patientdetails WHERE ic = ?', [patientIC], (error, patient) => {
            db.query('SELECT * FROM doctordetails WHERE fullname = ?', [createdBy], (error, row) => {
                if (!error) {
                    db.query('SELECT * FROM userdetails WHERE fullname = ?', [createdBy], (err, getuser) => {

                        res.render('v_d_analytics_display_info', { getuser, patient, row, message: 'Incorrect Input Field' });
                    })
                } else {
                    console.log(error);
                }
            })
        })

    } else {
        db.query('SELECT * FROM recommendation WHERE title = ? AND patientIC = ?', [title, patientIC], (err, recomexist) => {
            if (recomexist.length === 0) {
                db.query('INSERT INTO recommendation SET title = ?, description = ?, createdBy = ?, createdAt = ?, patientIC = ?', [title, description, createdBy, createdAt, patientIC], (err, row) => {
                    //when done with connection
                    db.query('SELECT * FROM patientdetails WHERE ic = ?', [patientIC], (err, row) => {
                        db.query('SELECT * FROM userdetails WHERE ic = ?', [patientIC], (error, result) => {
                            db.query('SELECT * FROM userdetails WHERE fullname = ?', [createdBy], (err, getuser) => {
                                res.render('v_d_analytics_display_info', { getuser, row, result, patientnum: row.length, alert: 'Patients Recommendation Has Been Updated' });
                            })
                        })
                    })

                })
            } else {

                db.query('UPDATE recommendation SET title = ?, description = ?, createdBy = ?, createdAt = ?, patientIC = ? WHERE id = ?', [title, description, createdBy, createdAt, patientIC, recomexist[0].id], (err, row) => {
                    //when done with connection
                    db.query('SELECT * FROM patientdetails WHERE ic = ?', [patientIC], (err, row) => {
                        db.query('SELECT * FROM userdetails WHERE ic = ?', [patientIC], (error, result) => {
                            db.query('SELECT * FROM userdetails WHERE fullname = ?', [createdBy], (err, getuser) => {
                                res.render('v_d_analytics_display_info', { getuser, row, result, patientnum: row.length, alert: 'Patients Recommendation Has Been Updated' });

                            })
                        })
                    })

                })

            }

        })


    }

}

exports.add_upload_ic = (req, res) => {

    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {

        db.query('SELECT * FROM doctordetails WHERE ic = ?', [req.params.ic], (err, rows) => {
            //when done with connection
            if (!err) { //if not error
                // res.render('v_p_profile_edit', { rows, success: `${fullname}'s Profile Has Been Updated` });

                db.query('SELECT * FROM userdetails WHERE ic = ?', [req.params.ic], (err, getuser) => {


                    //when done with connection 
                    if (!err) { //if not error
                        res.render('v_d_profile', { getuser, message: 'No files were uploaded.' });
                    } else {
                        console.log(err);
                    }

                })


            } else {
                console.log(err);
            }
            console.log(rows);

        })
    } else {

        // name of the input is name="image"
        sampleFile = req.files.image;
        const path = require("path");
        const p = path.join(__dirname, "../public/images/");

        uploadPath = p + req.params.ic;

        console.log(sampleFile);


        // Use mv() to place file on the server 
        sampleFile.mv(uploadPath, function(err) {
            if (err) {
                return res.status(500).send(err);
            } else {

                db.query('UPDATE userdetails SET image = ? WHERE ic = ?', [req.params.ic, req.params.ic], (error, results) => {

                    db.query('SELECT * FROM doctordetails WHERE ic = ?', [req.params.ic], (err, rows) => {


                        //when done with connection
                        if (!err) { //if not error
                            // res.render('v_p_profile_edit', { rows, success: `${fullname}'s Profile Has Been Updated` });

                            db.query('SELECT * FROM userdetails WHERE ic = ?', [req.params.ic], (err, getuser) => {


                                //when done with connection 
                                if (!err) { //if not error
                                    res.render('v_d_profile', { getuser, success: 'Profile Photo Updated' });
                                } else {
                                    console.log(err);
                                }

                            })

                        } else {
                            console.log(err);
                        }
                        console.log(rows);

                    })

                });

            }
        });
    }

}