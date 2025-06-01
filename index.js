const express = require("express");
const app = express();
const path = require("node:path");
const pool = require("./db");
const assetsPath = path.join(__dirname, "public");

app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const links = [
	{ href: "/", text: "Home" },
	{ href: "/new", text: "New Message" },
];

/* let messageId = 1;

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
]; */

const formatDate = (date) => {
	return date.toLocaleString("en-US", {
		dateStyle: "medium",
		timeStyle: "short",
	});
};

app.get("/", async (req, res, next) => {
	try {
		const result = await pool.query("SELECT * FROM messages ORDER BY added DESC");
		const formattedMessages = result.rows.map((msg) => ({
			...msg,
			formattedDate: formatDate(new Date(msg.added)),
		}));
		res.render("index", { title: "Mini Message Board", links, messages: formattedMessages });
	} catch (error) {
		next(error);
	}
});

app.get("/new", (req, res) => {
	res.render("form", { title: "New Message", links });
});

app.get("/message/:id", async (req, res, next) => {
	try {
		const result = await pool.query("SELECT * FROM messages WHERE id = $1", [req.params.id]);
		const message = result.rows[0];
		if (!message) return res.status(404).send("Message not found");

		res.render("message", {
			title: "Message Detail",
			message,
			links
		});
	} catch (error) {
		next(error);
	}
});

app.post("/new", async (req, res, next) => {
	const { user, text } = req.body;
	try {
		await pool.query("INSERT INTO messages (username, text) VALUES ($1, $2)", [user, text]);
		res.redirect("/");
	} catch (error) {
		next(error);
	}
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
