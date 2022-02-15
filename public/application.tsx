import React from 'react';
import ReactDOM from 'react-dom';
import { AppMountParameters, CoreStart } from '../../../src/core/public';
import { AppPluginStartDependencies } from './types';
import { StudyApp } from './components/app';

export const renderApp = (
  { notifications, http }: CoreStart,
  { data }: AppPluginStartDependencies,
  { appBasePath, element }: AppMountParameters
) => {
  ReactDOM.render(
    <StudyApp
      basename={appBasePath}
      notifications={notifications}
      data={data}
      http={http}
    />,
    element
  );

  return () => {
    ReactDOM.unmountComponentAtNode(element);
    // Setting refreshInterval.pause to true stops auto-fetching.
    data.query.timefilter.timefilter.setRefreshInterval({ pause: true })
  };
};
