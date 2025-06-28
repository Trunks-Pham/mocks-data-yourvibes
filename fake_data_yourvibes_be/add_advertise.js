const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

const client = new Client({
user: 'postgres',
host: 'yourvibes.duckdns.org',
database: 'yourvibes_db', // Thay đổi nếu cần
password: 'yourvibes123', // Thay đổi nếu cần
port: 5432,
});

const postIds = [
'8ef1dd58-0c47-4b56-941c-e6c77bf64852', 'ab57dcd9-cd51-4e17-9b51-0bfb6c724e14',
'c230aeb5-285c-4a6c-a764-74a45e971584', '6fbb95a3-6407-4832-8187-ae9cb19f6869',
'97b3baeb-a30a-450d-adb9-e28781b5c73b', 'c961f038-a129-4a9c-b951-d2436f776f47',
'c48f4537-5265-4027-aa30-51582782300d', '30764bb1-7fc3-409a-b077-4a08d1efbf46',
'877884ec-f693-4160-a626-9aeb4e3fc04a', '674f7e93-d926-4923-99de-00dedaed8b10',
'6d0e1ce3-7975-48e2-bf60-b40d2fe02559', '85509c82-bf56-4bea-acee-404cd412b7f9',
'94e3f40a-5ec6-4089-887a-784376720d6b', 'ece4f26c-0fda-499c-b555-4a0e222f6d1a',
'8d6a4a13-101d-4cee-8828-0829b80babff', '45ab3392-1322-469a-b2ed-fd967e704410',
'1e4c79c0-3d71-4461-8bc8-ad3f94f8685e', 'd1309ef1-5b20-4efd-813c-e83506ac791b',
'8f79e472-b9a1-4f15-8a37-08703876f9aa', '646c21d8-ebc7-4341-ae06-fdee77fe7c84',
'42479aa9-e86a-4237-826f-a87a7866c8de', 'f3bf5b8d-1370-4282-8ed7-e3e4616cba76',
'5622dd1c-1e41-4e7f-a9b5-fb2ff5b19bb0', '805c004b-5fa5-4b28-a090-5a5f929da916',
'c98c772e-ce36-442b-b054-886281e5b3a0', '68f0e224-7655-4bab-abbd-bae856ca0cc0',
'c6057c25-7dd0-4c40-bf30-5ea19dd67315', '60af73aa-5240-4234-a2fc-a8d76850bb5b',
'fa1715ef-f209-413f-b7c6-ad503a150215', 'cc4ee8fb-c22e-498f-ae2d-b49a3e2dd805',
'02ad28fd-cdc1-47f4-ba4c-dd31e0e6744f', 'ef994a7c-23eb-4312-b848-758676c26605',
'f9692d97-0ff3-413c-b413-e3f0fea4d417', '9700d858-a39d-4017-a95b-7956aeccce90',
'2381b0c7-ddf4-47cb-8ebe-61cea85ea658', '3b8105f3-d38f-40bd-a30a-9c7ea099db8c',
'788f978d-987c-47c1-b7f9-32e8eb21b2bd', 'b8c877b8-880f-44f9-a5ae-30baeca1864e',
'c55e6540-48a9-4e8a-88c8-eb67d35c82c9', '332b829b-4985-4e97-9127-21bd2e09a1aa',
'c699ae37-3203-4f09-8d75-20fc1e6eb531', '52ef9e58-af5b-486b-bf63-ac380aaaf79a',
'6573b4e0-80e4-47ae-91cd-d9cd69ec9d46', '14af68d8-16a4-4edd-9d56-f4bdca814918',
'9babeb42-f0b5-4088-ab54-5b407bce49c9', '2969dc41-3de8-4762-9252-1faa2567666b',
'125cda82-f179-48bf-9267-e6290022bbf3', '2631ee1b-8bb5-43d7-a13a-c8599d8c4765',
'cee43ca1-31e8-41b4-a05e-68e2978a05b5', 'd32c1e6d-28d8-47bb-be72-3905b4248948'
];

function getRandomDate() {
const start = new Date(2024, 5, 1); // Bắt đầu từ tháng 6/2024
const end = new Date(2025, 4, 1); // Kết thúc vào tháng 4/2025
return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomPrice() {
return Math.floor(Math.random() * (200000 - 33000 + 1)) + 33000;
}

function getRandomStatus() {
return Math.random() > 0.5;
}

(async () => {
try {
await client.connect();

for (let i = 0; i < 500; i++) { // Tăng lên 500
const advertiseId = uuidv4();
const postId = postIds[Math.floor(Math.random() * postIds.length)];
const startDate = getRandomDate();
const endDate = new Date(startDate);
endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 30));
const price = getRandomPrice();
const status = getRandomStatus();

await client.query(`
INSERT INTO advertises (id, post_id, start_date, end_date, created_at, updated_at)
VALUES ($1, $2, $3, $4, $5, $5)
`, [advertiseId, postId, startDate, endDate, startDate]);

await client.query(`
INSERT INTO bills (id, advertise_id, price, created_at, updated_at, status)
VALUES ($1, $2, $3, $4, $4, $5)
`, [uuidv4(), advertiseId, price, startDate, status]);

console.log(`✅ Added Advertise: ${advertiseId} for Post: ${postId}`);
}

console.log('✅ Done faking advertises and bills!');
} catch (err) {
console.error('❌ Error:', err.message);
} finally {
await client.end();
}
})();