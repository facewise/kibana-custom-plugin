import { DataPublicPluginStart } from '../../../src/plugins/data/public';

export interface StudyPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StudyPluginStart {}

export interface AppPluginStartDependencies {
  data: DataPublicPluginStart;
}
