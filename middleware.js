

module.exports.LoggedIn=(req,res,next)=>{
    if(!req.user){
        req.flash("error", "You Must Have Login!!")
       return res.redirect("/menu/login")
    }
next();
}