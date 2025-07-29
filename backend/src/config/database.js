const mongoose = require('mongoose')

const connectDB = async ()=>{
    await mongoose.connect(
      "mongodb+srv://prachuryaray:8ZfinlWmEWHakZDo@namastenode.xntkxn9.mongodb.net/devTinder"
    );
}

module.exports = connectDB;