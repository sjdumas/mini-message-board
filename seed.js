const pool = require("./db");

async function seed() {
	await pool.query(`
		INSERT INTO messages (username, text)
		VALUES
			('Armando', 'Hi there!'),
			('Charles', 'Hello world');
	`);
	console.log("Seeded!");
	process.exit();
}

seed();
