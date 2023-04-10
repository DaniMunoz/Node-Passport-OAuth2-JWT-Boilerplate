import dotenv from 'dotenv'
dotenv.config()

import passport from 'passport'
import passportConfig from "../server/strategies/passportConfig.js";
passportConfig(passport);

import jwt from 'jsonwebtoken'

import express from 'express'
const app = express();
const PORT = 3000;

import { getUser, createUser, updateUser, updateUserDeleteRefreshToken } from '../server/db.js';

app.use(express.json())

// Redirect the user to the Google signin page
//app.get("/api/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));

// Retrieve user data using the access token received
app.get("/api/auth/google/callback", passport.authenticate("google", { session: false }),
    async (req, res) => {
        console.log("User: " + req.user);
        const user = { email: req.user.google.email };
        const accessToken = generateAccessToken(user)
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
        const dbUser = await getUser(req.user.google.email);
        if(dbUser === null){
            //create user
            await createUser(req.user.google.id, req.user.google.email, req.user.google.name, req.user.google.image, refreshToken);
        } else {
            //update user
            await updateUser(req.user.google.email, refreshToken);
        }
        res.json({accessToken: accessToken, refreshToken: refreshToken})
    }
);

/*JWT*/

app.post('/api/token', async (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        console.log(user);
        if(err) return res.sendStatus(403)
        const dbUser = await getUser(user.email);
        if(dbUser.refreshToken === refreshToken){
            const accessToken = generateAccessToken({email: user.email})
            res.json({accessToken: accessToken})
        } else {
            return res.sendStatus(401)
        }
    })
})

app.delete('/api/logout', async (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        console.log(user);
        if(err) return res.sendStatus(403)
        const dbUser = await getUser(user.email);
        if(dbUser.refreshToken === refreshToken){
            await updateUserDeleteRefreshToken(user.email);
            res.sendStatus(204)
        } else {
            return res.sendStatus(401)
        }
    })
})

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'})
}



// Protected route
app.get('/api/profile', authenticateToken, (req, res) => {    
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