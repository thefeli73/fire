/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import './src/env';

const suppliedBuildDate = process.env.BUILD_DATE;
const parsedBuildDate = suppliedBuildDate === undefined ? new Date() : new Date(suppliedBuildDate);

if (Number.isNaN(parsedBuildDate.getTime())) {
  throw new Error(`Invalid BUILD_DATE "${suppliedBuildDate}": expected a valid date string`);
}

const buildDate = parsedBuildDate.toISOString();

/** @type {import("next").NextConfig} */
const config = {
  cacheComponents: true,
  env: {
    BUILD_DATE: buildDate,
  },
  output: 'standalone',
  partialPrefetching: true,
};

export default config;
