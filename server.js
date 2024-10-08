const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,  // 使用数据库名称
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`CREATE DATABASE IF NOT EXISTS game_db`);
    await connection.query(`USE game_db`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS saves (
        id INT AUTO_INCREMENT PRIMARY KEY,
        characterId INT NOT NULL,
        health INT DEFAULT 100,
        mana INT DEFAULT 100,
        experience INT DEFAULT 0,
        level INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('数据库和表已经准备就绪！');
    connection.release();
  } catch (error) {
    console.error('初始化数据库时出错:', error);
  }
}

initializeDatabase();

app.post('/new-game', async (req, res) => {
  const characterId = req.body.characterId;

  if (!characterId) {
    return res.status(400).json({ success: false, message: '缺少角色 ID' });
  }

  try {
    const [result] = await pool.query(`
      INSERT INTO game_db.saves (characterId, health, mana, experience, level)
      VALUES (?, 100, 100, 0, 1)
    `, [characterId]);

    res.json({ success: true, saveId: result.insertId });
  } catch (error) {
    console.error('创建新存档时出错:', error);
    res.status(500).send('内部服务器错误');
  }
});

app.get('/load-game', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM game_db.saves`);
    if (rows.length > 0) {
      res.json({ exists: true, saveData: rows });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error('读取存档时出错:', error);
    res.status(500).send('内部服务器错误');
  }
});

app.post('/update-player', async (req, res) => {
  const { level, experience, health, mana, characterId } = req.body;

  if (!characterId) {
    return res.status(400).json({ success: false, message: '缺少角色 ID' });
  }

  try {
    const [result] = await pool.query(`
      UPDATE game_db.saves 
      SET level = ?, experience = ?, health = ?, mana = ? 
      WHERE characterId = ?
    `, [level, experience, health, mana, characterId]);

    if (result.affectedRows > 0) {
      res.status(200).json({ success: true, message: '玩家数据更新成功' });
    } else {
      res.status(404).json({ success: false, message: '未找到该角色的存档' });
    }
  } catch (error) {
    console.error('更新玩家数据时出错:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log(`服务器正在 http://localhost:${port} 上运行`);
});

/**
 * CREATE TABLE IF NOT EXISTS saves (
  id INT AUTO_INCREMENT PRIMARY KEY,
  characterId INT NOT NULL,
  health INT DEFAULT 100,
  mana INT DEFAULT 100,
  experience INT DEFAULT 0,
  level INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

 */