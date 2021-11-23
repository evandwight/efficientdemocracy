import DataFrame from 'dataframe-js';
import MiniModVotes from './db/miniModVotes';
import ModActions from './db/modActions';
import * as C from '../../constant';

export function computeStrikes(df, strikeColumns) {
    return strikeColumns.reduce((obj, prop) => {
        obj = {... obj};
        obj[prop] = df.filter({[prop]: true}).stat.sum('ncount');
        return obj;
    }, {});
}

export function mapEntries(o, func) {
    return Object.fromEntries(Object.entries(o).map(([k,v]) => func([k,v])));
}

export function countsToSummary(counts) {
    const STRIKE_COLUMNS = ["strike_ups", "strike_downs", "strike_poster"];
    let df = new DataFrame(counts, ["vote", ... STRIKE_COLUMNS, "count"]);
    const totalVotes = df.stat.sum("count");
    if (totalVotes === 0) {
        return null;
    }
    // normalize count
    df = df.map(row => row.set('ncount', row.get('count')/totalVotes))

    return {
        vote: df.filter({'vote': true}).stat.sum('ncount'),
        true: computeStrikes(df.filter({'vote': true}), STRIKE_COLUMNS),
        false: computeStrikes(df.filter({'vote': false}), STRIKE_COLUMNS),
    }
}

export async function getMiniModVotes(args) {
    const rows = await MiniModVotes.getVotes(args);
    return rows.reduce((pv, cv) => ({... pv, [cv.field]: cv}), {});
}

export async function maybeUpdateModActionForMiniMod({thingId, field}) {
    const modAction = await ModActions.getModAction({thingId, field});
    if (modAction.priority > C.MOD_ACTIONS.PRIORTY.MINI_MOD) {
        return false;
    }
    
    const counts = await MiniModVotes.countVotes({thingId, field});
    const summary =  countsToSummary(counts);
    if (summary === null) {
        return false;
    }

    const vote = summary.vote >= 0.5;
    const strikes = mapEntries(summary[vote.toString()], ([k, v]) => [k, v >= 0.5]);
    
    await ModActions.upsertModAction({
        thingId, 
        creatorId: C.BOT_ACCOUNT_USER_ID,
        priority: C.MOD_ACTIONS.PRIORTY.MINI_MOD,
        banLength: C.BAN_LENGTH,
        value: vote,
        field,
        strikeUps: strikes.strike_ups,
        strikeDowns: strikes.strike_downs,
        strikePoster: strikes.strike_poster,
        strikeDisputers: strikes.strike_disputers,
    });

    return true;
}

export async function miniModVote(args) {
    const {thingId, field} = args;
    await MiniModVotes.vote(args);
    await maybeUpdateModActionForMiniMod({thingId, field});
}