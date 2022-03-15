import { TestPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, Kibana Platform `plugin()` initializer.
export function plugin() {
  return new TestPlugin();
}
export { TestPluginSetup, TestPluginStart } from './types';
