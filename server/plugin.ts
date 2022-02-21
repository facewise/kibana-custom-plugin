import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { RestartingPluginSetup, RestartingPluginStart } from './types';
import { defineRoutes } from './routes';

export class RestartingPlugin implements Plugin<RestartingPluginSetup, RestartingPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('restarting: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('restarting: Started');
    return {};
  }

  public stop() {}
}
