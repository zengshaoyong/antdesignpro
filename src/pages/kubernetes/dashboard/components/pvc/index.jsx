import React from 'react';
import {Table, Divider} from 'antd';
import {connect} from "dva";


const {Column, ColumnGroup} = Table;

class Pvcs extends React.Component {
  state = {
    pvcs: [],
  };


  UNSAFE_componentWillMount() {
    this.getpvcs()
  }

// const Pods = ({data}) => {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  getpvcs = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'kubernetes/fetchk8s',
      payload: {
        task: 'getpvc',
      },
    })
      .then(() => {
        const {data, loading} = this.props.kubernetes
        this.setState({
          pvcs: data,
        })
        // console.log('result', this.state.pvcs)
      });
  };

  render() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (
      <Table dataSource={this.state.pvcs} bordered size="small" pagination={false} scroll={{y: 620}}>

        <Column title="name" dataIndex="name" key="name" align='center'/>
        <Column title="namespace" dataIndex="namespace" key="namespace" align='center'/>
        <Column title="access_modes" dataIndex="access_modes" key="access_modes" align='center'/>
        <Column title="phase" dataIndex="phase" key="phase" align='center'/>
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
}))(Pvcs);
