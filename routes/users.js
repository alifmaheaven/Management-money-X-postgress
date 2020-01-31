'use strict';

var express = require('express');
var router = express.Router();

//for upload
var uploadcek = require('../config/upload')
var upload = uploadcek.destination('public')

const user = require('../controllers/userControllers');
const verify = require('../middleware/verify');

/* GET users listing. */
// router.get('/', user.users);
router.post('/register', upload.none(), user.createUsers);
router.get('/verifyuser/', upload.none(), user.verifyUser);
router.post('/login', upload.none(), user.loginUser);
router.post('/getuser',verify.verifyToken, upload.none(), user.getUser);
router.post('/sendrequestforget', upload.none(), user.sendRequestForget);
router.post('/changepassword', upload.none(), user.changePassword);

module.exports = router;