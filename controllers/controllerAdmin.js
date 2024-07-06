
const async = require("hbs/lib/async");
const db = require ("../firebase/firebase");
const { merge } = require("../router/routerAdmin");

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
exports.resolveTkt = async(req,res) => {
    // RECUPERA EL NUMERO DE TKT DEL QUERY
    const tktDoc = req.body.id;           // DOC del ticket a modificar
    const tktObs = req.body.observaciones;  // OBSERVACION a agregar
    const tktEstado = req.body.estado;      // ESTADO a cambiar

    // referencia a ticketsCollection
    const ticketRef = ticketsCollection.doc(tktDoc); 
        const ticketSnapshot = await ticketRef.get();

    // actualiza el Estado y Observaciones en el ticket
    if(ticketSnapshot.exists){
        await ticketRef.set({estado: tktEstado, observaciones: tktObs}, {merge: true})
    } else {
        console.log("El ticket no existe");
    }

    // redirecciona a lista de tickets
    const ticketsSnapshot = await ticketsCollection.orderBy("ticket", "desc").get();
    const tickets = ticketsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
    res.redirect("/admin")
}