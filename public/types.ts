import { DataPublicPluginStart } from '../../../src/plugins/data/public';

export interface RestartingPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RestartingPluginStart {}

export interface AppPluginStartDependencies {
  data: DataPublicPluginStart;
}
