import React, { useState, useEffect, memo } from 'react';
import { Form, Drawer, notification, Select, Card } from "antd";

import ctplAPI from 'services/ctpl';
import ComplianceCollapse from 'components/compliance-collapse';
import moment from 'moment';


const Index = ({ orgId, projectId, visible, toggleVisible, id }) => {

  const [ scanResults, setScanResults ] = useState([]);
  const [ scanTime, setScanTime ] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchResult();
  }, []);

  const fetchResult = async () => {
    try {
      const res = await ctplAPI.result({
        tplId: 'tpl-c3okcarn6m88icotqsu0'
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      const resss = { "code": 200, "message": "", "result": { "total": 1, "pageSize": 15, "list": { "scanTime": null, "scanResults": [
        { "Id": 1, 
          "org_id": "org-c3mh1v3n6m89h5povg4g", 
          "project_id": "", 
          "tpl_id": "tpl-c3okcarn6m88icotqsu0", 
          "env_id": "", 
          "taskId": "run-c4rgn7rn6m8de18mgr70", 
          "policyId": "po-c4rgfdrn6m86qtbimrdg",
          "policyGroupId": "pog-c4rgg1rn6m86qtbimreg", 
          "startAt": "2021-09-07T14:50:07+08:00", 
          "status": "violated", 
          "rule_name": "", 
          "description": "", 
          "rule_id": "", 
          "severity": "", 
          "line": 10,
          "source": `"code": "resource "alicloud_vpc" "jack_vpc" {\n  vpc_name = "tf_jack_vpc"\n  cidr_block = "172.16.0.0/12""`,
          "category": "", 
          "resource_name": "",
          "resource_type": "",
          "policyName": "violateRuleTest",
          "policyGroupName": "策略组测试不通过", 
          "fixSuggestion": "1. 设置 internet_max_bandwidth_out = 0\n 2. 取消设置 allocate_public_ip"
        }, { "Id": 2, 
          "org_id": "org-c3mh1v3n6m89h5povg4g", 
          "project_id": "", 
          "tpl_id": "tpl-c3okcarn6m88icotqsu0", 
          "env_id": "", 
          "taskId": "run-c4rgn7rn6m8de18mgr70", 
          "policyId": "po-c4rgfdrn6m86qtbimrdg",
          "policyGroupId": "pog-c4rgg1rn6m86qtbimreg", 
          "startAt": "2021-09-07T14:50:07+08:00", 
          "status": "passed", 
          "rule_name": "", 
          "description": "", 
          "rule_id": "", 
          "severity": "", 
          "line": 10,
          "source": '',
          "category": "", 
          "resource_name": "",
          "resource_type": "",
          "policyName": "violateRuleTest",
          "policyGroupName": "策略组测试不通过", 
          "fixSuggestion": "1. 设置 internet_max_bandwidth_out = 0\n 2. 取消设置 allocate_public_ip"
        }, { "Id": 3, 
          "org_id": "org-c3mh1v3n6m89h5povg4g", 
          "project_id": "", 
          "tpl_id": "tpl-c3okcarn6m88icotqsu0", 
          "env_id": "", 
          "taskId": "run-c4rgn7rn6m8de18mgr70", 
          "policyId": "po-c4rgfdrn6m86qtbimrdg",
          "policyGroupId": "pog-c4rgg1rn6m86qtbimreg", 
          "startAt": "2021-09-07T14:50:07+08:00", 
          "status": "failed", 
          "rule_name": "", 
          "description": "", 
          "rule_id": "", 
          "severity": "", 
          "line": 10,
          "source": '',
          "category": "", 
          "resource_name": "",
          "resource_type": "",
          "policyName": "violateRuleTest",
          "policyGroupName": "策略组测试不通过", 
          "fixSuggestion": "1. 设置 internet_max_bandwidth_out = 0\n 2. 取消设置 allocate_public_ip"
        }, { "Id": 6, 
          "org_id": "org-c3mh1v3n6m89h5povg4g", 
          "project_id": "", 
          "tpl_id": "tpl-c3okcarn6m88icotqsu0", 
          "env_id": "", 
          "taskId": "run-c4rgn7rn6m8de18mgr70", 
          "policyId": "po-c4rgfdrn6m86qtbimrdg",
          "policyGroupId": "pog-c4rgg1rn6m86qtbimreg", 
          "startAt": "2021-09-07T14:50:07+08:00", 
          "status": "suppressed", 
          "rule_name": "", 
          "description": "", 
          "rule_id": "", 
          "severity": "", 
          "line": 10,
          "source": '',
          "category": "", 
          "resource_name": "",
          "resource_type": "",
          "policyName": "violateRuleTest",
          "policyGroupName": "策略组测试不通过", 
          "fixSuggestion": "1. 设置 internet_max_bandwidth_out = 0\n 2. 取消设置 allocate_public_ip"
        }, 
        { "Id": 6, 
          "org_id": "org-c3mh1v3n6m89h5povg4g", 
          "project_id": "", 
          "tpl_id": "tpl-c3okcarn6m88icotqsu0", 
          "env_id": "", 
          "taskId": "run-c4rgn7rn6m8de18mgr70", 
          "policyId": "po-c4rgfdrn6m86qtbimrdg",
          "policyGroupId": "pog-c4rgg1rn6m86qtbimreg", 
          "startAt": "2021-09-07T14:50:07+08:00", 
          "status": "pending", 
          "rule_name": "", 
          "description": "", 
          "rule_id": "", 
          "severity": "", 
          "line": 10,
          "source": '',
          "category": "", 
          "resource_name": "",
          "resource_type": "",
          "policyName": "violateRuleTest",
          "policyGroupName": "策略组测试不通过", 
          "fixSuggestion": "1. 设置 internet_max_bandwidth_out = 0\n 2. 取消设置 allocate_public_ip"
        }
      ] } } };
      setScanResults(resetList(resss.result.list.scanResults || []));
      setScanTime(res.result.list.scanTime || null);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const resetList = (list) => {
    if (list.length) {
      let typeList = [...new Set(list.map(d => (d.policyGroupId)))];
      let ll = [];
      typeList.forEach(d => {
        let obj = {};
        let children = list.filter(t => t.policyGroupId === d).map(it => {
          return it || [];
        });
        obj.policyGroupName = (children.find(item => item.id === d.id) || {}).policyGroupName || '-';
        obj.children = children;
        ll.push(obj);
      });
      return ll || [];
    } else {
      return [];
    }
  };
  
  return (
    <Drawer
      title='检测详情'
      placement='right'
      visible={visible}
      onClose={toggleVisible}
      width={800}
      bodyStyle={{
        padding: 0
      }}
    >
      <Card 
        headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} 
        bodyStyle={{ padding: 6 }} 
        type={'inner'} 
        title={<span style={{ display: 'flex' }}>合规状态 <div className={'UbuntuMonoOblique'}>{scanTime && moment(scanTime).format('YYYY-MM-DD HH:mm:ss') || '-'}</div></span>}
      >
        {
          scanResults.map(info => {
            return (<ComplianceCollapse info={info} />);
          })
        }
      </Card>
    </Drawer>
  );
};
export default memo(Index);