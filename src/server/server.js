const express=require("express");
const app=express();
const path=require("path");
const bodyParser=require("body-parser");
const logger=require("morgan");
const routes=require(".././routes/routes");
const multer=require("multer");
const flash=require("req-flash")

//Configuracion
app.set('port',process.env.PORT || 3000);
app.set('views',path.join(__dirname,"../views"))
app.set("view engine","ejs");
app.use('/public',express.static(__dirname+'/../public'));


//middlewares
app.use(bodyParser.json());
// app.use(bodyParser.raw({type:'image/*',limit:'2mb'}));
app.use(bodyParser.urlencoded({
    extended: true,
}));

// app.use(flash())
app.use(logger("dev"));


//Rutas
app.use(routes);


module.exports=app;