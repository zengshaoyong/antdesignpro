import React from 'react';
import {Button, notification, Card, Input, Table, Select} from 'antd';
import {connect} from 'dva';
import styles from './index.less';

const {Option} = Select;

class Mysql extends React.Component {
  state = {
    data: '',
    columns: '',
    sql: '',
    databases: '',
    input: '',
    database: '',
    instances: '',
    instance: '',
    choose: true,
  };


  UNSAFE_componentWillMount() {
    this.getInstances()
  }


  SelectDatabaseChange = (value) => {
    // console.log(`selected ${value}`);
    this.setState({
      database: value
    })
  }

  SelectInstanceChange = (value) => {
    // console.log(`selected ${value}`);
    this.setState({
      instance: value
    }, () => {
      this.getdatabases()
      this.setState({
        choose: false,
      })
    })
  }


  InputChange = value => {
    this.setState({
      input: value.target.value
    })
  }

  reset = () => {
    this.setState({
      input: '',
      data: '',
      columns: '',
    })
  }


  getInstances = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'mysql/fetchInstance',
    })
      .then(() => {
        const {instance} = this.props.mysql;
        console.log(instance)
        if (instance) {
          this.setState({
            instances: instance,
          })
        }
      });
  }


  getdatabases = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'mysql/fetchMysql',
      payload: {
        sql: 'show databases',
        instance: this.state.instance,
      },
    })
      .then(() => {
        const {data} = this.props.mysql;
        // console.log(data)
        if (data) {
          this.setState({
            databases: data,
          })
        }
      });
  };


  getdata = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'mysql/fetchMysql',
      payload: {
        sql: this.state.input,
        database: this.state.database,
        instance: this.state.instance,
      },
    })
      .then(() => {
        const {data} = this.props.mysql;
        // console.log(data)
        if (data.length > 0) {
          this.setState({
            data: data,
          }, () => {
            let keys = Object.keys(data[0])
            let clumn = []
            keys.forEach((item) => {
              if (item != 'key') {
                clumn.push({'title': item, 'dataIndex': item})
              }
            })
            this.setState({
              columns: clumn
            })
          })
          dispatch({
            type: 'mysql/resetData'
          })
        }
      });
  };

  render() {

    const {loading} = this.props;

    return (
      <div>
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

          <Select style={{marginBottom: 20, minWidth: 200}} onChange={this.SelectDatabaseChange} placeholder='请选择数据库'
                  loading={loading} disabled={this.state.choose}>
            {this.state.databases ?
              this.state.databases.map((item, key) => {
                return <Option value={item.Database} key={key}>{item.Database}</Option>
              })
              :
              <Option value=""></Option>
            }

          </Select>
        </div>

        <div><Input
          placeholder="请输入查询语句"
          onChange={this.InputChange}
          value={this.state.input}
          disabled={this.state.choose}
        />
        </div>

        <div>
          <Button
            type="primary"
            onClick={() => this.getdata()}
            loading={loading}
            disabled={this.state.choose}
          >查询</Button>
          <Button
            onClick={() => this.reset()}
            disabled={this.state.choose}
          >重置</Button>
        </div>
        {
          this.state.columns ?
            <div><Table columns={this.state.columns} dataSource={this.state.data} loading={loading} size='small'
                        scroll={{y: 580}} pagination={false}/></div>
            :
            <div></div>
        }
      </div>
    );
  }
}


export default connect(({mysql, loading}) => ({
  mysql,
  loading: loading.models.mysql
}))(Mysql);

