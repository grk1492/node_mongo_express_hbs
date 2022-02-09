// Crée par Joachim Zadi le 17/04/2020 à 14:17
// ===========================================

const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");

module.exports = (passport) => {
    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'mdp'
        },
        function (email, mdp, done) {
            //Recherche du User
            User.findOne({
                email: email
            }).then(user => {
                //Ici le User existe bien en BDD
                if (!user) {
                    return done(null, false, {message: 'Vous etes inconnu(e) du Systeme !!!'});
                }

                //Si on arrive ici, c'est que le User existe en BDD
                validPassword(user, mdp, done);

            }).catch(err => {
                return done(null, false, {message: 'Le mot de passe est incorrecte.'});
            })

        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}

/*FONCTION PERMETTANT DE VERIFIER LE MOT PASSE CRYPTE*/
const validPassword = async (user, mdp, done) => {
    await bcrypt.compare(mdp, user.mdp)
        .then((estCorrect) => {
                if (!estCorrect) {
                    //Ici le mot de passe ne correspond pas
                    return done(null, false, {message: 'Le mot de passe est incorrecte.'});
                } else {
                    //Ici le mot de passe correspond
                    console.log(user);
                    return done(null, user);
                }
            }
        );
}