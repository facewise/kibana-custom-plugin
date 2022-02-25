import './index.scss';

import { RestartingPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, Kibana Platform `plugin()` initializer.
export function plugin() {
  return new RestartingPlugin();
}
export { RestartingPluginSetup, RestartingPluginStart } from './types';
