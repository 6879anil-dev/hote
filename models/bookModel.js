const mongoose = require("mongoose");
const schema = mongoose.Schema;

const BookSchema = new mongoose.Schema({

    odano: {
        type: String
    },
    tc: {
        type: String
    },
    fiyat:{
        type: Number
    },
    baslangic:{
        type: Date
    },
    bitis: {
        type: Date
    }

}, {collection: "books", timestamps: true});

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;