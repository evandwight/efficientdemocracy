import dbPool from "../../db/dbPool";
import { selectRows } from "../../db/utils";
import readline from 'readline';
const util = require('util');
import { stdin as input, stdout as output } from 'process';

async function run() {
    const dbNames = await dbPool.query("SELECT datname FROM pg_database").then(selectRows);
    const dropNames = dbNames
        .map(e => e.datname)
        .filter(name => name.slice(0, 6) === "testdb");

    console.log("Drop", { dropNames });
    const rl = readline.createInterface({ input, output });
    const question = util.promisify(rl.question).bind(rl);
    const answer = await question("Would you like to drop the databases? (y/n)");

    if ("y" === answer) {
        await Promise.all(dbNames
            .map(e => e.datname)
            .filter(name => name.slice(0, 6) === "testdb")
            .map(name => dbPool.query(`DROP DATABASE ${name}`)));
        console.log("Dropped");
    } else{
        console.log("Exiting script");
    }

    rl.close();
}

if (require.main === module) {
    console.log("Main mode");

    dbPool.initialize()
    run().then(() => dbPool.end());
}