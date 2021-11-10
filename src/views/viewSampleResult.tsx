import React from 'react';
import * as C from '../constant';

const prettyStrikesName = {
  'strike_ups': "up voters",
  'strike_downs': "down voters",
  'strike_poster': "poster",
  'strike_disputers': "disputers",
}

export function strikesTo(result) {
  return Object.keys(result).filter(v => result[v]).map(v => prettyStrikesName[v]).join(", ");
}

export const stringifyResult = (sample) => {
  return !sample.result ? 
    "Inconclusive" : 
    `Set ${C.FIELDS.PROPS[sample.field].PRETTY_LABEL} to ${sample.result.vote}. Give strikes to ${strikesTo(sample.result)}.`;
}

export const RawTable = ({dataTable}) => {
  return <table className="overflow-x-scroll">
      {dataTable.map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j}>{v}</td>)}</tr>)}
    </table>
}

// TODO chart looks bad on mobile
export const ViewSampleResult = ({ sample, dataTable }) => 
  <div>
    <h2>Result</h2>
    <div>{stringifyResult(sample)}</div>
    <h2>{C.FIELDS.PROPS[sample.field].VIEW_SAMPLE_RESULT.VOTE_CANVAS_TITLE}</h2>
    <div style={{width:"50%"}} className="center-h">
      <canvas id="voteCanvas" width="400" height="400"></canvas>
    </div>
    
    {!!sample.result && 
      <div>
        <h2>Votes for who should be given a strike</h2>
        <div style={{width:"50%"}} className="center-h">
          <canvas id="strikeCanvas" width="400" height="400"></canvas>
        </div>
      </div>}
    
    <h2>Raw data</h2>
    <RawTable dataTable={dataTable}/>
  </div>
