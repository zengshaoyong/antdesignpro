import React from 'react';
import {Table, Divider, Tag, message, Input} from 'antd';
import {connect} from "dva";
import {Button, Row, Col, Modal} from 'antd';
import styles from './index.less';
import Upload_yaml from "@/pages/kubernetes/dashboard/components/deployment/components/upload";


const {Column, ColumnGroup} = Table;
const {TextArea} = Input;

class Deployments extends React.Component {
  state = {
    dms: [],
    dm_name: '',
    container_name: '',
    image: '',
    result: '',
    vis_delete: false,
    vis_modify: false,
    vis_yaml: false,
    new_image: '',
    yaml: '',
  };


  UNSAFE_componentWillMount() {
    this.getdms()
  }

  showYamlModal = (record) => {
    // console.log(record)
    this.setState({
      vis_yaml: true,
    });
  };

  upload_done = (e) => {
    this.setState({
      yaml: e
    })
    // console.log('yaml', this.state.yaml)
  }

  yamlOk = e => {
    // console.log(this.state.yaml);
    if (this.state.yaml != '') {
      this.createdm()
    }
    // console.log(this.state.yaml)
    this.setState({
      vis_yaml: false,
    });
  };

  yamlCancel = e => {
    // console.log(e);
    this.setState({
      vis_yaml: false,
    }, () => {
      this.setState({
        yaml: '',
      })
    });
  };


  handleInput = (e) => {
    // console.log(e.target.value)
    this.setState({
      new_image: e.target.value.trim()
    })
  }

  showModifyModal = (record) => {
    // console.log(record)
    this.setState({
      dm_name: record.name,
      container_name: record.container_name,
      vis_modify: true,
    });
  };

  modifyOk = e => {
    // console.log(e);
    if (this.state.new_image != '') {
      this.editdm()
    }
    this.setState({
      vis_modify: false,
    });
  };

  modifyCancel = e => {
    // console.log(e);
    this.setState({
      vis_modify: false,
    }, () => {
      this.setState({
        new_image: '',
      })
    });
  };

  showDeleteModal = (record) => {
    // console.log(record)
    this.setState({
      vis_delete: true,
      dm_name: record.name,
    });
  };

  deleteOk = e => {
    // console.log(e);
    this.deletedm()
    this.setState({
      vis_delete: false,
    });
  };

  deleteCancel = e => {
    // console.log(e);
    this.setState({
      vis_delete: false,
    });
  };

  renew = () => {
    this.getdms()
  }

  getdms = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'kubernetes/fetchk8s',
      payload: {
        task: 'getdm',
      },
    })
      .then(() => {
        const {data, loading} = this.props.kubernetes
        this.setState({
          dms: data,
        })
        // console.log('data', data[0].namespace)
      });
  };

  createdm = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'kubernetes/fetchk8s',
      payload: {
        task: 'createdm',
        yaml: this.state.yaml,
      },
    })
      .then(() => {
        const {data} = this.props.kubernetes
        this.setState({
          result: data,
          yaml: '',
        }, () => {
          message.info(this.state.result, 5)
          this.getdms()
        })
      });
  }


  deletedm = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'kubernetes/fetchk8s',
      payload: {
        task: 'deletedm',
        name: this.state.dm_name,
      },
    })
      .then(() => {
        const {data} = this.props.kubernetes
        this.setState({
          result: data,
        }, () => {
          message.info(this.state.result, 5)
          this.getdms()
        })
      });
  }


  editdm = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'kubernetes/fetchk8s',
      payload: {
        task: 'editdm',
        name: this.state.dm_name,
        container_name: this.state.container_name,
        image: this.state.new_image,
      },
    })
      .then(() => {
        const {data} = this.props.kubernetes
        this.setState({
          result: data,
          new_image: '',
        }, () => {
          message.info(this.state.result, 5)
          this.getdms()
        })
      });
  }

  render() {

    const {loading} = this.props;

    return (
      <div>
        <div>
          <Row type="flex" justify="end">
            <Button size="small" onClick={() => this.renew()} loading={loading}
                    type="primary">刷新</Button>
            <Button size="small" onClick={() => this.showYamlModal()}
                    type="primary">创建</Button>
          </Row>
        </div>
        <div>
          <Table dataSource={this.state.dms} bordered size="small" pagination={false} scroll={{y: 620}}
                 loading={loading}>

            <Column title="name" dataIndex="name" key="name" align="center"/>
            <Column title="namespace" dataIndex="namespace" key="namespace" align="center"/>
            <Column title="container_name" dataIndex="container_name" key="container_name" align="center"/>
            <Column title="image" dataIndex="image" key="image" align="center"/>
            <Column align="center" title="操作" key="action" render={(text, record) => (
              <span>
              <Button
                onClick={() => this.showModifyModal(record)}
                type="link">修改
              </Button>
              <Divider type="vertical"/>
              <Button
                onClick={() => this.showDeleteModal(record)}
                type="link">删除
              </Button>
              </span>
            )}
            />
          </Table></div>
        <div>
          <Modal
            title="删除deployment"
            visible={this.state.vis_delete}
            onOk={this.deleteOk}
            onCancel={this.deleteCancel}
          >
            <p>请问确定要删除 {this.state.dm_name} 吗？</p>
          </Modal>
        </div>
        <div>
          <Modal
            title={"正在修改" + this.state.dm_name}
            visible={this.state.vis_modify}
            onOk={this.modifyOk}
            onCancel={this.modifyCancel}
          >
            <Input id='MyIput' placeholder="请输入image" onChange={this.handleInput} value={this.state.new_image}/>
          </Modal>
        </div>
        <div>
          <Modal
            title='创建Deployment'
            visible={this.state.vis_yaml}
            onOk={this.yamlOk}
            onCancel={this.yamlCancel}
          >
            <Upload_yaml upload_done={this.upload_done}/>
          </Modal>
        </div>
      </div>
    )
  };
}

export default connect(({kubernetes, loading}) => ({
  kubernetes,
  loading: loading.models.kubernetes
}))(Deployments);
