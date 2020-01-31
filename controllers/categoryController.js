'use strict';

require('dotenv').config()

var response = require('../config/res');
var { pool } = require('../config/database');

const uuidv1 = require('uuid/v1');
const moment = require('moment');
var localFormat = 'YYYY-MM-DD HH:mm:ss';

exports.getCategory = function(req, res) {
    var query = 'SELECT * FROM categories'
    // req.params.id
    if (req.params.id) {
        console.log('halo');
    }
    // query += 'id'
    // console.log(req.params.id);
    pool.query('SELECT * FROM categories', 
    function (error, result){
        if(error){
            console.log(error)
            response.bad("Gagal mendapatkan categories!",null, res)
        } else{
            response.ok("Success", result.rows, res)
        }
    });
};

exports.createCategories = function(req, res) {
    var types_id = req.body.types_id
    var name = req.body.name;
    var description = req.body.description;

    pool.query('INSERT INTO categories (id, types_id, name, description,  created_date, modified_date) values ($1,$2,$3,$4,$5,$6)',
    [ uuidv1(), types_id, name, description, String(moment(new Date()).format(localFormat)), String(moment(new Date()).format(localFormat)) ], 
    function (error, result){
        if(error){
            console.log(error)
            response.bad("Gagal menambahkan categories",null, res)
        } else{
            response.ok("Berhasil menambahkan categories",null, res)
        }
    });
};

exports.updateCategories = function(req, res) {
    var id = req.body.id
    var types_id = req.body.types_id
    var name = req.body.name;
    var description = req.body.description;

    pool.query('UPDATE categories SET name = $1, description = $2, types_id = $3, modified_date = $4 WHERE id = $5',
    [ name, description, types_id,String(moment(new Date()).format(localFormat)), id], 
    function (error, result){
        if(error){
            console.log(error)
            response.ok("Gagal merubah categories",null, res)
        } else{
            response.ok("Berhasil merubah categories",null, res)
        }
    });
};

exports.deleteCategories = function(req, res) {
    
    var id = req.body.id;

    pool.query('DELETE FROM categories WHERE id = $1',
    [ id ], 
    function (error, result){
        if(error){
            console.log(error)
            response.ok("Gagal menghapus categories!",null, res)
        } else{
            response.ok("Berhasil menghapus categories!",null, res)
        }
    });
};