const express = require('express');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const ejsLocals = require('ejs-locals');
const sql = require('mssql');
const passport  = require('passport');

const Routing = require('./Routing/routing');

const app = express();
const Port_Number = process.env.PORT||3000;

app.engine('ejs',ejsLocals);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.static(__dirname+'/Public'));

app.use(bodyParser.urlencoded({
    extended: true
}));


bodyParser.json();

app.use(function(res,req,next){
    //console.log('start');
    //sql.close();
    //console.log('sql connection close');
    next();
});

app.use('/',Routing);

app.listen(Port_Number,function(){
    console.log("Port listining at "+Port_Number);
});