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

function getRandomFriends(allIds, currentId, count, existingFriendsSet) {
  const shuffled = allIds.filter(id => id !== currentId && !existingFriendsSet.has(id)).sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

(async () => {
  await client.connect();

  const userIds = fs.readFileSync('user_ids.txt', 'utf-8').split('\n').filter(Boolean);
  const targetUserId = '7b33071b-bce5-4f9a-85a6-2c465398cf7b';

  // Only process the target user ID
  if (!userIds.includes(targetUserId)) {
    console.error('❌ Target user ID not found in user_ids.txt');
    await client.end();
    return;
  }

  // Đếm bạn hiện tại
  const res = await client.query('SELECT friend_id FROM friends WHERE user_id = $1', [targetUserId]);
  const existingFriends = res.rows.map(row => row.friend_id);
  const existingSet = new Set(existingFriends);

  const toAdd = 50 - existingFriends.length;
  if (toAdd <= 0) {
    console.log(`✅ User ${targetUserId} already has 50 or more friends.`);
    await client.end();
    return;
  }

  const newFriends = getRandomFriends(userIds, targetUserId, toAdd, existingSet);

  for (const friendId of newFriends) {
    try {
      // Kiểm tra tồn tại để tránh duplicate (đảm bảo hai chiều)
      const check = await client.query(`
        SELECT 1 FROM friends
        WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)
      `, [targetUserId, friendId]);

      if (check.rowCount === 0) {
        await client.query(`
          INSERT INTO friends (user_id, friend_id) VALUES ($1, $2), ($2, $1)
        `, [targetUserId, friendId]);
        console.log(`👥 ${targetUserId} ⇆ ${friendId}`);
      }
    } catch (err) {
      console.error('❌ Insert failed:', err.message);
    }
  }

  await client.end();
  console.log(`✅ Done creating ${toAdd} friendships for user ${targetUserId}!`);
})();