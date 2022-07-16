const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const async = require("hbs/lib/async");

//add db connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});

//function 1 - display ALL list screening(no id is passed)
exports.view_screening = (req, res) => {
    db.query('SELECT * FROM screening', (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            let removedScreening = req.query.removed; //if any screening is deleted, set alert 
            res.render('v_p_screening', { rows, removedScreening: removedScreening });
            //res.render('v_p_screening');
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}

//function 2 - search screening by score(pass req.body)
exports.find_screening = (req, res) => {

    let searchTerm = req.body.search; //get req.body.search from v_p_screening(name="search")
    const ic = req.body.ic;

    db.query('SELECT * FROM screening WHERE updatedAt LIKE ? AND ic = ?', ['%' + searchTerm + '%', ic], (err, rows) => {
        //when done with connection
        if (!err) { //if not error

            db.query('SELECT * FROM patientdetails WHERE ic = ?', [ic], (error, row) => {
                if (!error) {
                    db.query('SELECT * FROM userdetails WHERE ic = ?', [ic], (err, getuser) => {

                        res.render('v_p_screening', { getuser, rows, row, assignedTo: row[0].assignedTo, ic: req.body.ic, alert: 'Display Searched Screening' });
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

//function 3 - display add form to add new screening
exports.form_add_screening = (req, res) => {
    res.render('v_p_screening_add');
}


//function 4 - add new screening(pass req.body)
exports.add_screening = (req, res) => {

    const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());

    console.log(createdAt, updatedAt);

    const { ic, fullname, assignedTo, depress1, depress2, depress3, depress4, depress5, eat1, eat2, eat3, eat4, eat5 } = req.body;

    const datep = createdAt.getDate() + "/" + (createdAt.getMonth() + 1) + "/" + createdAt.getFullYear();

    //calculate score
    var nonum = 0;

    if (depress1 === "no") {
        nonum = nonum + 1;
    }
    if (depress2 === "no") {
        nonum = nonum + 1;
    }
    if (depress3 === "no") {
        nonum = nonum + 1;
    }
    if (depress4 === "no") {
        nonum = nonum + 1;
    }
    if (depress5 === "no") {
        nonum = nonum + 1;
    }
    if (eat1 === "no") {
        nonum = nonum + 1;
    }
    if (eat2 === "no") {
        nonum = nonum + 1;
    }
    if (eat3 === "no") {
        nonum = nonum + 1;
    }
    if (eat4 === "no") {
        nonum = nonum + 1;
    }
    if (eat5 === "no") {
        nonum = nonum + 1;
    }

    const finalscore = (nonum / 10) * 100;
    console.log(finalscore);
    const score = finalscore;

    if (depress1 === "yes" && depress2 === "yes" && depress3 === "yes" && depress4 === "yes" && depress5 === "yes") {
        const sid = process.env.SID;
        const auth_token = process.env.AUTH_TOKEN;

        var twilio = require('twilio')(sid, auth_token);
        twilio.messages.create({
            from: "+15074788007",
            to: "+60134355859",
            body: `BARIACT. Patient ${fullname} (${ic}) has recorded he/she Depression Screening Form. The form was submitted on ${datep} and the result are all 'yes'.`

        }).then((res) => console.log('message sent')).catch((err) => { console.log(err) })
    }


    if (eat1 === "yes" && eat2 === "yes" && eat3 === "yes" && eat4 === "yes" && eat5 === "yes") {
        const sid = process.env.SID;
        const auth_token = process.env.AUTH_TOKEN;

        var twilio = require('twilio')(sid, auth_token);
        twilio.messages.create({
            from: "+15074788007",
            to: "+60134355859",
            body: `BARIACT. Patient ${fullname} (${ic}) has recorded he/she Eating Habits Screening Form. The form was submitted on ${datep} and the result are all 'yes'.`

        }).then((res) => console.log('message sent')).catch((err) => { console.log(err) })
    }

    db.query('INSERT INTO screening SET ic = ?, fullname = ?, assignedTo = ?, score = ?,  depress1 = ?,  depress2 = ?,  depress3 = ?,  depress4 = ?,  depress5 = ?, eat1 = ?, eat2 = ?, eat3 = ?, eat4 = ?, eat5 = ?, createdAt = ?, updatedAt = ?', [ic, fullname, assignedTo, score, depress1, depress2, depress3, depress4, depress5, eat1, eat2, eat3, eat4, eat5, createdAt, updatedAt], (err, rows) => {
        //when done with connection
        if (!err) { //if not error

            db.query('SELECT * FROM patientdetails WHERE ic = ?', [ic], (error, row) => {
                if (!error) {
                    db.query('SELECT * FROM userdetails WHERE ic = ?', [ic], (err, getuser) => {

                        res.render('v_p_screening_add', { getuser, rows, row, assignedTo: row[0].assignedTo, alert: 'New Screening Has Been Added' });
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

//function 5 - display update form with data based on its id(pass id)
exports.form_update_screening_id = (req, res) => {
    db.query('SELECT * FROM screening WHERE id = ?', [req.params.id], (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_p_screening_edit', { rows, update: 'update' });
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}

//function 6 - update existing data using its id(pass req.body)
exports.update_screening_id = (req, res) => {

    const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());


    const { ic, fullname, assignedTo, depress1, depress2, depress3, depress4, depress5, eat1, eat2, eat3, eat4, eat5 } = req.body;

    //calculate score
    var nonum = 0;

    if (depress1 === "no") {
        nonum = nonum + 1;
    }
    if (depress2 === "no") {
        nonum = nonum + 1;
    }
    if (depress3 === "no") {
        nonum = nonum + 1;
    }
    if (depress4 === "no") {
        nonum = nonum + 1;
    }
    if (depress5 === "no") {
        nonum = nonum + 1;
    }
    if (eat1 === "no") {
        nonum = nonum + 1;
    }
    if (eat2 === "no") {
        nonum = nonum + 1;
    }
    if (eat3 === "no") {
        nonum = nonum + 1;
    }
    if (eat4 === "no") {
        nonum = nonum + 1;
    }
    if (eat5 === "no") {
        nonum = nonum + 1;
    }

    const finalscore = (nonum / 10) * 100;
    console.log(finalscore);
    const score = finalscore;


    db.query('UPDATE screening SET ic = ?, fullname = ?, assignedTo = ?, score = ?,  depress1 = ?,  depress2 = ?,  depress3 = ?,  depress4 = ?,  depress5 = ?, eat1 = ?, eat2 = ?, eat3 = ?, eat4 = ?, eat5 = ?,  updatedAt = ? WHERE id = ?', [ic, fullname, assignedTo, score, depress1, depress2, depress3, depress4, depress5, eat1, eat2, eat3, eat4, eat5, updatedAt, req.params.id], (err, rows) => {
        //when done with connection
        if (!err) { //if not error

            //display back updated version
            db.query('SELECT * FROM screening WHERE id = ?', [req.params.id], (err, rows) => {
                //when done with connection

                if (!err) { //if not error

                    db.query('SELECT * FROM patientdetails WHERE ic = ?', [ic], (error, row) => {
                        if (!error) {
                            db.query('SELECT * FROM userdetails WHERE ic = ?', [ic], (err, getuser) => {

                                res.render('v_p_screening_edit', { getuser, rows, row, assignedTo: row[0].assignedTo, alert: `${updatedAt} Has Been Updated` });
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

//function 7 - delete existing data using its id(pass id)
exports.delete_screening_id = (req, res) => {

    if (req.params.id) {
        db.query('DELETE FROM screening WHERE id = ?', [req.params.id], (err, rows) => {
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
}

//funciton 8 - display specific screening based on its id(pass id)
exports.display_screening_id = (req, res) => {

    db.query('SELECT * FROM screening WHERE id = ?', [req.params.id], (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_p_screening_display', { rows, alert: 'Your Selected Screening Displayed Below' });
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}