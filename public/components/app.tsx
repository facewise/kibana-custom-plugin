import React, { useEffect, useState } from 'react';
import { i18n } from '@kbn/i18n';
import { FormattedMessage, I18nProvider } from '@kbn/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CoreStart } from '../../../../src/core/public';
import { PLUGIN_NAME } from '../../common'
import { Config } from '../../config';

import {
  DataPublicPluginStart,
  ISearchSource,
  SortDirection,
} from '../../../../src/plugins/data/public';

import { DataView } from '../../../../src/plugins/data_views/common';

import {
  EuiButton,
  EuiHorizontalRule,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageHeader,
  EuiTitle,
  EuiText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
} from '@elastic/eui'

interface RestartingAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  data: DataPublicPluginStart;
  http: CoreStart['http'];
}

export const RestartingApp = ({ basename, notifications, data, http }: RestartingAppDeps) => {
  let searchSource: ISearchSource;
  let dataView: DataView;

  // Use React hooks to manage state.
  const [color, setColor] = useState<string>(Config.color.default);
  //Create search source and find index patterns (->data views).
  useEffect(() => {
    const call = async () => {
      [dataView] = await data.dataViews.find(Config.dataView);
      searchSource = (await data.search.searchSource.create())
        .setField('index', dataView)
        .setField('size', 1)
        .setField('sort', { '@timestamp': SortDirection.desc })
        .setField('query', {
          query: {
            match: {
              'monitor.ip': Config.monitor[0],
            },
          },
          language: 'lucene',
        });
    };
    call().then(() => {
      data.query.timefilter.timefilter.setRefreshInterval({
        pause: false,
        value: 5000,
      });
      const autoRefreshFetch$ = data.query.timefilter.timefilter.getAutoRefreshFetch$();
      autoRefreshFetch$.subscribe(
        (next) => {
          const search$ = searchSource.fetch$();
          search$.subscribe(
            (done) => {
              setColor(
                done.rawResponse.hits.hits[0]._source.summary.up === 1
                  ? Config.color.up
                  : Config.color.down
              );
            },
            (e) => {
              throw Error(e);
            },
            () => { }
          );
          next();
        },
        (e) => {
          throw Error(e);
        },
        () => { }
      );
    });

    return () => {
      data.query.timefilter.timefilter.setRefreshInterval({ value: 0 });
    }
  }, []);

  const onClickJenkinsHandler = () => {
    fetch('http://192.168.88.142:9090/buildByToken/build?job=study&token=PLEASERESTART', {
      method: 'POST',
      mode: 'no-cors',
    })
      .then(() => {
        notifications.toasts.addSuccess('Succeed');
      })
      .catch((e) => {
        notifications.toasts.addDanger('Error occured');
        throw Error(e);
      });
  };

  const onClickScriptHandler = () => {
    http.get('/api/restarting/ssh')
      .then((res) => {
        notifications.toasts.addSuccess('Succeed');
      })
      .catch((e) => {
        notifications.toasts.addDanger('Error occured');
        throw Error(e);
      });
  };

  // Render the application DOM.
  return (
    <Router basename={basename}>
      <I18nProvider>
        <>
          <EuiPage restrictWidth="800px">
            <EuiPageBody>
              <EuiPageHeader>
                <EuiTitle size='l'>
                  <h1>
                    <FormattedMessage
                      id="restarting.title"
                      defaultMessage="{name} plugin"
                      values={{ name: PLUGIN_NAME }}
                    />
                  </h1>
                </EuiTitle>
              </EuiPageHeader>
              <EuiPageContent>
                <EuiPageContentHeader>
                  <EuiTitle>
                    <h2>
                      <p>
                        <FormattedMessage
                          id="restarting.subTitle"
                          defaultMessage="If you click button, Kibana connects the server via SSH and execute command."
                        />
                      </p>
                    </h2>

                  </EuiTitle>
                </EuiPageContentHeader>
                <EuiPageContentBody>
                  <EuiHorizontalRule />
                  <EuiFlexGroup gutterSize='l' style={{ width: 300 }} alignItems="center">
                    <EuiFlexItem grow={1}>
                      <EuiIcon type="annotation" color={color} size="xxl" title="AP Server" />
                      <EuiText>AP Server</EuiText>
                    </EuiFlexItem>
                    <EuiFlexItem grow={1}>
                      <EuiButton type="primary" size="s" onClick={onClickScriptHandler}>
                        <FormattedMessage id="restarting.buttonText" defaultMessage="Execute shell script" />
                      </EuiButton>
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiPageContentBody>


              </EuiPageContent>
            </EuiPageBody>
          </EuiPage>
        </>
      </I18nProvider>
    </Router>
  );
};
