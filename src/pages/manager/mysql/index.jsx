import React from 'react';
import {connect} from 'dva';
import {Table, Button, Modal, Input, Row, Popconfirm} from 'antd';
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
                <Popconfirm
                  title="你确定？"
                  onConfirm={() => this.confirm(record)}
                  onCancel={this.cancel}
                  okText="Yes"
                  cancelText="No"
                >
                <Button type="link" size='small'>delete</Button>
                </Popconfirm>
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

  create = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'manager/fetchManagerMysql',
      payload: {
        type: 'add',
        instance: this.state.instance.trim(),
        ip: this.state.ip.trim(),
        port: this.state.port.trim(),
        read_user: this.state.read_user.trim(),
        read_password: this.state.read_password.trim(),
        execute_user: this.state.execute_user.trim(),
        execute_password: this.state.execute_password.trim(),
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
        instance: this.state.instance.trim(),
        ip: this.state.ip.trim(),
        port: this.state.port.trim(),
        read_user: this.state.read_user.trim(),
        read_password: this.state.read_password.trim(),
        execute_user: this.state.execute_user.trim(),
        execute_password: this.state.execute_password.trim(),
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

  add_showModal = () => {
    this.setState({
      instance: '',
      ip: '',
      port: '',
      read_user: '',
      read_password: '',
      execute_user: '',
      execute_password: '',
      add_visible: true,
    })
  }


  add_handleOk = e => {
    // console.log(e);
    if (this.state.instance.trim() != '' && this.state.ip.trim() != '' && this.state.port.trim() != '' && this.state.read_user.trim() != '' && this.state.read_password.trim() != '' && this.state.execute_user.trim() != '' && this.state.execute_password.trim() != '') {
      this.create()
    }
    this.setState({
      add_visible: false,
    });
  };

  add_handleCancel = e => {
    // console.log(e);
    this.setState({
      add_visible: false,
    });
  };

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

  instanceChange = e => {
    this.setState({
      instance: e.target.value
    })
  }

  confirm = (record) => {
    // console.log(e);
    this.delete(record)
  }

  cancel = (e) => {
    // console.log(e);
    // message.error('Click on No');
  }


  render() {
    const {loading} = this.props;

    return (
      <div>
        <div>
          <Row type="flex" justify="end">
            <Button size="small" onClick={() => this.add_showModal()}
                    type="primary">创建</Button>
          </Row>
        </div>
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
            <Input className={styles.input} value={this.state.ip} onChange={this.ipChange} placeholder="请输入IP地址"/>
            <Input className={styles.input} value={this.state.port} onChange={this.portChange} placeholder="请输入端口号"/>
            <p>只读用户密码：</p>
            <Input className={styles.input} value={this.state.read_user} onChange={this.read_userChange}
                   placeholder="请输入只读用户名"/>
            <Input className={styles.input} value={this.state.read_password} onChange={this.read_passwordChange}
                   placeholder="请输入只读用户密码"/>
            <p>读写用户密码：</p>
            <Input className={styles.input} value={this.state.execute_user} onChange={this.execute_userChange}
                   placeholder="请输入读写用户名"/>
            <Input className={styles.input} value={this.state.execute_password} onChange={this.execute_passwordChange}
                   placeholder="请输入读写用户密码"/>
          </Modal>
        </div>

        <div>
          <Modal
            title="add"
            visible={this.state.add_visible}
            onOk={this.add_handleOk}
            onCancel={this.add_handleCancel}
          >
            <Input className={styles.input} value={this.state.instance} onChange={this.instanceChange}
                   placeholder="请输入实例名"/>
            <Input className={styles.input} value={this.state.ip} onChange={this.ipChange} placeholder="请输入IP地址"/>
            <Input className={styles.input} value={this.state.port} onChange={this.portChange} placeholder="请输入端口号"/>
            <Input className={styles.input} value={this.state.read_user} onChange={this.read_userChange}
                   placeholder="请输入只读用户名"/>
            <Input className={styles.input} value={this.state.read_password} onChange={this.read_passwordChange}
                   placeholder="请输入只读用户密码"/>
            <Input className={styles.input} value={this.state.execute_user} onChange={this.execute_userChange}
                   placeholder="请输入读写用户名"/>
            <Input className={styles.input} value={this.state.execute_password} onChange={this.execute_passwordChange}
                   placeholder="请输入读写用户密码"/>
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
