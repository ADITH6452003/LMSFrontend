const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function initializeDatabase() {
    try {
        // Open the database file (creates it if it doesn't exist)
        const db = await open({
            filename: './database.sqlite',
            driver: sqlite3.Database
        });

        console.log("Connected to local SQLite file system.");

        // Create Users table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                role TEXT NOT NULL,
                name TEXT NOT NULL,
                userid TEXT NOT NULL,
                dept TEXT NOT NULL,
                password TEXT NOT NULL,
                assignedStaff TEXT,
                assignedHod TEXT,
                UNIQUE(userid, role)
            )
        `);
        console.log("Users table verified.");

        // Create Requests table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                userid TEXT NOT NULL,
                role TEXT NOT NULL,
                dept TEXT NOT NULL,
                type TEXT NOT NULL,
                days INTEGER NOT NULL,
                available INTEGER NOT NULL,
                fromDate TEXT NOT NULL,
                toDate TEXT NOT NULL,
                reason TEXT NOT NULL,
                status TEXT DEFAULT 'Pending'
            )
        `);
        console.log("Requests table verified.");

        // Default Principal Account
        const existingPrincipal = await db.get('SELECT * FROM users WHERE role = ? AND userid = ?', ['principal', 'admin']);
        if (!existingPrincipal) {
            await db.run(`
                INSERT INTO users (role, name, userid, dept, password) 
                VALUES ('principal', 'Principal', 'admin', 'ALL', 'admin')
            `);
            console.log("Default Principal seeded.");
        }

        console.log("Database initialization complete! Securely close this and run your server.");
        await db.close();
        process.exit(0);
    } catch (err) {
        console.error("Initialization Failed: ", err);
        process.exit(1);
    }
}

initializeDatabase();
