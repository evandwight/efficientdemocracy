import db from '../../db/databaseApi';
import ModVotes from './db/modVotes';
import { UserId } from '../../db/types';
import DataFrame from 'dataframe-js';
import { UnexpectedInternalError } from '../../routes/utils';

export function countsToWinner(counts): UserId {
    if (counts.length === 0) {
        return null;
    }
    let df = new DataFrame(counts, ["vote", "count"]);
    df = df.sortBy("count", true);
    return df.getRow(0).get("vote");
}

export async function getMod() {
    return db.users.getMod();
}

export async function updateMod() {
    // find current mod
    const currentMod = await getMod();
    // find new mod
    const counts = await ModVotes.countVotes();
    const newMod = countsToWinner(counts);

    if (newMod !== null && newMod !== currentMod) {
        // swappers
        throw new UnexpectedInternalError("New mod requested!");
        // await db.users.setSetting(newMod, C.USER.COLUMNS.is_mod, true);
        // await db.users.setSetting(currentMod, C.USER.COLUMNS.is_mod, false);
    }
}