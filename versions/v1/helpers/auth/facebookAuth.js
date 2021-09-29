const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../../api/user/user.model')
const MyError = require('../../error/MyError')

module.exports = (passport, PORT, next) => {
    try {
        passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: `http://localhost:${PORT}/api/v1/auth/facebook/callback`,
            profileFields: ['id', 'name', 'email']
        },
            async function (accessToken, refreshToken, profile, done) {
                
                // * User data to be saved
                const newUser = {
                    facebookId: profile.id,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    email: profile.emails[0].value
                }
    
                try {
                    const user = await User.findOne({ facebookId: profile.id })
    
                    if (user) {
                        done(null, user)
                    } else {
                        user = await User.create(newUser)
                        done(null, user)
                    }
                } catch (error) {
                    next(error)
                }
            }
        ))
    
        // * Session data handling by Passport
        passport.serializeUser((user, done) => done(null, user.id))
    
        passport.deserializeUser((id, done) => {
            User.findById(id, (error, user) => {
                if (error) throw new MyError(404, 'User does not exist.')
                console.log('User ', user)
                done(null, user)
            })
        })
    } catch (error) {
        next(error)
    }
}