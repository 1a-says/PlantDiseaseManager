// db.js
const mysql = require('mysql2/promise');

// 配置你的MySQL信息（替换为实际的用户名、密码、数据库名）
const dbConfig = {
  host: 'localhost',
  user: 'bingchonghai',
  password: '123456',
  database: 'crop_pest_db' // 后续要创建的数据库名
};

// 创建连接池（更高效、稳定）
const pool = mysql.createPool(dbConfig);

// 测试数据库连接
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ 知识科普模块数据库连接成功');
    connection.release();
  } catch (err) {
    console.error('❌ 数据库连接失败：', err);
  }
}
testConnection();

module.exports = pool; // 导出连接池，供其他接口使用