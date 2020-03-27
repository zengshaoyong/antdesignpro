import React from 'react';
import {connect} from 'dva';

class manage_redis extends React.Component {
  state = {}

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
}))(manage_redis);
