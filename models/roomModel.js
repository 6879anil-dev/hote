const mongoose = require("mongoose");
const schema = mongoose.Schema;

const RoomSchema = new mongoose.Schema({

    odano: {
        type: String
    },
    odatur: {
        type: String
    },
    fiyat:{
        type: Number
    },
    aciklama: {
        type: String
    },
    tarihler: [{
        baslangic: {
            type: Date
        },
        bitis: {
            type: Date
        }
    }]

}, {collection: "rooms", timestamps: true});

const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;