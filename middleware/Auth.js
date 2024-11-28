import express from "express";

function Auth(req, res, next) {
  if (req.session.user != undefined) {
    req.user = req.session.user;
    next();
  } else {
    req.flash(
      "error",
      "Você precisa estar logado para acessar essa página. Faça o login!"
    );
    res.redirect("/login");
  }
}

export default Auth;
