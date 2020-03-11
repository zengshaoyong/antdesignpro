import React from 'react';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {FormattedMessage} from 'umi-plugin-react/locale';
import {Card, Typography, Alert, Carousel} from 'antd';
import styles from './Welcome.less';

const CodePreview = ({children}) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);



export default () => (
  <div>
    <div>Welcome</div>
  </div>

);
