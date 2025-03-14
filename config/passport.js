const config = require('./config/db')
const User = require('./models/User')

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = function(passport){
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.secret
    }

    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            console.log("Decoded JWT Payload:", jwt_payload);

            const user = await User.findById(jwt_payload._id);

            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (err) {
            console.error("Ошибка при поиске пользователя:", err);
            return done(err, false);
        }
    }))


}