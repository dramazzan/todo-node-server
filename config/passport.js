const User = require('../models/user');

const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

module.exports = function (passport) {
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    };

    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            console.log("Decoded JWT Payload:", jwt_payload);

            const userId = jwt_payload._id || jwt_payload.id;
            if (!userId) {
                console.warn("JWT payload does not contain user ID");
                return done(null, false);
            }

            const user = await User.findById(userId);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (err) {
            console.error("Ошибка при поиске пользователя:", err);
            return done(err, false);
        }
    }));
};
