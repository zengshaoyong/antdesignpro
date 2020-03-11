import React from 'react';
import {connect} from 'dva';
import styles from './index.less';
import {
  Row,
  Input,
  Button,
  Table,
  DatePicker
} from 'antd';

import numeral from 'numeral';
import moment from 'moment';

class Audit extends React.Component {
  state = {
    data: '',
    columns: [],
    auditData: [],
    pre: '',
    now: '',
    user: '',
    startValue: null,
    endValue: null,
    endOpen: false,
    starttime: '',
    endtime: '',

  };

  // UNSAFE_componentWillMount() {
  //   this.getData()
  // }

  componentDidMount() {
    this.getData()
  }


  getOneDay = () => {
    const curDate = new Date();
    const preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);

    this.setState({
      pre: moment(preDate).format("YYYY-MM-DD HH:mm:ss"),
      now: moment(curDate).format("YYYY-MM-DD HH:mm:ss")
    })

    return {
      st: Number(moment(preDate).format('X')),
      et: Number(moment(curDate).format('X'))
    }

  }

  getData = (starttime, endtime) => {

    let defalutTime = this.getOneDay()
    // console.log(defalutTime.st)
    // console.log(defalutTime.et)

    this.props.dispatch({
      type: 'audit/fetchAudit',
      payload: {
        username: this.state.user,
        st_time: starttime || defalutTime.st,
        end_time: endtime || defalutTime.et,
      }
    }).then(() => {

      const {data} = this.props.audit
      // console.log('data', data)


      if (data.length > 0) {

        let keys = Object.keys(data[0])
        let clumn = []
        keys.forEach((item) => {
          if (item != 'key') {
            if (item != 'sql') {
              clumn.push({'title': item, 'dataIndex': item, 'width': 180})
            } else {
              clumn.push({'title': item, 'dataIndex': item})
            }
          }
        })

        this.setState({
          auditData: data,
          columns: clumn,
        })
      }

    }).catch((error) => {

    })
  }


  getFinalData = () => {
    const newDate1 = Number(moment(this.state.startValue).format('X'))
    const newDate2 = Number(moment(this.state.endValue).format('X'))
    // console.log('end', newDate2)
    // console.log('start', newDate1)
    this.getData(newDate1, newDate2)
  }

  handleInputChange = value => {
    // console.log('e', value.target.value)
    this.setState({
      user: value.target.value
    })
  }

  disabledStartDate = startValue => {
    const {endValue} = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const {startValue} = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = value => {
    this.onChange('startValue', value);
  };

  onEndChange = value => {
    this.onChange('endValue', value);
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({endOpen: true});
    }
  };

  handleEndOpenChange = open => {
    this.setState({endOpen: open});
  };

  render() {
    const {auditData, startValue, endValue, endOpen, pre, now, columns} = this.state;
    const {loading} = this.props;

    return (
      <div>
        <div>
          <Row>
            <Input style={{width: 200}} placeholder="请输入用户名" onChange={this.handleInputChange}/>
            <DatePicker
              disabledDate={this.disabledStartDate}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              value={startValue}
              placeholder={pre}
              onChange={this.onStartChange}
              onOpenChange={this.handleStartOpenChange}
            />
            <DatePicker
              disabledDate={this.disabledEndDate}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              value={endValue}
              placeholder={now}
              onChange={this.onEndChange}
              open={endOpen}
              onOpenChange={this.handleEndOpenChange}
            />
            <Button type="primay" onClick={this.getFinalData} loading={loading}>查询</Button>
          </Row>
        </div>
        <br/>
        <div>
          <Table
            loading={loading}
            columns={columns}
            dataSource={auditData}
          />
        </div>
      </div>
    )

  }

}

export default connect(({audit, loading}) => ({
  audit,
  loading: loading.models.audit
}))(Audit);
