// Redirect the user to the Google signin page
//app.get("/api/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));
export default function handler(req, res) {
    passport.authenticate("google", { scope: ["email", "profile"] });
}

