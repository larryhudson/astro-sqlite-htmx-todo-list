import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve('astro-sqlite-htmx-todo-list.db');

const db = new Database(dbPath, {verbose: console.log});
db.pragma("journal_mode = WAL");

const createTableStatements = [
	`CREATE TABLE IF NOT EXISTS todos (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT NOT NULL,
	date_completed DATE
	);`
]

createTableStatements.forEach(statement => {
	db.exec(statement);
});

db.close();
