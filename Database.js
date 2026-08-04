const mongoos=require('mongoose');
const url =
  "mongodb+srv://divyanshdamami2018_db_user:s0m86i5yl9TFyyog@cluster0.ybsdpcf.mongodb.net/Assign_1?retryWrites=true&w=majority";

const connectDB=async()=>{
    await mongoos.connect(url)
    console.log("Database Connnection Stablish")
};

module.exports=connectDB