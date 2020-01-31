'use strict';

require('dotenv').config()

var response = require('../config/res');
var { pool } = require('../config/database');

const uuidv1 = require('uuid/v1');
const moment = require('moment');
var localFormat = 'YYYY-MM-DD HH:mm:ss';

exports.getTypes = function(req, res) {
    pool.query('SELECT * FROM types', 
    function (error, result){
        if(error){
            console.log(error)
            response.bad("Gagal mendapatkan types!",null, res)
        } else{
            response.ok("Success", result.rows, res)
        }
    });
};

exports.createTypes = function(req, res) {
    var name = req.body.name;
    var description = req.body.description;

    pool.query('INSERT INTO types (id, name, description, created_date, modified_date) values ($1,$2,$3,$4,$5)',
    [uuidv1(), name, description, String(moment(new Date()).format(localFormat)), String(moment(new Date()).format(localFormat))], 
    function (error, result){
        if(error){
            console.log(error)
            response.ok("Gagal menambahkan Type!",null, res)
        } else{
            response.ok("Berhasil menambahkan Type!",null, res)
        }
    });
};

exports.updateTypes = function(req, res) {
    var id = req.body.id
    var name = req.body.name;
    var description = req.body.description;

    pool.query('UPDATE types SET name = $1, description = $2, modified_date = $3 WHERE id = $4',
    [ name, description, String(moment(new Date()).format(localFormat)), id], 
    function (error, result){
        if(error){
            console.log(error)
            response.ok("Gagal merubah Type!",null, res)
        } else{
            console.log(result);
            response.ok("Berhasil merubah Type!",null, res)
        }
    });
};

exports.deleteTypes = function(req, res) {
    
    var id = req.body.id;

    pool.query('DELETE FROM types WHERE id = $1',
    [ id ], 
    function (error, result){
        if(error){
            console.log(error)
            response.ok("Gagal menghapus types!",null, res)
        } else{
            response.ok("Berhasil menghapus types!",null, res)
        }
    });
};