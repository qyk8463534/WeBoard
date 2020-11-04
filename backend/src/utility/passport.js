/*
 * passport strategy config file
 * author: ziwei wei
 */
const passport = require("passport")
const validator = require("validator")
const passportJWT = require("passport-jwt")
const jwtSetting = require("../config")

module.exports =  () => {
  passport.use(
    "jwt",
    new passportJWT.Strategy(
      {
        jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtSetting.jwtSecret
      },
      (payload, done) => {
        if (payload.id === undefined || !validator.isMongoId(payload.id)) {
          done(null, false);
        } else {
          if (Date.now() > payload.exp * 1000) {
            done(null, false);
          } else {
            done(null, payload);
          }
        }
      }
    )
  );
};
