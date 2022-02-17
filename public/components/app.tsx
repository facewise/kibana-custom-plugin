import React, { useEffect, useState } from 'react';
import { i18n } from '@kbn/i18n';
import { FormattedMessage, I18nProvider } from '@kbn/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Config } from '../../config';
import { CoreStart } from '../../../../src/core/public';
import { PLUGIN_ID, PLUGIN_NAME } from '../../common';

import {
  DataPublicPluginStart,
  IndexPattern,
  ISearchSource,
  SortDirection,
} from '../../../../src/plugins/data/public';

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

interface StudyAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  data: DataPublicPluginStart;
  http: CoreStart['http'];
}

export const StudyApp = ({ basename, notifications, data, http }: StudyAppDeps) => {
  // console.log('rendered');
  let searchSource: ISearchSource;
  let indexPattern: IndexPattern | undefined;

  // Create searchSource and find index patterns.
  const call = async () => {
    searchSource = await data.search.searchSource.create();
    [indexPattern] = await data.indexPatterns.find(Config.indexPattern);
  };

  call();
  // Use React hooks to manage state.
  // const [hits, setHits] = useState<Array<Record<string, any>>>();
  const [color, setColor] = useState<string>(Config.color.default);

  // Use useEffect function to manage the lifecycle.
  useEffect(() => {
    data.query.timefilter.timefilter.setRefreshInterval({
      pause: false,
      value: Config.refreshIntervalValue,
    });
    // autoRefreshFetch$ makes a stream every {refreshInterval.value} milliseconds.
    const autoRefreshFetch$ = data.query.timefilter.timefilter.getAutoRefreshFetch$();

    // Query object must have language property with either 'lucene' or 'kuery'.
    // Lucene represents QueryDSL, the other does ESQuery.
    autoRefreshFetch$.subscribe(() => {
      searchSource
        .setField('index', indexPattern)
        .setField('size', 1)
        .setField('query', {
          query: {
            match: {
              'monitor.ip': Config.monitor[0],
            },
          },
          language: 'lucene',
        })
        .setField('sort', { '@timestamp': SortDirection.desc })
        .fetch()
        .then((response) => {
          // setHits(res.hits.hits);
          setColor(
            response.hits.hits[0]._source.summary.up === 1 ? Config.color.up : Config.color.down
          );
        });
    });
    // This return phrase is called when the element is unmounted from DOM.
    return () => {
      data.query.timefilter.timefilter.setRefreshInterval({ pause: true });
    };
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
