function checkAuthenticated(req, res, next) {
  if (!req.user) {
    req.flash('error','You are not logged in.Please login');
    res.redirect("/user/login");
  }
  else {
        next();
  }
}
module.exports=checkAuthenticated;
