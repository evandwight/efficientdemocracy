import { validationAssert } from "../../routes/utils";
import db from '../../db/databaseApi';
import { thingTypeHasField } from "./thingConfig";

export async function submitDispute({ userId, thingId, field, shouldBe }) {
    const type = await db.things.getType(thingId);
    validationAssert(thingTypeHasField(type, field), "Thing does not have field", 400);

    const success = await db.votes.submitDispute({ userId, thingId, field, shouldBe });
    return success;
}