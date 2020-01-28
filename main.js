require('dotenv').config()

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')

var port = process.env.PORT || 3000
// var usersRouter = require('./routes/users');
// var journalsRouter = require('./routes/journals');

var app = express();
app.use(cors());
app.use('/public', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use('/api/user', usersRouter);
// app.use('/api/journal', journalsRouter);
app.get('/', (req, res) => {
    return res.send('Api already create');
});

app.listen(port, () => {
    console.log(`Server started on port :`+port+``);
});
