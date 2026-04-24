
const pool = require('./db.js'); // 引入已配置好的数据库连接池

async function createAllTables() {
  try {
    // 1. 创建作物表（存储水稻、茄子、菠菜等作物基础信息）
    const createCropsTableSQL = `
      CREATE TABLE IF NOT EXISTS crops (
        id INT AUTO_INCREMENT PRIMARY KEY,
        crop_key VARCHAR(50) NOT NULL UNIQUE, -- 作物标识（rice/eggplant/spinach等）
        title VARCHAR(100) NOT NULL, -- 作物标题（如"水稻病虫害识别"）
        create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    // 2. 创建病虫害表（存储具体的病虫害信息，关联作物表）
    const createDiseasesPestsTableSQL = `
      CREATE TABLE IF NOT EXISTS diseases_pests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        crop_id INT NOT NULL, -- 关联作物表的主键
        name VARCHAR(100) NOT NULL, -- 病虫害名称（如"稻瘟病""菠菜叶斑病"）
        description VARCHAR(500), -- 简短描述
        category VARCHAR(50), -- 分类（如"真菌性病害""虫害"）
        image VARCHAR(255), -- 图片路径
        details JSON, -- 存储多层级的详细科普内容（用JSON类型适配复杂结构）
        create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        -- 外键约束：关联作物表，确保crop_id有效
        FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    // 执行建表语句
    await pool.query(createCropsTableSQL);
    console.log('✅ 作物表(crops)创建成功');

    await pool.query(createDiseasesPestsTableSQL);
    console.log('✅ 病虫害表(diseases_pests)创建成功');

  } catch (err) {
    console.error('❌ 建表失败：', err);
    throw err; // 抛出错误，方便排查
  }
}

// 执行建表函数
createAllTables()
  .then(() => {
    console.log('✅ 所有表创建完成');
    process.exit(0); // 正常退出
  })
  .catch(() => {
    process.exit(1); // 异常退出
  });