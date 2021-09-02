import React from 'react';

const prettyStrikesName = {
  'strikes_up': "up voters",
  'strikes_down': "down voters",
  'strikes_poster': "poster",
  'strikes_disputers': "disputers",
}

export function strikesTo(result) {
  return Object.keys(result).filter(v => result[v]).map(v => prettyStrikesName[v]).join(", ");
}

export const stringifyResult = (sample) => {
  return !sample.result ? 
    "Inconclusive" : 
    `Set censor to ${sample.result.vote}. Give strikes to ${strikesTo(sample.result)}.`;
}

export const RawTable = ({dataTable}) => {
  return <table className="overflow-x-scroll">
      {dataTable.map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j}>{v}</td>)}</tr>)}
    </table>
}

export const ViewSampleResult = ({ sample, dataTable }) => 
  <div>
    <h2>Result</h2>
    <div>{stringifyResult(sample)}</div>
    <h2>Votes for should post be censored?</h2>
    <div style={{width:"50%"}} className="center-h">
      <canvas id="shouldCensor" width="400" height="400"></canvas>
    </div>
    
    {!!sample.result && 
      <div>
        <h2>Votes for who should be given a strike</h2>
        <div style={{width:"50%"}} className="center-h">
          <canvas id="shouldStrike" width="400" height="400"></canvas>
        </div>
      </div>}
    
    <h2>Raw data</h2>
    <RawTable dataTable={dataTable}/>
  </div>
