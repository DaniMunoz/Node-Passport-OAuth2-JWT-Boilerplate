//const GoogleStrategy = require("passport-google-oauth20").Strategy;
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
//const User = require("../userModel");
import User from '../userModel.js';
//const JwtStrategy = require("passport-jwt").Strategy;
import { Strategy as JwtStrategy } from 'passport-jwt';
//const { ExtractJwt } = require("passport-jwt");
import { ExtractJwt } from 'passport-jwt';

export default (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID1,
        clientSecret: process.env.CLIENT_SECRET1,
        //callbackURL: "http://localhost:3000/api/auth/google/callback",
        callbackURL: "https://node-passport-o-auth2-jwt-boilerplate.vercel.app/api/auth/google/callback",
        passReqToCallback : true
        },
        async (request, accessToken, refreshToken, profile, done) => {
            try {
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