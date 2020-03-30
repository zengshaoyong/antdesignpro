import React, {useState} from 'react';
import {connect} from 'dva';
import {Table, Button, Modal, Input} from 'antd';
import styles from './index.less';


class manage_mysql extends React.Component {
  state = {
    data: [],
    clumn: [],
    type: '',
    instance: '',
    ip: '',
    port: '',
    read_user: '',
    read_password: '',
    execute_user: '',
    execute_password: '',
    mod_visible: false,
    add_visible: false,
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
                <Button type="link" size='small' onClick={() => this.mod_showModal(record)}>modify</Button>
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

  modify = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'manager/fetchManagerMysql',
      payload: {
        type: 'modify',
        instance: this.state.instance,
        ip: this.state.ip,
        port: this.state.port,
        read_user: this.state.read_user,
        read_password: this.state.read_password,
        execute_user: this.state.execute_user,
        execute_password: this.state.execute_password,
      },
    })
      .then(() => {
        this.query()
      })
  }


  mod_showModal = (record) => {
    this.setState({
      instance: record.instance,
      ip: record.ip,
      port: record.port,
      read_user: record.read_user,
      read_password: record.read_password,
      execute_user: record.execute_user,
      execute_password: record.execute_password,
      mod_visible: true,
    })
  }

  mod_handleOk = e => {
    // console.log(e);
    this.modify()
    this.setState({
      mod_visible: false,
    });
  };

  mod_handleCancel = e => {
    // console.log(e);
    this.setState({
      mod_visible: false,
    });
  };

  ipChange = e => {
    this.setState({
      ip: e.target.value
    })
  }

  portChange = e => {
    this.setState({
      port: e.target.value
    })
  }

  read_userChange = e => {
    this.setState({
      read_user: e.target.value
    })
  }

  read_passwordChange = e => {
    this.setState({
      read_password: e.target.value
    })
  }

  execute_userChange = e => {
    this.setState({
      execute_user: e.target.value
    })
  }

  execute_passwordChange = e => {
    this.setState({
      execute_password: e.target.value
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
        <div>
          <Modal
            title="Modify"
            visible={this.state.mod_visible}
            onOk={this.mod_handleOk}
            onCancel={this.mod_handleCancel}
          >
            <p>实例：</p>
            <Input className={styles.input} value={this.state.instance} disabled/>
            <Input type='ip' className={styles.input} value={this.state.ip} onChange={this.ipChange}/>
            <Input className={styles.input} value={this.state.port} onChange={this.portChange}/>
            <p>只读用户密码：</p>
            <Input className={styles.input} value={this.state.read_user} onChange={this.read_userChange}/>
            <Input className={styles.input} value={this.state.read_password} onChange={this.read_passwordChange}/>
            <p>读写用户密码：</p>
            <Input className={styles.input} value={this.state.execute_user} onChange={this.execute_userChange}/>
            <Input className={styles.input} value={this.state.execute_password} onChange={this.execute_passwordChange}/>
          </Modal>
        </div>
      </div>
    )

  }
}

export default connect(({manager, loading}) => ({
  manager,
  loading: loading.models.manager
}))(manage_mysql);
