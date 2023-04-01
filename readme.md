# NodeJS Passport OAuth2 JWT boilerplate

This is a template, for future Node projects, to authenticate users and protect APIs

It uses:

- [Node](https://nodejs.org/en), [React](https://reactjs.org/)
- [PassportJS](https://www.passportjs.org/), [Passport-Google-OAuth20](https://www.passportjs.org/packages/passport-google-oauth20/), [Passport-JWT](https://www.passportjs.org/packages/passport-jwt/)

Several tutorials were used:

https://www.passportjs.org/tutorials/google/
Video tutorial original: https://www.youtube.com/watch?v=mbsmsi7l3r4
Github: https://github.com/WebDevSimplified/JWT-Authentication

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