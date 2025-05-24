const express = require("express");
const app = express();
const path = require("node:path");
const assetsPath = path.join(__dirname, "public");

app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const links = [
	{ href: "/", text: "Home" },
	{ href: "/new", text: "New Message" },
];

let messageId = 1;

const messages = [
	{
		id: messageId++,
		text: "Hi there!",
		user: "Amando",
		added: new Date()
	},
	{
		id: messageId++,
		text: "Hello World!",
		user: "Charles",
		added: new Date()
	},
];

const formatDate = (date) => {
	return date.toLocaleString("en-US", {
		dateStyle: "medium",
		timeStyle: "short",
	});
};

app.get("/", (req, res) => {
	const formattedMessages = messages
		.slice() // make a copy
		.sort((a, b) => b.added - a.added) // sort newest first
		.map((msg) => ({
			...msg,
			formattedDate: formatDate(msg.added),
		}));

	res.render("index", {
		title: "Mini Message Board",
		links: links,
		messages: formattedMessages
	});
});

app.get("/new", (req, res) => {
	res.render("form", {
		title: "New Message",
		links: links
	});
});

app.get("/message/:id", (req, res) => {
	const message = messages.find(msg => msg.id === parseInt(req.params.id));
	if (!message) return res.status(404).send("Message not found");

	res.render("message", {
		title: "Message Detail",
		message: message,
		links: links
	});
});

app.post("/new", (req, res) => {
	const messageUser = req.body.user;
	const messageText = req.body.text;

	messages.push({
		id: messageId++,
		text: messageText,
		user: messageUser,
		added: new Date()
	});

	res.redirect("/");
});

// Error handling - 500 and 404
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).render("500", {
		title: "500",
		links: links
	});
});

app.use((req, res) => {
	res.status(404).render("404", {
		title: "404",
		links: links
	});
});

const PORT = 3000;

app.listen(PORT, () => {
	console.log(`Express + EJS app listening at http://localhost:${PORT}`);
});
