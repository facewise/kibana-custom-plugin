import React from 'react';
import { DataPublicPluginStart } from '../../../../src/plugins/data/public';

import { EuiBasicTable, EuiButton } from '@elastic/eui';
import { StatusIcon } from './status_icon';

interface MonitorItemDeps {
  data: DataPublicPluginStart;
  props: Array<string>;
}

export const MonitorTable = ({ data, props }: MonitorItemDeps) => {
  /* const onClickHandler = () => {
    http
      .get('/api/test/ssh')
      .then((res) => {
        notifications.toasts.addSuccess('Succeed');
      })
      .catch((e) => {
        notifications.toasts.addDanger('Error occured');
        throw Error(e);
      });
  }; */

  const columns = [
    {
      field: 'host',
      name: 'Host',
      render: (url) => url.replace('http://', ''),
    },
    {
      field: 'status',
      name: 'Status',
      render: (url) => <StatusIcon data={data} url={url} />,
    },
    {
      field: 'button',
      name: 'Button',
      render: (url) => (
        <EuiButton color='primary' fill>
          Execute Shell Script
        </EuiButton>
      ),
    },
  ];

  const items = props.map((item) => {
    return {
      host: item,
      status: item,
      button: item,
    };
  });

  return (
    <EuiBasicTable
      tableCaption="Table"
      items={items}
      rowHeader="Host"
      columns={columns}
    />
  );
};
