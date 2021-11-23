import React from 'react';

export const RawTable = ({dataTable}) => {
    return <table className="overflow-x-scroll">
        {dataTable.map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j}>{v}</td>)}</tr>)}
      </table>
  }
  