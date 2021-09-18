import React from 'react';
import * as C from '../../constant';

const title = "Sampling is magic";

const IMG_URL = "/public/blog/sampling-is-magic/";

const element = () =>
    <div>
        <h2>{title}</h2>
        <p>Sampling is simple: take a few people from a group, ask them a question and suddenly you are able to have a good guess of how the entire group would answer. Know what people think without even asking them. That's magical.</p>

        <p>Lets see how this works!</p>

        <p>We can skip the theoretical by using the immense brute force of modern computers to consider hypothetical worlds. Below are 10,000 people - you control how many are red and how many are blue.</p>

        <p>Percent blue: <input type="text" id="people-percent-blue" defaultValue="50"/>%</p>

        <p>The 10,000:</p>
        <canvas width="500" height="500" id="people-canvas"></canvas>

        <p>Now that we have our people, select how many you want to randomly take from the group to ask a very simple question: are you feeling blue?</p>

        <p>Abduct #: <input type="text" id="sample-size" defaultValue="50"/></p>

        <p>Thats it! You are done! Let's start abducting people and checking their color. Click run to get a new group of abductees.</p>

        <button id="run-one">Run</button>

        <div id="run-one-result" style={{display:"none"}} className="card">
            <p>The abductees:</p>
            <canvas width="450" height="5" id="sample-canvas"></canvas>
            <p>The abductees are <span id="sample-percent">X</span>% blue. Thats a difference of <span id="sample-percent-difference">Y</span> percentage points from the full group.</p>
        </div>

        <p>You've probably noticed a few things about the blueness of the abductees:</p>
        <ul>
            <li>it's usually different from the blueness of the 10,000</li>
            <li>it's not wildly different from the blueness of the 10,000</li>
        </ul>

        <p>You may be asking yourself how often is it really wrong? For that we will need to use the central limit theorem to approximate the bernoulli process as a guassian distributon, allowing us to use Z-test. OR if like me you don't really know what that means, then you can just run it a bunch[0].</p>

        <button id="run-it-a-bunch">Run it a bunch</button>

        <div id="run-it-a-bunch-result" style={{display:"none"}} className="card">
            <p>Runs: <span id="run-it-a-bunch-tries">0</span></p>

            <p>The answer is sample will be pretty close to the whole group <span id="sample-big-difference-percent">Z%</span> of the time[1].</p>
        </div>
        
        <p>Too long, didn't burn electricity: the number of abductees (sample size) directly affects how accurate your guesses are. Here is a handy graph of their loving relationship:</p>
        <img src={IMG_URL + "accuracy-sample-size.png"}/>

        <p>A difference closer to 0 is better. Slimmer is more accurate. The graph shows that a sample size of 50 is not that useful for preciesly knowing how blue people feel, but it is pretty good at letting us know whether the population is 80% blue or 80% red. With small sample sizes we can detect extremes.</p>

        <p>The power to detect extremes is a useful tool. For example, we can use it to filter out posts that most people think are clearly lies, misleading, or reprehensible without needing to trust a representative to act on our behalf.</p>

        <h4>Notes</h4>
        <ul style={{listStyleType:"none"}}>
            <li>[0] - it is much easier to estimate error rates than find closed form solutions, especially when adding complications like missing data or subjects that arent identically distributed.</li>
            <li>[1] - within 10 percentage points</li>
        </ul>
        <div style={{display: "none"}}>
            <img  id="red-person-img" src={IMG_URL+"red-person.png"}/>
            <img  id="blue-person-img" src={IMG_URL+"blue-person.png"}/>
        </div>
    </div>

export const Page = { 
    element, 
    title, url: C.URLS.BLOG_SAMPLING_IS_MAGIC, 
    created: new Date(2021, 8, 17),
    includeScript: "/public/blog/sampling-is-magic/script.js",
};