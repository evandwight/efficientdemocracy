import React from 'react';
import * as C from "../../constant";

export const Page = () =>
    <div>
        <h2>What is this?</h2>
        <p>
            The world has changed. We no longer live with a scarcity of information but with an abundance. Hacker news is great at collecting interesting information but has a flaw. It’s an addictive infinite feed. Each click gives you a hit of dopamine - a reward for seeking out potentially important information. It works so well because people are mostly the same; what engages others, engages you.
        </p>
        <p>
            We help by reducing hacker news to a minimalist weekly newsletter of only those posts you need to read. No news is good news.
        </p>
        <p>
            Instead of using your similarity to others to maximize engagement, we use it to lessen the work of finding that important information. If your peers think a post is important then we mark it as such. Instead of everyone individually curating the infinite feed, we crowdsource it so everyone has a lighter load.
        </p>
        <p>
            Scroll less; feel better.
        </p>
        <p>
            Read <a href={C.URLS.ABOUT_HOW_IT_WORKS}>how it works</a>!
        </p>
    </div>