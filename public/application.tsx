import React from 'react';
import ReactDOM from 'react-dom';
import { AppMountParameters, CoreStart } from '../../../src/core/public';
import { AppPluginStartDependencies } from './types';
import { RestartingApp } from './components/app';

export const renderApp = (
  { notifications, http }: CoreStart,
  { data }: AppPluginStartDependencies,
  { appBasePath, element }: AppMountParameters
) => {
  ReactDOM.render(
    <RestartingApp
      basename={appBasePath}
      notifications={notifications}
      data={data}
      http={http}
    />,
    element
  );

  return () => {
    ReactDOM.unmountComponentAtNode(element);
  }
}