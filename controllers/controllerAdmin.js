
const async = require("hbs/lib/async");
const db = require ("../firebase/firebase");

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