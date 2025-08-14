import { useEffect, useState } from 'react';
import { isOffline } from '@/lib/supabase/utils/cache';
import { getOfflineQueueLength } from '@/lib/supabase/utils/offline';

export function useOfflineBanner() {
  const [offline, setOffline] = useState<boolean>(isOffline());
  const [queued, setQueued] = useState<number>(getOfflineQueueLength());

  useEffect(() => {
    const handleOnline = () => {
      setOffline(false);
      setQueued(getOfflineQueueLength());
    };
    const handleOffline = () => {
      setOffline(true);
      setQueued(getOfflineQueueLength());
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    const interval = setInterval(() => setQueued(getOfflineQueueLength()), 1500);

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
      clearInterval(interval);
    };
  }, []);

  const message = offline
    ? queued > 0
      ? `You are offline. ${queued} change(s) will sync when back online.`
      : 'You are offline. Viewing cached data.'
    : queued > 0
    ? 'Reconnecting... syncing recent changes.'
    : null;

  return { offline, queued, message };
}


