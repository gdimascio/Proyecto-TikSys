require("dotenv").config;
const { onSnapshotsInSync } = require("firebase/firestore");
const db = require("../firebase/firebase");
const nodemailer = require("nodemailer");


exports.sendMail = async (req,res) => {
    // RECUPERA EL NUMERO DE TKT DEL QUERY
    const tktDoc = req.query.tktDoc;
    // LLAMA AL TKT CORRESPONDIENTE 
    const ticketsCollection = db.collection("tickets").doc(tktDoc);
    const doc = await ticketsCollection.get();
    // ASIGNA LOS DATOS DEL TICKET
    const {asunto, nombre, telefono, email, descripcion, estado, ticket} = doc.data();

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

    // Configurar correo electronico
    const mailOptions = {
        from: 'no-reply@systick.com',  // gmail no acepta otro SENDER...
        to: email,
        bcc: 'guido.dimascio@gmail.com',
        subject: 'Nuevo Ticket Cargado N°' + ticket,

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
                <th>Estado</th>
                <td id="estado" style="text-transform:uppercase;">${estado}</td>
            </tr>
        </table>
        <a href="https://systick.vercel.app/tkt/${tktDoc}">Ir al ticket</a><br/>
        `
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
