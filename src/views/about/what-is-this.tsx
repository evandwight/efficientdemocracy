import React from 'react';
import * as C from "../../constant";

export const Page = () =>
    <div>
        <h2>What is this?</h2>
        <p>
            We are a weekly newsletter of deeply important Hacker News posts. An alternative to an addictive infinite list of interesting posts. We only select those you need to read - no news is good news.
        </p>
        <p>
            Hacker news is great at collecting interesting information but this is also it’s flaw. It’s an addictive infinite feed. Each click gives you a hit of dopamine - a reward for seeking out potentially important information. It works so well because people are mostly the same so what engages other people engages you.
        </p>

        <p>
            Instead of using your similarity to others for addiction, we use it to lessen the work of finding that important information. If your peers think a post is important then we mark it as such. Instead of everyone individually curating the infinite feed, we crowdsource it so everyone has a lighter load.
        </p>
        <p>
            Scroll less; you’ll feel better.
        </p>

        <p>
            Read <a href={C.URLS.ABOUT_HOW_IT_WORKS}>how it works</a>!
        </p>

    </div>
