import { PluginInitializerContext } from '../../../src/core/server';
import { RestartingPlugin } from './plugin';

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new RestartingPlugin(initializerContext);
}

export { RestartingPluginSetup, RestartingPluginStart } from './types';
