const mongoose = require('mongoose');
const connectionString = require('./connectionString');

const connectDB = async ()=>{
    await mongoose.connect(
      connectionString
    );
}

module.exports = connectDB;