
// CONEXION A FIREBASE
const async = require("hbs/lib/async");
const db = require("../firebase/firebase");
const { FieldValue } = require("firebase-admin/firestore");
const { default: firebase } = require("firebase/compat/app");
const { doc } = require("firebase/firestore");

// CARGA DE COLECCIONES
const ticketsCollection = db.collection("tickets");
const cantidadTktsCollection = db.collection("cantidad tkts").doc("cant_ID");

// VENTANA PRINCIPAL DEL FORMULARIO
exports.formulario = async(req,res) => {
    res.render("home")
}

// CARGA TKT A FIREBASE
exports.submitTkt = async(req,res) => {
    // SUMA AL CONTADOR DE TKTS
    const increment = FieldValue.increment(1);
    await cantidadTktsCollection.update({ cant_tkts: increment });

    // OBTIENE EL VALOR DEL CONTADOR
    const counterDoc = await cantidadTktsCollection.get();
    const { cant_tkts } = counterDoc.data();

    // CARGA LOS DATOS DEL NUEVO TKT
    const {asunto, nombre, telefono, email, descripcion} = req.body;
    const newTkt = {asunto, nombre, telefono, email, descripcion, estado:["abierto"], ticket:`${cant_tkts}`};
    // AGREGA LOS DATOS DEL NUEVO TICKET Y REDIRECCIONA A MAIL MANDANDO EL ID
    const ticketSnapshot = await ticketsCollection.add(newTkt);
    res.redirect(`/enviar?tktDoc=${ticketSnapshot.id}`);
}

// VENTANA PRINCIPAL DE TICKETS PARA ADMIN
exports.admin = async(req,res) => {
    const ticketSnapshot = await ticketsCollection.orderBy("ticket", "asc").get();
    const tickets = ticketSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
    res.render("tickets", {tickets})
}

// VENTANA DE TICKET ESPECIFICO PARA ADMIN
exports.showTkt = async(req,res) => {
    const tktDoc = await ticketsCollection.doc(req.params.id).get();
    if (!tktDoc.exists) {
        return res.status(404).send("Ticket not found");
    }
    const ticket = {
        id: tktDoc.id,
        ...tktDoc.data()
    }
    res.render("ticket", {ticket})
}