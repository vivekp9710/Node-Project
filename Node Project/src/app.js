
// import bodyParser from "body-parser";
// import cookieParser from "cookie-parser";
import express from "express";
import userRouter from "./router/user";
import cors from "cors";
import postRouter from "./router/post";
import likeRouter from "./router/like";
import followerRouter from "./router/follower";
import passport from "passport";
import session from "express-session";



// const GOOGLE_CLIENT_ID = "899441356881-898fboo6rqun0bvdbch4v83am8nfb0tu.apps.googleusercontent.com"

// const GOOGLE_CLIENT_SECRET = "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"

// var GoogleStrategy = require('passport-google-oauth20').Strategy;

// passport.use(new GoogleStrategy({
//     clientID: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: "https://be82-106-215-45-171.ngrok-free.app/auth/google/callback",
//     // scope: ["profile", "email"],
// },
//     async function (accessToken, refreshToken, profile, cb) {
//         console.log("first", refreshToken);
//         console.log("first", accessToken);
//         console.log("first", profile);

//         // let data = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
//         //     headers: {
//         //         "Authorization": "Bearer" + accessToken
//         //     }
//         // });
//         // console.log("first", data);
//         return cb(null, profile);

//     }
// ));

// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//     done(err, user);
// });

const app = express();

app.use(session({
    secret: "abc",
    resave: false,
    saveUninitialized: false
}))

app.get("/auth/google/callback", passport.authenticate('google', { failureRedirect: "/auth/ failed" }), (req, res) => {
    console.log("-----abc")
    res.send("Welcome to Goa Singham");
})

app.get("/auth/google", passport.authenticate('google', { scope: ["profile", "email"] }), (req, res) => {
    res.redirect("/auth/google/callback")
});

app.get("/auth/failed", passport.authenticate('google', { scope: ["profile"] }), (req, res) => {
    res.send("login failed")
});


app.use(express.json());
// app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/like", likeRouter);
app.use("/follower", followerRouter);

// app.use((req, res, next) => {
//     res.header("allow origin", '*');
//     res.header("allow method", 'GET,POST,PUT,DELETE,OPTIONS');
//     res.header("allow-headers", 'Content-Type,Authorization');
// })


// app.use(cookieParser());

app.get("/", (_, res) => {
    res.send("hello world...!")

});

export default app;