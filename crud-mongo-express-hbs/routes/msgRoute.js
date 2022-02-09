// Crée par Joachim Zadi le 17/04/2020 à 09:45
// ===========================================

const express = require("express");
const router = express.Router();

/*CHARGEMENT DU MODE DE MESSAGE*/
const Message = require("../models/MessageModel");

/*ROUTE LISTE DES MESSAGES*/
router.get("/", (req, res) => {
    Message.find({})
        .then(resultat => {
            res.render("msg/liste", {
                titre: "Page Liste",
                messages: resultat
            });
        })
        .catch(err => {
                console.log(err);
                throw err;
            }
        );
});

/*ROUTE AFFICHE FORM MESSAGE*/
router.get("/add", (req, res) => {
    res.render("msg/add", {
        titre: "Add"
    });
});

/*MIDDLEWARE DE VERIFICATION*/
const checkBody = (req, res, next) => {

    req.errors = [];

    if (!req.body.title || req.body.title.trim() === '') {
        req.errors.push({text: "Le titre du message est requis"});
    }

    if (!req.body.content || req.body.content.trim() === '') {
        req.errors.push({text: "Le contenu du message est requis"});
    }
    next();
}

/*ROUTE POST FORM MESSAGE*/
router.post("/add", checkBody, (req, res) => {

    let errors = req.errors;

    if (errors.length > 0) {
        res.render("msg/add", {
            errors: errors
        });
    } else {
        let message = new Message({
            title: req.body.title,
            content: req.body.content
        });

        message.save()
            .then(message => {
                res.redirect("/msg")
            })
            .catch(err => {
                    console.log(err);
                }
            );
    }
});

/*ROUTE AFFICHE FORM MESSAGE UPDATE*/
router.get("/:id", (req, res) => {
    Message.findById({_id: req.params.id})
        .then(message => {
            res.render("msg/update", {
                titre: "Page Update",
                message: message
            });
        })
        .catch(err => {
                console.log(err);
            }
        )
});

/*ROUTE PUT FORM MESSAGE*/
router.put("/:id", checkBody, function (req, res) {

    let errors = req.errors;

    if (errors.length > 0) {
        let message = new Message({
            title: req.body.title,
            content: req.body.content
        });
        res.render("msg/update", {
            errors: errors,
            message: message
        });
    } else {
        Message.findOne({_id: req.params.id})
            .then(message => {
                message.content = req.body.content;
                message.title = req.body.title;
                message.save()
                    .then(message => {
                        res.redirect("/msg")
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
});

/*ROUTE DELETE MESSAGE*/
router.delete("/:id", (req, res) => {
    Message.deleteOne({_id: req.params.id})
        .then(() => {
            res.redirect("/msg");
        });
});

/*EXPORT DU ROUTER SOUS FORME DE MODULE*/
module.exports = router;