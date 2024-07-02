require("dotenv").config;
const db = require("../firebase/firebase");
const nodemailer = require("nodemailer");



exports.sendMail = async(req,res) => {

    const ticketsCollection = db.collection("tickets").doc(cant_tkts);

    const tkt = req.query.cant_tkts;
    console.log(tkt);

    /*

    // Configurar transportador SMTP
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            // user: process.env.USERNAME,
            // pass: process.env.PASSWORD

            user: process.env.USERNAME_LOCAL,
            pass: process.env.PASSWORD_LOCAL
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

    // Configurar correo electronico
    const mailOptions = {
        from: 'no-reply@systick.com',  // gmail no acepta otro SENDER..
        to: email,
        bcc: 'guido.dimascio@gmail.com',
        subject: 'Nuevo Ticket Cargado N°' + asunto,
        text: `
        Asunto: ${asunto}
        Usuario: ${nombre}
        Telefono: ${telefono}
        Email: ${email}
        Descripcion: 
        ${descripcion}
        `
        // TODO: agregar un link que direccione al TKT
    };

    await new Promise((resolve, reject) => {
        // Enviar correo
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                res.send(`<script>alert("Email Sent Successfully.")</script>`);
                res.redirect("/");
                // console.log(info);
                resolve(info);
            }
        });
    });


    */
    res.redirect("/");

}
