import React, { useState, useEffect } from 'react';
import { FormattedMessage, I18nProvider } from '@kbn/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { MonitorTable } from './monitor_table';

import { DataPublicPluginStart } from '../../../../src/plugins/data/public';

import {
  EuiHorizontalRule,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageHeader,
  EuiTitle,
} from '@elastic/eui';

import { CoreStart } from '../../../../src/core/public';

import { PLUGIN_NAME } from '../../common';

interface TestAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  data: DataPublicPluginStart;
}



const areArraysEqual = (a: Array<string>, b: Array<string>): boolean => {
  return a.length === b.length && a.every((val, index) => val === b[index]);
};

export const TestApp = ({ basename, notifications, http, data }: TestAppDeps) => {
  // Use React hooks to manage state.
  const [targets, setTargets] = useState<Array<string>>([]);

  let _intervalId: NodeJS.Timeout;

  const getTargets = async () => {
    return await http.post('http://open-distro:9200/_opendistro/_sql', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: getQueryString(new Date()),
      }),
    });
  };

  const getQueryString = (date: Date) => {
    const today = date.toISOString().substring(0, 10);
    const yesterday = new Date(date.setDate(date.getDate() - 1)).toISOString().substring(0, 10);
  
    return (
      `SELECT DISTINCT url.full FROM logstash-index-test* ` +
      `WHERE DATE(@timestamp)=DATE('${today}') OR ` +
      `DATE(@timestamp)=DATE('${yesterday}')`
    );
  };

  const refreshTargets = () => {
    getTargets().then((res) => {
      let newArray = [];
      for (let i = 0; i < res.datarows.length; i++) {
        newArray.push(res.datarows[i][0]);
      }
      if (!areArraysEqual(targets, newArray)) {
        setTargets(newArray);
      }
    })
    .catch((e) => {
      console.error(e);
    });
  };

  useEffect(() => {
    refreshTargets();
    _intervalId = setInterval(refreshTargets, 5000);

    return () => {
      clearInterval(_intervalId);
    };
  }, [targets]);

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
                      id="test.helloWorldText"
                      defaultMessage="{name}"
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
                          id="test.subTitle"
                          defaultMessage="If you click button, Kibana connects the server via SSH and execute command."
                        />
                      </p>
                    </h2>
                  </EuiTitle>
                </EuiPageContentHeader>
                <EuiPageContentBody>
                  <EuiHorizontalRule />
                  <MonitorTable data={data} props={targets} />
                </EuiPageContentBody>
              </EuiPageContent>
            </EuiPageBody>
          </EuiPage>
        </>
      </I18nProvider>
    </Router>
  );
};
