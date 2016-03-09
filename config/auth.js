// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '1001497043231909', // your App ID
        'clientSecret'  : '13637ecafd3141c65a548a02cb7ca9cf', // your App Secret
        'callbackURL'   : 'https://dibs.izzygomez.com/auth/facebook/callback' // 'http://localhost:3000/auth/facebook/callback' if testing locally; 'https://dibs-v1.herokuapp.com/auth/facebook/callback' if on heroku
    }

};
