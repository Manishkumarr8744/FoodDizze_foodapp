if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}
 //npm package to use env file with server or access .env data with code 
console.log(process.env.SECRET);

const express= require("express");
const app=express();
// const sessions =require("")
const MongoStore = require('connect-mongo');

const path=require("path")
const ejsMate= require("ejs-mate");
const session = require("express-session");
const mongoose = require('mongoose');
const Food=require("./models/food")
const User=require("./models/user")
const passport=require("passport");
const LocalStrategy=require("passport-local");
const ExpressError=require("./utils/ExpressError")
const flash =require("connect-flash");
const {LoggedIn}=require("./middleware");

app.engine("ejs",ejsMate);
app.set("views","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))

const dburl=process.env.ATLASDB_URL;

main().then((res)=>{
    console.log("database connected succesfully");
    
}).catch(err => console.log(err));


async function main() {
    await mongoose.connect(dburl);
  
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  }


// const fooditems=[
//     {
//         id:1,
//         name:"pizza",
//         image:"https://plus.unsplash.com/premium_photo-1661762555601-47d088a26b50?q=80&w=2092&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         price:149,
//         quantity:1
//     },
//     {
//         id:2,
//         name:"burger",
//         price:49,
//         image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww",
//         quantity:1
//     },
//     {
//         id:3,
//         name:"cold coffee",
//         price:79,
//         image:"https://plus.unsplash.com/premium_photo-1663933534262-5de49eb4f59f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29sZCUyMGNvZmZlZXxlbnwwfHwwfHx8MA%3D%3D",
//         quantity:1
//     }, {
//         id:4,
//         name:"pizza",
//         image:"https://plus.unsplash.com/premium_photo-1661762555601-47d088a26b50?q=80&w=2092&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         price:149,
//         quantity:1
//     },
//     {
//         id:5,
//         name:"burger",
//         price:49,
//         image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww",
//         quantity:1
//     },
//     {
//         id:6,
//         name:"cold coffee",
//         price:79,
//         image:"https://plus.unsplash.com/premium_photo-1663933534262-5de49eb4f59f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29sZCUyMGNvZmZlZXxlbnwwfHwwfHx8MA%3D%3D",
//         quantity:1
//     }, {
//         id:7,
//         name:"pizza",
//         image:"https://plus.unsplash.com/premium_photo-1661762555601-47d088a26b50?q=80&w=2092&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         price:149,
//         quantity:1
//     },
//     {
//         id:8,
//         name:"burger",
//         price:49,
//         image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww",
//         quantity:1
//     },
//     {
//         id:9,
//         name:"cold coffee",
//         price:79,
//         image:"https://plus.unsplash.com/premium_photo-1663933534262-5de49eb4f59f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29sZCUyMGNvZmZlZXxlbnwwfHwwfHx8MA%3D%3D",
//         quantity:1
//     }
// ]

const store= MongoStore.create({
    mongoUrl:dburl,
    crypto: {
        secret: 'mysecretkey'
      },
      touchAfter: 24 * 3600 
})

store.on("error",()=>{
    console.log("error in mongodb",err);
    
})

const sessionsOptions={
    store,
    secret:"mysecretkey",
    resave:false,
    saveUninitialized:true,
    cookie :{
        expires: Date.now()+7*24*60*60*1000, //to expire login after 7 days
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}



app.use(session(sessionsOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session()); //request know their session 

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //store user credentails and use for login and logout
passport.deserializeUser(User.deserializeUser());//unstores user credentails and use for login and logout





app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next()
})
//root 
app.get("/",(req,res)=>{
    res.render("menu/home.ejs")
})


//index route
app.get("/menu",async(req,res)=>{
    let fooditems=await Food.find({});
    res.render("menu/index.ejs",{fooditems})
})

//place order empty cart
app.post("/menu/placeorder",(req,res)=>{
    req.session.cart=[];
    res.render("menu/orderplace.ejs")
})



//add items to card
app.post("/menu/checkout/:id",async(req,res)=>{
    let {id}=req.params
//    console.log(id);
   
   try{
    const food =await Food.findById(id);
    if(!food){
        console.log("food doesnt exist");
        return redirect("/menu")
    }

    if(!req.session.cart){
        req.session.cart=[];
    }
    const cartItem= req.session.cart.find(item=> item.id===id);
    if(cartItem){
        cartItem.quantity+=1;
    }else{
        req.session.cart.push({
            id:food._id.toString(),
            name:food.name,
            price:food.price,
            quantity:1
        })
    }
    //    const Cart= req.session.cart;
    
        res.redirect("/menu")

    
   }catch(err){
    console.log(err);
    res.redirect("/menu")

   }
    
})


//reomve items from cart
app.post("/menu/checkout/remove/:id",(req,res)=>{
    let {id}=req.params;
    console.log(id);
    
   let  cart=req.session.cart;
    if(req.session.cart){
        req.session.cart = cart.filter(item => item.id !== id);
    }
    res.redirect("/menu/checkout")
})

//checkout route and dispay added items 
app.get("/menu/checkout",LoggedIn, (req,res)=>{
    
    
    const cart =req.session.cart ||[];
    // console.log(cart);
    
    res.render("menu/checkout.ejs",{cart})
})
//sign-up form
app.get("/menu/signup",(req,res)=>{
    res.render("users/signup.ejs")
})
//sign up data saved in database
app.post("/menu/signup",async(req,res)=>{
    try{
    let {username ,email,password}=req.body;
    // console.log(username,email,password);
    
    let newUser= new User({username,email,})
    await User.register(newUser,password) //add passowrd in hash form with newUser
    
    console.log("suucesfully saved");
    req.flash("success","Registered succesfully")
    res.redirect("/menu")

    }catch(e){
        req.flash('error', e.message);
        console.log(e);
        
    }
    
})


//login page
app.get("/menu/login",(req,res)=>{
    res.render("users/login.ejs")
})

//login sucessfully with flash msg
app.post("/menu/login",passport.authenticate('local',{failureRedirect:'/menu/login'}),(req,res)=>{
    

    req.flash("success", "Successfully Logged in ")
    res.redirect("/menu")


})

//logout route
app.get("/menu/logout",(req,res,next)=>{
    // const cart = req.session.cart ||[];
    req.logout((err)=>{
        if(err){
              console.log("error in logout" , err);
                return res.redirect("/menu");
        }
        
        req.flash("success","You Logged out")
        res.redirect("/menu");
    })
})

app.get("/menu/about",(req,res)=>{
    res.render("menu/about.ejs")
})

app.use("*", (req,res,next)=>{
    next(new ExpressError(404,"Page not found"))
 })



app.use((err,req,res,next)=>{
    let {statusCode=500 , message="Something went wrong!!"}=err;
    // res.status(statusCode).send(message);
    res.render("error.ejs",{statusCode,message})

})

app.listen(3030,()=>{
    console.log("listening to the port....");

})
