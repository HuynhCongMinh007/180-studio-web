# Code Style

Durable rules for how frontend code is written in this repository. Read this before creating or editing a page, route, or component.

## 1. Comments

Goal: code that a junior developer can read and review quickly. Comments are written in English.

### 1.1 Standards followed

These come from published standards. Do not change them without changing the source they reference.

- **Doc comments use TSDoc** (`/** ... */`, see tsdoc.org). Use them for things another developer calls or uses: exported components, functions, hooks, and types.
- **Implementation comments use `//`** and go inside the code, on their own line above the code they explain (Google TypeScript Style Guide).
- **Do not write types in comments.** TypeScript already declares them, so no `{string}` in `@param` (Google TypeScript Style Guide).
- **Do not restate the code or the name of a parameter.** A comment that only repeats what the code says adds noise and gets outdated (Google TypeScript Style Guide).
- **`TODO` comments name a reference**, for example `// TODO(#123): Replace mock data with the API call.` A `TODO` without an issue or owner is not allowed (Google style guides).
- **Never leave commented-out code.** Delete it; git keeps the history.

### 1.2 Project rules

- **Explain why, not what.** Good reasons to comment:
  - a business rule or a rule from `docs/specs/` (cite the section, for example `spec §9.2`);
  - a non-obvious choice, workaround, or limitation;
  - a behavior that is easy to misread, such as `%` used to wrap around, or a cleanup function;
  - a React or Next.js concept a junior is likely to miss, such as why a file is a Client Component.
- **Do not comment obvious code.** If a clear variable or function name already tells the story, write no comment. Prefer renaming over commenting.
- **Keep comments short.** One or two plain sentences. Simple words, no jargon, no clever wording.
- **One comment per idea, above the line it explains.** No trailing comments at the end of a code line.
- **Update or remove a comment in the same change that makes it wrong.**
- **Mark a Client Component with the reason** on the line above `"use client"`, for example `// Client Component: uses state and a timer.`
- **Mock or temporary data must say so** and point to what replaces it, using the `TODO` format in 1.1.

### 1.3 Example

```tsx
/** Shows the current slide full screen and moves to the next one on a timer. */
export function HomeSlideshow({ slides }: { slides: HomeSlide[] }) {
  useEffect(() => {
    // One slide has nothing to rotate to.
    if (totalSlides < 2) return;

    const timer = setInterval(() => {
      // "%" sends the index back to 0 after the last slide.
      setCurrentIndex((previousIndex) => (previousIndex + 1) % totalSlides);
    }, SLIDE_INTERVAL_MS);

    // Without this, the timer keeps running after the component is removed.
    return () => clearInterval(timer);
  }, [totalSlides]);
}
```

Not allowed:

```tsx
// Set the index to 0
const [currentIndex, setCurrentIndex] = useState(0);

const timer = setInterval(...); // start timer
```
