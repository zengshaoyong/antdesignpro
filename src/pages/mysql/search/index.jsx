import React from 'react';
import {Button, notification, Card, Input, Table, Select, Row, Col} from 'antd';
import {connect} from 'dva';
import {message, Tooltip} from "antd";
import ExportJsonExcel from "js-export-excel";
import Hotkeys from 'react-hot-keys';
import styles from './index.less';
import moment from "moment";

const {Option} = Select;
const {TextArea} = Input;

const text =
  <span>
    <p>如果存在鼠标滑选，系统会只执行鼠标滑选中的内容，否则正常执行输入框的内容</p>
    <p>每句结尾必须带有英文符";"分号，否则连续的多条语句将不被识别！</p>
    <p>导出Excel功能按钮将在查询结束后生效</p>
    <p>此处限制执行频率为每两秒一次</p>
</span>;


class Mysql extends React.Component {
  state = {
    data: '',
    columns: '',
    sql: '',
    select_sql: '',
    sqls: {},
    databases: '',
    input: '',
    database: [],
    instances: '',
    instance: [],
    choose: true,
    export: true,
    his_column: [{'title': '历史记录', 'dataIndex': 'sql'}],
    his_data: [],
    table_column: [{'title': 'tables'}],
    table_data: [],
    field_column: [{'title': '表字段', 'dataIndex': 'field'}],
    field_data: [],
    field_name: '',
    tables: '',
    table: [],
  };


  componentDidMount() {
    this.getInstances()
    this.getHis()
    document.addEventListener("dblclick", this.doubleClick, true);
    document.addEventListener("mouseup", this.mouseUp, true);
  }

  componentWillUnmount() {
    document.removeEventListener("dblclick", this.doubleClick, true);
    document.removeEventListener("mouseup", this.mouseUp, true);
  }

  onKeyDown2 = () => {
    if (!this.state.choose) {
      this.formatData()
    }
  }


  // 获取鼠标双击选中
  doubleClick = () => {
    let text = "";
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
    }
    // if ("" != text) {
    // console.log(text);
    this.setState({
      select_sql: text,
    })
    // }

  }

// 释放鼠标处理函数
  mouseUp = () => {
    let text = "";
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
    }
    // if ("" != text) {
    // console.log(text);
    this.setState({
      select_sql: text,
    })
    // }
  }


  onKeyDown = e => {
    if (13 == e.keyCode && e.ctrlKey) {
      this.formatData()
    }
  }

  SelectDatabaseChange = (value) => {
    // console.log(`selected ${value}`);
    this.setState({
      database: value,
      table: [],
      field_data: [],
    }, () => {
      this.gettables()
    })
  }

  SelectInstanceChange = (value) => {
    // console.log(`selected ${value}`);
    this.setState({
      instance: value,
    }, () => {
      this.getdatabases()
      this.setState({
        choose: false,
        database: [],
        table_data: [],
        field_data: [],
        table: [],
      })
    })
  }

  SelectTableChange = (value) => {
    // console.log('table', value)
    this.setState({
      table: value,
    }, () => {
      this.getField()
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
      export: true,
    })
  }


  handleExport = () => {
    const option = {};

    option.fileName = 'excel';
    option.datas = [
      {
        sheetData: this.state.data,
        sheetName: 'ExcelName',
        sheetFilter: this.state.columns.map(item => item.dataIndex),
        sheetHeader: this.state.columns.map(item => item.title),
        columnWidths: this.state.columns.map(() => 10),
      },
    ];
    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  };


  formatData = () => {
    let sql;
    let arr_sql = {}
    if (this.state.select_sql != "") {
      sql = this.state.select_sql;
    } else {
      sql = this.state.input;
    }

    if (sql.trim() != '') {
      // console.log(sql.split(/[\n]/))
      // arr_sql['sqls'] = sql.split(/[\n]/)
      let arr = sql.replace(/[\n]/, " ")
      let arr2 = arr.split(";")
      let arr_new = []
      arr2.forEach((item, index) => {
        if (item.trim() != "") {
          arr_new.push(item.trim())
        }
      })
      arr_sql['sqls'] = arr_new
      // console.log(arr_new)
      // console.log(JSON.stringify(arr_sql))
      this.setState({
        sqls: JSON.stringify(arr_sql)
      }, () => {
        this.getdata()
        // console.log(this.state.sqls)
      })
    } else {
      message.error('请输入SQL语句')
    }
  }


  getInstances = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'mysql/fetchInstance',
    })
      .then(() => {
        const {instance} = this.props.mysql;
        // console.log(instance)
        if (instance) {
          this.setState({
            instances: instance,
          })
        }
      });
  }


  getdatabases = () => {
    const {dispatch} = this.props;
    let arr_sql = {}
    arr_sql['sqls'] = ['show databases']
    dispatch({
      type: 'mysql/fetchMysql',
      payload: {
        sqls: JSON.stringify(arr_sql),
        instance: this.state.instance,
      },
    })
      .then(() => {
        const {data} = this.props.mysql;
        // console.log(data)
        if (data.length > 0) {
          // console.log(data[0].Database)
          this.setState({
            databases: data,
          })
        }
      });
  };

  gettables = () => {
    const {dispatch} = this.props;
    let arr_sql = {}
    arr_sql['sqls'] = ['show tables']
    dispatch({
      type: 'mysql/fetchMysql',
      payload: {
        sqls: JSON.stringify(arr_sql),
        instance: this.state.instance,
        database: this.state.database,
      },
    })
      .then(() => {
        const {data} = this.props.mysql;
        // console.log(data)
        if (data.length > 0) {
          // console.log(data[0].Database)
          let keys = Object.keys(data[0])
          let clumn = []
          let tables_arr = []
          keys.forEach((item) => {
            if (item != 'key') {
              clumn.push({'title': item, 'dataIndex': item})
            }
          })
          data.forEach((item) => {
            // console.log(Object.values(item))
            tables_arr.push(Object.values(item)[0])
          })

          // console.log(tables_arr)

          this.setState({
            table_data: data,
            table_column: clumn,
            tables: tables_arr,
          })
        }
      });
  };

  getField = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'mysql/fetchFields',
      payload: {
        instance: this.state.instance,
        database: this.state.database,
        table: this.state.table,
      },
    }).then(() => {
      const {fields} = this.props.mysql;
      // console.log(fields)
      if (fields.length > 0) {
        this.setState({
          field_data: fields,
        })
      }
    })
  }


  getdata = () => {
    this.setState({
      data: '',
      columns: '',
      export: true,
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
      type: 'mysql/fetchMysql',
      payload: {
        database: this.state.database,
        instance: this.state.instance,
        sqls: this.state.sqls
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
              columns: clumn,
              export: false,
            })
          })
        }
        if (data.length == 0) {
          this.setState({
            data: [],
            columns: [],
          })
        }
        this.getHis()
        this.gettables()
        dispatch({
          type: 'mysql/resetData'
        })
      });
  };


  getHis = () => {

    this.props.dispatch({
      type: 'audit/fetchAudit',
      payload: {
        username: 'current_user',
        st_time: '',
        end_time: '',
      }
    }).then(() => {

      const {data} = this.props.audit
      // console.log('history', data)


      if (data.length > 0) {

        this.setState({
          his_data: data,
        })
      }
    }).catch((error) => {

    })
  }


  render() {

    const {loading} = this.props;

    return (
      <div>
        <div>
          <Hotkeys
            keyName="ctrl+enter"
            onKeyDown={this.onKeyDown2}
            // onKeyUp={this.onKeyUp}
          >
            {/*<div style={{padding: "50px"}}>*/}
            {/*  {this.state.output}*/}
            {/*</div>*/}
          </Hotkeys>
        </div>
        <div id='div'>
          <Tooltip title={text}>
            <span>注意事项,请先把鼠标移到此处</span>
          </Tooltip>
        </div>

        <div>
          <Select style={{marginBottom: 20, minWidth: 200}} onChange={this.SelectInstanceChange} placeholder='请选择实例'
                  loading={loading} value={this.state.instance}>
            {this.state.instances ?
              this.state.instances.map((item, key) => {
                return <Option value={item} key={key}>{item}</Option>
              })
              :
              <Option value=""></Option>
            }
          </Select>

          <Select style={{marginBottom: 20, minWidth: 200}} onChange={this.SelectDatabaseChange}
                  placeholder='请选择数据库（可不选）'
                  loading={loading} disabled={this.state.choose} value={this.state.database} showSearch>
            {this.state.databases ?
              this.state.databases.map((item, key) => {
                return <Option value={item.Database} key={key}>{item.Database}</Option>
              })
              :
              <Option value=""></Option>
            }

          </Select>

          <Select style={{marginBottom: 20, minWidth: 200}} onChange={this.SelectTableChange} placeholder='请选择数据表（可不选）'
                  loading={loading} disabled={this.state.choose} value={this.state.table} showSearch>
            {this.state.tables ?
              this.state.tables.map((item, key) => {
                return <Option value={item} key={key}>{item}</Option>
              })
              :
              <Option value=""></Option>
            }

          </Select>
        </div>

        <Row gutter={[8, 8]}>

          <Col span={4}>
            <div>
              <Table style={{marginBottom: 20}} columns={this.state.table_column} dataSource={this.state.table_data}
                     loading={loading} size='small'
                     scroll={{y: 190}} pagination={false}/>
            </div>
          </Col>


          <Col span={4}>
            <div>
              <Table style={{marginBottom: 20}} columns={this.state.field_column} dataSource={this.state.field_data}
                     loading={loading} size='small'
                     scroll={{y: 190}} pagination={false}/>
            </div>
          </Col>

          <Col span={16}>
            <div>
              <Table style={{marginBottom: 20}} columns={this.state.his_column} dataSource={this.state.his_data}
                     loading={loading} size='small'
                     scroll={{y: 190}} pagination={false}/>
            </div>
          </Col>
        </Row>
        <div><TextArea onKeyDown={this.onKeyDown}
                       placeholder="请输入SQL语句"
                       onChange={this.InputChange}
                       value={this.state.input}
                       disabled={this.state.choose}
        />
        </div>

        <div>
          <Tooltip title="Ctrl Enter">
            <Button
              type="primary"
              onClick={() => this.formatData()}
              loading={loading}
              disabled={this.state.choose}
            >执行</Button>
          </Tooltip>
          <Button
            onClick={() => this.reset()}
            disabled={this.state.choose}
          >重置</Button>
          <Button
            onClick={this.handleExport}
            disabled={this.state.export}
          >导出Excel</Button>
        </div>
        {
          this.state.columns ?
            <div><Table columns={this.state.columns} dataSource={this.state.data} loading={loading} size='small'
                        pagination={{defaultPageSize: 10}} scroll={{x: true}}/></div>
            :
            <div></div>
        }
      </div>
    );
  }
}


export default connect(({audit, mysql, loading}) => ({
  mysql,
  audit,
  loading: loading.models.mysql,
}))(Mysql);

