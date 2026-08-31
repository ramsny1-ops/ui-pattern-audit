# UI Anti-Pattern Field Guide

## 60 Visual, Interaction, and Functional Patterns That Make Interfaces Look Generated, Over-Engineered, or Fragile

This handbook is a practical reference for reviewing modern frontend code. It focuses on three failure zones:

1. Visual boilerplate: interfaces that look technically polished but generic.
2. Over-engineered visual systems: interfaces where motion, effects, and abstractions overpower usability.
3. Functional fallout: interfaces that appear complete until real users interact with them.

The goal is not to ban gradients, animation, Tailwind, Shadcn, React, or any other tool. The goal is to identify when a technique becomes a repeated default instead of a deliberate design decision.

Each pattern includes:

- What it looks like
- Typical code fingerprint
- Why it becomes a problem
- Better implementation direction
- Review questions

---

# Chapter 1: The Classic 20

## 1. Purple-to-blue gradient

### What it looks like

A hero, button, logo, background, or call-to-action uses the same purple-to-blue diagonal gradient seen across thousands of templates.

### Code fingerprint

```css
.hero {
  background: linear-gradient(135deg, #7c3aed, #2563eb);
}
```

Tailwind equivalent:

```html
<section class="bg-gradient-to-br from-violet-600 to-blue-600">
```

### Why it becomes a smell

The problem is not the gradient itself. The problem is using it as the default personality of the product. It often hides the absence of a real visual system.

### Better direction

Use a product-specific color system and reserve gradients for a reason such as hierarchy, data visualization, or state.

```css
:root {
  --surface: #0f1115;
  --surface-raised: #171a21;
  --accent: #7c5cff;
  --text: #f5f7fa;
}

.hero {
  background: var(--surface);
  border-bottom: 1px solid #262b35;
}
```

### Review question

If the gradient is removed, does the interface still have a recognizable identity?

---

## 2. Gradient hero text

### What it looks like

The most important headline is transparent text clipped against a gradient.

### Code fingerprint

```css
.hero-title {
  background: linear-gradient(90deg, #a855f7, #3b82f6);
  -webkit-background-clip: text;
  color: transparent;
}
```

Tailwind fingerprint:

```html
<h1 class="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
```

### Why it becomes a smell

It is often used to make ordinary copy feel premium without improving hierarchy or writing quality. It can also hurt readability.

### Better direction

Use scale, weight, spacing, and wording first.

```css
.hero-title {
  max-width: 14ch;
  font-size: clamp(3rem, 8vw, 7rem);
  line-height: 0.92;
  letter-spacing: -0.055em;
  color: #f8fafc;
}
```

---

## 3. Emojis in headings

### What it looks like

Section names rely on emojis as visual anchors instead of a coherent icon or typography system.

### Code fingerprint

```html
<h2>Features</h2>
<h2>Performance</h2>
<h2>Security</h2>
```

The fingerprint is literal Unicode emoji characters inside headings, tabs, cards, or navigation labels.

### Why it becomes a smell

Different operating systems render emojis differently. Their visual weight can overpower the heading, and their style rarely matches the product.

### Better direction

Use text alone or a consistent icon set only where the icon improves comprehension.

```html
<section aria-labelledby="security-heading">
  <h2 id="security-heading">Security</h2>
</section>
```

---

## 4. Inter font everywhere

### What it looks like

Every product uses the same font, weight, and spacing regardless of brand or content type.

### Code fingerprint

```css
html {
  font-family: Inter, system-ui, sans-serif;
}
```

### Why it becomes a smell

Inter is excellent, but universal use without typography decisions makes unrelated products visually converge.

### Better direction

Build a type system based on use cases.

```css
:root {
  --font-ui: "IBM Plex Sans", system-ui, sans-serif;
  --font-code: "IBM Plex Mono", monospace;
}

body {
  font-family: var(--font-ui);
}
```

A system font stack is also a strong choice when performance matters.

---

## 5. Colored border cards

### What it looks like

Cards are differentiated mainly by green, purple, blue, or pink borders.

### Code fingerprint

```html
<article class="rounded-xl border border-purple-500/50 p-6">
```

### Why it becomes a smell

Color becomes decoration rather than meaning. It also makes card collections noisy.

### Better direction

Use shared structure and reserve semantic color for status.

```html
<article class="card">
  <h3>Build status</h3>
  <p class="status status-success">Healthy</p>
</article>
```

```css
.card {
  border: 1px solid #2a2f39;
  background: #171a20;
}

.status-success {
  color: #65d890;
}
```

---

## 6. Glassmorphism cards

### What it looks like

Semi-transparent cards use blur, weak borders, and floating shadows.

### Code fingerprint

```css
.card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
```

Tailwind:

```html
<div class="bg-white/10 backdrop-blur-xl border border-white/10">
```

### Why it becomes a smell

Blur is expensive on some devices, weakens contrast, and is frequently applied where a solid surface would communicate hierarchy better.

### Better direction

```css
.card {
  background: #15181e;
  border: 1px solid #292e38;
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.18);
}
```

---

## 7. Low-contrast dark mode

### What it looks like

Dark gray text sits on slightly darker gray surfaces, often with opacity utilities.

### Code fingerprint

```html
<p class="text-gray-400/60">Secondary information</p>
```

```css
.muted {
  color: rgba(255, 255, 255, 0.38);
}
```

### Why it becomes a smell

The interface may look subtle on the designer's monitor while becoming unreadable on low-quality screens, outdoor displays, or low brightness.

### Better direction

Use measurable contrast. WCAG guidance should be treated as a baseline, not an aesthetic limitation.

```css
:root {
  --bg: #0e1014;
  --text: #f1f4f8;
  --muted: #aab2bf;
}
```

---

## 8. Three icon boxes in a row

### What it looks like

A landing page repeatedly presents exactly three cards with an icon, title, and two lines of text.

### Code fingerprint

```jsx
<div className="grid md:grid-cols-3 gap-6">
  {features.slice(0, 3).map(feature => <FeatureCard key={feature.id} {...feature} />)}
</div>
```

### Why it becomes a smell

The layout is chosen because it fits a template, not because the information naturally forms three equal groups.

### Better direction

Let information density choose the layout.

```css
.feature-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
}
```

---

## 9. Badge above the heading

### What it looks like

Nearly every section starts with a pill-shaped label above the title.

### Code fingerprint

```html
<span class="rounded-full border px-3 py-1 text-xs">NEW PLATFORM</span>
<h2>Everything you need</h2>
```

### Why it becomes a smell

Repeated pre-headings flatten hierarchy because every section receives the same ceremonial treatment.

### Better direction

Use an eyebrow only when it adds context.

```html
<p class="eyebrow">For infrastructure teams</p>
<h2>Trace failures from request to dependency</h2>
```

---

## 10. Lucide icons everywhere

### What it looks like

Every button, heading, card, metric, and navigation item gets an icon from the same icon package.

### Code fingerprint

```jsx
import {
  Sparkles,
  Zap,
  Shield,
  Settings,
  ArrowRight,
  Check,
  Menu
} from "lucide-react";
```

### Why it becomes a smell

Icons stop carrying meaning when nearly every label receives one.

### Better direction

Use icons for navigation, recognition, and compact controls. Use text for content hierarchy.

```jsx
<button aria-label="Open settings">
  <Settings aria-hidden="true" />
</button>

<a href="/billing">Billing</a>
```

---

## 11. Untouched Shadcn UI

### What it looks like

A product visually resembles the default examples because tokens, spacing, radii, and component composition were never adapted.

### Code fingerprint

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
```

The import itself is not the smell. The signal is that default variants, dimensions, colors, and structure are copied unchanged throughout the product.

### Better direction

Create product-level wrappers and tokens.

```tsx
export function PrimaryAction(props) {
  return (
    <Button
      {...props}
      className="h-11 rounded-lg px-5 font-medium tracking-[-0.01em]"
    />
  );
}
```

---

## 12. Fade-in on scroll

### What it looks like

Almost every block starts hidden and becomes visible when entering the viewport.

### Code fingerprint

```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 600ms, transform 600ms;
}
```

```js
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  }
});
```

### Why it becomes a smell

Content becomes artificially delayed. The effect adds motion without communicating state.

### Better direction

Animate only important transitions and support reduced motion.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
```

---

## 13. Cursor-following beam

### What it looks like

A radial glow follows the pointer across a card, hero, or entire page.

### Code fingerprint

```js
window.addEventListener("pointermove", event => {
  document.documentElement.style.setProperty("--x", `${event.clientX}px`);
  document.documentElement.style.setProperty("--y", `${event.clientY}px`);
});
```

```css
body::before {
  background: radial-gradient(
    600px circle at var(--x) var(--y),
    rgb(124 58 237 / 0.18),
    transparent 45%
  );
}
```

### Why it becomes a smell

It continuously repaints, contributes little on touch devices, and can distract from content.

### Better direction

Use hover feedback locally.

```css
.card:hover {
  border-color: #454c59;
  transform: translateY(-1px);
}
```

---

## 14. Buttons fade on hover using opacity only

### Code fingerprint

```css
.button:hover {
  opacity: 0.8;
}
```

Tailwind:

```html
<button class="hover:opacity-80">
```

### Why it becomes a smell

Opacity can make text and focus cues less readable. It is also a weak interaction model.

### Better direction

```css
.button:hover {
  background: #6f52e8;
}

.button:focus-visible {
  outline: 3px solid #a896ff;
  outline-offset: 3px;
}
```

---

## 15. Inconsistent spacing

### Code fingerprint

```html
<section class="pt-14 pb-24">
<section class="py-11">
<section class="pt-[73px] pb-[118px]">
```

### Why it becomes a smell

The eye notices rhythm even when the user cannot explain what is wrong.

### Better direction

Use a spacing scale.

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
}
```

---

## 16. Em dashes everywhere

### Code fingerprint

```txt
Fast — secure — scalable — developer-first — production-ready.
```

### Why it becomes a smell

It often appears in generated marketing copy because it is used as a generic rhythm device. Excessive punctuation also makes copy sound uniform.

### Better direction

Prefer direct sentences.

```txt
Fast by default. Secure in production. Easy to operate.
```

---

## 17. Generic buzzword copy

### Code fingerprint

```txt
Empower your workflow with a seamless, next-generation platform
built to unlock productivity at scale.
```

### Why it becomes a smell

The copy says almost nothing that could not apply to another product.

### Better direction

Name the user, the action, and the measurable outcome.

```txt
Inspect failed API requests, compare deployments, and trace the dependency
that caused the regression from one dashboard.
```

---

## 18. Serif italic accents

### Code fingerprint

```html
<h1>
  Build software
  <em class="font-serif italic">beautifully</em>
</h1>
```

### Why it becomes a smell

The contrast can work, but repeated use across startup templates makes it feel borrowed rather than intentional.

### Better direction

Use a true display treatment only when it fits the product's voice.

---

## 19. Overused display fonts

### Code fingerprint

```css
@font-face {
  font-family: "Instrument Sans";
}

body {
  font-family: "Instrument Sans", sans-serif;
}
```

### Why it becomes a smell

A fashionable font can become a visual shortcut. Typography still needs hierarchy, width control, weights, and content-specific decisions.

### Better direction

Treat the font as one token in a full system rather than the identity itself.

---

## 20. Grain overlay on gradients

### Code fingerprint

```css
.hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("/noise.png");
  opacity: 0.08;
  pointer-events: none;
}
```

### Why it becomes a smell

Noise can add texture, but it is frequently added to make flat gradient work appear more sophisticated.

### Better direction

Use texture only when it is part of the brand language and optimize the asset aggressively.

---

# Chapter 2: Unleashed Visual Chaos

## 21. Magnetic buttons that warp toward the cursor

### Code fingerprint

```js
button.addEventListener("pointermove", event => {
  const rect = button.getBoundingClientRect();
  const x = event.clientX - rect.left - rect.width / 2;
  const y = event.clientY - rect.top - rect.height / 2;
  button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
});
```

### Why it becomes a smell

Pointer position changes the location of the click target. That can make interaction feel unstable.

### Better direction

Keep geometry stable and animate color, elevation, or a small fixed transform.

---

## 22. Scroll-stealing parallax with conflicting speeds

### Code fingerprint

```js
window.addEventListener("wheel", event => {
  event.preventDefault();
  virtualScroll += event.deltaY * 0.42;
}, { passive: false });
```

### Why it becomes a smell

It breaks native scrolling expectations, accessibility tooling, keyboard behavior, and often browser history restoration.

### Better direction

Do not intercept scroll unless the application is genuinely a canvas-like experience.

---

## 23. Breathing gradient background

### Code fingerprint

```css
.page {
  background: linear-gradient(120deg, #6d28d9, #2563eb, #db2777);
  background-size: 300% 300%;
  animation: breathe 8s ease infinite;
}

@keyframes breathe {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

### Better direction

Prefer a static surface or short-lived state transition. Infinite animation should earn its cost.

---

## 24. Staggered fade-in hell

### Code fingerprint

```jsx
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.35, duration: 0.8 }}
  />
))}
```

### Problem

Large index-based delays can make content take several seconds to become usable.

### Better direction

Cap delay and duration.

```js
const delay = Math.min(index * 0.04, 0.2);
```

---

## 25. Every section forced to min-h-screen

### Code fingerprint

```html
<section class="min-h-screen">
```

Repeated many times.

### Why it becomes a smell

The page receives artificial vertical gaps. Short sections require unnecessary scrolling.

### Better direction

Use natural content height and intentional padding.

---

## 26. Z-index soup

### Code fingerprint

```html
<div class="z-[999]">
<div class="z-[9999]">
<div class="z-[100000]">
```

### Why it becomes a smell

Z-index becomes a local patch rather than part of a layering model.

### Better direction

```css
:root {
  --z-base: 0;
  --z-header: 10;
  --z-popover: 20;
  --z-modal: 30;
  --z-toast: 40;
}
```

---

## 27. Inconsistent border radii in the same row

### Code fingerprint

```html
<div class="rounded-md">...</div>
<div class="rounded-2xl">...</div>
<div class="rounded-[28px]">...</div>
```

### Better direction

Define radius tokens.

```css
:root {
  --radius-control: 0.5rem;
  --radius-card: 0.75rem;
  --radius-modal: 1rem;
}
```

---

## 28. Masonry grid with jagged gaps

### Code fingerprint

```css
.gallery {
  columns: 3 18rem;
  column-gap: 1rem;
}
```

### Why it becomes a smell

Masonry is appropriate for image discovery but poor for ordered data, pricing, settings, or content users need to compare horizontally.

### Better direction

Choose a grid that reflects comparison needs.

---

## 29. Every-animation-at-once cards

### Code fingerprint

```css
.card:hover {
  transform: perspective(800px) rotateX(4deg) rotateY(-5deg) translateY(-8px) scale(1.02);
  filter: drop-shadow(0 0 24px #7c3aed);
  animation: bounce 700ms;
}
```

### Why it becomes a smell

Multiple effects compete for attention and can cause expensive composite work.

### Better direction

One interaction, one purpose.

```css
.card {
  transition: transform 160ms ease, border-color 160ms ease;
}

.card:hover {
  transform: translateY(-2px);
  border-color: #48515f;
}
```

---

## 30. Nested Shadcn components

### Code fingerprint

```tsx
<Dialog>
  <DialogTrigger asChild>
    <HoverCard>
      <HoverCardTrigger asChild>
        <Tooltip>
          <TooltipTrigger>Open</TooltipTrigger>
        </Tooltip>
      </HoverCardTrigger>
    </HoverCard>
  </DialogTrigger>
</Dialog>
```

### Why it becomes a smell

Focus management, pointer events, portals, escape-key behavior, and accessibility semantics can conflict.

### Better direction

Flatten interaction. A control should normally have one primary interaction role.

---

## 31. Neon gradient charts with no labels

### Code fingerprint

```js
const options = {
  scales: { x: { display: false }, y: { display: false } },
  plugins: { legend: { display: false }, tooltip: { enabled: false } }
};
```

### Why it becomes a smell

A chart without units, labels, legend, or accessible alternative becomes decoration.

### Better direction

Always answer: What is measured? Over what period? In what unit? What changed?

---

## 32. Overstuffed mobile headers

### Code fingerprint

```html
<nav class="flex overflow-x-auto whitespace-nowrap">
  <!-- 12 navigation items -->
</nav>
```

### Why it becomes a smell

Primary navigation becomes horizontally hidden and difficult to discover.

### Better direction

Prioritize a small number of primary actions and move secondary items behind a menu.

---

## 33. Five-font roulette

### Code fingerprint

```css
.hero { font-family: Inter; }
.quote { font-family: Georgia; }
.code { font-family: "JetBrains Mono"; }
.cta { font-family: "Space Grotesk"; }
.badge { font-family: "Comic Sans MS"; }
```

### Better direction

One UI family plus one monospace family is enough for most products. A display family may be added deliberately.

---

## 34. Extreme letter-spacing on tiny text

### Code fingerprint

```html
<span class="text-[10px] tracking-[0.35em] uppercase">
```

### Problem

Tiny uppercase text with extreme tracking is harder to scan and often used as decoration.

### Better direction

```css
.eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
}
```

---

## 35. Fluid typography that breaks on mobile

### Code fingerprint

```css
h1 {
  font-size: clamp(2rem, 12vw, 10rem);
}
```

### Problem

The viewport term can dominate between breakpoints and cause huge headings, wrapping, or overflow.

### Better direction

```css
h1 {
  font-size: clamp(2.5rem, 6vw, 6rem);
  line-height: 0.95;
  max-width: 12ch;
}
```

Test real strings, not just "Build better".

---

## 36. No prefers-reduced-motion support

### Detection fingerprint

The codebase contains `animation:`, `transition:`, `motion.div`, GSAP, or scroll animation logic but contains no `prefers-reduced-motion`.

### Better direction

```css
@media (prefers-reduced-motion: reduce) {
  .animated {
    animation: none;
    transition: none;
    transform: none;
  }
}
```

JavaScript can also read the preference:

```js
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
```

---

## 37. Unclickable micro-CTAs

### Code fingerprint

```html
<button class="p-1 text-xs">
  Edit
</button>
```

### Problem

The visual and physical hit target is too small, especially on touch devices.

### Better direction

```css
.icon-button {
  min-width: 44px;
  min-height: 44px;
}
```

---

## 38. Endless dummy states with generic icons

### Code fingerprint

```jsx
if (!items.length) {
  return (
    <EmptyState
      icon={<Sparkles />}
      title="Nothing here yet"
      description="Start creating something amazing."
    />
  );
}
```

### Why it becomes a smell

The state does not explain what is missing, why it is missing, or what the user should do.

### Better direction

```jsx
if (!deployments.length) {
  return (
    <EmptyState
      title="No deployments in this environment"
      description="Push a commit to main or create a manual deployment."
      action={<a href="/docs/deploy">Deployment guide</a>}
    />
  );
}
```

---

## 39. Contrast ratio terrorism

### Code fingerprint

```html
<p class="text-zinc-500/40 bg-zinc-950/80">
```

### Problem

Multiple opacity layers make final contrast hard to reason about.

### Better direction

Use explicit semantic tokens whose combinations have been tested.

---

## 40. Single div with 40 or more Tailwind classes

### Code fingerprint

```html
<div class="relative isolate flex min-h-[420px] w-full flex-col items-start ...">
```

### Why it becomes a smell

Long class strings can hide repeated design decisions, conditional conflicts, and responsive complexity.

### Better direction

Extract semantic components or CSS layers when a class string expresses a reusable object.

```css
.metric-card {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  background: var(--surface-raised);
}
```

---

# Chapter 3: Functional Fallout

## 41. Input state updates only on blur

### Code fingerprint

```jsx
<input
  defaultValue={name}
  onBlur={event => setName(event.target.value)}
/>
```

### Problem

Dependent UI, validation, save state, and previews remain stale while the user types.

### Better direction

```jsx
<input
  value={name}
  onChange={event => setName(event.target.value)}
  onBlur={saveName}
/>
```

For expensive effects, debounce the expensive effect, not the input state.

---

## 42. Double-fetch cascades

### Code fingerprint

```jsx
useEffect(() => {
  loadUser();
}, []);

useEffect(() => {
  if (user) loadUser();
}, [user]);
```

Another common fingerprint:

```jsx
useEffect(() => {
  fetchData();
}, [filters, data]);
```

where `fetchData()` updates `data`.

### Problem

The effect depends on state that the effect itself changes.

### Better direction

Separate trigger state from result state.

```jsx
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/users?role=${role}`, { signal: controller.signal })
    .then(response => response.json())
    .then(setUsers)
    .catch(error => {
      if (error.name !== "AbortError") setError(error);
    });

  return () => controller.abort();
}, [role]);
```

---

## 43. Optimistic UI with zero rollback

### Code fingerprint

```js
setTodos(items => items.filter(item => item.id !== id));
await fetch(`/api/todos/${id}`, { method: "DELETE" });
```

### Problem

If the request fails, the local UI lies.

### Better direction

```js
const previous = todos;
setTodos(items => items.filter(item => item.id !== id));

try {
  const response = await fetch(`/api/todos/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Delete failed");
} catch (error) {
  setTodos(previous);
  setError("Could not delete the item.");
}
```

---

## 44. Console logging in production

### Code fingerprint

```js
console.log("user", user);
console.log("token", token);
console.log("response", response);
```

### Problem

Logs can leak sensitive data, create noise, and make production diagnostics inconsistent.

### Better direction

Use an environment-aware logger.

```js
const logger = {
  debug(...args) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(...args);
    }
  },
  error(...args) {
    console.error(...args);
  }
};
```

Never log credentials, tokens, or passwords.

---

## 45. Stale cache with contradictory user data

### Typical cause

The application stores the same entity in several independent caches.

```js
localStorage.setItem("user", JSON.stringify(user));
sessionStorage.setItem("profile", JSON.stringify(user));
queryCache.set(["currentUser"], user);
```

### Better direction

Use a single source of truth and invalidate related queries after mutation.

```js
await updateProfile(input);
queryClient.invalidateQueries({ queryKey: ["currentUser"] });
```

Without a library, centralize fetch and cache behavior in one module.

---

## 46. Back-button trap

### Code fingerprint

```js
window.addEventListener("popstate", () => {
  history.pushState(null, "", location.href);
});
```

### Problem

The app actively prevents navigation.

### Better direction

Use real routes and only warn about genuinely unsaved work.

```js
window.addEventListener("beforeunload", event => {
  if (!hasUnsavedChanges) return;
  event.preventDefault();
});
```

---

## 47. Generated links to missing pages

### Code fingerprint

```jsx
<a href={`/docs/${feature.slug}`}>Learn more</a>
```

with no route validation or content existence check.

### Better direction

Generate navigation from the same source that generates routes.

```js
const docs = new Map([
  ["caching", "/docs/caching"],
  ["auth", "/docs/auth"]
]);

const href = docs.get(feature.slug);
return href ? <a href={href}>Learn more</a> : null;
```

---

## 48. Scroll restoration amnesia

### Code fingerprint

```js
useEffect(() => {
  window.scrollTo(0, 0);
}, [pathname]);
```

### Problem

Every navigation destroys the user's reading position, even on back navigation.

### Better direction

Let the browser restore scroll where possible. In SPAs, store positions keyed by history entry.

```js
history.scrollRestoration = "manual";
```

Then restore only when your router requires it.

---

## 49. Modal stacking nightmare

### Code fingerprint

```jsx
<SettingsDialog>
  <DeleteAccountDialog>
    <ConfirmDialog />
  </DeleteAccountDialog>
</SettingsDialog>
```

### Problem

Multiple focus traps and portal layers compete.

### Better direction

Use one modal state machine.

```js
const [dialog, setDialog] = useState(null);
// null | "settings" | "delete-confirmation"
```

A new dialog replaces the previous interaction layer rather than nesting inside it.

---

## 50. Client-only validation

### Code fingerprint

```js
if (password.length < 8) {
  setError("Too short");
  return;
}

await fetch("/api/register", {
  method: "POST",
  body: JSON.stringify({ email, password })
});
```

with no equivalent server validation.

### Problem

Client validation is a convenience, not a security boundary.

### Better direction

Server example with Zod:

```ts
const RegisterInput = z.object({
  email: z.string().email(),
  password: z.string().min(12).max(128)
});

app.post("/api/v1/register", (req, res) => {
  const result = RegisterInput.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "INVALID_INPUT",
      issues: result.error.issues
    });
  }

  // Continue using validated input.
});
```

---

## 51. Contradictory password requirements

### Failure example

UI text:

```txt
Password must contain at least 8 characters.
```

Client code:

```js
if (password.length < 10) return "Too short";
```

Server code:

```js
z.string().min(12)
```

### Better direction

Share one policy definition or expose policy metadata from the backend.

```js
export const PASSWORD_POLICY = {
  minLength: 12,
  maxLength: 128
};
```

---

## 52. Missing autocomplete attributes

### Code fingerprint

```html
<input type="email" name="email">
<input type="password" name="password">
```

### Better direction

```html
<input
  type="email"
  name="email"
  autocomplete="email"
  inputmode="email"
>

<input
  type="password"
  name="password"
  autocomplete="current-password"
>
```

Registration:

```html
<input type="password" autocomplete="new-password">
```

---

## 53. Submit spam with no lockout

### Code fingerprint

```js
form.addEventListener("submit", async event => {
  event.preventDefault();
  await chargeCard();
});
```

### Problem

Several rapid submissions can create duplicate writes or duplicate payments.

### Better direction

Client:

```js
let submitting = false;

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (submitting) return;

  submitting = true;
  submitButton.disabled = true;

  try {
    await submitOrder();
  } finally {
    submitting = false;
    submitButton.disabled = false;
  }
});
```

Server:

```http
Idempotency-Key: order-7e5a...
```

The server should enforce idempotency for critical mutations.

---

## 54. Full-page spinner for tiny requests

### Code fingerprint

```jsx
if (isFetching) {
  return <FullScreenSpinner />;
}
```

### Problem

Refreshing one small resource makes the entire interface unusable.

### Better direction

Differentiate initial load from background refresh.

```jsx
if (isLoading && !data) return <PageSkeleton />;

return (
  <>
    {isFetching && <InlineRefreshIndicator />}
    <Dashboard data={data} />
  </>
);
```

---

## 55. Unoptimized multi-megabyte PNG images

### Detection fingerprint

Large `.png` files imported into hero, card, avatar, or product components.

### Better direction

Use responsive assets and modern formats.

```html
<picture>
  <source srcset="/hero.avif" type="image/avif">
  <source srcset="/hero.webp" type="image/webp">
  <img
    src="/hero.jpg"
    width="1600"
    height="900"
    loading="eager"
    decoding="async"
    alt=""
  >
</picture>
```

---

## 56. Massive layout shift on image load

### Code fingerprint

```html
<img src="/dashboard.png" alt="Dashboard preview">
```

with no dimensions or aspect ratio.

### Better direction

```html
<img
  src="/dashboard.png"
  alt="Dashboard preview"
  width="1440"
  height="900"
>
```

or:

```css
.preview {
  aspect-ratio: 16 / 10;
}
```

---

## 57. Infinite re-render from Math.random in JSX

### Code fingerprint

```jsx
<Component key={Math.random()} />
```

or:

```jsx
<div style={{ width: `${Math.random() * 100}%` }} />
```

### Problem

A random key tells React this is a different component every render. State is destroyed and the component remounts.

### Better direction

Use stable identity.

```jsx
<Component key={item.id} />
```

For random values that should be created once:

```jsx
const [seed] = useState(() => Math.random());
```

---

## 58. Horizontal overflow on mobile

### Common fingerprints

```css
.panel {
  width: 100vw;
  padding: 2rem;
}
```

Because default box sizing can make the actual width larger than the viewport.

Another:

```html
<div class="w-screen translate-x-10">
```

### Better direction

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

.panel {
  width: 100%;
  max-width: 100%;
}
```

Debug helper:

```js
for (const element of document.querySelectorAll("*")) {
  if (element.scrollWidth > document.documentElement.clientWidth) {
    console.log("Overflow candidate:", element);
  }
}
```

---

## 59. Fat-finger graveyard

### Code fingerprint

```css
.toolbar button {
  width: 20px;
  height: 20px;
  margin-right: 4px;
}
```

### Better direction

Give touch targets enough size and separation.

```css
.toolbar button {
  min-width: 44px;
  min-height: 44px;
}

.toolbar {
  gap: 0.5rem;
}
```

---

## 60. Critical actions hidden behind hover

### Code fingerprint

```css
.card .delete-button {
  opacity: 0;
}

.card:hover .delete-button {
  opacity: 1;
}
```

### Problem

Touch screens do not have a persistent hover state. Keyboard users may never discover the action.

### Better direction

Keep critical actions visible or reveal them on both focus and hover.

```css
.card .delete-button {
  opacity: 0.72;
}

.card:hover .delete-button,
.card:focus-within .delete-button {
  opacity: 1;
}
```

For destructive actions, clarity is more important than visual minimalism.

---

# Chapter 4: How to Review a Real Codebase

A good review should not treat every match as a bug. Static fingerprints are clues. Human judgment decides whether a pattern is deliberate, repeated, accessible, maintainable, and appropriate for the product.

## Pass 1: Search for visual fingerprints

Useful searches:

```bash
rg "bg-gradient|linear-gradient|radial-gradient" src
rg "backdrop-blur|backdrop-filter" src
rg "hover:opacity|opacity-[0-9]" src
rg "min-h-screen|h-screen" src
rg "z-\[" src
rg "tracking-\[" src
rg "overflow-x-auto|w-screen|100vw" src
rg "Math\.random\(" src
rg "console\.log\(" src
rg "onBlur=.*set|onBlur=.*=>" src
```

## Pass 2: Review motion

Search:

```bash
rg "animation:|transition:|motion\.|gsap|IntersectionObserver|pointermove|mousemove" src
rg "prefers-reduced-motion" src
```

If the first search produces many results and the second produces none, motion accessibility deserves attention.

## Pass 3: Review forms

Search:

```bash
rg "<input|<form|type=\"password\"|type=\"email\"" src
rg "autocomplete=" src
rg "onSubmit|addEventListener\(\"submit\"" src
```

Check that:

- interactive state updates immediately
- submit controls become disabled during irreversible requests
- the server validates the same constraints
- password policy is defined once
- autocomplete is correct

## Pass 4: Review network behavior

Search for effects that fetch data:

```bash
rg "useEffect|fetch\(|axios\.|queryClient|invalidateQueries" src
```

Then inspect whether an effect depends on state that the request itself changes.

## Pass 5: Review responsive behavior

Useful browser test widths:

```txt
320
360
390
768
1024
1280
1440
```

Do not test only the exact breakpoints used by the CSS framework.

---

# Chapter 5: Severity Model

Use a four-level review scale.

## Level 0: Intentional

The pattern exists for a product-specific reason, has accessibility support, and does not repeat mechanically.

## Level 1: Cosmetic smell

The pattern makes the interface feel generic but does not harm completion of tasks.

Examples:

- repeated gradient text
- too many badges
- generic icons
- excessive decorative grain

## Level 2: Usability debt

The pattern slows users, reduces readability, or creates mobile friction.

Examples:

- low contrast
- micro targets
- scroll-stealing effects
- delayed staggered content
- horizontal overflow

## Level 3: Functional defect

The pattern can create incorrect data, duplicate writes, navigation traps, broken state, or inaccessible critical actions.

Examples:

- optimistic update without rollback
- submit spam
- client-only validation
- infinite fetch loops
- unstable React keys

---

# Chapter 6: A Practical Scorecard

Score each area from 0 to 5.

| Area | 0 | 5 |
| --- | --- | --- |
| Visual identity | copied template | clearly product-specific |
| Typography | default everywhere | deliberate hierarchy |
| Color | decorative noise | semantic and accessible |
| Motion | constant decoration | purposeful and optional |
| Spacing | arbitrary | consistent rhythm |
| Mobile | desktop squeezed down | designed for touch |
| Forms | fragile | explicit and accessible |
| Network state | global spinners | local resilient state |
| Error recovery | silent failure | clear rollback and retry |
| Code structure | class soup | reusable semantic system |

A score below 25 suggests the interface needs foundational work rather than more polish.

---

# Chapter 7: Automated Audit Script

The companion file `ui-pattern-audit.mjs` performs a static scan of HTML, CSS, JavaScript, TypeScript, JSX, TSX, Vue, Svelte, and common template files.

Run it from a project root:

```bash
node ui-pattern-audit.mjs ./src
```

Or scan the entire project:

```bash
node ui-pattern-audit.mjs .
```

It reports matching files and lines for patterns that can reasonably be detected with static text analysis.

Important limitation:

Static scanning can detect fingerprints, not intent. A result should start a review, not automatically fail a build.

---

# Final Principle

A mature interface is not the one with the fewest gradients, animations, icons, or dependencies. It is the one where every visible and interactive decision can answer a simple question:

Why is this here?

If the answer is only "because modern websites usually do this," the pattern deserves review.
