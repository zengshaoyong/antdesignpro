import React from 'react';
import {connect} from 'dva';
import {Table, Button, Modal, Input, Popconfirm} from 'antd';
import styles from './index.less';


class manage_user extends React.Component {
  state = {
    data: [],
    clumn: [],
    type: '',
    username: '',
    authority: '',
    namespace: '',
    group: '',
    execute_instances: '',
    read_instances: '',
    redis: '',
    mod_visible: false,
  }

  componentDidMount() {
    this.query()
  }

  query = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'manager/fetchManagerUser',
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
      type: 'manager/fetchManagerUser',
      payload: {
        type: 'del',
        username: record.username,
      },
    })
      .then(() => {
        this.query()
      })
  }

  modify = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'manager/fetchManagerUser',
      payload: {
        type: 'modify',
        username: this.state.username.trim(),
        authority: this.state.authority.trim(),
        namespace: this.state.namespace.trim(),
        group: this.state.group.trim(),
        execute_instances: this.state.execute_instances.trim(),
        read_instances: this.state.read_instances.trim(),
        redis: this.state.redis.trim(),
      },
    })
      .then(() => {
        this.query()
      })
  }

  mod_showModal = (record) => {
    this.setState({
      username: record.username,
      authority: record.authority,
      namespace: record.namespace,
      group: record.group,
      execute_instances: record.execute_instances,
      read_instances: record.read_instances,
      redis: record.redis,
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

  authorityChange = e => {
    this.setState({
      authority: e.target.value
    })
  }

  namespaceChange = e => {
    this.setState({
      namespace: e.target.value
    })
  }

  groupChange = e => {
    this.setState({
      group: e.target.value
    })
  }

  read_instancesChange = e => {
    this.setState({
      read_instances: e.target.value
    })
  }

  execute_instancesChange = e => {
    this.setState({
      execute_instances: e.target.value
    })
  }

  redisChange = e => {
    this.setState({
      redis: e.target.value
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
            <p>用户名：</p>
            <Input className={styles.input} value={this.state.username} disabled/>
            <p>权限级别：</p>
            <Input className={styles.input} value={this.state.authority} onChange={this.authorityChange}
                   placeholder="请输入权限级别"/>
            <p>namespace：</p>
            <Input className={styles.input} value={this.state.namespace} onChange={this.namespaceChange}
                   placeholder="请输入namespace"/>
            <p>group：</p>
            <Input className={styles.input} value={this.state.group} onChange={this.groupChange}
                   placeholder="请输入group"/>
            <p>mysql只读实例：</p>
            <Input className={styles.input} value={this.state.read_instances} onChange={this.read_instancesChange}
                   placeholder="请输入只读实例"/>
            <p>mysql读写实例：</p>
            <Input className={styles.input} value={this.state.execute_instances} onChange={this.execute_instancesChange}
                   placeholder="请输入读写实例"/>
            <p>redis实例：</p>
            <Input className={styles.input} value={this.state.redis} onChange={this.redisChange}
                   placeholder="请输入redis实例"/>
          </Modal>
        </div>
      </div>
    )
  }

}

export default connect(({manager, loading}) => ({
  manager,
  loading: loading.models.manager
}))(manage_user);
