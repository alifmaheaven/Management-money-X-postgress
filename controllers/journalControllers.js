'use strict';

require('dotenv').config()

var response = require('../config/res');
var { pool } = require('../config/database');

const uuidv1 = require('uuid/v1');
const moment = require('moment');
var localFormat = 'YYYY-MM-DD HH:mm:ss';

exports.getJournals = function(req, res) {

    var query = 'SELECT * FROM journals'
    var id
    if (req.params.id) {
        id = req.params.id
        query += ` WHERE id = '${id}'`
    }

    pool.query(query, 
    function (error, result){
        if(error){
            console.log(error)
            response.bad("Gagal mendapatkan journals!",null, res)
        } else{
            response.ok("Success",id ? result.rows[0] : result.rows, res)
        }
    });
};

exports.createJournals = function(req, res) {
    var users_id = req.body.users_id
    var categories_id = req.body.categories_id
    var name = req.body.name;
    var description = req.body.description;
    var price = req.body.price
    var nota = req.files.nota[0].path
    // console.log(nota);

    pool.query('INSERT INTO journals(id, users_id, categories_id, name, description, price, nota, created_date, modified_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
    [uuidv1(), users_id, categories_id, name, description, price, nota, String(moment(new Date()).format(localFormat)), String(moment(new Date()).format(localFormat)) ], 
    function (error, result){
        if(error){
            console.log(error)
            response.ok("Gagal menambahkan journals",null, res)
        } else{
            response.ok("Berhasil menambahkan journals",null, res)
        }
    });
};

exports.updateJournals = function(req, res) {
    var id = req.body.id
    var users_id = req.body.users_id
    var categories_id = req.body.categories_id
    var name = req.body.name;
    var description = req.body.description;
    var price = req.body.price
    var nota = req.files.nota != null ? req.files.nota[0].path : ''

    pool.query('UPDATE journals SET users_id=$1,categories_id=$2,name=$3,description=$4,price=$5,nota=$6, modified_date =$7  WHERE id=$8',
    [ users_id, categories_id, name, description, price, nota, String(moment(new Date()).format(localFormat)), id ],
    function (error, result){
        if(error){
            console.log(error)
            response.ok("Gagal merubah journals",null, res)
        } else{
            console.log(result);
            response.ok("Berhasil merubah journals",null, res)
        }
    });
};

exports.deleteJournals = function(req, res) {
    
    var id = req.body.id;

    pool.query('DELETE FROM journals WHERE id = $1',
    [ id ], 
    function (error, result){
        if(error){
            console.log(error)
            response.ok("Gagal menghapus journals!",null, res)
        } else{
            response.ok("Berhasil menghapus journals!",null, res)
        }
    });
};