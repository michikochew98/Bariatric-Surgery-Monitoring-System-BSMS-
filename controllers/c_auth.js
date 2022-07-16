const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const async = require("hbs/lib/async");
const { home } = require("nodemon/lib/utils");
const schedule = require('node-schedule');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});

exports.login_user = async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).render('v_login', {
                message: 'Field Cannot Be Empty'
            })
        }

        db.query('SELECT * FROM userdetails WHERE email = ?', [email], async(error, results) => {
            // console.log(results);
            if ((!results || !(await bcrypt.compare(password, results[0].password)))) {
                res.status(401).render('v_login', {
                    message: 'Email or Password is Incorrect'
                })
            } else {
                const id = results[0].id;
                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is " + token);

                const cookieOptions = {
                    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);

                if (results[0].role === "Doctor") {
                    res.status(200).redirect("/doctor/profile");
                } else if (results[0].role === "Patient") {
                    res.status(200).redirect("/profile/display");
                } else {
                    res.status(200).redirect("/admin/healthcare");
                }

            }
        })
    } catch (error) {
        console.log(error);
    }
}

exports.form_register_patient = (req, res) => {
    res.render('v_p_profile_add');
}


exports.train = (req, res) => {



}

exports.register_user = (req, res) => {
    try {

        //console.log(req.body);

        const { email, password, passwordConfirm, role, ic, healthcare } = req.body;

        var r = req.body.role;
        var fullname = req.body.fullname;

        if (r === "Doctor") {
            if (!(fullname.includes("dr")) || !(fullname.includes("DR")) || !(fullname.includes("Dr")) || !(fullname.includes("dR"))) {
                fullname = "Dr " + fullname;
            }
        }

        //console.log(" 2. " + email + " 3. " + password + " 4. " + passwordConfirm + " 5. " + role + " 6. " + ic + "7." + healthcare);

        if (!fullname || !email || !password || !passwordConfirm || !role || !ic) {


            db.query('SELECT * FROM healthcare', (err, rows) => {

                if (!err) { //if not error
                    return res.status(400).render('v_register', {
                        message: 'Field Cannot Be Empty',
                        rows: rows
                    })
                } else {
                    console.log(err);
                }

                console.log('the data from user table', rows);
            })
        }


        db.query('SELECT * FROM healthcare', (err, rows) => {

            if (!err) { //if not error

                db.query('SELECT ic FROM userdetails WHERE ic = ? OR email = ?', [ic, email], async(error, results) => {

                    if (error) {
                        console.log(error);
                    }
                    if (results.length > 0) {
                        return res.render('v_register', {
                            message: 'IC or Email Has Been Registered',
                            rows: rows
                        })
                    } else if (password !== passwordConfirm) {
                        return res.render('v_register', {
                            message: 'Password Do Not Match',
                            rows: rows
                        })
                    }

                    let hashedPassword = await bcrypt.hash(password, 8);
                    console.log(hashedPassword);

                    db.query('INSERT INTO userdetails SET ?', { fullname: fullname, email: email, password: hashedPassword, ic: ic, role: role, healthcare: healthcare }, (error, results) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(results);
                            /*
                                if (role == "Patient") {
                                    return res.status(200).render('v_p_profile', {
                                        message: 'Successfully Registered',
                                        ic: ic
                                    })
                                } else if (role == "") {
                                    return res.status(200).render('v_d_register', {
                                        message: 'Successfully Registered'
                                    })
                                } else {
            
                                }*/

                            return res.status(200).render('v_login', {
                                success: 'Successfully Registered'
                            });
                        }
                    })
                })
            } else {
                console.log(err);
            }

            console.log('the data from user table', rows);
        })
    } catch (error) {

    }

}

exports.isLoggedIn = async(req, res, next) => {


    //run every 2 seconds
    const mJob = schedule.scheduleJob('*/2 * * * * *', () => {

        db.query('SELECT * FROM train_food', (err, rows) => {
            if (!err) {
                if (rows.length > 0) {
                    for (let i = 0; i < rows.length; i++) {
                        if (rows[i].new === 1) {
                            console.log('Row ID' + rows[i].id + " is a new row");
                        }
                    }
                }
            }
        })


        // mJob.cancel();
        //console.log('job ran @', new Date().toString());
        //mJob.cancel();
    })

    //console.log(req.cookies);
    if (req.cookies.jwt) {
        try {

            // 1. Verify token of the user
            //get ID from jwt token parameter - jwt token & password
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            console.log(decoded);

            // 2. Check if user exist in MySQL based on decoded jwt token ID 
            db.query('SELECT * FROM userdetails WHERE id = ?', [decoded.id],
                (error, result) => {
                    console.log(result);

                    //2. a. if there is no result
                    if (!result) {
                        return next();
                    }

                    req.user = result[0]; //only 1 array of result
                    return next();
                });

        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        next(); //next() function redirect back to r_pages
    }
}

exports.logout_user = async(req, res) => {


    //run every 2 seconds
    const mJob = schedule.scheduleJob('*/2 * * * * *', () => {

        db.query('SELECT * FROM train_food', (err, rows) => {
            if (!err) {
                if (rows.length > 0) {
                    for (let i = 0; i < rows.length; i++) {
                        if (rows[i].new === 1) {

                        }
                    }
                }
            }
        })

        //console.log('job ran @', new Date().toString());
        //mJob.cancel();
    })

    //if user has cookie, overwrite by jwt
    res.cookie('jwt', 'logout', {
        //cookie expires in 2 sec once click logout
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });

    //redirect to homepage
    res.status(200).redirect('/');


}