import { reactRender } from '../views/utils';
import validator from 'validator';
import { ViewSampleResult } from '../views/viewSampleResult';
import { ViewSamples } from '../views/viewSamples';
import DemocraticModerationService from '../services/democraticModerationService';
import { formToStrikes, validationAssert } from './utils';
import { sum } from '../utils/counts';

export async function submitSampleVote(req, res) {
    const {sampleId} = req.params;
    validationAssert(validator.isUUID(sampleId, 4), "Invalid sample id", 400);
    const userId = req.user.id;
    const body = {... req.body};
    const vote = body.hasOwnProperty("vote");
    const strikes = formToStrikes(body);
    
    await DemocraticModerationService.sampleVote({sampleId, userId, vote, strikes});

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

export function dangerousCountsToChartData(sample) {
    // Do not put user input into this data. This gets injected into a script tag
    // Be careful what strings you use, I have not escaped this so for example </script> would break the page
    const {counts} = sample;
    let chartData: any = {
        voteCanvas: {
            labels: ["Yes", "No", "Didn't vote"],
            datasets: [{
                label: '# of Votes',
                data: [true, false, null].map(v => sum(counts.filter(e => e.vote === v))),
            }]
        }
    };
    if (!!sample.result) {
        chartData.strikeCanvas = {
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
    validationAssert(validator.isUUID(sampleId, 4), "Invalid sample id", 400);

    const sample = await DemocraticModerationService.getSampleResult(sampleId);
    validationAssert(!!sample, "Sample not found", 404);
    validationAssert(sample.is_complete, "Sample must be complete to view", 400);

    const dangerousChartData = dangerousCountsToChartData(sample);
    const dataTable = countsToDataTable(sample.counts);
    
    reactRender(res, ViewSampleResult({ sample, dataTable }), {title: "Sample", includeChartJs: true, dangerousChartData});
}

export async function viewSamples(req, res) {
    const {thingId} = req.params;
    validationAssert(validator.isUUID(thingId, 4), "Invalid thing id", 400);

    const samples = await DemocraticModerationService.getCompletedSamples(thingId);
    
    reactRender(res, ViewSamples({ samples }), {title: "Samples"});
}