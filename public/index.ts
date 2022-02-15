import './index.scss';

import { StudyPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, Kibana Platform `plugin()` initializer.
export function plugin() {
  return new StudyPlugin();
}
export { StudyPluginSetup, StudyPluginStart } from './types';
