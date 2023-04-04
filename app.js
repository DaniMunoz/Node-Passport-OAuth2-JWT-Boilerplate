require("dotenv").config()

const passport = require("passport");
require("./passportConfig")(passport);

const jwt = require("jsonwebtoken")

const express = require("express");
const app = express();
const PORT = 3000;
//const db = require("./db");
//db.connect();

app.use(express.json())

// Redirect the user to the Google signin page
app.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] })
);
// Retrieve user data using the access token received
app.get("/auth/google/callback", passport.authenticate("google", { session: false }),
    (req, res) => {
        console.log("User: " + req.user);
        /*
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
        */
        //const username = req.body.username
        //const user = { name: username }
        const user = { name: req.user.name };
        const accessToken = generateAccessToken(user)
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
        refreshTokens.push(refreshToken)
        res.json({accessToken: accessToken, refreshToken: refreshToken})
    }
);

/*JWT*/
let refreshTokens = []

app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        const accessToken = generateAccessToken({name: user.name})
        res.json({accessToken: accessToken})
    })
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

/*
app.post('/login', (req, res) => {
    //Authenticate user (ver passport video: https://www.youtube.com/watch?v=Ud5xKCYQTjM )
    const username = req.body.username
    const user = { name: username }
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({accessToken: accessToken, refreshToken: refreshToken})
})
*/
function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'})
}



// Protected route
/*
// profile route after successful sign in
app.get("/profile", passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
        //req.user
        res.send("Welcome");
    }
);
*/
app.get('/profile', authenticateToken, (req, res) => {    
    //res.json(posts.filter(post => post.username === req.user.name))
    res.send("Welcome");
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] //Obtiene el TOKEN de la cabecera de autenticación, que tiene la forma: Bearer TOKEN
    if(token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});