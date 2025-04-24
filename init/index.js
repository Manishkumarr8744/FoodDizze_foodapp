const mongoose = require('mongoose');
const initdata= require("./data");
const Food= require("../models/food");



main().then((res)=>{
    console.log("database connected succesfully");
    
}).catch(err => console.log(err));


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fooddizze');
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
   const initDb=async()=>{
    await Food.deleteMany({});
     await Food.insertMany(initdata.data);
     console.log("data was initailzed");
     
   

  }
  initDb();