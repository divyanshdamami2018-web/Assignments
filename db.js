const mongoose = require('mongoose') ;
const url = 'mongodb+srv://tanvinirwan123_db_user:0WlmckhYjglZ66bH@cluster0.lrn1wb5.mongodb.net/technoNJR?retryWrites=true&w=majority&appName=Cluster0';
//bc we are doing database fetching , hence we are usign async and await

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected DB:", mongoose.connection.name);
  } catch (error) {
    console.error("Full DB Error:");
    console.error(error);
    console.error(error.message);
  }
};
 
module.exports = connectDB ;