// Crée par Joachim Zadi le 17/04/2020 à 15:41
// ===========================================

module.exports = {
    protection: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error_msg", "Vous n'avez pas les autoristations nécessaires pour acceder à cette resource");
        res.redirect("/users/login");
    },
    autreCle:"autreValeur"
}