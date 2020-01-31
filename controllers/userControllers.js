'use strict';

require('dotenv').config()

var response = require('../config/res');
var { pool } = require('../config/database');

var mailConfig = require('../config/email');

const uuidv1 = require('uuid/v1');
const moment = require('moment');
var localFormat = 'YYYY-MM-DD HH:mm:ss';

var SCREET_KEY = process.env.SCREET_KEY
var EXPIRED_TOKEN = process.env.EXPIRED_TOKEN * 60

// agar sepuluh baris maka kita gunakan salt dan pake async ya :)
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

exports.getUser = async function(req, res) {
    jwt.verify(req.token, SCREET_KEY, (err, authData) => {
        if (err) {
            response.bad("Token Expired",null, res);
        } else {
            response.ok('Success',authData, res)
        }
    } )
};

exports.createUsers = async function(req, res) {
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var url = req.body.url;
    var selfUrl = req.protocol + '://' + req.get('host')+'/'
    console.log(selfUrl);
    
    var salt = await bcrypt.genSalt(10);
    var password = await bcrypt.hash(password, salt)

    var userData = {
        name : name,
        username : username,
        email : email,
        password : password,
        url : url
    }


pool.query('SELECT * FROM users WHERE username = $1 OR email = $2 ',
[username,username],
async function (err, result){
    if(err){
        console.log(err)
        response.bad("Error Database",null, res)
    } else{
        // console.log(result.rows);
        if (result.rows.length > 0) {
            response.bad('Email/Username already exist',null, res)
            return
        } else {
            console.log(uuidv1());
            pool.query('INSERT INTO users (id, name, username, email, password, is_active, created_date, modified_date) values ($1,$2,$3,$4,$5,0,$6,$7)',
            [uuidv1(), name, username, email, password, String(moment(new Date()).format(localFormat)),String(moment(new Date()).format(localFormat)) ], 
            function (err, result){
                    if(err){
                        console.log(err)
                        response.bad("gagal menambahkan user!",null, res)
                    } else {
                        jwt.sign({userData}, SCREET_KEY,(err, token) => {
                            selfUrl = selfUrl + 'api/user/verifyuser' +'?token='+token+''                   
                            mailConfig.email.send({
                                template: 'confirmationEmail',
                                message: {
                                    from: 'Alif Maheaven <no-reply@blog.com>',
                                    to: email,
                                },
                                locals: {
                                    subject: 'Verify User',
                                    token: token,
                                    urlSelf:selfUrl,
                                    name:name,
                                }
                            })
                            .then((result) => {
                                console.log('send');
                                response.ok("Email send!",null, res)
                                return
                            })
                            .catch((err) => {
                                console.log(err); 
                                response.bad("Email Not send!",null, res)
                                return
                            });
                        })
                    }
                });
            };
        }
    })
}

exports.verifyUser = async function(req, res) {
    var token = req.query.token
    var username

    jwt.verify(token, SCREET_KEY, (err, authData) => {
        if (err) {
            console.log(err);
            response.bad('Token Expired',null,res);
            return
        }
        console.log(authData.userData);
        // response.ok(authData.userData,null, res)
        username = authData.userData.username
        return username
    } )

    await pool.query('UPDATE users SET is_active = 1 WHERE username = $1',
    [username],
    async function (err, result){
        if(err){
            console.log(err)
            response.bad("Error Database",null, res)
        } else{
            response.ok("Success",result, res)
            return
        }
    });
}

   


exports.loginUser = async function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var isMatch
    var userData = {}

    pool.query('SELECT * FROM users WHERE username = $1 OR email = $2 AND is_active = 1',
    [username,username],
    async function (err, result){
        if(err){
            console.log(err)
            response.bad("Error Database",null, res)
        } else{
            if (result.rows.length > 0) {
                userData = result.rows[0]
                console.log(userData);
                isMatch = await bcrypt.compare( password, userData.password);
                if (isMatch) {
                    jwt.sign({userData}, SCREET_KEY,{expiresIn: EXPIRED_TOKEN},(err, token) => {
                        userData.token = token
                        // userData.expiresIn = 60 * EXPIRED_TOKEN
                        console.log(EXPIRED_TOKEN);
                        response.ok("Success",userData, res)
                   })
                   return
                }
                await response.bad('Username and Password not match',null, res)
                return
            }
            response.bad('Username not registered or not actived',null, res)
            return
        }
    });
};

exports.sendRequestForget = async function(req, res) {
    var email = req.body.email;
    var url = req.body.url
    var userData = {}
    if (email === null || email === undefined) {
        response.bad("Please insert email!",null, res)
        return
    }

    if (url === null || url === undefined) {
        response.bad("Please insert url for fogot password!",null, res)
        return
    }

    pool.query('SELECT * FROM users WHERE email = $1',
    [email,],
    async function (err, result){
        if(err){
            console.log(err)
            response.bad("Error Database",null, res)
            return
        } else{
            if (result.rows.length > 0) {
                userData = result.rows[0]
                console.log(userData.name);
                    jwt.sign({userData}, SCREET_KEY,{expiresIn: EXPIRED_TOKEN * 8},(err, token) => {  
                        console.log(token);           
                        mailConfig.email.send({
                            template: 'resetPassword',
                            message: {
                                from: 'Alif Maheaven <no-reply@blog.com>',
                                to: email,
                            },
                            locals: {
                                subject: 'Reset Password',
                                token: token,
                                urlSelf:url,
                                name:userData.name,
                            }
                        })
                        .then((result) => {
                            console.log('send');
                            response.ok("Email send!",null, res)
                            return
                        })
                        .catch((err) => {
                            console.log(err); 
                            response.bad("Email Not send!",null, res)
                            return
                        });
                   })
                   
            } else {
                response.bad('Email not registered',null, res)
                return
            }

        }
    });
};

exports.changePassword = async function(req, res) {
    var token = req.body.token;
    var newpassword = req.body.newpassword;
    var id

    var salt = await bcrypt.genSalt(10);
    newpassword = await bcrypt.hash(newpassword, salt)

    jwt.verify(token, SCREET_KEY, (err, authData) => {
        if (err) {
            console.log(err);
            response.bad('Token Expired',null,res);
            return
        }
        id = authData.userData.id
        return id
    } )

    pool.query('UPDATE users SET password = $1 WHERE id = $2',
    [newpassword,id],
    async function (err, result){
        if(err){
            console.log(err)
            response.bad("Error Database",null, res)
        } else{
            response.ok("Success",result, res)
            return
        }
    });
};
