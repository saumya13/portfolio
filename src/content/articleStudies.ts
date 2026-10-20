// A screenshot, or a short looping screen recording when `video` is set (`src` is then the poster image).
export type ArticleShot = {
  src: string;
  alt: string;
  caption: string;
  video?: string;
};
export type ArticleFlow = {
  problem: string;
  solution: string;
  title: string;
  body: string;
  shots: ArticleShot[];
};

export type ArticleStudy = {
  slug: string;
  title: string;
  // The big headline.
  headline: string;
  intro: string;
  spec: { label: string; value: string }[];
  // What the project was built with, shown as chips under the spec sheet.
  built: string[];
  links: { label: string; href: string }[];
  hero: ArticleShot[];
  problems: { heading: string; points: string[] };
  did: {
    icon:
      | "compass"
      | "cursor"
      | "eye"
      | "chart"
      | "code"
      | "plug"
      | "pen"
      | "layers";
    title: string;
    body: string;
  }[];
  solution: { intro: string; principles: string[] };
  flows: ArticleFlow[];
  impact: {
    heading: string;
    points: { lead: string; body: string }[];
    closing: string;
  };
  nextProject: string;
};

export const articleStudies: ArticleStudy[] = [
  {
    slug: "model-arena",
    title: "Model-Arena",
    headline: "Designing an arena where AI models go head to head.",
    intro:
      "OpenRouter publishes rankings, usage and pricing for its models, but they are spread across multiple separate charts and are averages across everyone's traffic. They can't tell me how models do on my prompt, especially for images, where \"better\" is something you have to see. I got tired of switching tabs to compare models, so I built Model-Arena. Same prompt goes to up to four models at once, answers show up side by side, and you can see the actual time, cost and tokens for each one. I designed the flows and the interface, then built it end to end on top of the OpenRouter API. It runs entirely in the browser, with no backend.",
    spec: [
      { label: "Role", value: "Designer and developer (solo)" },
      {
        label: "Context",
        value: "Personal project, exploring design and AI tooling",
      },
      {
        label: "Scope",
        value:
          "Product Design · Interface · Data Visualisation · API integration",
      },
    ],
    built: [
      "React 19",
      "TypeScript",
      "Vite",
      "Tailwind CSS v4",
      "Zustand",
      "Recharts",
      "Motion",
      "OpenRouter API",
    ],
    links: [
      { label: "Live demo", href: "https://saumya13.github.io/model-arena/" },
      { label: "GitHub", href: "https://github.com/saumya13/model-arena" },
    ],
    hero: [
      {
        src: "/work/model-arena/recording1.jpg",
        video: "/work/model-arena/recording1.mp4",
        alt: "A screen recording of Model-Arena: a prompt is run against several models and their answers stream in side by side.",
        caption: "Model-Arena landing page, animation made using Motion",
      },
    ],
    problems: {
      heading: "The problem",
      points: [
        "OpenRouter shows rankings, pricing, latency for all AI models, but all of it is an average across everyone's requests.",
        "An average can't tell which model is best for my prompt. For images it is worse, because quality is something you have to look at, and no table of numbers captures it.",
        "So to compare, I generated the same prompt in several places and compared the output, time and cost myself.",
        "What I wanted was simple: one place where I can prompt several models and see the outputs next to each other along with the speed, cost and tokens measured for that exact request.",
      ],
    },
    did: [
      {
        icon: "compass",
        title: "Product direction",
        body: "I defined the job to be done in one sentence and cut everything that did not serve it.",
      },
      {
        icon: "cursor",
        title: "Interaction design",
        body: "I designed the states that matter: connecting, streaming, done, and each way a request can fail.",
      },
      {
        icon: "eye",
        title: "Visual design",
        body: "A quiet, paper-white interface with a primary and secondary color, monospaced font that line up.",
      },
      {
        icon: "chart",
        title: "Data visualisation",
        body: "Trend charts with a colour-blind-safe palette, where each model keeps its colour across runs.",
      },
      {
        icon: "code",
        title: "Front-end engineering",
        body: "React 19, TypeScript, Zustand and a streaming reader",
      },
      {
        icon: "plug",
        title: "API integration",
        body: "OpenRouter model catalog, parallel streaming and usage data turned into cost.",
      },
    ],
    solution: {
      intro:
        "Model-Arena runs one prompt against up to four models and lets you read the results side by side. I held the design to five principles.",
      principles: [
        "Every answer sits in an identical card with its metrics in the same strip, so your eye compares instead of hunting.",
        "Trends, not just snapshots. As you run more prompts, latency, cost and tokens are charted across runs, so you can see which model is consistently fast, cheap or chatty.",
        "Colour is identity. A model gets a colour the first time it appears and keeps it for the whole session.",
        "One model failing never takes the others down with it.",
        "Your key stays with you. It is stored only in your browser and sent only to OpenRouter.",
      ],
    },
    flows: [
      {
        title: "Choosing models",
        problem:
          "A catalog of 300+ models buries the ones people actually compare.",
        solution:
          "Pin the main providers to the top, and cap a run at four so the screen stays readable.",
        body: "The model picker loads the live catalog from OpenRouter, including each model's per-token pricing and whether it can output images. A Text / Image switch and a search box narrow the list, and the models you pick appear as chips with a 4/4 counter, so you always know how much room is left.",
        shots: [
          {
            src: "/work/model-arena/choosing-models.jpg",
            alt: "The Model-Arena picker with four image models chosen, a Text and Image switch, a search box and the prompt box beside it.",
            caption:
              "Pick up to four models, filter by text or image, and write one prompt.",
          },
        ],
      },
      {
        title: "Comparing answers",
        problem:
          "Four tabs and a stopwatch make a fair comparison nearly impossible.",
        solution:
          "Stream every model in parallel into identical cards with a fixed metrics strip.",
        body: "Each comparison fires one streaming request per model over Server-Sent Events, so tokens appear in every card as they arrive. Each card owns its own state and abort controller, which means a rate limit on one model shows up in that card while the others keep going. I wrote a small SSE reader that skips OpenRouter's keep-alive comment lines and stops cleanly at the end marker.",
        shots: [
          {
            src: "/work/model-arena/cat.jpg",
            alt: "Three Nano Banana image models painting an orange cat on a windowsill in the style of Van Gogh, with latency, tokens and cost under each.",
            caption:
              "A cat on a windowsill, painted like Van Gogh. Same prompt, three models: from 6.42s to 17.92s, and about a tenfold spread in cost.",
          },
          {
            src: "/work/model-arena/galaxy.jpg",
            alt: "Three Nano Banana image models painting a fractal spiral galaxy in watercolour, with latency, tokens and cost under each.",
            caption:
              "A fractal spiral galaxy in watercolour: each model reads the prompt differently, and the cost strip shows what each interpretation cost.",
          },
        ],
      },
      {
        title: "Tracking across runs",
        problem:
          "A single run says little, because models vary from one request to the next.",
        solution:
          "Chart latency, cost and tokens across runs, with a stable colour for each model.",
        body: "Run the same models on a new prompt and each chart gains another point. The palette has eight colours that I checked for colour-blind contrast, and anything beyond eight folds into grey instead of inventing a ninth hue. Cost is computed from the usage the API reports, tokens times the model's per-token price, and it has unit tests.",
        shots: [
          {
            src: "/work/model-arena/results.jpg",
            alt: "Line charts of latency, cost and tokens across five runs for three models.",
            caption:
              "Trend charts show which model is consistently fast, cheap or chatty.",
          },
        ],
      },
      {
        title: "Bringing your own key",
        problem: "Pasting an API key into a website asks for a lot of trust.",
        solution:
          "No backend at all. The key lives only in local storage and goes only to OpenRouter, and the key screen says so plainly.",
        body: "There is no server in the app that could see, log or forward the key, so the privacy claim is something you can verify rather than something you have to take on faith. As a side effect, the whole project is a static site that is free to host.",
        shots: [],
      },
    ],
    impact: {
      heading: "Impact and what I learned",
      points: [
        {
          lead: "It surfaced a real finding.",
          body: "In one image-generation run, the same prompt cost $0.0017 on one model and $0.0697 on another, about 40 times more, and took 5 times less time. No leaderboard would have shown me that.",
        },
        {
          lead: "Learning OpenRouter API integration.",
          body: "I learned how to work with the OpenRouter API end to end: fetching the model catalog and pricing, streaming responses from several models at once over Server-Sent Events, handling errors per model, and turning the usage data into cost.",
        },
        {
          lead: "Deployment on GitHub Pages.",
          body: "It is a static site with no server and no database, so it deploys straight to GitHub Pages.",
        },
      ],
      closing:
        "The part I enjoyed most was the design work around the data: deciding what earns a place on screen, and making four live streams feel calm instead of chaotic.",
    },
    nextProject: "what-can-i-cook",
  },
  {
    slug: "what-can-i-cook",
    title: "ChefMate",
    headline: "Designing an AI chef that starts from your fridge.",
    intro:
      "Recipe sites start from a dish. But in reality, I start from whatever is in the fridge because finding a recipe online often means discovering I am missing three ingredients.So I built ChefMate: add the ingredients you have, pick a couple of preferences, and get a complete recipe with an AI-generated photo of the finished dish. I designed the flows and the interface, then built it full-stack: a React front end, a NodeJS backend, OpenRouter for the AI, and Supabase for the database and images.",
    spec: [
      { label: "Role", value: "Designer and developer (solo)" },
      {
        label: "Context",
        value: "Personal project, built out of my own need",
      },
      {
        label: "Scope",
        value:
          "Product design · Interface · Full-stack development · Prompt design · AI integration",
      },
    ],
    built: [
      "React 19",
      "TypeScript",
      "Vite",
      "Tailwind CSS v4",
      "React Router",
      "Express 5",
      "Drizzle ORM",
      "Supabase Storage",
      "OpenRouter SDK",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/saumya13/what-can-i-cook" },
    ],
    hero: [
      {
        src: "/work/what-can-i-cook/landing.jpg",
        video: "/work/what-can-i-cook/landing.mp4",
        alt: "The ChefMate landing page: a headline, two buttons, and floating ingredients that gather into a dish when hovered.",
        caption:
          "The landing page: hover the ingredients and they gather, click and a dish is revealed.",
      },
    ],
    problems: {
      heading: "The problem",
      points: [
        "Recipe sites start from a dish. I start from whatever is in the fridge, so I would search, then find I was missing three ingredients.",
        "A general chatbot can improvise from a list, but I wanted something built for the job: a consistent recipe layout, exact steps and a photo of what I was aiming for.",
        "Good home cooking depends on details: quantities, temperatures, times, and how the food should look when it is ready.",
        "What I wanted was simple: add what I have, tap a couple of preferences, get something I can cook tonight, and keep the ones I liked.",
      ],
    },
    did: [
      {
        icon: "compass",
        title: "Product direction",
        body: "I flipped the usual flow: start from the ingredients you have, not the dish you want.",
      },
      {
        icon: "cursor",
        title: "Interaction design",
        body: "I designed the input, the wait while the AI works, and the saved-recipe states.",
      },
      {
        icon: "eye",
        title: "Visual design",
        body: "Warm editorial type, a single orange accent, and generated food photography doing the rest.",
      },
      {
        icon: "pen",
        title: "Prompt design",
        body: "A strict JSON contract for the recipe, and art direction for the dish photo.",
      },
      {
        icon: "code",
        title: "Full-stack engineering",
        body: "React on the front, Express and Drizzle on the back, Postgres and storage on Supabase.",
      },
      {
        icon: "layers",
        title: "AI integration",
        body: "Two models chained through the OpenRouter SDK, with graceful fallbacks.",
      },
    ],
    solution: {
      intro:
        "ChefMate turns a short list of ingredients into a recipe you can follow. I held the design to five principles.",
      principles: [
        "Start from what you have. The input is the hero of the page, and it is quick and forgiving.",
        "Make the wait feel intentional. Generating a recipe and a photo takes a while, so the loading state is designed, not hidden.",
        "A recipe you can follow with messy hands. Ingredients beside the photo, and every step its own clear paragraph with exact quantities and cues.",
        "Fail gracefully. If the photo fails, the recipe still arrives.",
        "Keep what you like. One tap saves a recipe into your own cookbook.",
      ],
    },
    flows: [
      {
        title: "Adding ingredients",
        problem:
          "Typing out a long ingredient list is the slowest part of asking for a recipe.",
        solution:
          "Quick-add chips for staples, a running count, and two one-tap preferences.",
        body: "Chips like Onions, Garlic, Tomatoes and Tofu add in one tap. The app tells you how many more ingredients it needs (at least three), and the preferences are one tap each: vegetarian, and mild, medium or hot. Floating ingredient bubbles around the form keep the page alive without competing with it.",
        shots: [
          {
            src: "/work/what-can-i-cook/ingredients.jpg",
            video: "/work/what-can-i-cook/ingredients.mp4",
            alt: "Adding onions and garlic with the quick-add chips, with the ingredient count and spice level updating.",
            caption: "Quick-add chips, a running count, and spice level.",
          },
        ],
      },
      {
        title: "Generating a recipe",
        problem:
          "Creating a recipe and a photo takes a while, and an empty screen feels broken.",
        solution:
          "Design the wait with an animated wok and a recipe-shaped skeleton, then show the whole recipe.",
        body: 'While the AI works, a small wok lifts its lid and lets steam curl out on a  loop, with a skeleton of the recipe layout behind it. The finished recipe puts the ingredients beside the photo, and each step is its own paragraph starting with a bold "Step 1:", with exact quantities, temperatures, times and visual cues like "until golden brown".',
        shots: [
          {
            src: "/work/what-can-i-cook/generate.jpg",
            video: "/work/what-can-i-cook/generate.mp4",
            alt: "Generating a recipe: the ingredient list, the loading animation, then the finished recipe.",
            caption: "From ingredient list to finished recipe.",
          },
        ],
      },
      {
        title: "Keeping a cookbook",
        problem: "A great recipe is lost the moment you leave the page.",
        solution:
          "Save it with one tap and it joins a grid of image cards you can reopen or delete.",
        body: "Saved recipes are stored in Postgres through Drizzle, and their photos in Supabase Storage. The cookbook is a grid of cards, each with its photo, a one-line description and a View Recipe button.",
        shots: [
          {
            src: "/work/what-can-i-cook/cookbook-grid.jpg",
            alt: "The cookbook page, headed 'Your personal cookbook, made one meal at a time', with saved recipes as cards showing a photo, title, short description and a View Recipe button.",
            caption: "Saved recipes as a grid of cards, each with View Recipe and delete.",
          },
        ],
      },
      {
        title: "Chaining two models with OpenRouter",
        problem:
          "I wanted the photo to match the recipe, not look like a generic stock image.",
        solution:
          "Let the recipe model write the brief, and the image model paint it.",
        body: 'Both calls go through the OpenRouter SDK. The first model returns the recipe as JSON, including a short image prompt. The second model draws the dish from that prompt, the image is uploaded to Supabase Storage, and the saved recipe stores its URL. Both model ids live in one config file, so swapping or upgrading a model never touches the route code. The brief is art-directed to look like a phone photo a home cook took of their own dinner, with natural light, a normal plate and a fork in frame, and it bans words like "vibrant", "cinematic" and "studio lighting" that push models towards a glossy, staged look.',
        shots: [],
      },
      {
        title: "Making the AI dependable",
        problem:
          "Language models return messy output, and image generation is slow and sometimes fails.",
        solution:
          "A strict contract, a tolerant parser, and a recipe that never waits on the photo.",
        body: "The prompt demands one JSON object with fixed keys and specifies the exact markdown shape for the steps. The parser strips code fences and stray text, repairs over-escaped line breaks, and checks every field is the right type. Image generation has a 30 second timeout and can never block the recipe: if it fails, the recipe still arrives and the interface shows a placeholder. Keys stay on the server, requests are validated, and the server refuses to start if a required key is missing.",
        shots: [],
      },
    ],
    impact: {
      heading: "Impact and what I learned",
      points: [
        {
          lead: "A full-stack AI product, end to end.",
          body: "React, Express, Postgres, file storage and two AI models, with secrets kept on the server.",
        },
        {
          lead: "Most of the quality is in the contract around the model.",
          body: "The prompt, the parser, the fallbacks and the loading state did more for how good ChefMate feels than any model change.",
        },
        {
          lead: "Built from a real need.",
          body: "Every decision was checked against one question: does this get me to a dinner I can cook?",
        },
      ],
      closing:
        "The part I enjoyed most was designing the whole path, from a half-empty fridge to a recipe card, including the moments where the AI is slow or wrong.",
    },
    nextProject: "model-arena",
  },
];

export const getArticleStudy = (slug: string | undefined) =>
  articleStudies.find((a) => a.slug === slug);
