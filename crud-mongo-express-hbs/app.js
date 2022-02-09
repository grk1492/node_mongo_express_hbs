// Crée par Joachim Zadi le 14/04/2020 à 14:47
// ===========================================

/*IMPORTS DES MODULES DU PROJETS*/
const express = require("express");
const methodOverride = require('method-override')
const hbs = require('hbs');
const path = require("path");
const session = require('express-session');
const flash = require("connect-flash");
const passport = require("passport");

/*CREATION DE L'INSTANCE DU SERVEUR*/
const app = express();

app.use(passport.initialize());
app.use(passport.session());

/*MIDDLEWARE DE OVERRIDE VERBES HTTP*/
app.use(methodOverride('_method'));

/*MIDDLEWARE DE EXPRESS-SESSION*/
app.use(session({
        secret: 'Stage Dam 2020',
        resave: true,
        saveUninitialized: true
    })
);

/*MIDDLEWARE CONNECT-FLASH*/
app.use(flash());

/*DECLARATION DES VARIABLES GLOBALES DU PROJET*/
app.use((req, res, next) => {
    res.locals.success_mgs = req.flash("success_mgs");
    res.locals.error_mgs = req.flash("error_mgs");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

/*MIDDLEWARE */
app.use(express.urlencoded({extended: false}))
app.use(express.json());

/*CONFIG DE LA CONNEXION A MONGO*/
require("./config/database");

/*CONFIGURATION DU MOTEUR DE VUE*/
app.set('view engine', 'hbs');

/*DECLARATION DU FOURNISSEURS DE FICHIERS STATICS*/
app.use(express.static(path.join(__dirname, "public")))

/*DECLARATION DES FICHIERS PARTIELS*/
hbs.registerPartials(__dirname + '/views/partials', function (err) {
    return {_navbar: "_navbar", _msg: "_msg"}
});

/*ROUTE POUR LA RACINE DU PROJET*/
app.get("/", function (req, res) {
    let titre = "Index";
    res.render("index", {
        titre: titre
    });
});

const msgRouter = require("./routes/msgRoute");
const usersRouter = require("./routes/userRoute");

require("./config/passport")(passport);
const auth = require("./config/auth")

app.use("/msg", auth.protection, msgRouter);
app.use("/users", usersRouter);

/*DEMARRAGE DU SERVEUR SUR LE PORT 8000*/
app.listen(8000, () => {
    console.log("Emission et Reception sur le port 8000");
});

