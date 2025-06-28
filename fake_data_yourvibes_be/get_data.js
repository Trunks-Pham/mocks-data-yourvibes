const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
  user: 'postgres',
  host: '192.168.20.94',
  database: 'yourvibes_db',
  password: 'yourvibes123',
  port: 5432,
});

(async () => {
  await client.connect();
  const res = await client.query('SELECT id FROM users');
  const ids = res.rows.map(row => row.id).join('\n');
  fs.writeFileSync('user_ids.txt', ids);
  console.log('✅ Exported emails to user_ids.txt');
  await client.end();
})();
