import React from 'react';
import {connect} from 'dva';
import {Table, Button, Modal, Input, Row} from 'antd';
import styles from './index.less';


class manage_user extends React.Component {


  render() {
    return (
      <div>

      </div>
    )
  }

}

export default connect(({manager, loading}) => ({
  manager,
  loading: loading.models.manager
}))(manage_user);
