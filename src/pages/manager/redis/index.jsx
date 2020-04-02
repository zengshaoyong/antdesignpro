import React from 'react';
import {connect} from 'dva';
import {Button, Table, Modal, Input, Row, Popconfirm} from "antd";
import styles from "@/pages/manager/mysql/index.less";

class manage_redis extends React.Component {
  state = {
    data: [],
    clumn: [],
    type: '',
    name: '',
    ip: '',
    port: '',
    password: '',
    add_visible: false,
    mod_visible: false,
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

  create = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'manager/fetchManagerRedis',
      payload: {
        type: 'add',
        name: this.state.name.trim(),
        ip: this.state.ip.trim(),
        port: this.state.port.trim(),
        password: this.state.password.trim(),
      },
    })
      .then(() => {
        this.query()
      })
  }

  modify = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'manager/fetchManagerRedis',
      payload: {
        type: 'modify',
        name: this.state.name.trim(),
        ip: this.state.ip.trim(),
        port: this.state.port.trim(),
        password: this.state.password.trim(),
      },
    })
      .then(() => {
        this.query()
      })
  }

  delete = (record) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'manager/fetchManagerRedis',
      payload: {
        type: 'del',
        name: record.name,
      },
    })
      .then(() => {
        this.query()
      })
  }


  add_handleOk = e => {
    // console.log(e);
    if (this.state.name.trim() != '' && this.state.ip.trim() != '' && this.state.port.trim() != '') {
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


  add_showModal = () => {
    this.setState({
      name: '',
      ip: '',
      port: '',
      password: '',
      add_visible: true,
    })
  }

  mod_showModal = (record) => {
    this.setState({
      name: record.name,
      ip: record.ip,
      port: record.port,
      password: record.password,
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

  nameChange = e => {
    this.setState({
      name: e.target.value
    })
  }

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

  passwordChange = e => {
    this.setState({
      password: e.target.value
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
            title="add"
            visible={this.state.add_visible}
            onOk={this.add_handleOk}
            onCancel={this.add_handleCancel}
          >
            <Input className={styles.input} value={this.state.name} onChange={this.nameChange}
                   placeholder="请输入实例名"/>
            <Input className={styles.input} value={this.state.ip} onChange={this.ipChange} placeholder="请输入IP地址"/>
            <Input className={styles.input} value={this.state.port} onChange={this.portChange} placeholder="请输入端口号"/>
            <Input className={styles.input} value={this.state.password} onChange={this.passwordChange}
                   placeholder="请输入密码"/>
          </Modal>
        </div>

        <div>
          <Modal
            title="Modify"
            visible={this.state.mod_visible}
            onOk={this.mod_handleOk}
            onCancel={this.mod_handleCancel}
          >
            <p>实例：</p>
            <Input className={styles.input} value={this.state.name} disabled/>
            <Input className={styles.input} value={this.state.ip} onChange={this.ipChange} placeholder="请输入IP地址"/>
            <Input className={styles.input} value={this.state.port} onChange={this.portChange} placeholder="请输入端口号"/>
            <p>密码：</p>
            <Input className={styles.input} value={this.state.password} onChange={this.passwordChange}
                   placeholder="请输入密码"/>
          </Modal>
        </div>
      </div>
    )

  }
}


export default connect(({manager, loading}) => ({
  manager,
  loading: loading.models.manager
}))(manage_redis);
