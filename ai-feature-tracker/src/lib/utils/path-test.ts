// Test file to verify TypeScript path mappings
import type { Env } from '@/lib/config';
// import { Button } from '@/components/ui'; // Commented out until Button component exists
import type { Database } from '@/types/database.types';

// This file should compile without errors if path mappings are correct
export function testPathMappings(): void {
  console.log('TypeScript path mappings are working correctly');
  // console.log('Button component:', Button); // Commented out until Button component exists
}

// Test that imports resolve correctly
export type TestTypes = {
  env: Env;
  database: Database;
};
