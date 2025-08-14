/**
 * Lightweight service tests without external test runner.
 * Run manually by importing and invoking runServiceTests() from a script if desired.
 */
import { toolsService } from '@/lib/supabase/services/toolsService';
import { updatesService } from '@/lib/supabase/services/updatesService';
import { categoriesService } from '@/lib/supabase/services/categoriesService';

type TestResult = { name: string; success: boolean; error?: unknown };

export async function runServiceTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      results.push({ name, success: true });
    } catch (error) {
      results.push({ name, success: false, error });
    }
  }

  // Read-only smoke checks (will work if Supabase env is configured; otherwise should not throw synchronously)
  await test('toolsService.getAllTools returns shape', async () => {
    const { data } = await toolsService.getAllTools();
    if (data && !Array.isArray(data)) throw new Error('Expected array');
  });

  await test('updatesService.getLatestUpdates returns shape', async () => {
    const { data } = await updatesService.getLatestUpdates(1);
    if (data && !Array.isArray(data)) throw new Error('Expected array');
  });

  await test('categoriesService.getAllCategories returns shape', async () => {
    const { data } = await categoriesService.getAllCategories();
    if (data && !Array.isArray(data)) throw new Error('Expected array');
  });

  return results;
}


