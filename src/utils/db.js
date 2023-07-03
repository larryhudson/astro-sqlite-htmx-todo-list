import Database from 'better-sqlite3';
import path from "path";

// Connect to the SQLite database
const dbPath = path.resolve('astro-sqlite-htmx-todo-list.db');
const db = new Database(dbPath, {verbose: console.log});
db.pragma("journal_mode = WAL");

// Function to create a new record in a table
export function createRecord(table, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = values.map(() => '?').join(', ');
  const statement = db.prepare(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`);
  statement.run(values);
  return statement.lastInsertRowid;
}

function parseId(id) {

	const parsedId = parseInt(id);

	if (Number.isNaN(parsedId)) {
		throw new Error('Invalid ID. Please provide a valid integer ID.');
	}

	return parsedId;
}

// Function to look up a record by ID
export function getRecordById(table, id) {
  const parsedId = parseId(id);

  const statement = db.prepare(`SELECT * FROM ${table} WHERE id = ?`);

  return statement.get(parsedId);
}

// Function to update a record
export function updateRecord(table, id, data) {
const parsedId = parseId(id);

  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(key => `${key} = ?`).join(', ');
  const statement = db.prepare(`UPDATE ${table} SET ${placeholders} WHERE id = ?`);
  statement.run([...values, parsedId]);
  return statement.changes > 0;
}

// Function to execute a query on a table
export function executeQuery(table, condition) {
  let whereClause = '';
  const values = [];

  if (condition) {
    const keys = Object.keys(condition);
    const conditions = keys.map(key => {
      values.push(condition[key]);
      return `${key} = ?`;
    });

    whereClause = `WHERE ${conditions.join(' AND ')}`;
  }

  const query = `SELECT * FROM ${table} ${whereClause}`;
  const stmt = db.prepare(query);
  return stmt.all(values);
}

export function deleteRecordById(table, id) {
  const parsedId = parseId(id);
  const statement = db.prepare(`DELETE FROM ${table} WHERE id = ?`);
  const result = statement.run(parsedId);
  return result.changes > 0;
}

