import db from '../db/databaseApi';
import * as C from '../constant';
import axios from 'axios';
import { ThingId } from '../db/types';
import DemocraticModerationService from '../services/democraticModerationService';
import { execFile } from 'child_process';
import { HnPost } from './types';

export async function runTasks() {
    console.log("Running tasks");
    const start = new Date().getTime();

    await DemocraticModerationService.updateStrikes();

    await db.pool.query(`REFRESH MATERIALIZED VIEW vote_count`);

    // await DemocraticModerationService.createAllSamples();

    await DemocraticModerationService.endAllSamples();

    await updateHackerNewsPosts();

    await DemocraticModerationService.updateMod();

    console.log(`Done running tasks. Took ${(new Date().getTime() - start) / 1000} seconds`);
}

export async function updateHackerNewsPosts() {
    const topList = await axios.get("https://hacker-news.firebaseio.com/v0/topstories.json");
    let items:HnPost[] = await Promise.all(topList.data.filter((v, i) => i < 30)
        .map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(v => v.data)));
    const titles = items.map(v => v.title);
    const isTechincal = await areTitlesTechnical(titles);
    items = items.map((v, i) => ({...v, isTechincal: isTechincal[i]}));
    await Promise.all(items.map(async (v: any) => {
        const thingId = await db.qPosts.upsertHackerNewsPost(v);
        await maybeSetField({thingId, shouldBe: v.score > 600, field: C.FIELDS.LABELS.DEEPLY_IMPORTANT});
        await maybeSetField({thingId, shouldBe: v.isTechincal, field: C.FIELDS.LABELS.TECHNICAL});
    }));
}

export async function areTitlesTechnical(titles: string[]): Promise<boolean[]> {
    const json = JSON.stringify({titles});
    return new Promise((resolve,reject) => {
        execFile('python3', ['./other/classifyHn/run.py', json], (error, stdout) => {
            if (error) {
                reject(error);
            }
            resolve(JSON.parse(stdout).result.map(v => v === 1));
        });
    });
}

export async function maybeSetField({thingId, shouldBe, field}: {thingId: ThingId, shouldBe: boolean, field: string}) {
    const creatorId = C.BOT_ACCOUNT_USER_ID;
    const value = shouldBe;
    const strikes = {
        strikeUps: false,
        strikeDowns: false,
        strikePoster: false,
        strikeDisputers: false,
    }
    const modAction = await DemocraticModerationService.getModAction({ thingId, field });
    const version = !!modAction ? modAction.version : 0;
    if ((!modAction && value) || (!!modAction && modAction.value !== value)) {
        await DemocraticModerationService.createModAction(
            { thingId, field, version, creatorId, isAutoMod: true, value, strikes });
    }
}