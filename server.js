const fs = require("fs");
const path = require("path");
const https = require("https");
const express = require("express");
const helmet = require("helmet");

require("dotenv").congif();

const PORT = 7000;
const config = {
	CLIENT_ID: process.env.CLIENT_ID,
	CLIENT_SECRET: process.env.CLIENT_SECRET,
};

const app = express();
app.use(helmet());

function checkLoggedIn(req, res, next) {
	const isLoggedIn = true; // TODO: Make this shit work.
	if (!isLoggedIn) {
		return res.status(401).json({
			error: "You must log in.",
		});
	}
	next();
}

app.get("/auth/google", (req, res) => {});

app.get("/auth/google/callback", (req, res) => {});

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
			cert: fs.readFileSync("./cert.pem"),
		},
		app
	)
	.listen(PORT, () => {
		console.log(`https://localhost:${PORT}`);
	});
