
require("dotenv").config();

const express = require("express");

const router = require("./router/router")
const routerAdmin = require("./router/routerAdmin")
const hbs = require("hbs");

const app = express();

// HBS
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

// MIDDLEWARE
app.use(express.static(__dirname + "/public"));

// Configurar express para procesar datos de formulario
app.use(express.urlencoded({extended: false}));


app.use("/", router);
app.use("/admin", routerAdmin);



const port = process.env.PORT || 3001;
app.listen(port , () => {
    console.log("usando el puerto http://localhost:" + port);
})