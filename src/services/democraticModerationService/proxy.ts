import * as C from '../../constant';
import db from '../../db/databaseApi';

export async function getProxy(userId) {
    const user = await db.users.getUser(userId);
    return user.proxy_id;
}

export async function setProxy({userId, proxyId}) {
    return db.users.setSetting(userId, C.USER.COLUMNS.proxy_id, proxyId);
}

export async function getProxies() {
    return db.users.getProxies();
}