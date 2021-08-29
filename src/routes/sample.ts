import db from '../db/databaseApi';
import * as C from '../constant';
import { reactRender } from '../views/utils';
import assert from 'assert';
import validator from 'validator';
import { ViewSampleResult } from '../views/viewSampleResult';
import { sum } from '../batch/samples';
import { ViewSamples } from '../views/viewSamples';

export async function submitSampleVote(req, res) {
    const {sampleId} = req.params;
    assert(validator.isUUID(sampleId, 4), "Invalid sampleId");
    const userId = req.user.id;
    const body = {... req.body};
    const [vote, strikeUps, strikeDowns, strikePoster, strikeDisputers] = 
        ["vote", "strike_ups", "strike_downs", "strike_poster", "strike_disputers"].map((v) => body.hasOwnProperty(v));

    assert(await db.samples.canUserVote({sampleId, userId}), "User not in sample");

    const {field} = await db.samples.getSampleResult(sampleId);
    if (field === C.SAMPLE.FIELDS.DEEPLY_IMPORTANT) {
        assert(!(strikeUps || strikeDowns || strikePoster), "Cannot strike with field deeply important");
    }

    db.samples.vote({sampleId, userId, vote, strikeUps, strikeDowns, strikePoster, strikeDisputers})

    res.redirect(req.get("Referrer"));
}

export function countsToDataTable(counts) {
    const rows: any[] = [true, false, null];
    const rowHeader = ["Yes", "No", "Didn't vote"]
    const cols = ["strike_ups", "strike_downs", "strike_poster", "strike_disputers"];

    return [
        ["Censor?", "Total", "Strike up voters", "Strike down voters", "Strike poster", "Strike disputers"],
        ... rows.map((row, i) => [
            rowHeader[i],
            sum(counts.filter(v => v.vote === row)), // Total
            ... cols.map(col => sum(counts.filter(v => v.vote === row && v[col] === true)))
            ])
        ];
}

export function countsToChartData(sample) {
    const {counts} = sample;
    let chartData: any = {
        shouldCensor: {
            labels: ["Yes", "No", "Didn't vote"],
            datasets: [{
                label: '# of Votes',
                data: [true, false, null].map(v => sum(counts.filter(e => e.vote === v))),
            }]
        }
    };
    if (!!sample.result) {
        chartData.shouldStrike = {
            labels: ["Up voters", "Down voters", "Poster", "Disputers"],
            datasets: [{
                label: '# of Votes',
                data: ["strike_ups", "strike_downs", "strike_poster", "strike_disputers"].map(v =>
                    sum(counts.filter(e => e.vote === sample.result.vote && e[v] === true))),
            }]
        };
    }
    return chartData;
}

export async function viewSampleResult(req, res) {
    const {sampleId} = req.params;
    assert(validator.isUUID(sampleId, 4));

    const sample = await db.samples.getSampleResult(sampleId);
    assert(sample.is_complete, "Sample must be complete to view");

    const dangerousChartData = countsToChartData(sample);
    const dataTable = countsToDataTable(sample.counts);
    
    reactRender(res, ViewSampleResult({ sample, dataTable }), {title: "Sample", includeChartJs: true, dangerousChartData});
}

export async function viewSamples(req, res) {
    const {thingId} = req.params;
    assert(validator.isUUID(thingId, 4));

    const samples = await db.samples.getCompletedSamples(thingId);
    
    reactRender(res, ViewSamples({ samples }), {title: "Samples"});
}