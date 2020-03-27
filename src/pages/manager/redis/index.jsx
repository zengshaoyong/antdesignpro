import React from 'react';
import {connect} from 'dva';
import {Button, Table} from "antd";

class manage_redis extends React.Component {
  state = {
    data: [],
    clumn: [],
    type: '',
  }


  componentDidMount() {
    this.query()
  }


  query = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'manager/fetchManagerRedis',
      payload: {
        type: 'query'
      },
    })
      .then(() => {
        const {data} = this.props.manager;
        // console.log('data', data)
        if (data.length > 0) {
          this.setState({
            data: data,
          })
          let keys = Object.keys(data[0])
          let clumn = []
          keys.forEach((item) => {
            if (item != 'key') {
              clumn.push({'title': item, 'dataIndex': item, 'align': 'center'})
            }
          })
          clumn.push({
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (text, record) => (
              <span>
                <Button type="link" size='small'>modify</Button>
                <Button type="link" size='small'>delete</Button>
              </span>
            ),
          },)
          this.setState({
            clumn: clumn,
          })
        }
      });
  }

  render() {
    const {loading} = this.props;

    return (
      <div>
        <Table columns={this.state.clumn} dataSource={this.state.data} bordered size="small" pagination={false}
               loading={loading}/>
      </div>
    )

  }
}


export default connect(({manager, loading}) => ({
  manager,
  loading: loading.models.manager
}))(manage_redis);
