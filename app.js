require("dotenv").config()

const passport = require("passport");
require("./passportConfig")(passport);

const jwt = require("jsonwebtoken")

const express = require("express");
const app = express();
const PORT = 3000;
//const db = require("./db");
//db.connect();

// Redirect the user to the Google signin page
app.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] })
);
// Retrieve user data using the access token received
app.get("/auth/google/callback", passport.authenticate("google", { session: false }),
    (req, res) => {
        console.log("User: " + req.user);
        jwt.sign(
            { user: req.user },
            process.env.SECRET_KEY,
            { expiresIn: "1h" },
            (err, token) => {
                if (err) {
                    return res.json({
                        token: null,
                    });
                }
                console.log(token);
                res.json({
                    token,
                });
                //res.cookie('token', token)        
                //res.redirect('http://localhost:3000/profile?token=' + token)
            }
        );
    }
);
// profile route after successful sign in
app.get("/profile", passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
        //req.user
        res.send("Welcome");
    }
);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});