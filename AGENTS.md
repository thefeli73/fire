<!-- BEGIN:nextjs-agent-rules -->
 
# Next.js: ALWAYS read docs before coding
 
Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.
 
<!-- END:nextjs-agent-rules -->

## Product constraints

- **When:** editing calculator UI, chart labels, examples, metadata, or learning content that references amounts.
- **Do:** keep amounts currency-agnostic: use labels like `portfolio balance`, `monthly allowance`, `40,000`, or `40k`.
- **Don't:** hard-code currency names, currency symbols, or currency-specific terms.
- **Verify:** search changed user-facing files for currency codes, currency terms, and symbol-prefixed amounts before claiming done.
- **Scope:** FIRE calculator, charts, metadata, and learn pages.
