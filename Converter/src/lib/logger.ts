export type LogLevel = 'info' | 'warn' | 'error';

export function logEvent(level: LogLevel, message: string, meta?: Record<string, any>) {
  try {
    const payload = { level, message, meta, timestamp: new Date().toISOString() };
    if (typeof window === 'undefined') {
      // Server-side logging
      console[level === 'error' ? 'error' : level](JSON.stringify(payload));
    } else {
      // Client-side logging
      console[level === 'error' ? 'error' : level](payload);
    }
  } catch (e) {
    // Ensure logging never throws
    console.error('[logger] failed to log event');
  }
}

export function captureError(err: unknown, context?: Record<string, any>) {
  const normalized = err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : { message: String(err) };
  logEvent('error', '[error boundary]', { ...normalized, context });
}