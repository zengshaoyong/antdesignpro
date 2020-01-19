import React from 'react';
import {connect} from 'dva';
import styles from './index.less';
import {Tabs} from 'antd';
import Pods from "@/pages/kubernetes/dashboard/components/pods";
import Svc from "@/pages/kubernetes/dashboard/components/services";
import Pvcs from "@/pages/kubernetes/dashboard/components/pvc";
import Deployments from "@/pages/kubernetes/dashboard/components/deployment";
import Ingress from "@/pages/kubernetes/dashboard/components/ingress";

const {TabPane} = Tabs;

class kubernetes extends React.Component {
  state = {};


  render() {
    return (
      <div className={styles}>
        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="Pod" key="1">
            <div><Pods/></div>
          </TabPane>
          <TabPane tab="Deployment" key="2">
            <div><Deployments/></div>
          </TabPane>
          <TabPane tab="Service" key="3">
            <div><Svc/></div>
          </TabPane>
          <TabPane tab="Pvc" key="4">
            <div><Pvcs/></div>
          </TabPane>
          <TabPane tab="Ingress" key="5">
            <div><Ingress/></div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

// eslint-disable-next-line no-shadow
export default connect(({kubernetes, loading}) => ({
  kubernetes,
  loading: loading.models.kubernetes,
}))(kubernetes);

