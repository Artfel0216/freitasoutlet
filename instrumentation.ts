import { logger } from '@/lib/logger'

export async function register() {
  try {
    const isEdge = typeof process === 'undefined' || process.env.NEXT_RUNTIME === 'edge' || !process.versions?.node
    if (isEdge) {
      logger.info('[INSTRUMENTATION] Skipping database initialization on Edge Runtime')
      return
    }

    logger.info('[INSTRUMENTATION] Skipping database initialization from instrumentation; schema will be created lazily on first DB access')
  } catch (err) {
    logger.error('[INSTRUMENTATION] Failed to run instrumentation register', { error: String(err) })
  }
}

export function onRequestError(err: unknown, request: Request) {
  if (process.env.NODE_ENV === 'development') {
    logger.error('Request error:', { error: String(err), url: request.url })
  }
}
