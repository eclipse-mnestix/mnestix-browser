import pino from 'pino';
import pretty from 'pino-pretty';
import { v4 as uuidv4 } from 'uuid';

const isProduction = process.env.NODE_ENV === 'production';

const stream = pretty({
    colorize: true,
    translateTime: 'SYS:standard',
    ignore: 'pid,hostname',
});

const baseLogger = isProduction
    ? pino({ level: 'info' })
    : pino(
          {
              level: 'debug',
          },
          stream,
      );

export const createLogger = (correlationId: string) => baseLogger.child({ correlationId });

export default baseLogger;

export const getCorrelationId = (headers: Headers) => {
    let correlationId = headers.get('x-correlation-id');
    if (!correlationId) {
        correlationId = uuidv4();
    }
    return correlationId;
};
