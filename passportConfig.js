const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./userModel");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback : true
        },
        async (request, accessToken, refreshToken, profile, done) => {
            try {
                /*
                let existingUser = await User.findOne({ 'google.id': profile.id });
                <em>// if user exists return the user</em> 
                if (existingUser) {
                    return done(null, existingUser);
                }
                <em>// if user does not exist create a new user</em> 
                console.log('Creating new user...');
                const newUser = new User({
                    method: 'google',
                    google: {
                        id: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value
                    }
                });
                await newUser.save();
                */
                const newUser = new User({
                    method: 'google',
                    google: {
                        id: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        image: profile.photos[0].value,
                    }
                });
                console.log("newUser: " + newUser);
                return done(null, newUser);
            } catch (error) {
                return done(error, false)
            }
        }
    ));
    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromHeader("authorization"),
                //secretOrKey: process.env.SECRET_KEY,
                secretOrKey: process.env.ACCESS_TOKEN_SECRET
            },
            async (jwtPayload, done) => {
                try {
                    // Extract user
                    const user = jwtPayload.user;
                    done(null, user); 
                } catch (error) {
                    done(error, false);
                }
            }
        )
    );
}