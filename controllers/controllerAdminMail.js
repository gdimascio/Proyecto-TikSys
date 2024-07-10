require("dotenv").config;
const { onSnapshotsInSync } = require("firebase/firestore");
const db = require("../firebase/firebase");
const nodemailer = require("nodemailer");
const fs = require('fs');
const { promisify } = require('util');
const handlebars = require('handlebars');
const juice = require('juice');

exports.sendChanges = async (req,res) => {
    // recupera el ID del tkt del URL
    const tktDoc = req.params.tktDoc;
    // LLAMA AL TKT CORRESPONDIENTE 
    const ticketsCollection = db.collection("tickets").doc(tktDoc);
    const doc = await ticketsCollection.get();
    // ASIGNA LOS DATOS DEL TICKET
    const {asunto, nombre, telefono, email, descripcion, estado, ticket, observaciones} = doc.data();

    // Revisa si se esta accediendo por host o de forma local
    let username;
    let password;
    try {
        if (!process.env.USERNAME || !process.env.PASSWORD) {
            throw new Error("No se encontraron variables en .env");
        }
        username = process.env.USERNAME;
        password = process.env.PASSWORD
    } catch (error) {
        console.log("No se encontraron variables en.env");
        console.log("Usando variables locales");
        username = process.env.USERNAME_LOCAL;
        password = process.env.PASSWORD_LOCAL
    }

    // Configura transportador SMTP usando .env
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        
        auth: {
            user: username,
            pass: password
        },
        tls: {rejectUnauthorized: false}
    });
    
    await new Promise((resolve, reject) => {
        // verify connection configuration
        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log("Server is ready to take our messages");
                resolve(success);
            }
        });
    });

    // Lee el template HTML y complílala con Handlebars
    const readFileAsync = promisify(fs.readFile);
    let htmlTemplate;
    let cssSheet;
    try {
        const templateFile = await readFileAsync('views/tktMailTemplate.hbs', 'utf-8');
        const cssFile = await readFileAsync('public/css/style.css', 'utf-8');
        htmlTemplate = handlebars.compile(templateFile);
        cssSheet = cssFile;
    } catch (error) {
        console.error("Error leyendo la plantilla:", error);
        return res.status(500).send("Error al leer la plantilla de correo.");
    }

    // Datos del ticket para enviar al template
    const datosTicket = {
        asunto: asunto,
        nombre: nombre,
        telefono: telefono,
        email: email,
        descripcion: descripcion,
        observaciones: observaciones,
        estado: estado,
        tktDoc: tktDoc
    }
    let htmlToSend = htmlTemplate(datosTicket)
    htmlToSend = juice.inlineContent(htmlToSend, cssSheet);
    
    // Configurar correo electronico utilizando el template htmlToSend
    const mailOptions = {
        from: 'no-reply@systick.com',  // gmail no acepta otro SENDER...
        to: email,
        bcc: 'guido.dimascio@gmail.com',
        subject: 'Modificación de Ticket N°' + ticket,

        html: htmlToSend
    };

    await new Promise((resolve, reject) => {
        // Enviar correo
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                // redirecciona a lista de tickets
                res.redirect("/admin")
                // console.log(info);
                resolve(info);
            }
        });
    });
}