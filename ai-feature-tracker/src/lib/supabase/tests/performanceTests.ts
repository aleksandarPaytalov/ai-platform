import { timeAsync } from '@/lib/supabase/utils/debug';
import { toolsService } from '@/lib/supabase/services/toolsService';

export async function runPerformanceTests() {
  const { ms } = await timeAsync('toolsService.getAllTools', async () => {
    const { data } = await toolsService.getAllTools();
    return data;
  });
  return { name: 'getAllTools performance', ms };
}


