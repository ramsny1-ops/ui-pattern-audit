# Rule Catalog

Current built-in rules: 50

## a11y.clickable-div

Category: accessibility  
Severity: high  
Confidence: 91%

A div with click behavior is not keyboard-operable or announced as a control by default.

Recommended direction: Use a button for actions and an anchor for navigation. Native elements provide keyboard and accessibility behavior automatically.

Risky example:

```text
<div onClick={openModal}>Open</div>
```

Better example:

```text
<button type="button" onClick={openModal}>Open</button>
```

## a11y.icon-button-name

Category: accessibility  
Severity: high  
Confidence: 78%

Icon-only controls need an accessible name that communicates the action to assistive technology.

Recommended direction: Add aria-label or visible text. Prefer labels that describe the action rather than the icon shape.

Risky example:

```text
<button><TrashIcon /></button>
```

Better example:

```text
<button aria-label="Delete project"><TrashIcon /></button>
```

## a11y.image-missing-alt

Category: accessibility  
Severity: high  
Confidence: 92%

Images without alt text lack an accessible text alternative. Decorative images should explicitly use an empty alt.

Recommended direction: Add concise meaningful alt text, or alt="" for decorative imagery.

Risky example:

```text
<img src="product.jpg">
```

Better example:

```text
<img src="product.jpg" alt="Black leather travel bag">
```

## a11y.micro-target

Category: accessibility  
Severity: high  
Confidence: 73%

Tiny target padding increases missed taps and can make adjacent destructive actions dangerous on touch screens.

Recommended direction: Aim for a comfortable touch target around 44 by 44 CSS pixels where practical.

Risky example:

```text
<button class="p-1"><X /></button>
```

Better example:

```text
<button class="min-h-11 min-w-11 p-2" aria-label="Close"><X /></button>
```

## a11y.outline-none

Category: accessibility  
Severity: high  
Confidence: 84%

Removing the focus indicator can make keyboard navigation impossible to track unless an equally visible replacement exists.

Recommended direction: Provide a visible :focus-visible treatment before removing the browser outline.

Risky example:

```text
button:focus { outline: none; }
```

Better example:

```text
button:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
```

## forms.email-autocomplete

Category: forms  
Severity: warning  
Confidence: 88%

Autocomplete metadata improves form completion, password-manager interoperability and mobile keyboard behavior.

Recommended direction: Use autocomplete="email" for account email fields unless there is a specific reason not to.

Risky example:

```text
<input type="email" name="email">
```

Better example:

```text
<input type="email" name="email" autocomplete="email">
```

## forms.input-missing-name

Category: forms  
Severity: warning  
Confidence: 76%

Unnamed controls are omitted from native form submission and are harder for tooling to understand.

Recommended direction: Give form controls stable semantic names unless they are intentionally non-submitting UI controls.

Risky example:

```text
<input type="text" id="display-name">
```

Better example:

```text
<input type="text" id="display-name" name="displayName">
```

## forms.password-autocomplete

Category: forms  
Severity: warning  
Confidence: 90%

Correct password autocomplete values help password managers distinguish sign-in from password creation.

Recommended direction: Use current-password for sign-in and new-password for account creation or reset flows.

Risky example:

```text
<input type="password" name="password">
```

Better example:

```text
<input type="password" name="password" autocomplete="current-password">
```

## functional.back-button-trap

Category: functional  
Severity: critical  
Confidence: 96%

Forcing navigation back into the current page can trap users and violate expected browser behavior.

Recommended direction: Only warn about genuine unsaved work. Let browser navigation remain reversible.

Risky example:

```text
addEventListener("popstate", () => history.pushState({}, "", location.href));
```

Better example:

```text
addEventListener("beforeunload", handleUnsavedChanges);
```

## functional.hover-only-action

Category: functional  
Severity: high  
Confidence: 78%

Critical actions hidden until hover may be undiscoverable on touch and keyboard interfaces.

Recommended direction: Keep important actions visible or reveal them through focus and an explicit touch-accessible menu.

Risky example:

```text
class="opacity-0 group-hover:opacity-100 delete-button"
```

Better example:

```text
class="opacity-100 md:opacity-70 md:group-hover:opacity-100 focus-visible:opacity-100"
```

## functional.mutation-before-state-set

Category: functional  
Severity: high  
Confidence: 78%

Mutating an existing state array preserves its reference and can produce missed renders or hard-to-track shared mutations.

Recommended direction: Create a new array when updating state.

Risky example:

```text
users.push(newUser); setUsers(users);
```

Better example:

```text
setUsers((current) => [...current, newUser]);
```

## functional.state-on-blur

Category: functional  
Severity: high  
Confidence: 86%

Using blur as the only state synchronization point can make displayed values stale and interactions unpredictable.

Recommended direction: Update local input state on change. Debounce expensive persistence independently.

Risky example:

```text
<input onBlur={(e) => setName(e.target.value)} />
```

Better example:

```text
<input value={name} onChange={(e) => setName(e.target.value)} />
```

## network.fetch-no-status-check

Category: functional  
Severity: warning  
Confidence: 68%

fetch resolves for HTTP errors. Parsing JSON directly can treat 404 or 500 responses as successful transport.

Recommended direction: Check response.ok or explicit expected statuses before consuming the body.

Risky example:

```text
fetch(url).then((r) => r.json())
```

Better example:

```text
const r = await fetch(url); if (!r.ok) throw new Error(`HTTP ${r.status}`);
```

## react.effect-self-update

Category: functional  
Severity: critical  
Confidence: 88%

An effect that writes to a value represented in its own dependency list can become a render loop or repeated side-effect cascade.

Recommended direction: Derive values directly where possible, or ensure the update converges and depends on a distinct source value.

Risky example:

```text
useEffect(() => { setCount(count + 1); }, [count]);
```

Better example:

```text
const nextCount = count + 1; // derive, or update only from an external event
```

## react.index-key

Category: functional  
Severity: warning  
Confidence: 72%

Index keys become unsafe when items can be reordered, inserted or removed because identity follows position rather than data.

Recommended direction: Use an entity ID when list order can change. Index keys are acceptable only for truly static lists.

Risky example:

```text
items.map((item, index) => <Row key={index} />)
```

Better example:

```text
items.map((item) => <Row key={item.id} />)
```

## react.random-key

Category: functional  
Severity: critical  
Confidence: 99%

Keys must describe stable identity. Generating a new key remounts components, loses local state and creates unnecessary DOM work.

Recommended direction: Use a durable entity ID. If the source lacks one, create identity when data enters the system rather than during rendering.

Risky example:

```text
<Row key={Math.random()} item={item} />
```

Better example:

```text
<Row key={item.id} item={item} />
```

## maintainability.arbitrary-z

Category: maintainability  
Severity: high  
Confidence: 92%

Large local z-index values create stacking-context escalation and modal or tooltip conflicts.

Recommended direction: Define a short layer scale such as base, sticky, dropdown, overlay, modal and toast.

Risky example:

```text
class="z-[99999]"
```

Better example:

```text
z-index: var(--layer-modal);
```

## maintainability.console-log

Category: maintainability  
Severity: warning  
Confidence: 98%

Debug logging left in application code can leak information, add noise and hide meaningful diagnostics.

Recommended direction: Remove it or route structured diagnostics through an environment-aware logger.

Risky example:

```text
console.log("user", user);
```

Better example:

```text
logger.debug({ userId: user.id }, "Loaded user");
```

## maintainability.debugger

Category: maintainability  
Severity: high  
Confidence: 99%

A debugger statement can unexpectedly pause execution when developer tools are attached.

Recommended direction: Remove it before production or gate diagnostics behind explicit development tooling.

Risky example:

```text
debugger;
```

Better example:

```text
// use a breakpoint in development tooling
```

## maintainability.large-component

Category: maintainability  
Severity: warning  
Confidence: 70%

Very large UI files often combine data access, state, validation, orchestration and rendering in one maintenance hotspot.

Recommended direction: Extract boundaries by responsibility, not merely by line count. Keep orchestration near the page and reusable behavior in focused modules.

Risky example:

```text
Dashboard.tsx // 1,100 lines, 18 hooks, networking and five modals
```

Better example:

```text
DashboardPage + DashboardData + ActivityTable + SettingsDialog
```

## maintainability.tailwind-class-soup

Category: maintainability  
Severity: warning  
Confidence: 90%

A huge class string mixes layout, typography, effects, breakpoints and state into one hard-to-review surface.

Recommended direction: Extract a semantic component or reusable variant. Keep local utilities where they remain readable.

Risky example:

```text
className="flex relative min-h-screen ... forty more utilities ..."
```

Better example:

```text
<HeroPanel variant="primary" />
```

## maintainability.todo-production

Category: maintainability  
Severity: info  
Confidence: 62%

Markers are useful during development but can represent known unfinished behavior in production paths.

Recommended direction: Link important debt to an issue and remove stale or meaningless comments.

Risky example:

```text
// FIXME: fake data for now
```

Better example:

```text
// Issue #184 tracks retry policy migration.
```

## project.z-index-soup

Category: maintainability  
Severity: high  
Confidence: 86%

Several unrelated high stacking values indicate local escalation rather than a controlled layer system.

Recommended direction: Replace numeric competition with named layer tokens and document which component types own each layer.

Risky example:

```text
100, 999, 9999, 99999, 2147483647
```

Better example:

```text
--layer-sticky: 20; --layer-dropdown: 40; --layer-modal: 60; --layer-toast: 80;
```

## motion.cursor-follow

Category: motion  
Severity: warning  
Confidence: 79%

Cursor-following visuals can cause frequent style updates and provide no equivalent value on touch devices.

Recommended direction: Keep pointer effects subtle, throttle work and ensure the interface remains complete without them.

Risky example:

```text
addEventListener("mousemove", e => glow.style.transform = `translate(${e.clientX}px...)`);
```

Better example:

```text
button:hover { transform: translateY(-1px); }
```

## motion.expensive-property-animation

Category: motion  
Severity: warning  
Confidence: 72%

Animating layout or heavy paint properties can produce avoidable frame drops on lower-end devices.

Recommended direction: Prefer transform and opacity for high-frequency visual motion when the visual result is equivalent.

Risky example:

```text
transition: width 500ms, box-shadow 500ms;
```

Better example:

```text
transition: transform 180ms, opacity 180ms;
```

## motion.infinite-animation

Category: motion  
Severity: warning  
Confidence: 94%

Continuous decorative motion consumes attention and resources long after it has communicated anything useful.

Recommended direction: Use finite motion for state transitions. If continuous animation is meaningful, respect reduced-motion and provide pause behavior when appropriate.

Risky example:

```text
animation: pulse 1.5s ease-in-out infinite;
```

Better example:

```text
animation: enter 180ms ease-out both;
```

## motion.missing-reduced-motion-file

Category: motion  
Severity: high  
Confidence: 84%

Users who request reduced motion should not receive the same non-essential animation by default.

Recommended direction: Add a reduced-motion media query or framework equivalent. A project-level policy may satisfy this even if it lives elsewhere.

Risky example:

```text
.card { animation: float 3s infinite; }
```

Better example:

```text
@media (prefers-reduced-motion: reduce) { .card { animation: none; } }
```

## motion.scroll-stealing

Category: motion  
Severity: high  
Confidence: 76%

Intercepting native scrolling can create inaccessible, motion-heavy experiences and conflict with browser navigation gestures.

Recommended direction: Prefer native scrolling. Use scroll-linked effects that observe rather than replace scroll behavior.

Risky example:

```text
addEventListener("wheel", e => { e.preventDefault(); scrollTo(...); });
```

Better example:

```text
const observer = new IntersectionObserver(onVisibility);
```

## project.motion-without-reduced-motion

Category: motion  
Severity: critical  
Confidence: 93%

A project-level reduced-motion policy is a more reliable safeguard than hoping each animated component handles the preference independently.

Recommended direction: Add global reduced-motion CSS and make JavaScript animation systems consult matchMedia('(prefers-reduced-motion: reduce)').

Risky example:

```text
animations throughout the project, no reduced-motion branch
```

Better example:

```text
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto; } }
```

## project.multiple-animation-libraries

Category: motion  
Severity: warning  
Confidence: 99%

Multiple animation systems increase bundle size, mental overhead and inconsistent motion behavior.

Recommended direction: Standardize on the smallest set that covers actual product requirements.

Risky example:

```text
framer-motion + gsap + animejs + aos
```

Better example:

```text
one primary motion system plus native CSS transitions where sufficient
```

## performance.base64-css-asset

Category: performance  
Severity: warning  
Confidence: 90%

Large base64 assets inflate CSS or JavaScript, cannot be cached independently and can delay parsing.

Recommended direction: Store substantial assets as files unless inlining is measured to be beneficial.

Risky example:

```text
background: url(data:image/png;base64,iVBOR...);
```

Better example:

```text
background-image: url("/assets/texture.webp");
```

## performance.eager-below-fold-candidate

Category: performance  
Severity: info  
Confidence: 52%

Non-critical images can compete with essential resources when loaded eagerly. Hero images may correctly remain eager.

Recommended direction: Use loading="lazy" for below-the-fold content. Keep important LCP imagery eager and prioritized deliberately.

Risky example:

```text
<img src="gallery-24.webp" alt="...">
```

Better example:

```text
<img src="gallery-24.webp" loading="lazy" alt="...">
```

## performance.image-missing-dimensions

Category: performance  
Severity: warning  
Confidence: 87%

Images without intrinsic dimensions can create layout shift while the browser discovers their aspect ratio.

Recommended direction: Provide width and height attributes or a CSS aspect-ratio with reserved layout space.

Risky example:

```text
<img src="hero.webp" alt="Dashboard">
```

Better example:

```text
<img src="hero.webp" width="1200" height="700" alt="Dashboard">
```

## responsive.100vw-overflow

Category: responsive  
Severity: warning  
Confidence: 77%

100vw can include scrollbar width and produce a small horizontal bleed on desktop or nested layouts.

Recommended direction: Prefer width: 100% for normal page flow. Use viewport width only when the viewport itself is the intended reference.

Risky example:

```text
.page { width: 100vw; }
```

Better example:

```text
.page { width: 100%; }
```

## responsive.fixed-wide-width

Category: responsive  
Severity: high  
Confidence: 83%

Large fixed widths frequently overflow narrow screens and fail under text zoom.

Recommended direction: Use max-width plus fluid width, and test around 320 to 400 CSS pixels.

Risky example:

```text
.panel { width: 900px; }
```

Better example:

```text
.panel { width: min(100%, 56rem); }
```

## responsive.horizontal-scroll-nav

Category: responsive  
Severity: warning  
Confidence: 73%

Primary navigation hidden behind sideways scrolling can become difficult to discover on touch devices.

Recommended direction: Prioritize core destinations, use an intentional overflow menu, or provide a responsive navigation pattern.

Risky example:

```text
class="nav overflow-x-auto whitespace-nowrap"
```

Better example:

```text
<PrimaryNav collapsedAt="md" />
```

## responsive.viewport-height-section

Category: responsive  
Severity: warning  
Confidence: 74%

Repeated viewport-height sections can create artificial gaps and mobile browser viewport issues.

Recommended direction: Use content-driven height unless the viewport is a real interaction requirement. Consider dynamic viewport units where appropriate.

Risky example:

```text
<section class="min-h-screen">
```

Better example:

```text
<section class="py-20">
```

## security.dangerously-set-inner-html

Category: security  
Severity: high  
Confidence: 97%

Direct HTML injection can become an XSS sink when content is not strictly trusted and sanitized.

Recommended direction: Prefer normal rendering. When rich HTML is required, sanitize at a well-defined trust boundary and document it.

Risky example:

```text
<div dangerouslySetInnerHTML={{ __html: userHtml }} />
```

Better example:

```text
<div>{userText}</div>
```

## security.dom-inner-html

Category: security  
Severity: high  
Confidence: 86%

Writing strings into innerHTML is an injection sink when any value can contain untrusted markup.

Recommended direction: Use textContent for text or construct DOM nodes. Sanitize explicitly if rich HTML is necessary.

Risky example:

```text
result.innerHTML = data.message;
```

Better example:

```text
result.textContent = data.message;
```

## security.frontend-secret-name

Category: security  
Severity: critical  
Confidence: 74%

Secrets shipped to browser code are public to every user and should be considered compromised.

Recommended direction: Move privileged credentials behind a server-side boundary. Public client identifiers should be named accordingly.

Risky example:

```text
const API_KEY = "live_secret_1234567890";
```

Better example:

```text
const apiBase = "/api/v1";
```

## project.multiple-icon-libraries

Category: visual-design  
Severity: info  
Confidence: 99%

Multiple icon sets can create inconsistent stroke language and ship duplicate glyph infrastructure.

Recommended direction: Choose a primary icon family and allow exceptions only when a specific symbol is unavailable.

Risky example:

```text
lucide-react + react-icons + heroicons
```

Better example:

```text
one documented icon system
```

## project.spacing-token-drift

Category: visual-design  
Severity: warning  
Confidence: 67%

A large number of one-off spacing values often means components are being tuned independently instead of using a shared rhythm.

Recommended direction: Create a spacing scale and migrate frequently repeated values first. Keep exceptions when geometry truly requires them.

Risky example:

```text
7px, 11px, 13px, 19px, 23px, 27px, 31px ...
```

Better example:

```text
4px, 8px, 12px, 16px, 24px, 32px ...
```

## visual.arbitrary-radius

Category: visual-design  
Severity: info  
Confidence: 80%

One-off radii are a common signal of a design system drifting into local guesses.

Recommended direction: Use a small documented radius scale and assign radii by component role.

Risky example:

```text
class="rounded-[17px]"
```

Better example:

```text
class="rounded-lg"
```

## visual.em-dash-density

Category: visual-design  
Severity: info  
Confidence: 55%

The punctuation is valid; repeated use across headings and product copy can be a generated-copy fingerprint.

Recommended direction: Review the surrounding copy for specificity and natural rhythm. Do not replace punctuation mechanically.

Risky example:

```text
Ship faster — scale smarter — win more.
```

Better example:

```text
Deploy in minutes. Keep operating costs predictable.
```

## visual.extreme-tracking

Category: visual-design  
Severity: warning  
Confidence: 88%

Extreme tracking on small labels slows scanning and often becomes decorative noise.

Recommended direction: Reduce tracking and test the label at actual mobile size.

Risky example:

```text
class="text-[10px] tracking-[0.45em]"
```

Better example:

```text
class="text-xs tracking-wide"
```

## visual.glassmorphism

Category: visual-design  
Severity: warning  
Confidence: 83%

Blurred translucent panels can reduce contrast, add GPU cost and flatten hierarchy when used everywhere.

Recommended direction: Reserve blur for a specific layering need. Prefer opaque surfaces for primary reading regions.

Risky example:

```text
.card { backdrop-filter: blur(24px); background: rgb(255 255 255 / .08); }
```

Better example:

```text
.card { background: var(--surface-raised); border: 1px solid var(--border); }
```

## visual.gradient-purple-blue

Category: visual-design  
Severity: info  
Confidence: 82%

A familiar purple-to-blue gradient often appears as default template personality rather than a product-specific color decision.

Recommended direction: Keep it only when it is part of an intentional brand system. Prefer named design tokens and a restrained accent strategy.

Risky example:

```text
<section class="bg-gradient-to-r from-violet-600 to-blue-600">
```

Better example:

```text
<section class="bg-surface border-b border-subtle">
```

## visual.gradient-text

Category: visual-design  
Severity: info  
Confidence: 94%

Gradient text is frequently used to manufacture hierarchy instead of earning it through typography and copy.

Recommended direction: Verify the heading remains distinctive with a normal foreground color. Use scale, weight and measure first.

Risky example:

```text
<h1 class="bg-gradient-to-r bg-clip-text text-transparent">Build faster</h1>
```

Better example:

```text
<h1 class="hero-title">Build software your team can operate.</h1>
```

## visual.inter-global

Category: visual-design  
Severity: info  
Confidence: 72%

Inter is excellent, but using it by default can make unrelated products converge visually.

Recommended direction: Keep Inter when it suits the product. Otherwise define a deliberate type system with fallback metrics and clear hierarchy.

Risky example:

```text
body { font-family: Inter, sans-serif; }
```

Better example:

```text
:root { --font-ui: "Your Product Sans", system-ui, sans-serif; }
```

## visual.noise-overlay

Category: visual-design  
Severity: info  
Confidence: 82%

Texture overlays are frequently layered onto gradients to imitate premium landing-page aesthetics.

Recommended direction: Keep texture only if it supports the visual language and its asset cost is justified.

Risky example:

```text
background-image: url("/grain.png");
```

Better example:

```text
background: var(--surface);
```

