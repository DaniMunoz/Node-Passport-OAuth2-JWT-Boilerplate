# NodeJS Passport OAuth2 JWT boilerplate

This is a template, for future Node projects, to authenticate users and protect APIs

It uses:

- [Node](https://nodejs.org/en), [React](https://reactjs.org/)
- [PassportJS](https://www.passportjs.org/), [Passport-Google-OAuth20](https://www.passportjs.org/packages/passport-google-oauth20/), [Passport-JWT](https://www.passportjs.org/packages/passport-jwt/)

Several tutorials were used:

https://www.passportjs.org/packages/passport-google-oauth20/
https://www.passportjs.org/tutorials/google/
Video tutorial original: https://www.youtube.com/watch?v=mbsmsi7l3r4
Github: https://github.com/WebDevSimplified/JWT-Authentication
https://shivamvv.medium.com/google-oauth2-along-with-jwt-using-node-js-and-passport-e7d119e81678
https://nelsonweb.netlify.app/post/passport-jwt-google/


# How to test it

1. npm run devStart
2. http://localhost:3000/auth/google - Sign in with your Google account on Google servers. After successful login, it call backs to http://localhost:3000/auth/google/callback and returns an accessToken and a refreshToken
3. To access the demo protected route http://localhost:3000/profile: Go to request.rest and paste the accessToken to http://localhost:3000/profile. Send the request
4. To obtain a nes accessToken, using the refreshToken: Go to request.rest and paste the refreshToken to POST http://localhost:3000/token. Send the request, and a new accessToken is returned
5. To logout: Go to request.rest and paste the refreshToken to DELETE http://localhost:3000/logout. Send the request, and a the refreshToken is deleted. No more accessTokens will be returned using that refreshToken


# To Do

- Store refreshTokens in a Database instead of memory
- Create a React client
- Deploy on Vercel using serverless capabilities


# Resumen

Simula tener 2 servidores:

1. server.js: Para obtener posts de usuarios
2. authServer.js: Para logarse, deslogarse, generar y refrescar tokens

Lanza ambos en dos terminales distintas
npm run devStart  (puerto 3000)
npm run devStartAuth (puerto 4000)

En request.rest están las distintas llamadas REST

1. Llamar a login, te da un token de acceso y otro de refresco
2. llamar a posts con el de acceso y te da los posts. A los 15 segundos el token caduca y ya no te da posts
3. Llamar a /token con el token de refresco, y te da un nuevo token de acceso, para usarlo en /posts
4. /logout elimina tokens de refresco. Los de acceso no hace falta porque caducan por sí mismos



Comentarios:
- Normalmente, al llamar a login primero se obtendría el usuario con passport, y después se obtendrían los token de acceso y refresco
- En el cliente (react, vanilla, etc), los tokens se guardan en localStorage. Antes se hacía en cookies, pero ya no se recomienda. Supongo que por GDPR
- Hay una versión async de jwt.sign, que usa un callback. Es mejor de cara a rendimiento
    jwt.sign({user: user}, secretKey, (err, token) => {
        res.json({
            token: token
        })
    })