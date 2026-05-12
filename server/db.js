const mysql = require('mysql2/promise')

const {
  DB_HOST = '127.0.0.1',
  DB_PORT = 3306,
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_DATABASE = 'tournament'
} = process.env

const baseConfig = {
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD
}

const db = mysql.createPool({
  ...baseConfig,
  database: DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

const createDatabaseIfNeeded = async () => {
  const connection = await mysql.createConnection(baseConfig)
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_DATABASE}\``)
  await connection.end()
}

const initializeDatabase = async () => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS teams (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      wins INT DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS players (
      id INT AUTO_INCREMENT PRIMARY KEY,
      team_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      kills INT DEFAULT 0,
      deaths INT DEFAULT 0,
      assists INT DEFAULT 0,
      FOREIGN KEY (team_id) REFERENCES teams(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS matches (
      id INT AUTO_INCREMENT PRIMARY KEY,
      round VARCHAR(255) NOT NULL,
      team1_id INT NOT NULL,
      team2_id INT NOT NULL,
      winner_id INT,
      FOREIGN KEY (team1_id) REFERENCES teams(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
      FOREIGN KEY (team2_id) REFERENCES teams(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
      FOREIGN KEY (winner_id) REFERENCES teams(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)

  const [rows] = await db.execute('SELECT COUNT(*) AS count FROM teams')
  const count = rows[0]?.count || 0

  if (count === 0) {
    await db.execute('INSERT INTO teams (name, wins) VALUES (?, ?), (?, ?)', [
      'Team 1', 0,
      'Team 2', 0
    ])

    const playerInserts = []
    for (let i = 1; i <= 5; i++) {
      playerInserts.push([1, `Player ${i}`, 0, 0, 0])
      playerInserts.push([2, `Player ${i}`, 0, 0, 0])
    }

    for (const player of playerInserts) {
      await db.execute(
        'INSERT INTO players (team_id, name, kills, deaths, assists) VALUES (?, ?, ?, ?, ?)',
        player
      )
    }

    await db.execute(
      'INSERT INTO matches (round, team1_id, team2_id, winner_id) VALUES (?, ?, ?, ?)',
      ['finals', 1, 2, null]
    )
  }
}

const initialize = async () => {
  try {
    await createDatabaseIfNeeded()
    await initializeDatabase()
    console.log('Connected to MySQL database and initialized schema')
  } catch (err) {
    console.error('MySQL initialization error:', err)
    process.exit(1)
  }
}

initialize()

module.exports = db
