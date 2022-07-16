const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const async = require("hbs/lib/async");
const authContoller = require('../controllers/c_auth');

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
            let removedFood = req.query.removed; //if any food is deleted, set alert 
            res.render('v_p_diet', { rows, removedFood: removedFood });
        } else {
            console.log(err);
        }
        console.log(rows);

    })
}

//function 2 - search food by name of meal(pass req.body)
exports.find_diet = (req, res) => {

    let searchTerm = req.body.search; //get req.body.search from v_p_diet(name="search")
    const ic = req.body.ic;

    db.query('SELECT * FROM diets WHERE name LIKE ? AND ic = ?', ['%' + searchTerm + '%', ic], (err, rows) => {
        //when done with connection
        if (!err) { //if not error
            db.query('SELECT * FROM patientdetails WHERE ic = ?', [ic], (error, row) => {
                if (!error) {
                    db.query('SELECT * FROM userdetails WHERE ic = ?', [ic], (err, getuser) => {

                        res.render('v_p_diet', { getuser, rows, row, assignedTo: row[0].assignedTo, ic: req.body.ic, alert: 'Display Searched Food', searchword: searchTerm });
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

//function 3 - display add form to add new food
exports.form_add_diet = (req, res) => {
    res.render('v_p_diet_add');
}


//function 4 - add new food(pass req.body)
exports.add_diet = (req, res) => {

    const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());


    console.log(createdAt, updatedAt);

    const { ic, fullname, assignedTo, name, calories, type, serving_size, serving_type, time } = req.body;

    const ss = parseInt(serving_size);
    const cc = parseInt(calories);
    if (!serving_size || ss < 1 || cc < 1 || !cc || !name || !type) {

        db.query('SELECT * FROM patientdetails WHERE ic = ?', [ic], (error, row) => {
            if (!error) {
                db.query('SELECT * FROM userdetails WHERE ic = ?', [ic], (err, getuser) => {

                    res.status(400).render('v_p_diet_add', { getuser, row, assignedTo: row[0].assignedTo, message: 'Incorrect Input Field' });

                })
            } else {
                console.log(error);
            }
        })
    } else {
        //if no error in input field
        var c = [],
            labels = [];
        var datep = new Date(time);
        var getsdate = datep.getDate() + "/" + (datep.getMonth() + 1) + "/" + datep.getFullYear();
        console.log(getsdate);

        db.query('SELECT * FROM diets WHERE ic = ?', [ic], (err, rows) => {

            db.query('SELECT * FROM patientdetails WHERE ic = ?', [ic], (err, row) => {

                c.push(calories);
                labels.push(getsdate);

                if (rows.length != 0) {

                    console.log("rowlength", rows.length);
                    for (let n = 0; n < rows.length; n++) {

                        console.log(rows[n].time);
                        console.log(rows[n].calories);

                        var getDate = new Date(rows[n].time);
                        console.log("getdate", getDate);
                        var newDate = getDate.getDate() + "/" + (getDate.getMonth() + 1) + "/" + getDate.getFullYear();


                        var calofmeal = rows[n].calories;
                        calofmeal = parseInt(calofmeal);
                        console.log(typeof calofmeal + "calofmeal" + calofmeal);

                        if (labels.includes(newDate)) {
                            for (let i = 0; i < labels.length; i++) {

                                c[i] = parseInt(c[i]);

                                if (labels[i] == newDate) {

                                    c[i] = c[i] + calofmeal;
                                    console.log("ci before break", c[i], typeof c[i]);
                                    break;
                                }
                            }

                        } else {
                            c.push(calofmeal);
                            labels.push(newDate);
                        }

                    }


                    console.log("c", c);
                    console.log("labels", labels);

                    for (let m = 0; m < c.length; m++) {
                        if (c[m] > row[0].daily_intake && (labels[m] === getsdate)) {
                            console.log("ci", c[m]);
                            console.log("DI", row[0].daily_intake);

                            const sid = process.env.SID;
                            const auth_token = process.env.AUTH_TOKEN;

                            var twilio = require('twilio')(sid, auth_token);
                            twilio.messages.create({
                                from: "+15074788007",
                                to: "+60134355859",
                                body: `BARIACT. Patient ${fullname} (${ic}) has exceeded the recommended calories intake of ${row[0].daily_intake} on ${labels[m]}.  ${fullname}'s total calories intake on ${labels[m]} is ${c[m]}.`

                            }).then((res) => console.log('message sent')).catch((err) => { console.log(err) })
                        }
                    }

                }
            })

        })


        db.query('INSERT INTO diets SET ic = ?, fullname = ?, assignedTo = ?, time = ?, name = ?, calories = ?, type = ?, serving_size = ?, serving_type = ?, createdAt = ?, updatedAt = ?', [ic, fullname, assignedTo, time, name, calories, type, serving_size, serving_type, createdAt, updatedAt], (err, rows) => {
            //when done with connection
            if (!err) { //if not error

                db.query('SELECT * FROM patientdetails WHERE ic = ?', [ic], (error, row) => {
                    if (!error) {
                        db.query('SELECT * FROM userdetails WHERE ic = ?', [ic], (err, getuser) => {

                            res.render('v_p_diet_add', { getuser, rows, row, assignedTo: row[0].assignedTo, alert: 'New Food Has Been Added' });
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

}

//function 5 - display update form with data based on its id(pass id)
exports.form_update_diet_id = (req, res) => {
    db.query('SELECT * FROM diets WHERE id = ?', [req.params.id], (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_p_diet_edit', { rows });
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}

//function 6 - update existing data using its id(pass req.body)
exports.update_diet_id = (req, res) => {

    const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());

    console.log("Day: " + createdAt.getDate());
    console.log("Month: " + (createdAt.getMonth() + 1));
    console.log("Year: " + createdAt.getFullYear());

    const { ic, fullname, assignedTo, name, calories, type, serving_size, serving_type, time } = req.body;

    const ss = parseInt(serving_size);
    const cal = parseInt(calories);
    if (!serving_size || ss < 1 || cal < 1 || !cal || !name || !type) {

        db.query('SELECT * FROM patientdetails WHERE ic = ?', [ic], (error, row) => {
            if (!error) {
                db.query('SELECT * FROM userdetails WHERE ic = ?', [ic], (err, getuser) => {

                    res.status(400).render('v_p_diet_edit', { getuser, row, assignedTo: row[0].assignedTo, message: 'Incorrect Input Field' });
                })
            } else {
                console.log(error);
            }


        })
    } else {

        //if no error in input field
        var c = [],
            labels = [];
        var datep = new Date(time);
        var getsdate = datep.getDate() + "/" + (datep.getMonth() + 1) + "/" + datep.getFullYear();
        console.log(getsdate);
        c.push(cal);
        labels.push(getsdate);

        db.query('SELECT * FROM diets WHERE ic = ?', [ic], (err, rows) => {

            db.query('SELECT * FROM patientdetails WHERE ic = ?', [ic], (err, row) => {

                if (rows.length != 0) {

                    console.log("rowlength", rows.length);
                    for (let n = 0; n < rows.length; n++) {

                        var getDate = new Date(rows[n].time);
                        console.log("getdate", getDate);
                        var newDate = getDate.getDate() + "/" + (getDate.getMonth() + 1) + "/" + getDate.getFullYear();


                        var calofmeal = rows[n].calories;
                        calofmeal = parseInt(calofmeal);
                        console.log(typeof calofmeal + "calofmeal" + calofmeal);

                        if (rows[n].id != req.params.id) {
                            if (labels.includes(newDate)) {
                                for (let i = 0; i < labels.length; i++) {

                                    c[i] = parseInt(c[i]);
                                    if (labels[i] == newDate) {
                                        c[i] = c[i] + calofmeal;
                                        console.log("ci before break", c[i], typeof c[i]);
                                        break;
                                    }
                                }

                            } else {
                                c.push(calofmeal);
                                labels.push(newDate);
                            }
                        }

                    }


                    console.log("c", c);
                    console.log("labels", labels);

                    for (let m = 0; m < c.length; m++) {
                        if (c[m] > row[0].daily_intake && (labels[m] === getsdate)) {
                            console.log("ci", c[m]);
                            console.log("DI", row[0].daily_intake);

                            const sid = process.env.SID;
                            const auth_token = process.env.AUTH_TOKEN;

                            var twilio = require('twilio')(sid, auth_token);
                            twilio.messages.create({
                                from: "+15074788007",
                                to: "+60134355859",
                                body: `BARIACT. Patient ${fullname} (${ic}) has exceeded the recommended calories intake of ${row[0].daily_intake} on ${labels[m]}.  ${fullname}'s total calories intake on ${labels[m]} is ${c[m]}.`

                            }).then((res) => console.log('message sent')).catch((err) => { console.log(err) })
                        }
                    }

                }
            })

        })

        db.query('UPDATE diets SET ic = ?, fullname = ?, assignedTo = ?, time = ?, name = ?, calories = ?, type = ?, serving_size = ?, serving_type = ?,updatedAt = ? WHERE id = ?', [ic, fullname, assignedTo, time, name, calories, type, serving_size, serving_type, updatedAt, req.params.id], (err, rows) => {
            //when done with connection
            if (!err) { //if not error

                //display back updated version
                db.query('SELECT * FROM diets WHERE id = ?', [req.params.id], (err, rows) => {
                    //when done with connection

                    if (!err) { //if not error

                        db.query('SELECT * FROM patientdetails WHERE ic = ?', [ic], (error, row) => {
                            if (!error) {
                                db.query('SELECT * FROM userdetails WHERE ic = ?', [ic], (err, getuser) => {

                                    res.render('v_p_diet_edit', { getuser, rows, row, assignedTo: row[0].assignedTo, alert: `${name} Has Been Updated` });
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

            } else {
                console.log(err);
            }
            console.log(rows);

        })
    }


}

//function 7 - delete existing data using its id(pass id)
exports.delete_diet_id = (req, res) => {

    if (req.params.id) {
        db.query('DELETE FROM diets WHERE id = ?', [req.params.id], (err, rows) => {
            //when done with connection

            if (!err) { //if not error
                let removedFood = encodeURIComponent('Food Successfully Removed');
                res.redirect('/diet/view?removed=' + removedFood); //no need render just redirect to same page of current page dislaying
                // res.redirect('/diet/view');
            } else {
                console.log(err);
            }
            console.log(rows);
        })
    }
}

//function 8 - display specific food based on its id(pass id)
exports.display_diet_id = (req, res) => {

    db.query('SELECT * FROM diets WHERE id = ?', [req.params.id], (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_p_diet_display', { rows, alert: 'Your Selected Food Displayed Below' });
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}

//function 9 - display search form to search existing food
exports.form_search_foodlist = (req, res) => {
    res.render('v_p_diet_search');
}

//function 10 - search specific food based on req.body.search
exports.search_foodlist_db = (req, res) => {

    let searchTerm = req.body.search; //get req.body.search from v_p_diet_search(name="search")
    const ic = req.body.ic;
    console.log("my ic for search diet" + ic);

    db.query('SELECT * FROM food_list WHERE name LIKE ? LIMIT 10', ['%' + searchTerm + '%'], (err, rows) => {
        //when done with connection
        if (!err) { //if not error
            //res.render('v_p_diet_search', { ic: req.body.ic, rows, alert: 'Display Searched Food', searchword: searchTerm });

            db.query('SELECT * FROM patientdetails WHERE ic = ?', [ic], (error, row) => {
                if (!error) {
                    db.query('SELECT * FROM userdetails WHERE ic = ?', [ic], (err, getuser) => {

                        res.render('v_p_diet_search', { getuser, rows, row, assignedTo: row[0].assignedTo, ic: req.body.ic, alert: 'Display Searched Food', searchword: searchTerm });
                    })


                } else {
                    console.log(error);
                }
            })

        } else {
            console.log(err);
        }
    })
}

//function 11 - add specific food after search from database food
exports.add_search_diet = (req, res) => {
    const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());

    //console.log(createdAt, updatedAt);

    var size = req.body.serving_size;
    const serving_size = parseInt(size);

    var cal = req.body.calories;
    let calories = parseInt(cal);

    //console.log(serving_size, calories);

    const newCal = calories * serving_size;

    //console.log(newCal);

    const { ic, fullname, name, type, serving_type, time } = req.body;
    console.log("add_search_diet", ic, fullname);

    const ss = parseInt(serving_size);
    const cc = parseInt(calories);
    if (!serving_size || ss < 1 || cc < 1 || !cc || !name || !type) {

        db.query('SELECT * FROM patientdetails WHERE ic = ?', [ic], (error, row) => {
            if (!error) {
                db.query('SELECT * FROM userdetails WHERE ic = ?', [ic], (err, getuser) => {

                    res.render('v_p_diet_search', { getuser, row, assignedTo: row[0].assignedTo, message: 'Incorrect Input Field' });
                })
            } else {
                console.log(error);
            }
        })
    } else {
        var c = [],
            labels = [];
        var datep = new Date(time);
        var getsdate = datep.getDate() + "/" + (datep.getMonth() + 1) + "/" + datep.getFullYear();
        console.log(getsdate);

        db.query('SELECT * FROM diets WHERE ic = ?', [ic], (err, rows) => {

            db.query('SELECT * FROM patientdetails WHERE ic = ?', [ic], (err, row) => {

                c.push(newCal);
                labels.push(getsdate);

                if (rows.length != 0) {

                    console.log("rowlength", rows.length);
                    for (let n = 0; n < rows.length; n++) {


                        var getDate = new Date(rows[n].time);
                        console.log("getdate", getDate);
                        var newDate = getDate.getDate() + "/" + (getDate.getMonth() + 1) + "/" + getDate.getFullYear();


                        var calofmeal = rows[n].calories;
                        calofmeal = parseInt(calofmeal);
                        console.log(typeof calofmeal + "calofmeal" + calofmeal);

                        if (labels.includes(newDate)) {
                            for (let i = 0; i < labels.length; i++) {

                                c[i] = parseInt(c[i]);

                                if (labels[i] == newDate) {

                                    c[i] = c[i] + calofmeal;
                                    console.log("ci before break", c[i], typeof c[i]);
                                    break;
                                }
                            }

                        } else {
                            c.push(calofmeal);
                            labels.push(newDate);
                        }

                    }


                    console.log("c", c);
                    console.log("labels", labels);

                    for (let m = 0; m < c.length; m++) {
                        if (c[m] > row[0].daily_intake && (labels[m] === getsdate)) {
                            console.log("ci", c[m]);
                            console.log("DI", row[0].daily_intake);

                            const sid = process.env.SID;
                            const auth_token = process.env.AUTH_TOKEN;

                            var twilio = require('twilio')(sid, auth_token);
                            twilio.messages.create({
                                from: "+15074788007",
                                to: "+60134355859",
                                body: `BARIACT. Patient ${fullname} (${ic}) has exceeded the recommended calories intake of ${row[0].daily_intake} on ${labels[m]}.  ${fullname}'s total calories intake on ${labels[m]} is ${c[m]}.`

                            }).then((res) => console.log('message sent')).catch((err) => { console.log(err) })
                        }
                    }

                } else {
                    console.log("row 0")
                }
            })

        })


        //console.log("pass my ic" + req.body.ic);

        db.query('SELECT * FROM patientdetails WHERE ic = ?', [ic], (err, row) => {
            const at = row[0].assignedTo;
            db.query('INSERT INTO diets SET ic = ?, fullname = ?, assignedTo = ?, time = ?, name = ?, calories = ?, type = ?, serving_size = ?, serving_type = ?, createdAt = ?, updatedAt = ?', [ic, fullname, at, time, name, newCal, type, serving_size, serving_type, createdAt, updatedAt], (err, rows) => {
                //when done with connection
                if (!err) { //if not error

                    db.query('SELECT * FROM userdetails WHERE ic = ?', [ic], (err, getuser) => {

                        res.render('v_p_diet_search', { getuser, assignedTo: row[0].assignedTo, alert: 'New Food Has Been Added' });
                    })

                } else {
                    console.log(err);
                }
                console.log(rows);

            })
        });
    }

}