const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const fs = require('fs');

// Hàm escape dấu nháy đơn để không lỗi SQL
function escapeString(str) {
  return str.replace(/'/g, "''");
}

(async () => {
  const hashedPassword = await bcrypt.hash('12345678', 10);
  const now = new Date().toISOString();

  let userSQLs = '';
  let settingSQLs = '';

  for (let i = 0; i < 100; i++) {
    const userId = uuidv4();
    const birthday = faker.date.birthdate({ min: 18, max: 50, mode: 'age' });

    const user = {
      id: userId,
      familyName: escapeString(faker.person.lastName()),
      name: escapeString(faker.person.firstName()),
      email: escapeString(faker.internet.email()),
      password: hashedPassword,
      phoneNumber: faker.string.numeric(20).slice(0, 15),
      birthday: birthday.toISOString(),
      avatarUrl: escapeString(faker.image.avatar()),
      capwallUrl: escapeString(faker.image.urlPicsumPhotos()),
      privacy: 'public',
      biography: escapeString(faker.lorem.sentence()),
      authType: 'local',
      authGoogleId: null,
      postCount: 0,
      friendCount: 0,
      status: true,
      createdAt: now,
      updatedAt: now
    };

    const setting = {
      userId: userId,
      language: 'vi',
      status: true,
      createdAt: now,
      updatedAt: now
    };

    const userSQL = `INSERT INTO users (
  id, family_name, name, email, password, phone_number, birthday,
  avatar_url, capwall_url, privacy, biography,
  auth_type, auth_google_id,
  post_count, friend_count, status,
  created_at, updated_at
) VALUES (
  '${user.id}', '${user.familyName}', '${user.name}', '${user.email}', '${user.password}',
  '${user.phoneNumber}', '${user.birthday}',
  '${user.avatarUrl}', '${user.capwallUrl}', '${user.privacy}', '${user.biography}',
  '${user.authType}', ${user.authGoogleId},
  ${user.postCount}, ${user.friendCount}, ${user.status},
  '${user.createdAt}', '${user.updatedAt}'
);`;

    const settingSQL = `INSERT INTO settings (
  user_id, language, status, created_at, updated_at
) VALUES (
  '${setting.userId}', '${setting.language}', ${setting.status},
  '${setting.createdAt}', '${setting.updatedAt}'
);`;

    userSQLs += userSQL + '\n';
    settingSQLs += settingSQL + '\n';
  }

  const fullSQL = `BEGIN;\n${userSQLs}${settingSQLs}COMMIT;`;

  fs.writeFileSync('insert_100_users.sql', fullSQL);
  console.log('✅ File insert_100_users.sql đã được tạo thành công.');
})();
