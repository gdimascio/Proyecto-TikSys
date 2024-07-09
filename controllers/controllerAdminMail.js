require("dotenv").config;
const { onSnapshotsInSync } = require("firebase/firestore");
const db = require("../firebase/firebase");
const nodemailer = require("nodemailer");

exports.sendChanges = async (req,res) => {
    // recupera el ID del tkt del URL
    const tktDoc = req.params.tktDoc;
    // LLAMA AL TKT CORRESPONDIENTE 
    const ticketsCollection = db.collection("tickets").doc(tktDoc);
    const doc = await ticketsCollection.get();
    // ASIGNA LOS DATOS DEL TICKET
    const {asunto, nombre, telefono, email, descripcion, estado, ticket, observaciones} = doc.data();

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
            subject: 'Modificación de Ticket N°' + ticket,
    
            html: `           
            <table class="admin-table">
                <tr>
                    <th>Asunto</th>
                    <td>${asunto}</td>
                </tr>
                <tr>
                    <th>Nombre</th>
                    <td>${nombre}</td>
                </tr>
                <tr>
                    <th>Telefono</th>
                    <td>${telefono}</td>
                </tr>
                <tr>
                    <th>Mail</th>
                    <td>${email}</td>
                </tr>
                <tr>
                    <th>Descripcion</th>
                    <td>${descripcion}</td>
                </tr>
                <tr>
                    <th>Observaciones</th>
                <td>
                    ${observaciones.map(obs => `${obs}<br>`).join('')}
                </td>
                </tr>
                <tr>
                    <th>Estado</th>
                    <td id="estado" style="text-transform:uppercase;">${estado}</td>
                </tr>
            </table>
            <a href="https://systick.vercel.app/tkt/${tktDoc}">Ir al ticket</a><br/>
            `,    
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