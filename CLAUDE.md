# Project guidelines

## Code style

- If a solution looks convoluted, the approach is probably wrong - step back and reconsider
- Use data already available through type inheritance rather than looking up definitions from a registry
- Use existing patterns in the codebase (`Partial<ResourceStore>`, lodash utilities) rather than inventing new shapes for the same data
- Use default parameters over nullish coalescing where possible (`(a = 0, b = 0) => a + b`)
- Don't make fields optional when an empty value (e.g. `[]`) is equivalent
- Don't wrap simple data transformations in hooks or abstractions; plain functions and reduces are fine
- When mutating store state, only pass the keys that change - the mutation does a shallow merge
