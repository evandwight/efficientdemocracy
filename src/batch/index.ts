import db from '../db/databaseApi';
import * as C from '../constant';
import axios from 'axios';
import { ThingId } from '../db/types';
import DemocraticModerationService from '../services/democraticModerationService';

export async function runTasks() {
    console.log("Running tasks");
    const start = new Date().getTime();

    await DemocraticModerationService.updateStrikes();

    await db.pool.query(`REFRESH MATERIALIZED VIEW vote_count`);

    // await DemocraticModerationService.createAllSamples();

    await DemocraticModerationService.endAllSamples();

    await updateHackerNewsPosts();

    console.log(`Done running tasks. Took ${(new Date().getTime() - start)/1000} seconds`);
}

export async function updateHackerNewsPosts() {
    const topList = await axios.get("https://hacker-news.firebaseio.com/v0/topstories.json");
    const items = await Promise.all(topList.data.filter((v, i) => i < 30)
        .map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(v => v.data)));
    await Promise.all(items.map(async (v:any) => {
        const postId = await db.qPosts.upsertHackerNewsPost(v);
        await maybeSetDeeplyImportant(postId, v.score > 600);
    }));
}
export async function maybeSetDeeplyImportant(thingId: ThingId, shouldBeDeeplyImportant: boolean) {
        const field = C.FIELDS.LABELS.DEEPLY_IMPORTANT;
        const creatorId = C.BOT_ACCOUNT_USER_ID;
        const value = shouldBeDeeplyImportant;
        const strikes = {
            strikeUps:false, 
            strikeDowns: false, 
            strikePoster: false,
            strikeDisputers: false,
        }
        const modAction = await DemocraticModerationService.getModAction({thingId, field});
        const version = !!modAction ? modAction.version : 0;
        if ((!modAction && value) || (!!modAction && modAction.value !== value)) {
            await DemocraticModerationService.createModAction(
                {thingId, field, version, creatorId, isAutoMod: true, value, strikes});
        }
}

