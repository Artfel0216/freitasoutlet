import { logger } from '@/lib/logger'

export function onRequestError(err: unknown, request: Request) {
  if (process.env.NODE_ENV === 'development') {
    logger.error('Request error:', { error: String(err), url: request.url })
  }
}
