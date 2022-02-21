import React, { useEffect, useState } from 'react';
import { i18n } from '@kbn/i18n';
import { FormattedMessage, I18nProvider } from '@kbn/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Config } from '../../config';
import { CoreStart } from '../../../../src/core/public';
import { PLUGIN_ID, PLUGIN_NAME } from '../../common';

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
} from '@elastic/eui';

interface RestartingAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  data: DataPublicPluginStart;
  http: CoreStart['http'];
}

export const RestartingApp = ({ basename, notifications, data, http }: RestartingAppDeps) => {
  let searchSource: ISearchSource;
  let dataView: DataView | undefined;

  // Use React hooks to manage state.
  // const [hits, setHits] = useState<Array<Record<string, any>>>();
  const [color, setColor] = useState<string>(Config.color.default);

  // Create searchSource and find index patterns.
  useEffect(() => {
    const call = async () => {
      [dataView] = await data.dataViews.find(Config.dataView);
      searchSource = (await data.search.searchSource.create())
        .setField('index', dataView)
        .setField('size', 1)
        .setField('query', {
          query: {
            match: {
              'monitor.ip': Config.monitor[0],
            },
          },
          language: 'lucene',
        })
        .setField('sort', { '@timestamp': SortDirection.desc });
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
            () => {}
          );
          next();
        },
        (e) => {
          throw Error(e);
        },
        () => {}
        // .then((response) => {
        //   // setHits(res.hits.hits);
        //   setColor(
        //     response.hits.hits[0]._source.summary.up === 1 ? Config.color.up : Config.color.down
        //   );
        // });
      );
    });

    return () => {
      data.query.timefilter.timefilter.setRefreshInterval({ value: 0 });
    }
  }, []);

  const onClickHandler = () => {
    fetch('http://192.168.88.142:9090/buildByToken/build?job=study&token=PLEASERESTART', {
      method: 'POST',
      mode: 'no-cors',
    })
      .then(() => {
        alert('Succeed');
      })
      .catch((error) => {
        alert('Error. Check console');
        throw new Error(error);
      });
  };

  // Render the application DOM.
  return (
    <Router basename={basename}>
      <I18nProvider>
        <>
          <EuiPage restrictWidth="1000px">
            <EuiPageBody>
              <EuiPageHeader>
                <EuiTitle size="l">
                  <h1>
                    <FormattedMessage
                      id="study.helloWorldText"
                      defaultMessage="{id},{name}"
                      values={{ id: PLUGIN_ID, name: PLUGIN_NAME }}
                    />
                  </h1>
                </EuiTitle>
              </EuiPageHeader>
              <EuiPageContent>
                <EuiPageContentHeader>
                  <EuiTitle>
                    <h2>
                      <FormattedMessage
                        id="study.congratulationsTitle"
                        defaultMessage="Congratulations, you have successfully created a new Kibana Plugin!"
                      />
                    </h2>
                  </EuiTitle>
                </EuiPageContentHeader>
                <EuiPageContentBody>
                  <EuiText>
                    <p>
                      <FormattedMessage
                        id="study.content"
                        defaultMessage="Look through the generated code and check out the plugin development documentation."
                      />
                    </p>
                    <EuiHorizontalRule />
                    <EuiFlexGroup gutterSize="l" style={{ width: 300 }} alignItems="center">
                      <EuiFlexItem grow={1}>
                        <EuiIcon type="annotation" color={color} size="xxl" title="node-1" />
                        <EuiText>AP Server</EuiText>
                      </EuiFlexItem>
                      <EuiFlexItem grow={1}>
                        <EuiButton type="primary" size="s" onClick={onClickHandler}>
                          <FormattedMessage id="study.buttonText" defaultMessage="Click me" />
                        </EuiButton>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiText>
                  {/* <p>
                    <pre>
                      {JSON.stringify(hits, null, 2)}
                    </pre>
                  </p> */}
                </EuiPageContentBody>
              </EuiPageContent>
            </EuiPageBody>
          </EuiPage>
        </>
      </I18nProvider>
    </Router>
  );
};
