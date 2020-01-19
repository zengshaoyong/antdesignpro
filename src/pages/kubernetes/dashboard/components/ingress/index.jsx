import React from 'react';
import {Table, Divider} from 'antd';
import {connect} from "dva";


const {Column, ColumnGroup} = Table;

class Ingress extends React.Component {
  state = {
    ings: [],
    loading: '',
  };


  UNSAFE_componentWillMount() {
    this.getings()
  }

// const Pods = ({data}) => {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  getings = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'kubernetes/fetchk8s',
      payload: {
        task: 'geting',
      },
    })
      .then(() => {
        const {data, loading} = this.props.kubernetes;
        this.setState({
          // eslint-disable-next-line react/no-unused-state
          ings: data,
        })
        // console.log('result', this.state.pods)
      });
  };

  render() {
    return (
      <Table dataSource={this.state.ings} bordered size="small" pagination={false} scroll={{y: 620}}>

        <Column title="name" dataIndex="name" key="name" align='center'/>
        <Column title="namespace" dataIndex="namespace" key="namespace" align='center'/>
        <Column title="host" dataIndex="host" key="host" align='center'/>
        <Column title="backend_svc" dataIndex="backend_svc" key="backend_svc" align='center'/>
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
}))(Ingress);
