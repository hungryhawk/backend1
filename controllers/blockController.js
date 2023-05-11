const db = require('../config/database');

const getBlocks = async (req, res) => {
  const blocks = await db.query("SELECT * FROM blocks");
  res.json({ blocks: blocks.rows });
};

module.exports = {
  getBlocks,
};
