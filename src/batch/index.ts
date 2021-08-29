import db from '../db/databaseApi';
import * as C from '../constant';
import axios from 'axios';
import { createSamples, endSamples } from './samples';

export async function runTasks() {
    console.log("Running tasks");
    const start = new Date().getTime();

    await db.strikes.updateStrikes();

    await db.pool.query(`REFRESH MATERIALIZED VIEW vote_count`);

    await createSamples(C.SAMPLE.TYPE.LEVEL_1, C.SAMPLE.FIELDS.CENSOR);
    await createSamples(C.SAMPLE.TYPE.REFERENDUM, C.SAMPLE.FIELDS.CENSOR);
    await createSamples(C.SAMPLE.TYPE.LEVEL_1, C.SAMPLE.FIELDS.DEEPLY_IMPORTANT);
    await createSamples(C.SAMPLE.TYPE.REFERENDUM, C.SAMPLE.FIELDS.DEEPLY_IMPORTANT);

    await endSamples();

    await updateHackerNewsPosts();

    console.log(`Done running tasks. Took ${(new Date().getTime() - start)/1000} seconds`);
}

export async function updateHackerNewsPosts() {
    const topList = await axios.get("https://hacker-news.firebaseio.com/v0/topstories.json");
    const items = await Promise.all(topList.data.filter((v, i) => i < 30)
        .map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(v => v.data)));
    await Promise.all(items.map(v => db.qPosts.upsertHackerNewsPost(v)));
}