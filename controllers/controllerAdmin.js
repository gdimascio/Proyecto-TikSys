
const async = require("hbs/lib/async");
const db = require ("../firebase/firebase");
const { merge } = require("../router/routerAdmin");
const { FieldValue, Timestamp } = require("firebase-admin/firestore");

const ticketsCollection = db.collection("tickets");

// VENTANA PRINCIPAL DE TICKETS PARA ADMIN
exports.admin = async(req,res) => {
    const ticketSnapshot = await ticketsCollection.orderBy("ticket", "desc").get();
    const tickets = ticketSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
    res.render("tickets", {tickets})
}

// VENTANA DE TICKET ESPECIFICO PARA ADMIN
exports.showTkt = async(req,res) => {
    // recupera el ID del tkt del URL
    const tktDoc = await ticketsCollection.doc(req.params.id).get();
    if (!tktDoc.exists) {
        return res.status(404).send("Ticket not found");
    }
    const ticket = {
        id: tktDoc.id,
        ...tktDoc.data()
    }
    res.render("ticketAdmin", {ticket})
}

// CAMBIO DE ESTADO DE TICKETS PARA ADMIN
exports.estadoTkt = async(req,res) => {
    // RECUPERA EL NUMERO DE TKT DEL QUERY
    const tktDoc = req.body.id;           // DOC del ticket a modificar
    const tktObs = req.body.observaciones;  // OBSERVACION a agregar
    const tktEstado = req.body.estado;      // ESTADO a cambiar

    // referencia a ticketsCollection
    const ticketRef = ticketsCollection.doc(tktDoc); 
    const ticketSnapshot = await ticketRef.get();

    // Obtener la hora actual y escribirla en formato YYYY-MM-dd hh:mm
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}`;
    
    // actualiza el Estado y Observaciones en el ticket
    if(ticketSnapshot.exists){
        await ticketRef.update({
            estado: tktEstado, 
            observaciones: FieldValue.arrayUnion(`${tktEstado.toUpperCase()}: (${formattedTime}) ${tktObs}`)
        })
    } else {
        console.log("El ticket no existe");
    }

    // redirecciona para enviar un mail al usuario
    res.redirect(`/admin/enviar/${tktDoc}`)
}