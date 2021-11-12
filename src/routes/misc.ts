import { CachedDB } from '../db/cachedDb';
import db from '../db/databaseApi';
import { PastNewsletters } from '../views/pastNewsletters';
import { Sort } from '../views/sort';
import { reactRender } from '../views/utils';

export const viewSorts = (req, res) => {
    reactRender(res, Sort(), {title:"Sort posts"});
}

export const viewPastNewsletters = async (req, res) => {
    const keys = await CachedDB.getFromCache('viewPastNewsletters', () => db.kv.selectPrefix("deeply-important"));
    reactRender(res, PastNewsletters({keys}), {title:"Past newsletters"});
}