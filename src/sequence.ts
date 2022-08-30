import {MiddlewareSequence, RequestContext} from '@loopback/rest';
import {LoggingBindings} from '@loopback/logging';
import {inject} from '@loopback/core';
import {WinstonLogger} from '@loopback/logging';
export class MySequence extends MiddlewareSequence {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;

  async handle(context: RequestContext): Promise<void> {
    const {request} = context;
    this.logger.log({
      level: 'info',
      message: `${request.method} ${request.originalUrl}`,
    });

    const finished = await this.invokeMiddleware(context, this.options);
    if (finished) return;
  }
}
