import React from 'react';
import {connect} from 'dva';

class manage_redis extends React.Component {


  render() {
    return (
      <div>

      </div>
    )

  }
}


export default connect(({manager, loading}) => ({
  manager,
  loading: loading.models.audit
}))(manage_redis);
