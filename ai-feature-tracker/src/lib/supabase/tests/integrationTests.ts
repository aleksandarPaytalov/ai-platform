import { supabase } from '@/lib/supabase/client';

type TestResult = { name: string; success: boolean; error?: unknown };

export async function runIntegrationTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      results.push({ name, success: true });
    } catch (error) {
      results.push({ name, success: false, error });
    }
  }

  await test('Supabase connectivity', async () => {
    const { error } = await supabase.from('ai_tools').select('id').limit(1);
    if (error) throw error;
  });

  await test('Query tools table (limited)', async () => {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('id, name, is_active')
      .limit(5);
    if (error) throw error;
    if (data && !Array.isArray(data)) throw new Error('Expected array');
  });

  return results;
}


