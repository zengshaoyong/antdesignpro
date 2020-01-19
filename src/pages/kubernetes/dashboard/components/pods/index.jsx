import React from 'react';
import {Table, Divider, Tag} from 'antd';
import {Modal, Button, Row, Col, message} from 'antd';
import styles from './index.less';
import {connect} from "dva";

const {Column, ColumnGroup} = Table;

class Pods extends React.Component {
  state = {
    pods: [],
    visible: false,
    pod_name: '',
    result: '',
  };


  UNSAFE_componentWillMount() {
    this.getpods()
  }


  showModal = (record) => {
    this.setState({
      visible: true,
      pod_name: record.name,
    });
  };

  handleOk = e => {
    this.deletepod()
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  getpods = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'kubernetes/fetchk8s',
      payload: {
        task: 'getpod',
      },
    })
      .then(() => {
        const {data} = this.props.kubernetes;
        if (data.length > 0) {
          this.setState({
            pods: data,
          })
        }
      });
  };

  deletepod = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'kubernetes/fetchk8s',
      payload: {
        task: 'deletepod',
        name: this.state.pod_name,
      },
    })
      .then(() => {
        const {data} = this.props.kubernetes
        this.setState({
          result: data,
        }, () => {
          message.info(this.state.result, 5)
          // this.getpods()
          this.timer = setTimeout(
            () => {
              this.getpods()
            },
            1000
          );
        })
      });
  }

  render() {

    const {loading} = this.props;

    return (
      <div>
        <div>
          <Row type="flex" justify="end">
            <Button size="small" onClick={() => this.getpods()} loading={loading}
                    type="primary">刷新</Button>
          </Row>
        </div>
        <Table dataSource={this.state.pods} bordered size="small" pagination={false} scroll={{y: 620}}
               loading={loading}>

          <Column title="name" dataIndex="name" key="name" align="center"/>
          <Column title="namespace" dataIndex="namespace" key="namespace" align="center"/>
          <Column title="status" dataIndex="status" key="status" align="center"/>
          {/* <Column title="ready" dataIndex="ready" key="ready"/> */}
          <Column title="restart_count" dataIndex="restart_count" key="restart_count" align="center"/>
          <ColumnGroup title="Name">
            <Column title="pod_ip" dataIndex="pod_ip" key="pod_ip" align="center"/>
            <Column title="host_ip" dataIndex="host_ip" key="host_ip" align="center"/>
          </ColumnGroup>
          <Column align="center" title="操作" key="action" render={(text, record, index) => (
            <span>
              <Button
                onClick={() => this.showModal(record)}
                type="link">删除
              </Button>
              <Modal
                title="删除pod"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <p>请问确定要删除 {this.state.pod_name} 吗？</p>
              </Modal>
            </span>
          )}
          />
        </Table></div>
    )
  }
  ;
}

export default connect(({kubernetes, loading}) => ({
  kubernetes,
  loading: loading.models.kubernetes
}))(Pods);
