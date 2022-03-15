import { i18n } from '@kbn/i18n';
import { AppMountParameters, CoreSetup, CoreStart, Plugin } from '../../../src/core/public';
import { TestPluginSetup, TestPluginStart, AppPluginStartDependencies } from './types';
import { PLUGIN_NAME } from '../common';

export class TestPlugin implements Plugin<TestPluginSetup, TestPluginStart> {
  public setup(core: CoreSetup): TestPluginSetup {
    // Register an application into the side navigation menu
    core.application.register({
      id: 'test',
      title: PLUGIN_NAME,
      async mount(params: AppMountParameters) {
        // Load application bundle
        const { renderApp } = await import('./application');
        // Get start services as specified in kibana.json
        const [coreStart, depsStart] = await core.getStartServices();
        // Render the application
        return renderApp(coreStart, depsStart as AppPluginStartDependencies, params);
      },
    });

    // Return methods that should be available to other plugins
    return {
      getGreeting() {
        return i18n.translate('test.greetingText', {
          defaultMessage: 'Hello from {name}!',
          values: {
            name: PLUGIN_NAME,
          },
        });
      },
    };
  }

  public start(core: CoreStart): TestPluginStart {
    return {};
  }

  public stop() {}
}
