import React from 'react';
import {Table, Divider, Tag} from 'antd';
import styles from './index.less';
import {connect} from "dva";

const {Column, ColumnGroup} = Table;

class Svc extends React.Component {
  state = {
    svcs: [],
  };


  UNSAFE_componentWillMount() {
    this.getsvcs()
  }

// const Pods = ({data}) => {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  getsvcs = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'kubernetes/fetchk8s',
      payload: {
        task: 'getsvc',
      },
    })
      .then(() => {
        const {data, loading} = this.props.kubernetes
        this.setState({
          svcs: data,
        })
        // console.log('result', this.state.svcs)
      });
  };

  render() {
    return (
      <Table dataSource={this.state.svcs} bordered={true} size="small" pagination={false} scroll={{y: 620}}>

        <Column title="name" dataIndex="name" key="name" align='center'/>
        <Column title="namespace" dataIndex="namespace" key="namespace" align='center'/>
        <Column title="cluster_ip" dataIndex="cluster_ip" key="cluster_ip" align='center'/>
        {/*<Column align='center'*/}
        {/*        title="Action"*/}
        {/*        key="action"*/}
        {/*        render={(text, record) => (*/}
        {/*          <span>*/}
        {/*  <a>Modify {record.lastName}</a>*/}
        {/*  <Divider type="vertical"/>*/}
        {/*  <a>Delete</a>*/}
        {/*</span>*/}
        {/*        )}*/}
        {/*/>*/}
      </Table>
    )
  };
}

export default connect(({kubernetes}) => ({
  kubernetes,
}))(Svc);
