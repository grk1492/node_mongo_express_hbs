// Crée par Joachim Zadi le 14/04/2020 à 16:35
// ===========================================

const mongoose = require("mongoose");

/**
 * Classe permettant d'etablir la connexion au serveur Mongo DB
 */
class MongoConnexion {

    constructor() {
        this.connexion()
            .then(() => {
                console.log("CONNEXION OK 👍");
            })
            .catch((err) => {
                console.log("CONNEXION NOK 👎")
                console.log(err);
            });
    }

    connexion = async () => {
        await mongoose.connect('mongodb://localhost:27017/StageDb', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
    }
}

module.exports = new MongoConnexion();