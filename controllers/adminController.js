const {validationResult} = require("express-validator");
const Room = require("../models/roomModel");
const Book = require("../models/bookModel");
const passport = require("passport");
require("../config/passportLocal")(passport);

const ShowPage = async (req,res,next) => {

    const rooms = await Room.find({});
    const books = await Book.find({});

    res.render("admin", {
        rooms: rooms,
        books: books
    });
}

const AddRoom = (req,res,next) => {
    const odano = req.body.odano;
    const odatur = req.body.odatur;
    const fiyat = req.body.fiyat;
    const aciklama = req.body.aciklama;

    const newRoom = new Room({
        odano: odano,
        odatur: odatur,
        fiyat: fiyat,
        aciklama: aciklama,
    })

    newRoom.save()
        .then(() => console.log('Oda başarıyla kaydedildi.'))
        .catch(err => console.error('Oda kaydetme hatası:', err));
    
    res.redirect("/admin");
}

const DeleteRoom = async (req,res,next) => {
    await Room.findOneAndRemove({
        odano: req.params.odano
    })

    res.redirect("/admin");
}

module.exports = {
    AddRoom,
    ShowPage,
    DeleteRoom
}