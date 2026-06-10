/**
 * Metro resolves `database.native.ts` / `database.web.ts` at bundle time.
 * This file exists for TypeScript module resolution.
 */
export { getDatabase, resetDatabase } from './database.native';
