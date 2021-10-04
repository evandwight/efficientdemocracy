import React from 'react';
import * as C from '../../constant';

const title = "Microservice or monolith; why not both?";

const element = () =>
    <div>
        <h2>{title}</h2>
        <p>When I started this project I had the internal debate: monolith or microservices. This project seemed too small to get any benefits from a microservice architecture but would make the project structure and deployment more complicated. However, when building the democratic moderation system (DMS) I stumbled upon a middle ground: build a microservice within the monolith.</p>
        <p>When thinking about how to use DMS for more than just posts I was having difficulty reasoning about what areas it touched. Further, I had the looming fear that each time I added another system the codebase was going to get more tangled and unmanagable. Then a simple solution occured to me, put all the DMS code together and give it an interface for the rest of the system to interact with. Basically, build DMS like it was a microservice but let it live within the monolith. You get the ease and flexibility of building a monolith combined with the simplicity of reasoning about a microservice. Plus, you can easily split it into a true microservice if needed.</p>
        <p>In the end, I didn't completely isolate DMS behind an interface. I left calls from calls from DMS into the users and things tables because removing them would require needlessly duplicating information. Still, I'm pretty happy with how it grouped the code and isolated DMS logic from the rest of the codebase.</p>
        <p>It worked well enough that I'm going to use this microservice within a monolith pattern for future systems like elected moderators and proxies.</p>
    </div>

export const Page = { element, title, url: C.URLS.BLOG_MICROSERVICE_OR_MONOLITH, created: new Date(2021, 9, 4)};