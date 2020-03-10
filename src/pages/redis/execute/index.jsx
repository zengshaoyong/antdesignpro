import React from 'react';
import {Button, notification, Card, Input, Table, Select, Row, Col} from 'antd';
import {connect} from 'dva';
import {message, Tooltip} from "antd";
import ExportJsonExcel from "js-export-excel";
import styles from './index.less';
import moment from "moment";

const {Option} = Select;


// const text = <span><p>每句结尾必须带有英文符";"分号，否则连续的多条语句将不被识别！</p><p>导出Excel功能按钮将在查询结束后生效</p><p>此处限制执行频率为每两秒一次</p></span>;

class Redis extends React.Component {
  state = {
    instances: [],
    data: [],
    columns: [],
    choose: false,
    key: '',
    type: '',
    instance: '',
  };


  componentDidMount() {
    this.getInstances()
    // this.getdata()
  }

  getInstances = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'redis/fetchRedisInstance',
      payload: {
        type: 'get_instance'
      },
    })
      .then(() => {
        const {instance} = this.props.redis;
        // console.log('instance', instance)
        if (instance.length > 0) {
          this.setState({
            instances: instance,
          })
        }
      });
  }


  getdata = () => {
    this.setState({
      choose: true,
    })
    this.timer_two = setTimeout(
      () => {
        this.setState({
          choose: false,
        })
      },
      2000
    );
    const {dispatch} = this.props;
    dispatch({
      type: 'redis/fetchRedis',
      payload: {
        key: this.state.key,
        type: this.state.type,
        instance: this.state.instance,
      },
    })
      .then(() => {
        const {data} = this.props.redis;
        // console.log('data', data)
        if (data.length > 0) {
          this.setState({
            data: data,
          }, () => {
            let keys = Object.keys(data[0])
            // console.log('keys', keys)
            let clumn = []
            keys.forEach((item) => {
              if (item != 'key') {
                clumn.push({'title': item, 'dataIndex': item})
              }
            })
            this.setState({
              columns: clumn,
            })
          })
        }
        if (data.length == 0) {
          this.setState({
            data: [],
            columns: [],
          })
        }
      });
  };

  SelectInstanceChange = (value) => {
    // console.log(`selected ${value}`);
    this.setState({
      instance: value,
    })
  }


  InputChange = value => {
    this.setState({
      key: value.target.value
    })
  }


  searchString = () => {
    this.setState({
      type: 'get',
    }, () => {
      this.getdata()
    })
  }

  searchHash = () => {
    this.setState({
      type: 'hscan',
    }, () => {
      this.getdata()
    })
  }

  searchlist = () => {
    this.setState({
      type: 'lscan',
    }, () => {
      this.getdata()
    })
  }

  scan = () => {
    this.setState({
      type: 'scan',
    }, () => {
      this.getdata()
    })
  }


  render() {

    const {loading} = this.props;

    return (
      <div>
        <Select style={{marginBottom: 20, minWidth: 200}} onChange={this.SelectInstanceChange} placeholder='请选择实例'
                loading={loading}>
          {this.state.instances ?
            this.state.instances.map((item, key) => {
              return <Option value={item} key={key}>{item}</Option>
            })
            :
            <Option value=""></Option>
          }
        </Select>

        <div><Input placeholder="寻找key请通过Scan进行匹配（支持*号），查询key内容请输入完整的key" allowClear onChange={this.InputChange}/></div>


        <div>
          <Button
            type="primary"
            onClick={() => this.scan()}
            loading={loading}
            disabled={this.state.choose}
          >Scan</Button>
          <Button
            onClick={() => this.searchString()}
            disabled={this.state.choose}
          >查询String</Button>
          <Button
            onClick={() => this.searchHash()}
            disabled={this.state.choose}
          >查询Hash</Button>
          <Button
            onClick={() => this.searchlist()}
            disabled={this.state.choose}
          >查询List</Button>
        </div>

        <div>
          {
            this.state.columns ?
              <div><Table columns={this.state.columns} dataSource={this.state.data} loading={loading} size='small'
                          scroll={{y: 580}} pagination={false}/></div>
              :
              <div></div>
          }
        </div>

      </div>
    );
  }
}


export default connect(({redis, loading}) => ({
  redis,
  loading: loading.models.redis,
}))(Redis);

