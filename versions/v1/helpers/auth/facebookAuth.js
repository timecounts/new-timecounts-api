const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../../api/user/user.model')
const MyError = require('../../error/MyError')

module.exports = (passport, PORT, next) => {
    try {
        passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: `/api/v1/auth/facebook/callback`,
            profileFields: ['id', 'displayName', 'email']
        },
            async function (accessToken, refreshToken, profile, done) {
                // * User data to be saved
                const newUser = {
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
    
        // * Session data handling by Passport
        passport.serializeUser((user, done) => done(null, user.id))
    
        passport.deserializeUser((id, done) => {
            User.findById(id, (error, user) => {
                if (error) throw new MyError(404, 'User does not exist.')
                done(null, user)
            })
        })
    } catch (error) {
        next(error)
    }
}