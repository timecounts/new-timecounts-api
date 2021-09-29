const MyError = require('../../error/MyError')

const authVerify = (req, res, next) => {
    
    if (req.user) {
        next()
    } else {
        throw new MyError(401, 'Please, Login before.')
    }
}

module.exports = authVerify