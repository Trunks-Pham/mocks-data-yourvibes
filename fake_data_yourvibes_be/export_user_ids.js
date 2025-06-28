const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
  user: 'yourvibes_db_owner',
  host: 'ep-still-hat-a1f7trde.ap-southeast-1.aws.neon.tech',
  database: 'yourvibes_db',
  password: 'W1aUPhETrec5',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

(async () => {
  try {
    await client.connect();

    // Ensure the specific user ID is included
    const specificUserId = '7b33071b-bce5-4f9a-85a6-2c465398cf7b';
    const res = await client.query(`
      SELECT id FROM users
      WHERE id != $1
      LIMIT 99
    `, [specificUserId]);

    const userIds = [specificUserId, ...res.rows.map(row => row.id)];

    fs.writeFileSync('user_ids.txt', userIds.join('\n'));
    console.log('✅ Exported 100 user IDs (including your user ID) to user_ids.txt');
  } catch (err) {
    console.error('❌ Error exporting user IDs:', err.message);
  } finally {
    await client.end();
  }
})();