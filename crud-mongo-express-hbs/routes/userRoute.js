// Crée par Joachim Zadi le 17/04/2020 à 09:45
// ===========================================
const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require("passport");

/*CHARGEMENT DU MODEL DU USER*/
const User = require("../models/UserModel");

/*ROUTE AFFICHER USER-RESISTER*/
router.get("/register", (req, res) => {
    res.render("users/register");
});

/*ROUTE POST USER-RESISTER*/
router.post("/register", (req, res) => {

    let errors = [];

    if (!req.body.fullName || req.body.fullName.trim() === '') {
        errors.push({text: "Le nom complet est requis"});
    }

    if (!req.body.email || req.body.email.trim() === '') {
        errors.push({text: "L'identifiant est requis"});
    }

    if (!req.body.mdp || req.body.mdp.trim() === '') {
        errors.push({text: "Le mot de passe est requis"});
    }

    if (!req.body.mdp2 || req.body.mdp2.trim() === '') {
        errors.push({text: "La confirmation du mot de passe est requise"});
    }

    if (req.body.mdp !== req.body.mdp2) {
        errors.push({text: "Les mots ne correspondent pas"});
    }

    if (errors.length > 0) {
        res.render("users/register", {
            errors: errors,
            fullName: req.body.fullName,
            email: req.body.email,
            mdp: req.body.mdp,
            mdp2: req.body.mdp2
        });
    } else {
        User.findOne({
            email: req.body.email
        }).then(user => {
                if (user) {
                    req.flash("error_mgs", "Cette adresse email est deja utilise en BDD");
                    res.redirect("/users/register");
                } else {
                    let newUser = new User({
                        fullName: req.body.fullName,
                        email: req.body.email,
                        mdp: req.body.mdp
                    });

                    //Ici on crypte le mdp su user avant la persistence en bdd
                    bcrypt.genSalt(10, function (err, salt) {
                            bcrypt.hash(newUser.mdp, salt)
                                .then(hash => {
                                    newUser.mdp = hash;

                                    newUser.save()
                                        .then(user => {
                                            req.flash("success_mgs", `Le compte ${req.body.email} a été crée avec succès`);
                                            res.redirect("/users/login");
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        });
                                })
                                .catch(err => {
                                        console.log(err);
                                    }
                                );
                        }
                    );
                }
            }
        );
    }
});

/*ROUTE AFFICHER USER-LOGIN*/
router.get("/login", (req, res) => {
    res.render("users/login");
});

/*ROUTE POST USER-LOGIN*/
router.post("/login", (req, res, next) => {
    passport.authenticate(
        'local',
        {
            successRedirect: '/msg',
            failureRedirect: '/users/login',
            failureFlash: true
        }
    )(req, res, next)
});

/*ROUTE USER-LOGOUT*/
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "Vous avez été deconnecté avec succès");
    res.redirect("/users/login");
});

module.exports = router;