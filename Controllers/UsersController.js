import express from "express";
const router = express.Router();
import User from "../models/User.js";
import bcrypt from "bcrypt"
// ROTA DE LOGIN
router.get("/login", (req,res) => {
    res.render("login");
});

// ROTA DE CADASTRO
router.get("/cadastro", (req,res) => {
    res.render("cadastro");
});

// ROTA DE CRIAÇÃO DE USUÁRIO
router.post("/createUser", (req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    // VERIFICAR SE O USUÁRIOI JÁ ESTÁ CADASTRADO
    User.findOne({where: {email: email}}).then((user) => {
        if(user == undefined){
            // AQUI É FEITO O CADASTRO E O HASH DE SENHA
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)
      User.create({
        email: email,
        password: hash,
    }).then(() => {
        res.redirect("/login");
    });
       // CASO O USUÁRIO JÁ ESTEJA CADASTRADO:
    } else {

        res.send('Usuário já cadastrado. <br> <a href ="/login">Faça login!</a>');
     }
    }); 
});

// ROTA DE AUTENTICAÇÃO
router.post("/authenticate", (req,res) => {
    const email = req.body.email
    const password = req.body.password
    // BUSCA O USUÁRIO NO BANCO
    User.findOne({
        where:{
            email : email
        }
    }).then((user => {
        // SE O USUÁRIO TIVER CADASTRADO:
        if(user != undefined){
            // VALIDA A SENHA (VERIFICA O HASH)
            const correct = bcrypt.compareSync(password, user.password)
            if(correct){
                // AUTORIZA O LOGIN
             req.session.user = {
                id: user.id,
                email: user.email
             }
             res.redirect("/");
            } else{
                res.send('Senha inválida! <br><a href="/login">Tente novamente!</a>')
            }
        }
        else{
            // SE O USUÁRIO NÃO EXISTE 
            res.send('Usuário não cadastrado. <br>                       <a href ="/login">Tente novamente!</a>');
        }
    })).catch((error) => {
        console.log(error);
    });
})


export default router;