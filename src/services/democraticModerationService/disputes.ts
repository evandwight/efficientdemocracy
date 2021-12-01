import { validationAssert } from "../../routes/utils";
import db from '../../db/databaseApi';
import { thingTypeHasField } from "./thingConfig";
import Disputes from './db/disputes';

export async function submitDispute({ userId, thingId, field, shouldBe }) {
    const type = await db.things.getType(thingId);
    validationAssert(thingTypeHasField(type, field), "Thing does not have field", 400);

    const success = await Disputes.submitDispute({ userId, thingId, field, shouldBe });
    return success;
}