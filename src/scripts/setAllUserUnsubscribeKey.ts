import db from "../db/databaseApi";

async function run() {
    const users = await db.users.getUsers();
    console.log("users.length", users.length);
    await Promise.all(users.filter(user => user.unsubscribe_key === null)
        .map(user => db.pool.query(`UPDATE users SET unsubscribe_key = $2 WHERE id = $1`, [user.id, db.uuidv4()])
            .then(() => console.log("completed one"))
        )).then(() => console.log("compelted all"));
}

if (require.main === module) {
    console.log("Main mode");
    db.initialize();
    run().then(() => db.end());
}