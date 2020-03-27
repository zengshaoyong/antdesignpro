import React, {useState} from 'react';
import {connect} from 'dva';
import {Table, Button} from 'antd';


class manage_mysql extends React.Component {
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
      type: 'manager/fetchManagerMysql',
      payload: {
        type: 'query'
      },
    })
      .then(() => {
        const {data} = this.props.manager;
        // console.log(data)
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
                <Button type="link" size='small' onClick={() => this.delete(record)}>delete</Button>
              </span>
            ),
          },)
          this.setState({
            clumn: clumn,
          })
        }
      });
  }

  delete = (record) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'manager/fetchManagerMysql',
      payload: {
        type: 'del',
        instance: record.instance,
      },
    })
      .then(() => {
        this.query()
      })
  }


  render() {
    const {loading} = this.props;

    return (
      <div>
        <div>
          <Table columns={this.state.clumn} dataSource={this.state.data} bordered size="small" pagination={false}
                 loading={loading}/>
        </div>
      </div>
    )

  }
}

export default connect(({manager, loading}) => ({
  manager,
  loading: loading.models.manager
}))(manage_mysql);
