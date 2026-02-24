# Project guidelines

## About this file
Keep rules short and specific. Phrase behavioral rules as a test to apply before submitting ("does this edit contain X?"), not as a general principle ("always do X"). Include the failure mode for rules that are easy to rationalize around. Don't duplicate rules from this file in MEMORY.md.

## Edit discipline
Before submitting any edit, verify:
- Every new import has its usage in the same edit — if not, remove the import
- Every removed import has its usage removed in the same edit
- The substantive change is visible in this edit, not deferred to a follow-up

❌ Adding `useState` import, then the state usage in the next edit
✅ Import and usage land together in one edit

## CSS edits
Before adding any CSS rule, check:
- Was this visual detail explicitly requested? If not, don't add it
- Does an existing styled component already cover this? Reuse or extend it rather than creating a new one
- Is this rule doing visible work? If removing it doesn't change the output, remove it

Prefer one broad rule over several specific ones. A component with 10 properties in one selector beats 5 selectors with 2 properties each.

❌ Adding margin, font-size, color, letter-spacing tweaks that weren't asked for
✅ Write the minimum CSS that achieves the requested layout or style

## Code style
- If a solution looks convoluted, the approach is probably wrong — step back and reconsider
- Use data already available through type inheritance rather than looking up definitions from a registry
- Use existing patterns in the codebase (`Partial<ResourceStore>`, lodash utilities) rather than inventing new shapes for the same data
- Use default parameters over nullish coalescing where possible (`(a = 0, b = 0) => a + b`)
- Don't make fields optional when an empty value (e.g. `[]`) is equivalent
- When mutating store state, only pass the keys that change — the mutation does a shallow merge
