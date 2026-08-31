const visual = (rule) => ({ category: "visual-design", ...rule });
const motion = (rule) => ({ category: "motion", ...rule });
const access = (rule) => ({ category: "accessibility", ...rule });
const perf = (rule) => ({ category: "performance", ...rule });
const functional = (rule) => ({ category: "functional", ...rule });
const maintain = (rule) => ({ category: "maintainability", ...rule });
const responsive = (rule) => ({ category: "responsive", ...rule });
const forms = (rule) => ({ category: "forms", ...rule });
const security = (rule) => ({ category: "security", ...rule });

export const lineRules = [
  visual({
    id: "visual.gradient-purple-blue",
    severity: "info", confidence: 82,
    title: "Purple-to-blue gradient fingerprint",
    regex: /(bg-gradient-[^"' ]*.*(?:purple|violet|indigo).*(?:blue|cyan)|linear-gradient\([^)]*(?:purple|violet|#7c3aed|#8b5cf6)[^)]*(?:blue|#2563eb|#3b82f6))/i,
    description: "A familiar purple-to-blue gradient often appears as default template personality rather than a product-specific color decision.",
    suggestion: "Keep it only when it is part of an intentional brand system. Prefer named design tokens and a restrained accent strategy.",
    bad: '<section class="bg-gradient-to-r from-violet-600 to-blue-600">',
    good: '<section class="bg-surface border-b border-subtle">'
  }),
  visual({
    id: "visual.gradient-text",
    severity: "info", confidence: 94,
    title: "Gradient-clipped text",
    regex: /(bg-clip-text.*text-transparent|background-clip\s*:\s*text|-webkit-background-clip\s*:\s*text)/i,
    description: "Gradient text is frequently used to manufacture hierarchy instead of earning it through typography and copy.",
    suggestion: "Verify the heading remains distinctive with a normal foreground color. Use scale, weight and measure first.",
    bad: '<h1 class="bg-gradient-to-r bg-clip-text text-transparent">Build faster</h1>',
    good: '<h1 class="hero-title">Build software your team can operate.</h1>'
  }),
  visual({
    id: "visual.glassmorphism",
    severity: "warning", confidence: 83,
    title: "Glassmorphism surface",
    regex: /(backdrop-filter\s*:\s*blur|backdrop-blur-(?:sm|md|lg|xl|2xl|3xl)|bg-(?:white|black)\/\d+)/i,
    description: "Blurred translucent panels can reduce contrast, add GPU cost and flatten hierarchy when used everywhere.",
    suggestion: "Reserve blur for a specific layering need. Prefer opaque surfaces for primary reading regions.",
    bad: '.card { backdrop-filter: blur(24px); background: rgb(255 255 255 / .08); }',
    good: '.card { background: var(--surface-raised); border: 1px solid var(--border); }'
  }),
  visual({
    id: "visual.inter-global",
    severity: "info", confidence: 72,
    title: "Inter used as global identity",
    regex: /(font-family\s*:\s*["']?Inter\b|font-\[?["']?Inter)/i,
    description: "Inter is excellent, but using it by default can make unrelated products converge visually.",
    suggestion: "Keep Inter when it suits the product. Otherwise define a deliberate type system with fallback metrics and clear hierarchy.",
    bad: 'body { font-family: Inter, sans-serif; }',
    good: ':root { --font-ui: "Your Product Sans", system-ui, sans-serif; }'
  }),
  visual({
    id: "visual.arbitrary-radius",
    severity: "info", confidence: 80,
    title: "Arbitrary border radius",
    regex: /(rounded-\[(?:1[3-9]|[2-9]\d)px\]|border-radius\s*:\s*(?:1[3-9]|[2-9]\d)px)/i,
    description: "One-off radii are a common signal of a design system drifting into local guesses.",
    suggestion: "Use a small documented radius scale and assign radii by component role.",
    bad: 'class="rounded-[17px]"',
    good: 'class="rounded-lg"'
  }),
  visual({
    id: "visual.extreme-tracking",
    severity: "warning", confidence: 88,
    title: "Extreme letter spacing",
    regex: /(tracking-\[(?:0\.[2-9]|[1-9])(?:em|rem)\]|letter-spacing\s*:\s*(?:0\.[2-9]|[1-9])(?:em|rem))/i,
    description: "Extreme tracking on small labels slows scanning and often becomes decorative noise.",
    suggestion: "Reduce tracking and test the label at actual mobile size.",
    bad: 'class="text-[10px] tracking-[0.45em]"',
    good: 'class="text-xs tracking-wide"'
  }),
  visual({
    id: "visual.em-dash-density",
    severity: "info", confidence: 55,
    title: "Em dash in interface copy",
    regex: /—/,
    description: "The punctuation is valid; repeated use across headings and product copy can be a generated-copy fingerprint.",
    suggestion: "Review the surrounding copy for specificity and natural rhythm. Do not replace punctuation mechanically.",
    bad: 'Ship faster — scale smarter — win more.',
    good: 'Deploy in minutes. Keep operating costs predictable.'
  }),
  visual({
    id: "visual.noise-overlay",
    severity: "info", confidence: 82,
    title: "Noise or grain overlay",
    regex: /(noise|grain)\.(?:png|jpe?g|webp|svg)|background-image[^;]*(?:noise|grain)/i,
    description: "Texture overlays are frequently layered onto gradients to imitate premium landing-page aesthetics.",
    suggestion: "Keep texture only if it supports the visual language and its asset cost is justified.",
    bad: 'background-image: url("/grain.png");',
    good: 'background: var(--surface);'
  }),
  maintain({
    id: "maintainability.tailwind-class-soup",
    severity: "warning", confidence: 90,
    title: "Very long utility class list",
    regex: /class(?:Name)?=["'][^"']{240,}["']/i,
    description: "A huge class string mixes layout, typography, effects, breakpoints and state into one hard-to-review surface.",
    suggestion: "Extract a semantic component or reusable variant. Keep local utilities where they remain readable.",
    bad: 'className="flex relative min-h-screen ... forty more utilities ..."',
    good: '<HeroPanel variant="primary" />'
  }),
  maintain({
    id: "maintainability.arbitrary-z",
    severity: "high", confidence: 92,
    title: "Arbitrary high z-index",
    regex: /(z-\[(?:[1-9]\d{2,}|2147483647)\]|z-index\s*:\s*(?:[1-9]\d{2,}|2147483647))/i,
    description: "Large local z-index values create stacking-context escalation and modal or tooltip conflicts.",
    suggestion: "Define a short layer scale such as base, sticky, dropdown, overlay, modal and toast.",
    bad: 'class="z-[99999]"',
    good: 'z-index: var(--layer-modal);'
  }),
  maintain({
    id: "maintainability.console-log",
    severity: "warning", confidence: 98,
    title: "Production console.log candidate",
    regex: /\bconsole\.log\s*\(/,
    description: "Debug logging left in application code can leak information, add noise and hide meaningful diagnostics.",
    suggestion: "Remove it or route structured diagnostics through an environment-aware logger.",
    bad: 'console.log("user", user);',
    good: 'logger.debug({ userId: user.id }, "Loaded user");'
  }),
  maintain({
    id: "maintainability.debugger",
    severity: "high", confidence: 99,
    title: "debugger statement",
    regex: /(^|\s)debugger\s*;/,
    description: "A debugger statement can unexpectedly pause execution when developer tools are attached.",
    suggestion: "Remove it before production or gate diagnostics behind explicit development tooling.",
    bad: 'debugger;',
    good: '// use a breakpoint in development tooling'
  }),
  maintain({
    id: "maintainability.todo-production",
    severity: "info", confidence: 62,
    title: "TODO or FIXME marker",
    regex: /\b(?:TODO|FIXME|HACK)\b/i,
    description: "Markers are useful during development but can represent known unfinished behavior in production paths.",
    suggestion: "Link important debt to an issue and remove stale or meaningless comments.",
    bad: '// FIXME: fake data for now',
    good: '// Issue #184 tracks retry policy migration.'
  }),
  functional({
    id: "react.random-key",
    severity: "critical", confidence: 99,
    title: "Unstable React key generated during render",
    regex: /key\s*=\s*\{[^}]*(?:Math\.random\s*\(|Date\.now\s*\(|crypto\.randomUUID\s*\()/i,
    description: "Keys must describe stable identity. Generating a new key remounts components, loses local state and creates unnecessary DOM work.",
    suggestion: "Use a durable entity ID. If the source lacks one, create identity when data enters the system rather than during rendering.",
    bad: '<Row key={Math.random()} item={item} />',
    good: '<Row key={item.id} item={item} />'
  }),
  functional({
    id: "react.index-key",
    severity: "warning", confidence: 72,
    title: "Array index used as React key",
    regex: /key\s*=\s*\{\s*(?:index|idx|i)\s*\}/i,
    description: "Index keys become unsafe when items can be reordered, inserted or removed because identity follows position rather than data.",
    suggestion: "Use an entity ID when list order can change. Index keys are acceptable only for truly static lists.",
    bad: 'items.map((item, index) => <Row key={index} />)',
    good: 'items.map((item) => <Row key={item.id} />)'
  }),
  functional({
    id: "functional.state-on-blur",
    severity: "high", confidence: 86,
    title: "State-changing input logic attached only to onBlur",
    regex: /onBlur\s*=\s*\{[^}]*(?:set[A-Z]|dispatch|update|save)/i,
    description: "Using blur as the only state synchronization point can make displayed values stale and interactions unpredictable.",
    suggestion: "Update local input state on change. Debounce expensive persistence independently.",
    bad: '<input onBlur={(e) => setName(e.target.value)} />',
    good: '<input value={name} onChange={(e) => setName(e.target.value)} />'
  }),
  functional({
    id: "functional.back-button-trap",
    severity: "critical", confidence: 96,
    title: "Back-button interference",
    regex: /(popstate.*(?:pushState|history\.go)|history\.(?:pushState|go)\([^)]*\).*popstate)/i,
    description: "Forcing navigation back into the current page can trap users and violate expected browser behavior.",
    suggestion: "Only warn about genuine unsaved work. Let browser navigation remain reversible.",
    bad: 'addEventListener("popstate", () => history.pushState({}, "", location.href));',
    good: 'addEventListener("beforeunload", handleUnsavedChanges);'
  }),
  functional({
    id: "functional.mutation-before-state-set",
    severity: "high", confidence: 78,
    title: "Possible state array mutation",
    regex: /\b([A-Za-z_$][\w$]*)\.push\([^)]*\)\s*;\s*set[A-Z]\w*\(\1\)/,
    description: "Mutating an existing state array preserves its reference and can produce missed renders or hard-to-track shared mutations.",
    suggestion: "Create a new array when updating state.",
    bad: 'users.push(newUser); setUsers(users);',
    good: 'setUsers((current) => [...current, newUser]);'
  }),
  functional({
    id: "network.fetch-no-status-check",
    severity: "warning", confidence: 68,
    title: "fetch response consumed without visible status check",
    regex: /await\s+fetch\([^;]+\)\.then\(\s*\(?\w+\)?\s*=>\s*\w+\.json\(\)/i,
    description: "fetch resolves for HTTP errors. Parsing JSON directly can treat 404 or 500 responses as successful transport.",
    suggestion: "Check response.ok or explicit expected statuses before consuming the body.",
    bad: 'fetch(url).then((r) => r.json())',
    good: 'const r = await fetch(url); if (!r.ok) throw new Error(`HTTP ${r.status}`);'
  }),
  security({
    id: "security.dangerously-set-inner-html",
    severity: "high", confidence: 97,
    title: "dangerouslySetInnerHTML usage",
    regex: /dangerouslySetInnerHTML/i,
    description: "Direct HTML injection can become an XSS sink when content is not strictly trusted and sanitized.",
    suggestion: "Prefer normal rendering. When rich HTML is required, sanitize at a well-defined trust boundary and document it.",
    bad: '<div dangerouslySetInnerHTML={{ __html: userHtml }} />',
    good: '<div>{userText}</div>'
  }),
  security({
    id: "security.dom-inner-html",
    severity: "high", confidence: 86,
    title: "DOM innerHTML assignment",
    regex: /\.innerHTML\s*=/,
    description: "Writing strings into innerHTML is an injection sink when any value can contain untrusted markup.",
    suggestion: "Use textContent for text or construct DOM nodes. Sanitize explicitly if rich HTML is necessary.",
    bad: 'result.innerHTML = data.message;',
    good: 'result.textContent = data.message;'
  }),
  security({
    id: "security.frontend-secret-name",
    severity: "critical", confidence: 74,
    title: "Possible secret embedded in frontend source",
    regex: /(?:API_KEY|SECRET|PRIVATE_KEY|ACCESS_TOKEN)\s*[:=]\s*["'][A-Za-z0-9_\-/.+=]{16,}["']/,
    description: "Secrets shipped to browser code are public to every user and should be considered compromised.",
    suggestion: "Move privileged credentials behind a server-side boundary. Public client identifiers should be named accordingly.",
    bad: 'const API_KEY = "live_secret_1234567890";',
    good: 'const apiBase = "/api/v1";'
  }),
  forms({
    id: "forms.email-autocomplete",
    severity: "warning", confidence: 88,
    title: "Email input missing autocomplete",
    regex: /<input(?=[^>]*type=["']email["'])(?![^>]*autocomplete=)[^>]*>/i,
    description: "Autocomplete metadata improves form completion, password-manager interoperability and mobile keyboard behavior.",
    suggestion: "Use autocomplete=\"email\" for account email fields unless there is a specific reason not to.",
    bad: '<input type="email" name="email">',
    good: '<input type="email" name="email" autocomplete="email">'
  }),
  forms({
    id: "forms.password-autocomplete",
    severity: "warning", confidence: 90,
    title: "Password input missing autocomplete",
    regex: /<input(?=[^>]*type=["']password["'])(?![^>]*autocomplete=)[^>]*>/i,
    description: "Correct password autocomplete values help password managers distinguish sign-in from password creation.",
    suggestion: "Use current-password for sign-in and new-password for account creation or reset flows.",
    bad: '<input type="password" name="password">',
    good: '<input type="password" name="password" autocomplete="current-password">'
  }),
  forms({
    id: "forms.input-missing-name",
    severity: "warning", confidence: 76,
    title: "Form input missing name",
    regex: /<input(?![^>]*\bname=)[^>]*>/i,
    description: "Unnamed controls are omitted from native form submission and are harder for tooling to understand.",
    suggestion: "Give form controls stable semantic names unless they are intentionally non-submitting UI controls.",
    bad: '<input type="text" id="display-name">',
    good: '<input type="text" id="display-name" name="displayName">'
  }),
  access({
    id: "a11y.clickable-div",
    severity: "high", confidence: 91,
    title: "Clickable div without native button semantics",
    regex: /<div(?=[^>]*onClick=)(?![^>]*(?:role=|tabIndex=))[^>]*>/i,
    description: "A div with click behavior is not keyboard-operable or announced as a control by default.",
    suggestion: "Use a button for actions and an anchor for navigation. Native elements provide keyboard and accessibility behavior automatically.",
    bad: '<div onClick={openModal}>Open</div>',
    good: '<button type="button" onClick={openModal}>Open</button>'
  }),
  access({
    id: "a11y.outline-none",
    severity: "high", confidence: 84,
    title: "Focus outline removed",
    regex: /(outline\s*:\s*(?:none|0)|outline-none)/i,
    description: "Removing the focus indicator can make keyboard navigation impossible to track unless an equally visible replacement exists.",
    suggestion: "Provide a visible :focus-visible treatment before removing the browser outline.",
    bad: 'button:focus { outline: none; }',
    good: 'button:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }'
  }),
  access({
    id: "a11y.image-missing-alt",
    severity: "high", confidence: 92,
    title: "Image missing alt attribute",
    regex: /<img(?![^>]*\balt=)[^>]*>/i,
    description: "Images without alt text lack an accessible text alternative. Decorative images should explicitly use an empty alt.",
    suggestion: "Add concise meaningful alt text, or alt=\"\" for decorative imagery.",
    bad: '<img src="product.jpg">',
    good: '<img src="product.jpg" alt="Black leather travel bag">'
  }),
  access({
    id: "a11y.icon-button-name",
    severity: "high", confidence: 78,
    title: "Possible icon-only button without accessible name",
    regex: /<button(?![^>]*(?:aria-label=|aria-labelledby=|title=))[^>]*>\s*(?:<svg|<\w+Icon\b)/i,
    description: "Icon-only controls need an accessible name that communicates the action to assistive technology.",
    suggestion: "Add aria-label or visible text. Prefer labels that describe the action rather than the icon shape.",
    bad: '<button><TrashIcon /></button>',
    good: '<button aria-label="Delete project"><TrashIcon /></button>'
  }),
  responsive({
    id: "responsive.100vw-overflow",
    severity: "warning", confidence: 77,
    title: "100vw horizontal overflow risk",
    regex: /(width\s*:\s*100vw\b|\bw-screen\b)/i,
    description: "100vw can include scrollbar width and produce a small horizontal bleed on desktop or nested layouts.",
    suggestion: "Prefer width: 100% for normal page flow. Use viewport width only when the viewport itself is the intended reference.",
    bad: '.page { width: 100vw; }',
    good: '.page { width: 100%; }'
  }),
  responsive({
    id: "responsive.fixed-wide-width",
    severity: "high", confidence: 83,
    title: "Large fixed width",
    regex: /(width\s*:\s*(?:[7-9]\d{2}|[1-9]\d{3,})px|w-\[(?:[7-9]\d{2}|[1-9]\d{3,})px\])/i,
    description: "Large fixed widths frequently overflow narrow screens and fail under text zoom.",
    suggestion: "Use max-width plus fluid width, and test around 320 to 400 CSS pixels.",
    bad: '.panel { width: 900px; }',
    good: '.panel { width: min(100%, 56rem); }'
  }),
  responsive({
    id: "responsive.viewport-height-section",
    severity: "warning", confidence: 74,
    title: "Forced viewport-height section",
    regex: /(min-h-screen|h-screen|min-height\s*:\s*100vh|height\s*:\s*100vh)/i,
    description: "Repeated viewport-height sections can create artificial gaps and mobile browser viewport issues.",
    suggestion: "Use content-driven height unless the viewport is a real interaction requirement. Consider dynamic viewport units where appropriate.",
    bad: '<section class="min-h-screen">',
    good: '<section class="py-20">'
  }),
  responsive({
    id: "responsive.horizontal-scroll-nav",
    severity: "warning", confidence: 73,
    title: "Horizontally scrolling navigation candidate",
    regex: /(?:overflow-x-auto|overflow-x-scroll).*(?:nav|menu|header)|(?:nav|menu|header).*(?:overflow-x-auto|overflow-x-scroll)/i,
    description: "Primary navigation hidden behind sideways scrolling can become difficult to discover on touch devices.",
    suggestion: "Prioritize core destinations, use an intentional overflow menu, or provide a responsive navigation pattern.",
    bad: 'class="nav overflow-x-auto whitespace-nowrap"',
    good: '<PrimaryNav collapsedAt="md" />'
  }),
  perf({
    id: "performance.image-missing-dimensions",
    severity: "warning", confidence: 87,
    title: "Image missing explicit dimensions",
    regex: /<img(?![^>]*(?:\bwidth=|\bheight=))[^>]*>/i,
    description: "Images without intrinsic dimensions can create layout shift while the browser discovers their aspect ratio.",
    suggestion: "Provide width and height attributes or a CSS aspect-ratio with reserved layout space.",
    bad: '<img src="hero.webp" alt="Dashboard">',
    good: '<img src="hero.webp" width="1200" height="700" alt="Dashboard">'
  }),
  perf({
    id: "performance.eager-below-fold-candidate",
    severity: "info", confidence: 52,
    title: "Image without lazy-loading hint",
    regex: /<img(?![^>]*loading=)[^>]*>/i,
    description: "Non-critical images can compete with essential resources when loaded eagerly. Hero images may correctly remain eager.",
    suggestion: "Use loading=\"lazy\" for below-the-fold content. Keep important LCP imagery eager and prioritized deliberately.",
    bad: '<img src="gallery-24.webp" alt="...">',
    good: '<img src="gallery-24.webp" loading="lazy" alt="...">'
  }),
  perf({
    id: "performance.base64-css-asset",
    severity: "warning", confidence: 90,
    title: "Large inline base64 asset candidate",
    regex: /data:image\/[a-z+.-]+;base64,[A-Za-z0-9+/=]{180,}/i,
    description: "Large base64 assets inflate CSS or JavaScript, cannot be cached independently and can delay parsing.",
    suggestion: "Store substantial assets as files unless inlining is measured to be beneficial.",
    bad: 'background: url(data:image/png;base64,iVBOR...);',
    good: 'background-image: url("/assets/texture.webp");'
  }),
  motion({
    id: "motion.infinite-animation",
    severity: "warning", confidence: 94,
    title: "Infinite animation",
    regex: /(animation[^;]*(?:infinite)|repeat\s*:\s*Infinity|repeat\s*:\s*-1)/i,
    description: "Continuous decorative motion consumes attention and resources long after it has communicated anything useful.",
    suggestion: "Use finite motion for state transitions. If continuous animation is meaningful, respect reduced-motion and provide pause behavior when appropriate.",
    bad: 'animation: pulse 1.5s ease-in-out infinite;',
    good: 'animation: enter 180ms ease-out both;'
  }),
  motion({
    id: "motion.cursor-follow",
    severity: "warning", confidence: 79,
    title: "Pointer-following effect",
    regex: /(pointermove|mousemove).*(?:clientX|clientY|--x|--y|transform|radial-gradient)/i,
    description: "Cursor-following visuals can cause frequent style updates and provide no equivalent value on touch devices.",
    suggestion: "Keep pointer effects subtle, throttle work and ensure the interface remains complete without them.",
    bad: 'addEventListener("mousemove", e => glow.style.transform = `translate(${e.clientX}px...)`);',
    good: 'button:hover { transform: translateY(-1px); }'
  }),
  motion({
    id: "motion.scroll-stealing",
    severity: "high", confidence: 76,
    title: "Possible wheel or touchmove scroll interception",
    regex: /addEventListener\(["'](?:wheel|touchmove)["'][^\n]*(?:preventDefault|scrollTo|scrollBy)/i,
    description: "Intercepting native scrolling can create inaccessible, motion-heavy experiences and conflict with browser navigation gestures.",
    suggestion: "Prefer native scrolling. Use scroll-linked effects that observe rather than replace scroll behavior.",
    bad: 'addEventListener("wheel", e => { e.preventDefault(); scrollTo(...); });',
    good: 'const observer = new IntersectionObserver(onVisibility);'
  }),
  motion({
    id: "motion.expensive-property-animation",
    severity: "warning", confidence: 72,
    title: "Potentially expensive animated property",
    regex: /@keyframes|transition[^;]*(?:width|height|top|left|box-shadow|filter)|animation[^;]*(?:box-shadow|filter)/i,
    description: "Animating layout or heavy paint properties can produce avoidable frame drops on lower-end devices.",
    suggestion: "Prefer transform and opacity for high-frequency visual motion when the visual result is equivalent.",
    bad: 'transition: width 500ms, box-shadow 500ms;',
    good: 'transition: transform 180ms, opacity 180ms;'
  }),
  access({
    id: "a11y.micro-target",
    severity: "high", confidence: 73,
    title: "Very small interactive padding",
    regex: /<(?:button|a)[^>]*class(?:Name)?=["'][^"']*\bp-1\b/i,
    description: "Tiny target padding increases missed taps and can make adjacent destructive actions dangerous on touch screens.",
    suggestion: "Aim for a comfortable touch target around 44 by 44 CSS pixels where practical.",
    bad: '<button class="p-1"><X /></button>',
    good: '<button class="min-h-11 min-w-11 p-2" aria-label="Close"><X /></button>'
  }),
  functional({
    id: "functional.hover-only-action",
    severity: "high", confidence: 78,
    title: "Action visibility may depend on hover",
    regex: /(group-hover:(?:opacity-100|visible|block)|hover:(?:visible|block)).*(?:button|action|delete|edit)|(?:button|action|delete|edit).*(group-hover:(?:opacity-100|visible|block))/i,
    description: "Critical actions hidden until hover may be undiscoverable on touch and keyboard interfaces.",
    suggestion: "Keep important actions visible or reveal them through focus and an explicit touch-accessible menu.",
    bad: 'class="opacity-0 group-hover:opacity-100 delete-button"',
    good: 'class="opacity-100 md:opacity-70 md:group-hover:opacity-100 focus-visible:opacity-100"'
  })
];

export const fileRules = [
  motion({
    id: "motion.missing-reduced-motion-file",
    severity: "high", confidence: 84,
    title: "Motion exists without reduced-motion handling in this file",
    test(file) {
      if (file.extension === ".json") return [];
      const hasMotion = /(animation\s*:|transition\s*:|@keyframes|framer-motion|motion\.|gsap\.)/i.test(file.content);
      const hasReduced = /prefers-reduced-motion/i.test(file.content);
      if (!hasMotion || hasReduced) return [];
      const index = file.content.search(/animation\s*:|transition\s*:|@keyframes|framer-motion|motion\.|gsap\./i);
      return [{ index }];
    },
    description: "Users who request reduced motion should not receive the same non-essential animation by default.",
    suggestion: "Add a reduced-motion media query or framework equivalent. A project-level policy may satisfy this even if it lives elsewhere.",
    bad: '.card { animation: float 3s infinite; }',
    good: '@media (prefers-reduced-motion: reduce) { .card { animation: none; } }'
  }),
  functional({
    id: "react.effect-self-update",
    severity: "critical", confidence: 88,
    title: "Effect may update a dependency it watches",
    regex: /useEffect\s*\(\s*\(?.{0,40}=>\s*\{[\s\S]{0,500}?set([A-Z][A-Za-z0-9_]*)\([^)]*\)[\s\S]{0,300}?\}\s*,\s*\[[^\]]*\b\1\b[^\]]*\]/i,
    description: "An effect that writes to a value represented in its own dependency list can become a render loop or repeated side-effect cascade.",
    suggestion: "Derive values directly where possible, or ensure the update converges and depends on a distinct source value.",
    bad: 'useEffect(() => { setCount(count + 1); }, [count]);',
    good: 'const nextCount = count + 1; // derive, or update only from an external event'
  }),
  maintain({
    id: "maintainability.large-component",
    severity: "warning", confidence: 70,
    title: "Large component or source file",
    test(file) {
      const sourceExt = new Set([".jsx", ".tsx", ".vue", ".svelte", ".astro", ".ejs", ".js", ".ts"]);
      if (!sourceExt.has(file.extension) || file.lines.length < 550) return [];
      return [{ index: 0, meta: { lines: file.lines.length } }];
    },
    description: "Very large UI files often combine data access, state, validation, orchestration and rendering in one maintenance hotspot.",
    suggestion: "Extract boundaries by responsibility, not merely by line count. Keep orchestration near the page and reusable behavior in focused modules.",
    bad: 'Dashboard.tsx // 1,100 lines, 18 hooks, networking and five modals',
    good: 'DashboardPage + DashboardData + ActivityTable + SettingsDialog'
  })
];

export const projectRules = [
  motion({
    id: "project.multiple-animation-libraries",
    severity: "warning", confidence: 99,
    title: "Multiple animation libraries detected",
    run(ctx) {
      const libs = ctx.project.animationLibraries;
      if (libs.length < 2) return [];
      return [{ file: "package.json", line: 1, snippet: libs.join(", "), meta: { libraries: libs } }];
    },
    description: "Multiple animation systems increase bundle size, mental overhead and inconsistent motion behavior.",
    suggestion: "Standardize on the smallest set that covers actual product requirements.",
    bad: 'framer-motion + gsap + animejs + aos',
    good: 'one primary motion system plus native CSS transitions where sufficient'
  }),
  visual({
    id: "project.multiple-icon-libraries",
    severity: "info", confidence: 99,
    title: "Multiple icon libraries detected",
    run(ctx) {
      const libs = ctx.project.iconLibraries;
      if (libs.length < 2) return [];
      return [{ file: "package.json", line: 1, snippet: libs.join(", "), meta: { libraries: libs } }];
    },
    description: "Multiple icon sets can create inconsistent stroke language and ship duplicate glyph infrastructure.",
    suggestion: "Choose a primary icon family and allow exceptions only when a specific symbol is unavailable.",
    bad: 'lucide-react + react-icons + heroicons',
    good: 'one documented icon system'
  }),
  motion({
    id: "project.motion-without-reduced-motion",
    severity: "critical", confidence: 93,
    title: "Project uses motion but no prefers-reduced-motion policy was found",
    run(ctx) {
      const joined = ctx.files.map((f) => f.content).join("\n");
      const hasMotion = /(animation\s*:|@keyframes|framer-motion|motion\.|gsap\.|data-aos)/i.test(joined);
      const hasReduced = /prefers-reduced-motion/i.test(joined);
      if (!hasMotion || hasReduced) return [];
      return [{ file: "(project)", line: 1, snippet: "Motion detected; no prefers-reduced-motion policy found." }];
    },
    description: "A project-level reduced-motion policy is a more reliable safeguard than hoping each animated component handles the preference independently.",
    suggestion: "Add global reduced-motion CSS and make JavaScript animation systems consult matchMedia('(prefers-reduced-motion: reduce)').",
    bad: 'animations throughout the project, no reduced-motion branch',
    good: '@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto; } }'
  }),
  maintain({
    id: "project.z-index-soup",
    severity: "high", confidence: 86,
    title: "Many unrelated high z-index values",
    run(ctx) {
      const values = [];
      const re = /(?:z-index\s*:\s*|z-\[)(\d{3,})/g;
      for (const file of ctx.files) {
        let match;
        while ((match = re.exec(file.content))) values.push(Number(match[1]));
      }
      const unique = [...new Set(values)].sort((a, b) => a - b);
      if (unique.length < 4) return [];
      return [{ file: "(project)", line: 1, snippet: `High z-index values: ${unique.slice(0, 10).join(", ")}`, meta: { values: unique } }];
    },
    description: "Several unrelated high stacking values indicate local escalation rather than a controlled layer system.",
    suggestion: "Replace numeric competition with named layer tokens and document which component types own each layer.",
    bad: '100, 999, 9999, 99999, 2147483647',
    good: '--layer-sticky: 20; --layer-dropdown: 40; --layer-modal: 60; --layer-toast: 80;'
  }),
  visual({
    id: "project.spacing-token-drift",
    severity: "warning", confidence: 67,
    title: "Possible spacing token drift",
    run(ctx) {
      const counts = new Map();
      const re = /(?:margin|padding|gap|top|right|bottom|left)\s*:\s*(\d+)px\b/g;
      for (const file of ctx.files) {
        if (![".css", ".scss", ".sass", ".less"].includes(file.extension)) continue;
        let m;
        while ((m = re.exec(file.content))) {
          const n = Number(m[1]);
          if (n > 0 && n < 100) counts.set(n, (counts.get(n) ?? 0) + 1);
        }
      }
      const values = [...counts.keys()].sort((a, b) => a - b);
      if (values.length < 12) return [];
      return [{ file: "(project)", line: 1, snippet: `Spacing values: ${values.slice(0, 20).map((v) => `${v}px`).join(", ")}`, meta: { values } }];
    },
    description: "A large number of one-off spacing values often means components are being tuned independently instead of using a shared rhythm.",
    suggestion: "Create a spacing scale and migrate frequently repeated values first. Keep exceptions when geometry truly requires them.",
    bad: '7px, 11px, 13px, 19px, 23px, 27px, 31px ...',
    good: '4px, 8px, 12px, 16px, 24px, 32px ...'
  })
];

export const allRules = [...lineRules, ...fileRules, ...projectRules];

export function getRule(id) {
  return allRules.find((rule) => rule.id === id) ?? null;
}
