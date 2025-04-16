import pino from 'pino';
import pretty from 'pino-pretty';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponseWrapper, ApiResponseWrapperError } from 'lib/util/apiResponseWrapper/apiResponseWrapper';

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

/**
 * Creates a logger instance with a correlation ID for tracking requests.
 *
 * @param headers - Optional Headers object used to extract or generate a correlation ID.
 * @returns A logger instance with the correlation ID included.
 */
export const createRequestLogger = (headers?: Headers) => {
    const correlationId = !headers
        ? 'undefined'
        : getCorrelationId(headers as Headers);
    return baseLogger.child({ Correlation_ID: correlationId });
};

export default baseLogger;

/**
 * Logs an informational message with optional metadata.
 *
 * @param logger - The logger instance to use for logging.
 * @param methodName - The name of the method where the log is being generated.
 * @param message - The log message.
 * @param optional - Additional optional metadata to include in the log.
 */
export const logInfo = (logger: typeof baseLogger, methodName: string, message: string, optional?: object): void =>
    logger.info(
        {
            Method: methodName,
            ...optional,
        },
        message,
    );


/**
 * Logs a warning message with optional metadata.
 *
 * @param logger - The logger instance to use for logging the warning.
 * @param methodName - The name of the method where the warning occurred.
 * @param message - The warning message to log.
 * @param optional - An optional object containing additional context or metadata to include in the log.
 */
export const logWarn = (logger: typeof baseLogger, methodName: string, message: string, optional?: object): void =>
    logger.warn(
        {
            Method: methodName,
            ...optional,
        },
        message,
    );

/**
 * Logs an informational message with optional metadata and an API response.
 *
 * @param logger - The logger instance to use for logging.
 * @param methodName - The name of the method where the log is being generated.
 * @param message - The log message.
 * @param response - An API response wrapper containing HTTP status and text.
 * @param optional - Additional optional metadata to include in the log.
 */
export const logResponseDebug = <T>(
    logger: typeof baseLogger,
    methodName: string,
    message: string,
    response: ApiResponseWrapper<T>,
    optional?: object,
): void =>
    logger.debug(
        {
            Method: methodName,
            Http_Status: response?.httpStatus,
            Http_Message: response?.httpText ?? (response as ApiResponseWrapperError<T>)?.errorCode,
            ...optional,
        },
        message,
    );

export const logResponseInfo = <T>(
    logger: typeof baseLogger,
    methodName: string,
    message: string,
    response: ApiResponseWrapper<T>,
    optional?: object,
): void =>
    logger.info(
        {
            Method: methodName,
            Http_Status: response?.httpStatus,
            Http_Message: response?.httpText ?? (response as ApiResponseWrapperError<T>)?.errorCode,
            ...optional,
        },
        message,
    );

export const logResponseWarn = <T>(
    logger: typeof baseLogger,
    methodName: string,
    message: string,
    response: ApiResponseWrapper<T>,
    optional?: object,
): void =>
    logger.warn(
        {
            Method: methodName,
            Http_Status: response?.httpStatus,
            Http_Message: response?.httpText ?? (response as ApiResponseWrapperError<T>)?.errorCode,
            ...optional,
        },
        message,
    );

export const getCorrelationId = (headers: Headers) => {
    let correlationId = headers.get('x-correlation-id');
    if (!correlationId) {
        correlationId = uuidv4();
    }
    return correlationId;
};