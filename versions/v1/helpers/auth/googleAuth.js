const User = require('../../api/user/user.model')
const GoogleStrategy = require('passport-google-oauth20').Strategy

module.exports = (passport) => {

    try {
        //  * Creating a new Strategy to sign in
        passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `/api/v1/auth/google/callback`
        },

            // * Handling tokens and user data
            async function (accessToken, refreshToken, profile, done) {
                const newUser = {
                    googleId: profile.id,
                    fullName: profile.displayName,
                    email: profile.emails[0].value
                }

                try {
                    let user = await User.findOne({ email: newUser.email })

                    if (user) {
                        done(null, user)
                    } else {
                        user = await User.create(newUser)
                        done(null, user)
                    }
                } catch (error) {
                    done(error)
                }
            }
        ))

        // * Below 2functions are just to maintain the user instances to and from session
        passport.serializeUser((user, done) => done(null, user.id))

        passport.deserializeUser(function (id, done) {
            User.findById(id, (error, user) => {
                if (error) throw new MyError(404, 'User does not exist.')
                done(null, user)
            })
        })
    } catch (error) {
        next(error)
    }
}
