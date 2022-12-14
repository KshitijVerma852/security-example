const fs = require("fs");
const path = require("path");
const https = require("https");
const helmet = require("helmet");
const express = require("express");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");

require("dotenv").config();

const PORT = 7000;
const config = {
	CLIENT_ID: process.env.CLIENT_ID,
	CLIENT_SECRET: process.env.CLIENT_SECRET
};

const AUTH_OPTIONS = {
	callbackURL: "/auth/google/callback",
	clientID: config.CLIENT_ID,
	clientSecret: config.CLIENT_SECRET
};

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

function verifyCallback(accessToken, refreshToken, profile, done) {
	console.log("Google profile:", profile);
	89;
	done(null, profile);
}

const app = express();
app.use(helmet());
app.use(passport.initialize());

function checkLoggedIn(req, res, next) {
	const isLoggedIn = true; // TODO: Make this shit work.
	if (!isLoggedIn) {
		return res.status(401).json({
			error: "You must log in."
		});
	}
	next();
}

app.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: ["email"]
	})
);

app.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		failureRedirect: "/failure",
		successRedirect: "/",
		session: false
	})
);

app.get("/failure", (req, res) => {
	return res.send("Failed to log in.");
});

app.get("/auth/logout", (req, res) => {});

app.get("/secret", checkLoggedIn, (req, res) => {
	return res.send("ehh");
});

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

https
	.createServer(
		{
			key: fs.readFileSync("./key.pem"),
			cert: fs.readFileSync("./cert.pem")
		},
		app
	)
	.listen(PORT, () => {
		console.log(`https://localhost:${PORT}`);
	});
