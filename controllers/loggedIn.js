const loggedIn = (req, res, next) => {
    if (req.session.loggedIn) {
        if( req.session?.Cemail){
            req.session.email = req.session.Cemail;
            return res.redirect('/client-main');
        }
        else if( req.session?.Lemail ){
            req.session.email = req.session.Lemail;
            return res.redirect('/loan-provider-main');
        }
    }else{
        return res.redirect('/login-signup/index.html');
    }
}

module.exports = loggedIn;