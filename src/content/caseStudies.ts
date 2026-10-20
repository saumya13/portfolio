// The detailed write-up for each project, shown at /work/<slug>. Keep the copy in the first person and short: this is
// read by recruiters and hiring managers, so each block should earn its place.

export type Shot = { src: string; alt: string; caption: string }
export type Card = { title: string; body: string }

export type CaseStudy = {
  slug: string
  title: string
  tagline: string
  // The one-paragraph summary under the title.
  summary: string
  role: string
  type: string
  year: string
  stack: string[]
  links: { label: string; href: string }[]
  cover: Shot
  // Big numbers that sum the project up at a glance.
  glance: { value: string; label: string }[]
  need: { heading: string; paragraphs: string[] }
  goals: Card[]
  // The design process, step by step.
  process: { heading: string; intro: string; steps: Card[] }
  gallery: Shot[]
  build: {
    heading: string
    intro: string
    // A left-to-right flow of what talks to what.
    flow: string[]
    openrouter: { heading: string; paragraphs: string[]; bullets: string[] }
  }
  challenges: { problem: string; solution: string }[]
  takeaway: { quote: string; body: string }
  next: string[]
  // The slug of the project to link to at the bottom.
  nextProject: string
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'model-arena',
    title: 'Model-Arena',
    tagline: 'Pit AI models against each other and let latency, cost and tokens settle the score.',
    summary:
      'Run one prompt against up to four AI models at once, watch their answers stream in side by side, and see exactly what each one cost and how long it took. It runs entirely in the browser, with no backend, on top of the OpenRouter API.',
    role: 'Product design, front-end, API integration',
    type: 'Personal project, end to end',
    year: '2026',
    stack: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'Zustand', 'Recharts', 'Motion', 'Vitest', 'OpenRouter API'],
    links: [
      { label: 'Live demo', href: 'https://saumya13.github.io/model-arena/' },
      { label: 'GitHub', href: 'https://github.com/saumya13/model-arena' },
    ],
    cover: {
      src: '/work/model-arena/battle.jpg',
      alt: 'Three image models answering the same prompt side by side, each card showing latency, tokens and cost.',
      caption: 'Same prompt, three models, three very different bills.',
    },
    glance: [
      { value: '4', label: 'models compared side by side, streaming in parallel' },
      { value: '300+', label: 'models available through one OpenRouter catalog' },
      { value: '0', label: 'servers: it all runs in the browser, your key never leaves it' },
      { value: '3', label: 'numbers per answer: latency, tokens and cost' },
    ],
    need: {
      heading: 'I kept asking: which model should I actually use?',
      paragraphs: [
        'Every time I built something with an AI model I hit the same question. Leaderboards give averages, not answers for my own prompts, and pricing pages don\'t tell you how long a reply really takes or what a real request costs.',
        'My workaround was four browser tabs, the same prompt pasted four times and a stopwatch. It was slow, it was easy to get wrong, and I never ended up with numbers I could compare. Model-Arena is the tool I wished I had.',
      ],
    },
    goals: [
      { title: 'Design a dense interface that stays calm', body: 'A lot of data on one screen, and still easy to read at a glance.' },
      { title: 'Learn OpenRouter properly', body: 'One API for hundreds of models: catalog, pricing, streaming and usage.' },
      { title: 'Handle real-time data well', body: 'Parallel streams, partial failures and cancellation without a janky UI.' },
    ],
    process: {
      heading: 'One sentence, five design decisions',
      intro: 'I started from one sentence and made every screen answer to it: run one prompt, read the answers side by side, know what each one cost.',
      steps: [
        {
          title: 'Same card, same place',
          body: 'Every answer sits in an identical card with the metrics (latency, tokens in, tokens out, cost) in the same strip at the bottom. Your eye compares instead of hunting. Model ids and numbers are set in a monospace so digits line up.',
        },
        {
          title: 'A quiet interface with one signal colour',
          body: 'A paper-white surface, near-black ink, hairline borders, and a single purple used only where something is live or selected. Colour is reserved for meaning, so the content stays the loudest thing on the page.',
        },
        {
          title: 'Colour as identity in the charts',
          body: 'A model gets a colour the first time it appears and keeps it for the whole session, even if a later run drops it. The 8-colour palette was checked for colour-blind contrast, and anything beyond eight folds into grey rather than inventing a ninth hue.',
        },
        {
          title: 'A hero that explains itself',
          body: 'An interactive grid and a word that cycles through Run, Track, Compare tell you what the tool does before you read a sentence. Both respect reduced-motion settings.',
        },
        {
          title: 'Honest states for everything that can go wrong',
          body: 'Connecting, streaming, done, and clear messages for an invalid key, a rate limit or a model that is down. One model failing never takes the other three with it.',
        },
      ],
    },
    gallery: [
      {
        src: '/work/model-arena/results.jpg',
        alt: 'Line charts of latency, cost and tokens across five runs for three models.',
        caption: 'Trend charts across runs show which model is consistently fast, cheap or chatty.',
      },
      {
        src: '/work/model-arena/hero.jpg',
        alt: 'The Model-Arena landing hero with an interactive dotted grid.',
        caption: 'The hero: an interactive grid and a headline that explains the tool in three words.',
      },
    ],
    build: {
      heading: 'How it is built',
      intro:
        'A single-page React app with no backend. The browser talks straight to OpenRouter, which keeps the project simple to run, free to host, and means there is nothing in the middle that could see anyone\'s API key.',
      flow: ['Your browser', 'OpenRouter API', '300+ models'],
      openrouter: {
        heading: 'How I used OpenRouter',
        paragraphs: [
          'OpenRouter puts hundreds of models behind one API shape. That turned "compare four models" into a loop over four model ids, which is what made the whole project small enough to build properly.',
        ],
        bullets: [
          'The model catalog comes from the public models endpoint, including each model\'s per-token pricing, context length and whether it can output images.',
          'Each comparison fires one streaming chat request per model, in parallel, over Server-Sent Events, so tokens appear in every card as they arrive.',
          'I wrote a small SSE reader as an async generator. It skips OpenRouter\'s keep-alive comment lines, which are valid SSE but not JSON, and stops cleanly at the end marker.',
          'Cost is computed from the usage the API reports: tokens times the model\'s per-token price, split into prompt and completion. It has unit tests.',
          'Requests are cancellable, so leaving the page mid-stream aborts everything cleanly.',
        ],
      },
    },
    challenges: [
      {
        problem: 'The model picker was unusable with 300+ entries',
        solution: 'I pinned the providers people actually compare (OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek) to the top and floated image-capable models above them so they are not lost in the alphabet.',
      },
      {
        problem: 'Some "auto-router" models report a price of -1',
        solution: 'The real model changes per request, so they cannot be cost-compared. I filter them out rather than show a misleading number.',
      },
      {
        problem: 'Four streams at once means four ways to fail',
        solution: 'Each card owns its own state and abort controller. A rate limit on one model shows in that card and the rest keep streaming.',
      },
      {
        problem: 'Asking people to paste an API key into a website',
        solution: 'The key lives only in the browser\'s local storage and is sent only to OpenRouter. There is no backend to log it, and the app says so on the key screen.',
      },
    ],
    takeaway: {
      quote: 'The same prompt cost $0.0017 on one model and $0.0697 on another, about 40 times more, and took 42 seconds instead of under 4.',
      body: 'That was from one of my own image-generation runs, and no leaderboard would have shown it. It is exactly the kind of thing the tool exists to surface.',
    },
    next: ['Save run history so comparisons survive a reload', 'Shareable links to a run', 'Prompt presets for common tasks', 'A "which answer was best?" vote that sits next to the cost'],
    nextProject: 'what-can-i-cook',
  },
  {
    slug: 'what-can-i-cook',
    title: 'ChefMate',
    tagline: 'List what is in your kitchen. Get a recipe you can actually cook, with a photo of the dish.',
    summary:
      'ChefMate turns the random ingredients in your fridge into a complete recipe, writes it up step by step, generates a photo of the finished dish, and lets you save it to your own cookbook. It is a full-stack app: a React front end, an Express API, OpenRouter for the AI, and Supabase for data and images.',
    role: 'Product design, full-stack development',
    type: 'Personal project, end to end',
    year: '2026',
    stack: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Express 5', 'Drizzle ORM', 'Postgres (Supabase)', 'Supabase Storage', 'OpenRouter SDK'],
    links: [{ label: 'GitHub', href: 'https://github.com/saumya13/what-can-i-cook' }],
    cover: {
      src: '/work/what-can-i-cook/recipe-result.jpg',
      alt: 'A generated recipe for a spicy tomato and onion curry, with an ingredient list and an AI-generated photo of the dish.',
      caption: 'A generated recipe: ingredients, a dish photo and detailed steps.',
    },
    glance: [
      { value: '2', label: 'AI models chained: one writes the recipe, one photographs it' },
      { value: '3', label: 'tiers: React app, Express API and Supabase' },
      { value: '3+', label: 'ingredients is all it needs to get started' },
      { value: '0', label: 'blocking errors if the image fails: the recipe still arrives' },
    ],
    need: {
      heading: 'Nights with random ingredients and no idea what to make',
      paragraphs: [
        'Recipe sites start from a dish. I start from a fridge: half an onion, some tomatoes, a tin of something. Searching for ideas meant scrolling past life stories to find a recipe that needed three things I didn\'t have.',
        'So I flipped the problem. You tell the app what you have, and it works out what to make, using as much of it as it sensibly can and adding as little as possible.',
      ],
    },
    goals: [
      { title: 'Design around a real constraint', body: 'The input is what is in your kitchen, so the whole flow is built around adding ingredients quickly.' },
      { title: 'Build a proper full-stack AI feature', body: 'Prompt design, structured output, image generation, storage and a database, not just a chat box.' },
      { title: 'Make AI feel trustworthy', body: 'Predictable output, graceful failure and a wait that feels intentional.' },
    ],
    process: {
      heading: 'Designing the brief as well as the screen',
      intro: 'I treated the AI as a collaborator with a brief, and spent as much time designing what it should return as what the screen should show.',
      steps: [
        {
          title: 'Start from ingredients, not a dish',
          body: 'The input is the hero. Quick-add chips for common staples cut the typing, a minimum of three ingredients keeps the results good, and two preferences (vegetarian, spice level) cover most of what changes a recipe.',
        },
        {
          title: 'Make the wait feel intentional',
          body: 'Generating a recipe and a photo takes a while, so I designed the wait instead of hiding it. A small wok loader lifts its lid and lets steam curl out on a 3.6 second loop, with a recipe-shaped skeleton behind it, and the whole thing announces itself to screen readers.',
        },
        {
          title: 'A moment of delight on the home page',
          body: 'Hover the ingredient bowl and the ingredients float in and gather; click it to reveal a dish. It is a tiny piece of motion that says what the product does without a paragraph.',
        },
        {
          title: 'Warm, editorial typography',
          body: 'A serif (Newsreader) for headings and recipe names, Inter for everything functional, and a single orange accent. The generated food photos bring the rest of the colour.',
        },
        {
          title: 'A recipe you can follow with messy hands',
          body: 'Ingredients sit beside the photo, and every step is its own paragraph starting with a bold "Step 1:". The prompt asks for exact quantities, temperatures, times and visual cues like "until golden brown", rather than one-line instructions.',
        },
        {
          title: 'A personal cookbook',
          body: 'Save a recipe and it joins a grid of image cards you can revisit or delete. It turns a one-off tool into something worth coming back to.',
        },
      ],
    },
    gallery: [
      {
        src: '/work/what-can-i-cook/cookbook-grid.jpg',
        alt: 'A grid of saved recipe cards, each with a dish photo, title and short description.',
        caption: 'The cookbook: every saved recipe becomes a card with its own generated photo.',
      },
      {
        src: '/work/what-can-i-cook/hero.jpg',
        alt: 'The ChefMate landing page with the headline "Your AI chef" and two buttons.',
        caption: 'The landing page: one idea, two ways in.',
      },
    ],
    build: {
      heading: 'How it is built',
      intro:
        'A React single-page app talks to an Express API. The API calls OpenRouter for the AI and Supabase for the database and image storage. Secrets stay on the server and the app refuses to boot if one is missing.',
      flow: ['React app', 'Express API', 'OpenRouter (text, then image)', 'Supabase (Postgres and Storage)'],
      openrouter: {
        heading: 'How I used OpenRouter',
        paragraphs: [
          'Two models, one SDK. A text model writes the recipe as structured JSON. One of the fields it returns is a brief for an image model, which then paints the finished dish. In effect the first model is the art director for the second.',
        ],
        bullets: [
          'The recipe prompt demands a single JSON object with fixed keys (name, description, ingredients, nutrition, instructions, cuisine, cook time, servings and an image prompt) and specifies the exact markdown shape for the steps.',
          'The image brief is art-directed to look like a photo a good home cook took of their own dinner: natural light, a normal plate, a fork in frame. It also bans the words that make images look glossy and AI-made, such as "vibrant", "cinematic" and "studio lighting".',
          'Both model ids live in one config file, so swapping or upgrading a model never touches the route code.',
          'The generated image is uploaded to Supabase Storage and the saved recipe stores its public URL.',
        ],
      },
    },
    challenges: [
      {
        problem: 'Language models don\'t always return clean JSON',
        solution: 'I wrote a tolerant parser: it strips code fences, ignores stray text outside the braces, repairs over-escaped line breaks, then checks every field is the right type and fails loudly if not.',
      },
      {
        problem: 'Image generation is slow and sometimes fails',
        solution: 'It has a 30 second timeout and is never allowed to block the recipe. If it fails the recipe still returns and the interface shows a placeholder.',
      },
      {
        problem: 'Generated food photos look obviously fake',
        solution: 'I rewrote the image brief as art direction (a phone photo, home lighting, a realistic portion) and banned the vocabulary that pushes the model towards a polished, staged look.',
      },
      {
        problem: 'Keeping keys and data safe',
        solution: 'The OpenRouter key and the Supabase service key live only in the backend\'s environment, the server validates incoming requests, and a missing variable stops the server at startup instead of failing later.',
      },
    ],
    takeaway: {
      quote: 'Most of the quality in an AI product comes from the contract around the model, not the model itself.',
      body: 'The prompt, the parser, the fallbacks and the loading state did more for how good ChefMate feels than any model upgrade. That is the part I enjoy most: the design and engineering around the AI that make it dependable.',
    },
    next: ['Stream the recipe as it is written', 'Tweak and regenerate ("make it spicier", "no oven")', 'Remember what is in the pantry', 'Accounts, so each person gets their own cookbook'],
    nextProject: 'model-arena',
  },
]

export const getCaseStudy = (slug: string | undefined) => caseStudies.find((c) => c.slug === slug)
