import React from 'react';
import * as C from '../constant';

export const ViewProxy = ({ currentProxy, proxies }) => {
    return <div>
        <div>
            Current proxy: {!!currentProxy ? currentProxy.user_name : "no proxy"}
        </div>
        <div>
            <h4>Eligible proxies</h4>
            {proxies.length === 0
                ? <div>No eligible proxies</div>
                : <table>
                    <tr><td><b>Name</b></td><td></td></tr>
                    {proxies.map((e, i) => <tr key={i}>
                        <td>{e.user_name}</td>
                        <td>
                            <a className="onclick-post" data-reload href={`${C.URLS.SUBMIT_PROXY}${e.id}`}>
                                <button> &#x2714; </button>
                            </a>
                        </td>
                    </tr>)}
                </table>
            }
        </div>
    </div>
}