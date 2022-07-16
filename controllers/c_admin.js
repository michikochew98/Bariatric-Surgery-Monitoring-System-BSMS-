const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const async = require("hbs/lib/async");
const authContoller = require('./c_auth');

//add db connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});

//HEALTHCARE

//function 2 - search healthcare by name of healthcare(pass req.body)
exports.find_healthcare = (req, res) => {

    let searchTerm = req.body.search; //get req.body.search from v_a_healthcare(name="search")

    db.query('SELECT * FROM healthcare WHERE name LIKE ? OR address LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
        //when done with connection
        if (!err) { //if not error
            res.render('v_a_healthcare', { rows, alert: 'Display Searched Healthcare Provider' });
        } else {
            console.log(err);
        }
        console.log(rows);

    })

}

//function 4 - add new healthcare(pass req.body)
exports.add_healthcare = (req, res) => {

    const { name, address, state } = req.body;

    db.query('INSERT INTO healthcare SET name = ?, address = ?, state = ?', [name, address, state], (err, rows) => {
        //when done with connection
        if (!err) { //if not error
            res.render('v_a_healthcare_add', {
                alert: 'New Healthcare Has Been Added'
            });
        } else {
            console.log(err);
        }
        console.log(rows);

    })

}

//function 6 - update existing data using its id(pass req.body)
exports.update_healthcare_id = (req, res) => {

    const { name, address, state } = req.body;

    db.query('UPDATE healthcare SET name = ?, address = ?, state = ? WHERE id = ?', [name, address, state, req.params.id], (err, rows) => {
        //when done with connection
        if (!err) { //if not error

            //display back updated version
            db.query('SELECT * FROM healthcare WHERE id = ?', [req.params.id], (err, rows) => {
                //when done with connection

                if (!err) { //if not error
                    res.render('v_a_healthcare_edit', { rows, alert: `${name} Has Been Updated` });
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



//PATIENTLIST

//function 2 - search patient by name(pass req.body)
exports.find_patientlist = (req, res) => {

    let searchTerm = req.body.search; //get req.body.search from v_a_patientlist(name="search")

    db.query('SELECT * FROM patientdetails WHERE fullname LIKE ? OR assignedTo LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
        //when done with connection
        if (!err) { //if not error
            res.render('v_a_patientlist', { rows, alert: 'Display Searched Patient' });
        } else {
            console.log(err);
        }
        console.log(rows);

    })

}


//function 6 - update existing data using its id(pass req.body)
exports.update_patientlist_id = (req, res) => {

    const { fullname, ic, surgery_status, phone_number } = req.body;

    db.query('UPDATE patientdetails SET fullname = ?, surgery_status = ?, phone_number = ? WHERE id = ?', [fullname, surgery_status, phone_number, req.params.id], (err, rows) => {
        //when done with connection
        if (!err) { //if not error

            db.query('UPDATE userdetails SET fullname = ? WHERE ic = ?', [fullname, ic], (err, rows) => {
                //when done with connection
                if (!err) { //if not error


                    //display back updated version
                    db.query('SELECT * FROM patientdetails WHERE id = ?', [req.params.id], (err, rows) => {
                        //when done with connection

                        if (!err) { //if not error
                            res.render('v_a_patientlist_edit', { rows, alert: `${fullname} Has Been Updated` });
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
        console.log(rows);

    })
}




//DOCTORLIST

//function 2 - search doctor by name(pass req.body)
exports.find_doctorlist = (req, res) => {

    let searchTerm = req.body.search; //get req.body.search from v_a_doctorlist(name="search")

    db.query('SELECT * FROM doctordetails WHERE fullname LIKE ?', ['%' + searchTerm + '%'], (err, rows) => {
        //when done with connection
        if (!err) { //if not error
            res.render('v_a_doctorlist', { rows, alert: 'Display Searched Doctor' });
        } else {
            console.log(err);
        }
        console.log(rows);

    })

}


//function 6 - update existing data using its id(pass req.body)
exports.update_doctorlist_id = (req, res) => {

    const { fullname, ic, home_address, phone_number } = req.body;

    db.query('UPDATE doctordetails SET fullname = ?, home_address = ?, phone_number = ? WHERE id = ?', [fullname, home_address, phone_number, req.params.id], (err, rows) => {
        //when done with connection
        if (!err) { //if not error

            db.query('UPDATE userdetails SET fullname = ? WHERE ic = ?', [fullname, ic], (err, rows) => {
                //when done with connection
                if (!err) { //if not error


                    //display back updated version
                    db.query('SELECT * FROM doctordetails WHERE id = ?', [req.params.id], (err, rows) => {
                        //when done with connection

                        if (!err) { //if not error
                            res.render('v_a_doctorlist_edit', { rows, alert: `${fullname} Has Been Updated` });
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
        console.log(rows);

    })
}