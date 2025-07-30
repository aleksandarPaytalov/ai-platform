// Real-time event types
export interface RealtimeEvent {
  type: 'insert' | 'update' | 'delete';
  table: string;
  record: any;
  oldRecord?: any;
}

export interface RealtimeSubscription {
  id: string;
  table: string;
  event: string;
  filter?: string;
  callback: (payload: RealtimeEvent) => void;
}

export interface RealtimeConnection {
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  lastHeartbeat?: Date;
  error?: string;
}
