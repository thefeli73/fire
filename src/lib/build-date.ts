const iso = process.env.BUILD_DATE;

if (iso === undefined) {
  throw new Error('BUILD_DATE is missing; inject it through next.config.ts');
}

export const getBuildDate = () => ({
  year: iso.slice(0, 4),
  iso,
  date: iso.slice(0, 10),
});
