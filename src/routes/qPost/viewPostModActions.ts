
import DataFrame from 'dataframe-js';
import validator from 'validator';
import * as C from '../../constant';
import db from '../../db/databaseApi';
import DemocraticModerationService from '../../services/democraticModerationService';
import { ViewPostModAction, VoteDetails } from '../../views/post/viewPostModAction';
import { reactRender } from '../../views/utils';
import { unexpectedAssert, validationAssert } from '../utils';
export * from './listings';

export async function viewPostModAction(req, res) {
    const { id, field } = req.params;
    validationAssert(validator.isUUID(id, 4), "Invalid post id", 400);
    validationAssert(C.FIELDS.LIST.indexOf(field) !== -1, "Invalid field", 400);

    const post = await db.qPosts.getPost(id);
    validationAssert(!!post, "Post not found", 404);

    const action = await DemocraticModerationService.getModAction({ thingId: id, field });
    const { priority } = action || {};
    const { MINI_MOD, SAMPLE_1 } = C.MOD_ACTIONS.PRIORTY;
    let details = null;
    let includeChartJs = false;
    let dangerousChartData;
    if (priority === MINI_MOD || priority >= SAMPLE_1) {
        let isSample, counts, dataTable;
        if (priority == MINI_MOD) {
            counts = await DemocraticModerationService.getMiniModVoteCount({ thingId: id, field });
            isSample = false;
        } else {
            const sample = await DemocraticModerationService.getSampleResult(action.creator_id);
            unexpectedAssert(!!sample, "Sample not found");
            unexpectedAssert(sample.is_complete, "Sample must be complete to view");
            ({ counts } = sample);
            isSample = true;
        }

        ({ dangerousChartData, dataTable } = countsToViewData({ counts, result: action.value, isSample }));
        details = VoteDetails({ dataTable });
        includeChartJs = true;
    }

    reactRender(res, ViewPostModAction({ post, action, field, details }), 
        { title: `Mod info - ${field}`, includeVotesJs: true, includeChartJs, dangerousChartData });
}

export function countsToViewData({ counts, result, isSample }) {
    // Do not put user input into this data. This gets injected into a script tag
    // Be careful what strings you use, I have not escaped this so for example </script> would break the page

    const rows = [true, false, ...isSample ? [null] : []];
    const rowLabel = ["True", "False", ...isSample ? ["Didn't vote"] : []];

    const STRIKE_COLUMNS = ["strike_ups", "strike_downs", "strike_poster", ...isSample ? ["strike_disputers"] : []];

    let df = new DataFrame(counts, ["vote", ...STRIKE_COLUMNS, "count"]);
    const strikeDf = df.filter({ vote: result });

    const dangerousChartData: any = {
        voteCanvas: {
            labels: rowLabel,
            datasets: [{
                label: '# of Votes',
                data: rows.map(v => df.filter({ "vote": v }).stat.sum("count")),
            }]
        },
        strikeCanvas: {
            labels: ["Up voters", "Down voters", "Poster", ...isSample ? ["Disputers"] : []],
            datasets: [{
                label: '# of Strike Votes',
                data: STRIKE_COLUMNS.map(col => strikeDf.filter({ [col]: true }).stat.sum("count")),
            }]
        }
    };
    
    const dataTable = [
        ["Set field to", "Total", "Strike up voters", "Strike down voters", "Strike poster", ...isSample ? ["Strike disputers"] : []],
        ...rows.map((row, i) => [
            rowLabel[i],
            df.filter({ vote: row }).stat.sum("count"), // Total
            ...STRIKE_COLUMNS.map(col => df.filter({ vote: row, [col]: true }).stat.sum("count"))
        ])
    ];
    return { dangerousChartData, dataTable };
}