import { DataPublicPluginStart } from '../../../src/plugins/data/public';

export interface TestPluginSetup {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TestPluginStart {}

export interface AppPluginStartDependencies {
  data: DataPublicPluginStart;
}