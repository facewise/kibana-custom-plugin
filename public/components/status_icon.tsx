import React, { useState, useEffect } from 'react';
import {
  DataPublicPluginStart,
  IndexPattern,
  ISearchSource,
  SortDirection,
} from '../../../../src/plugins/data/public';

import { EuiIcon } from '@elastic/eui';

interface StatusIconDeps {
  data: DataPublicPluginStart;
  url: string;
}

export const StatusIcon = ({ data, url }: StatusIconDeps) => {
  const [color, setColor] = useState<string>('grey');

  let searchSource: ISearchSource;
  let indexPattern: IndexPattern;
  let _intervalId: NodeJS.Timeout;

  const searchData = () => {
    searchSource
      .setField('index', indexPattern)
      .setField('size', 1)
      .setField('query', {
        query: {
          match_phrase: {
            'url.full': `${url}`,
          },
        },
        language: 'lucene',
      })
      .setField('sort', { '@timestamp': SortDirection.desc })
      .fetch()
      .then((response) => {
        setColor(response.hits.hits[0]._source.summary.up === 1 ? 'green' : 'red');
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const findIndex = async () => {
    searchSource = await data.search.searchSource.create();
    [indexPattern] = await data.indexPatterns.find('logstash-index-test*');
  };

  useEffect(() => {
    findIndex()
      .then(() => {
        searchData();
        _intervalId = setInterval(searchData, 5000);
      })
      .catch((e) => {
        console.error(e);
      });

    // This return phrase is called when the element is unmounted from DOM.
    return () => {
      clearInterval(_intervalId);
    };
  }, []);

  return <EuiIcon key={url} type="annotation" size="xxl" color={color} />;
};
