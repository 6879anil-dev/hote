const Room = require("../models/roomModel");
const User = require("../models/userModel");
const Book = require("../models/bookModel");

const FindRoom = async (req,res,next) => {

    const hicGunuCakismayanOdalariBul = async (baslangicTarihi, bitisTarihi) => {
        try {
          const odalar = await Room.find({
            tarihler: {
              $not: {
                $elemMatch: {
                  baslangic: { $lt: bitisTarihi },
                  bitis: { $gt: baslangicTarihi }
                }
              }
            }
          });
      
          console.log('Hiçbir günü çakışmayan Odalar:');
          res.render("rooms", {
            rooms: odalar,
            user: req.user
          })
        } catch (err) {
          console.error('Oda bulma hatası:', err);
        }
      };
    
    const başlangıçTarihi = new Date(req.body.start);
    const bitişTarihi = new Date(req.body.end);

    const diffInMs = Math.abs(bitişTarihi - başlangıçTarihi);
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    try {
        const user = await User.findByIdAndUpdate(req.user.id, { 
            gun: diffInDays,
            baslangic: başlangıçTarihi,
            bitis: bitişTarihi
        })
    } catch (error) {
        console.log(error);
    }


    hicGunuCakismayanOdalariBul(başlangıçTarihi, bitişTarihi);

}

const ShowRoom = async (req,res,next) => {
    const odaId = req.params.id;

    try {

        const oda = await Room.findById(odaId);

        res.render("room", {
            room: oda,
            user: req.user
        })

    } catch (error) {
        console.log(error)
    }


}

const Payment = (req,res,next) => {
    res.render("payment", {
        id: req.params.id
    });
}

const BookRoom = (req,res,next) => {

    const yeniBaslangicTarihi = req.user.baslangic;
    const yeniBitisTarihi = req.user.bitis;

    // Odaya tarihleri ekleme
    const odayaTarihEkle = async (odaNumarasi, baslangicTarihi, bitisTarihi) => {
    try {

            const oda = await Room.findOne({ _id: odaNumarasi });

            if (oda) {
                oda.tarihler.push({
                    baslangic: baslangicTarihi,
                    bitis: bitisTarihi
            });

            await oda.save();

            console.log('Tarihler başarıyla eklendi.');

            const newBook = new Book({
                odano: oda.odano,
                tc: req.user.tc,
                fiyat: req.user.gun * oda.fiyat,
                baslangic: baslangicTarihi,
                bitis: bitisTarihi
            })

            await newBook.save()
                .then(() => console.log(' başarıyla kaydedildi.'))
                .catch(err => console.error(' kaydetme hatası:', err));

            res.redirect("/");
        } else {
            console.log('Oda bulunamadı.');
        }
    } catch (err) {
        console.error('Tarih ekleme hatası:', err);
    }
    };

    const odaNumarasi = req.params.id;

    odayaTarihEkle(odaNumarasi, yeniBaslangicTarihi, yeniBitisTarihi);
}

const Profile = async (req,res,next) => {

    const myBoooks = await Book.find({
        tc: req.user.tc
    })

    res.render("profile", {
        user: req.user,
        books: myBoooks
    });
}

const ShowProfileEdit = (req,res,next) => {
    res.render("profileedit", {
        user: req.user
    });
}

const ProfileEdit = (req,res,next) => {

    // Kullanıcı bilgilerini güncelleme
const updateUser = async (userId, updatedData) => {
    try {
      const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
  
      if (!user) {
        console.log('Kullanıcı bulunamadı');
        return;
      }
  
      console.log('Güncellenen Kullanıcı Bilgileri:');
      res.redirect("/rooms/profile/user")
    } catch (err) {
      console.error('Kullanıcı güncelleme hatası:', err);
    }
  };
  

  const userId = req.user.id; 
  const updatedData = {
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    tc: req.body.tc,
    phone: req.body.phone,
  };
  
  updateUser(userId, updatedData);
}

module.exports = {
    FindRoom,
    ShowRoom,
    BookRoom,
    Payment,
    Profile,
    ShowProfileEdit,
    ProfileEdit
}