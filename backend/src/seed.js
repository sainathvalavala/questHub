const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const Question = require('./models/Question');
const Answer = require('./models/Answer');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quizz';
    console.log(`Connecting to database: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('Database connected successfully for seeding.');

    // 1. Clear existing collections
    console.log('Clearing old collections...');
    await User.deleteMany({});
    await Question.deleteMany({});
    await Answer.deleteMany({});
    console.log('Collections cleared.');

    // 2. Create mock users
    console.log('Generating mock users...');
    const salt = await bcrypt.genSalt(10);
    const pw = await bcrypt.hash('password123', salt);

    const users = await User.create([
      {
        username: 'admin',
        email: 'admin@test.com',
        password: pw,
        role: 'admin',
        points: 420,
        stats: { questionsCount: 1, answersCount: 6, upvotesReceived: 18 }
      },
      {
        username: 'dev_sarah',
        email: 'sarah@test.com',
        password: pw,
        role: 'user',
        points: 310,
        stats: { questionsCount: 3, answersCount: 4, upvotesReceived: 12 }
      },
      {
        username: 'fullstack_mike',
        email: 'mike@test.com',
        password: pw,
        role: 'user',
        points: 185,
        stats: { questionsCount: 2, answersCount: 2, upvotesReceived: 5 }
      },
      {
        username: 'css_wizard',
        email: 'wizard@test.com',
        password: pw,
        role: 'user',
        points: 240,
        stats: { questionsCount: 2, answersCount: 3, upvotesReceived: 9 }
      },
      {
        username: 'react_noob',
        email: 'noob@test.com',
        password: pw,
        role: 'user',
        points: 75,
        stats: { questionsCount: 3, answersCount: 0, upvotesReceived: 0 }
      },
      {
        username: 'js_ninja',
        email: 'ninja@test.com',
        password: pw,
        role: 'user',
        points: 350,
        stats: { questionsCount: 1, answersCount: 5, upvotesReceived: 15 }
      }
    ]);

    const [adminUser, sarah, mike, wizard, noob, ninja] = users;
    console.log(`Created ${users.length} mock users.`);

    // 3. Create questions across HTML, CSS, JavaScript, React
    console.log('Creating mock questions...');

    // ── HTML Questions ──
    const q1 = await Question.create({
      asker: noob._id,
      title: 'What is the difference between <div> and <section> in HTML5?',
      description: `I keep using <div> for everything but my professor says I should use semantic HTML elements like <section>, <article>, <main>, etc. When exactly should I use <section> over a plain <div>? Does it affect SEO or accessibility?`,
      tags: ['HTML'],
      status: 'solved'
    });

    const q2 = await Question.create({
      asker: mike._id,
      title: 'How do I make an HTML form that validates email input without JavaScript?',
      description: `Building a simple contact form. I want the browser to check that the email field is actually a valid email before submitting. I know JavaScript can do this, but is there a pure HTML way? Also, how do I make a field required?`,
      tags: ['HTML'],
      status: 'unsolved'
    });

    // ── CSS Questions ──
    const q3 = await Question.create({
      asker: sarah._id,
      title: 'Flexbox vs Grid: When should I use which?',
      description: `I understand the basics of both CSS Flexbox and Grid but I always get confused about which one to pick for a given layout. Can someone give me a practical rule of thumb? For example, if I'm building a navbar vs a full page layout vs a card grid — which is best for each?`,
      tags: ['CSS'],
      status: 'solved'
    });

    const q4 = await Question.create({
      asker: noob._id,
      title: 'How to center a div both vertically and horizontally in CSS?',
      description: `I know this sounds like a meme question but I genuinely can't get it to work consistently. I've tried margin: auto, text-align: center, and transform tricks. What's the most reliable modern method that works across browsers?`,
      tags: ['CSS'],
      status: 'solved'
    });

    const q5 = await Question.create({
      asker: wizard._id,
      title: 'How do I create a glassmorphism card effect with pure CSS?',
      description: `Want to create that frosted glass card look that's trending in modern UI designs. I've seen it uses backdrop-filter but I'm not sure about the exact values for background, blur, and border to make it look premium. Any working snippet?`,
      tags: ['CSS'],
      status: 'unsolved'
    });

    // ── JavaScript Questions ──
    const q6 = await Question.create({
      asker: sarah._id,
      title: 'What is the difference between let, const, and var in JavaScript?',
      description: `I started learning JavaScript and the tutorials use let and const but older Stack Overflow answers use var everywhere. What's the actual difference? When should I use each one? I heard var has hoisting issues — can someone explain with examples?`,
      tags: ['JavaScript'],
      status: 'solved'
    });

    const q7 = await Question.create({
      asker: mike._id,
      title: 'How do JavaScript Promises work? async/await vs .then() chaining?',
      description: `I'm trying to fetch data from an API and I see two patterns everywhere:\n\n1. fetch().then().then().catch()\n2. async function with await\n\nAre they doing the same thing? Which one should I prefer in 2024+? And how does error handling differ between them?`,
      tags: ['JavaScript'],
      status: 'unsolved'
    });

    const q8 = await Question.create({
      asker: noob._id,
      title: 'Why does setTimeout(fn, 0) not execute immediately in JavaScript?',
      description: `I wrote setTimeout(() => console.log("hello"), 0) and expected it to run instantly since the delay is 0ms. But it runs AFTER other synchronous code. Why? Something about an event loop? Can someone explain this simply?`,
      tags: ['JavaScript'],
      status: 'unsolved'
    });

    const q9 = await Question.create({
      asker: wizard._id,
      title: 'How to deep clone an object in JavaScript without libraries?',
      description: `Using the spread operator {...obj} only does a shallow copy. If I have nested objects, changes to the clone still affect the original. What's the cleanest way to do a true deep clone in modern JavaScript without lodash?`,
      tags: ['JavaScript'],
      status: 'solved'
    });

    // ── React Questions ──
    const q10 = await Question.create({
      asker: sarah._id,
      title: 'What is the difference between useEffect and useLayoutEffect in React?',
      description: `I've been using useEffect for everything but I just discovered useLayoutEffect. The React docs say it fires synchronously after DOM mutations. When would I actually need useLayoutEffect over useEffect? Can someone give a real-world scenario where using the wrong one causes bugs?`,
      tags: ['React'],
      status: 'unsolved'
    });

    const q11 = await Question.create({
      asker: adminUser._id,
      title: 'How to prevent unnecessary re-renders in React with useMemo and useCallback?',
      description: `My React app feels sluggish. I have a parent component that re-renders frequently and it causes all child components to re-render too. I've heard useMemo and useCallback can help but I'm confused about:\n\n1. When to use useMemo vs useCallback\n2. When NOT to use them (premature optimization)\n3. How React.memo fits into this`,
      tags: ['React'],
      status: 'unsolved'
    });

    const q12 = await Question.create({
      asker: mike._id,
      title: 'How to handle protected routes in React Router v6?',
      description: `Building a MERN app and I need certain pages (like /dashboard, /profile) to only be accessible by logged-in users. If they're not authenticated, redirect to /login. What's the cleanest pattern for this in React Router v6? I've seen wrapper components and outlet-based approaches.`,
      tags: ['React'],
      status: 'solved'
    });

    console.log('Created 12 questions.');

    // 4. Create answers
    console.log('Creating answers...');

    // ── A1: Answer to Q1 (HTML semantic elements) by ninja — Best Answer
    const a1 = await Answer.create({
      responder: ninja._id,
      content: `Great question! Here's the key difference:

**<div>** is a generic container with NO semantic meaning. Screen readers and search engines get zero context from it.

**<section>** represents a thematic grouping of content, typically with a heading. Use it when:
- The content forms a logical section (e.g., "About Us", "Features", "Pricing")
- It would make sense as an entry in a table of contents

**Rule of thumb:**
- If you'd give it a heading → use <section>
- If it's just for styling/layout → use <div>

Yes, it absolutely helps SEO and accessibility. Google's crawler understands semantic HTML better, and screen readers announce sections to visually impaired users.

Other semantic elements to learn: <article>, <aside>, <header>, <footer>, <nav>, <main>.`,
      upvotes: [noob._id, sarah._id, mike._id, adminUser._id],
      parentQuestion: q1._id,
      isBestAnswer: true
    });
    q1.answers.push(a1._id);
    await q1.save();

    // ── A2: Answer to Q3 (Flexbox vs Grid) by ninja — Best Answer
    const a2 = await Answer.create({
      responder: ninja._id,
      content: `Here's my practical cheat sheet after years of CSS:

**Use Flexbox when:**
- Layout is ONE-dimensional (row OR column)
- Building navbars, button groups, centering single items
- Content size should determine layout

**Use Grid when:**
- Layout is TWO-dimensional (rows AND columns)
- Building full page layouts, card grids, dashboards
- You need precise control over placement

**Quick examples:**
- Navbar links → Flexbox (single row)
- Footer with 4 columns → Grid
- Card grid (3×3) → Grid
- Centering a modal → Flexbox
- Sidebar + main content → Grid

**Pro tip:** They work beautifully together. Use Grid for the page skeleton and Flexbox for components inside grid cells.`,
      upvotes: [sarah._id, wizard._id, mike._id, noob._id, adminUser._id],
      parentQuestion: q3._id,
      isBestAnswer: true
    });
    q3.answers.push(a2._id);
    await q3.save();

    // ── A3: Answer to Q4 (centering a div) by wizard — Best Answer
    const a3 = await Answer.create({
      responder: wizard._id,
      content: `The absolute easiest and most reliable way in modern CSS:

\`\`\`css
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
\`\`\`

Or with Grid (even shorter):
\`\`\`css
.parent {
  display: grid;
  place-items: center;
  min-height: 100vh;
}
\`\`\`

Both work in all modern browsers. The Grid method is my personal favorite — just 3 lines!

**Avoid:** The old position: absolute + transform: translate(-50%, -50%) trick. It works but it's fragile and can cause overflow issues.`,
      upvotes: [noob._id, sarah._id, ninja._id],
      parentQuestion: q4._id,
      isBestAnswer: true
    });
    q4.answers.push(a3._id);
    await q4.save();

    // ── A4: Answer to Q6 (let vs const vs var) by adminUser — Best Answer
    const a4 = await Answer.create({
      responder: adminUser._id,
      content: `Here's the breakdown:

| Feature | var | let | const |
|---------|-----|-----|-------|
| Scope | Function-scoped | Block-scoped | Block-scoped |
| Hoisting | Yes (initialized as undefined) | Yes (but not initialized — TDZ) | Yes (but not initialized — TDZ) |
| Re-declaration | Allowed | Not allowed | Not allowed |
| Re-assignment | Allowed | Allowed | Not allowed |

**Modern best practice:**
1. Use \`const\` by default for everything
2. Use \`let\` only when you KNOW the value will change (loop counters, accumulators)
3. Never use \`var\` — it's legacy and causes subtle hoisting bugs

Example of var's problem:
\`\`\`js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Prints: 3, 3, 3 (not 0, 1, 2!)

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Prints: 0, 1, 2 ✅
\`\`\``,
      upvotes: [sarah._id, mike._id, ninja._id, wizard._id],
      parentQuestion: q6._id,
      isBestAnswer: true
    });
    q6.answers.push(a4._id);
    await q6.save();

    // ── A5: Answer to Q9 (deep clone) by adminUser — Best Answer
    const a5 = await Answer.create({
      responder: adminUser._id,
      content: `In modern JavaScript (2024+), the cleanest native way is:

\`\`\`js
const deepClone = structuredClone(originalObject);
\`\`\`

That's it! \`structuredClone()\` is a built-in global function supported in all modern browsers and Node.js 17+. It handles nested objects, arrays, Maps, Sets, Dates, RegExp, and even circular references.

**What it DOESN'T clone:** Functions, DOM nodes, class prototype chains.

Before structuredClone existed, people used:
\`\`\`js
const clone = JSON.parse(JSON.stringify(obj));
\`\`\`
But this breaks with undefined values, functions, Dates, and circular refs. Avoid it.`,
      upvotes: [wizard._id, ninja._id, sarah._id],
      parentQuestion: q9._id,
      isBestAnswer: true
    });
    q9.answers.push(a5._id);
    await q9.save();

    // ── A6: Answer to Q12 (React protected routes) by ninja — Best Answer
    const a6 = await Answer.create({
      responder: ninja._id,
      content: `Here's the cleanest pattern I use in all my React Router v6 projects:

\`\`\`jsx
// ProtectedRoute.jsx
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

// App.jsx
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } />
</Routes>
\`\`\`

**Key points:**
1. The wrapper component checks auth context
2. \`replace\` in Navigate prevents the login page from appearing in browser history
3. Handle the loading state to avoid flash of login page while checking tokens
4. For admin routes, just add a role check inside the wrapper`,
      upvotes: [mike._id, sarah._id, adminUser._id],
      parentQuestion: q12._id,
      isBestAnswer: true
    });
    q12.answers.push(a6._id);
    await q12.save();

    // ── A7: Extra answer on Q7 (Promises) by adminUser — not best
    const a7 = await Answer.create({
      responder: adminUser._id,
      content: `Both .then() chaining and async/await do the same thing under the hood — they handle Promises. async/await is just syntactic sugar.

**Use async/await** (recommended for most cases):
\`\`\`js
try {
  const res = await fetch('/api/data');
  const data = await res.json();
  console.log(data);
} catch (err) {
  console.error('Failed:', err);
}
\`\`\`

It reads like synchronous code, and error handling with try/catch is cleaner.

**Use .then()** when you need to fire-and-forget or chain in a non-async context. But for 99% of cases in 2024, just use async/await.`,
      upvotes: [mike._id, noob._id],
      parentQuestion: q7._id,
      isBestAnswer: false
    });
    q7.answers.push(a7._id);
    await q7.save();

    // ── A8: Extra answer on Q5 (glassmorphism) by wizard — not best
    const a8 = await Answer.create({
      responder: sarah._id,
      content: `Here's a working glassmorphism snippet I use in my projects:

\`\`\`css
.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}
\`\`\`

**Key ingredients:**
1. Semi-transparent background (rgba with low alpha)
2. backdrop-filter: blur() for the frosted effect
3. Subtle border for depth
4. Needs a colored/image background BEHIND the card to look good

**Browser support:** Works in Chrome, Edge, Safari, Firefox 103+. Always add the -webkit- prefix for Safari.`,
      upvotes: [wizard._id, ninja._id, adminUser._id],
      parentQuestion: q5._id,
      isBestAnswer: false
    });
    q5.answers.push(a8._id);
    await q5.save();

    // ── A9: Answer to Q8 (setTimeout 0) by ninja — not best
    const a9 = await Answer.create({
      responder: ninja._id,
      content: `This is all about the JavaScript **Event Loop**!

JavaScript is single-threaded. It has:
1. **Call Stack** — runs synchronous code
2. **Web APIs** — handles setTimeout, fetch, etc.
3. **Callback Queue** — stores callbacks waiting to run
4. **Event Loop** — moves callbacks to the stack ONLY when the stack is empty

So when you write setTimeout(fn, 0):
1. fn gets sent to the Web API timer
2. After 0ms, fn moves to the callback queue
3. But it WAITS until ALL synchronous code finishes
4. Then the event loop pushes fn onto the empty call stack

That's why it runs after sync code — the event loop won't touch the queue until the stack is clear. It's not really "0ms delay", it's "run this as soon as you're free."`,
      upvotes: [noob._id, sarah._id],
      parentQuestion: q8._id,
      isBestAnswer: false
    });
    q8.answers.push(a9._id);
    await q8.save();

    console.log('Created 9 answers & linked to questions.');
    console.log('\n✅ Database seeding completed!');
    console.log('-----------------------------------');
    console.log('Login credentials (all passwords: password123):');
    console.log('  admin@test.com    (Admin, 420 pts)');
    console.log('  sarah@test.com    (User,  310 pts)');
    console.log('  mike@test.com     (User,  185 pts)');
    console.log('  wizard@test.com   (User,  240 pts)');
    console.log('  noob@test.com     (User,   75 pts)');
    console.log('  ninja@test.com    (User,  350 pts)');
    console.log('-----------------------------------');

    await mongoose.connection.close();
  } catch (error) {
    console.error(`Error during database seeding: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
