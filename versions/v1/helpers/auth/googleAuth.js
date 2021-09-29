const User = require('../../api/user/user.model')
const GoogleStrategy = require('passport-google-oauth20').Strategy

module.exports = (passport, PORT, next) => {

    try {
        //  * Creating a new Strategy to sign in
        passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,

        // TODO: Link should be changed during Production Time
        callbackURL: `http://localhost:${PORT}/api/v1/auth/google/callback`
    },

        // * Handling tokens and user data
        async function (accessToken, refreshToken, profile, done) {
            const newUser = {
                googleId: profile.id,
                firstName: profile.givenName,
                lastName: profile.familyName,
                email: profile.emails[0].value
            }
            let user = await User.findOne({ googleId: profile.id })

            if (user) {
                done(null, user)
            } else {
                user = await User.create(newUser)
                done(null, user)
            }
        }
    ))

    // * Below 2functions are just to maintain the user instances to and from session
    passport.serializeUser((user, done) => done(null, user.id))

    passport.deserializeUser(function (id, done) {
        User.findById(id, (err, user) => done(err, user))
    })
    } catch (error) {
        next(error)
    }
}