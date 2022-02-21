import { i18n } from '@kbn/i18n';
import { AppMountParameters, CoreSetup, CoreStart, Plugin } from '../../../src/core/public';
import { RestartingPluginSetup, RestartingPluginStart, AppPluginStartDependencies } from './types';
import { PLUGIN_NAME } from '../common';

export class RestartingPlugin implements Plugin<RestartingPluginSetup, RestartingPluginStart> {
  public setup(core: CoreSetup): RestartingPluginSetup {
    // Register an application into the side navigation menu
    core.application.register({
      id: 'restarting',
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
        return i18n.translate('study.greetingText', {
          defaultMessage: 'Hello from {name}!',
          values: {
            name: PLUGIN_NAME,
          },
        });
      },
    };
  }

  public start(core: CoreStart): RestartingPluginStart {
    return {};
  }

  public stop() {
    
  }
}
