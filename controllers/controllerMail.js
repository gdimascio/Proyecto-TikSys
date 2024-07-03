require("dotenv").config;
const { onSnapshotsInSync } = require("firebase/firestore");
const db = require("../firebase/firebase");
const nodemailer = require("nodemailer");



exports.sendMail = async (req,res) => {
    // RECUPERA EL NUMERO DE TKT DEL QUERY
    const tktDoc = req.query.tktDoc;
    // LLAMA AL TKT CORRESPONDIENTE USANDO cant_tkt
    const ticketsCollection = db.collection("tickets").doc(tktDoc);
    const doc = await ticketsCollection.get();
    // ASIGNA LOS DATOS DEL TICKET cant_tkt
    const {asunto, nombre, telefono, email, descripcion, estado, ticket} = doc.data();


    // Configura transportador SMTP
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
        from: 'no-reply@systick.com',  // gmail no acepta otro SENDER...
        to: email,
        bcc: 'guido.dimascio@gmail.com',
        subject: 'Nuevo Ticket Cargado N°' + ticket,
        text: `
        Asunto: ${asunto}
        Usuario: ${nombre}
        Telefono: ${telefono}
        Email: ${email}
        Descripcion: 
        ${descripcion}
        `
        // TODO: agregar un link que direccione al TKT
        // TODO: agregar estilos al envio de mail
    };

    await new Promise((resolve, reject) => {
        // Enviar correo
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                // Envia una respuesta por medio de ALERT, luego redirecciona
                res.send(`
                    <script>
                        alert("Email Sent Successfully.")
                        window.location.href = "/";
                    </script>
                    `);
                res.redirect("/");
                // console.log(info);
                resolve(info);
            }
        });
    });

}
