import React, { useState, useEffect, useRef } from 'react';
import { Card, Space, Radio, Input, notification, Row, Col, Button, Form } from 'antd';

import { Eb_WP } from 'components/error-boundary';
import { chartUtils } from 'components/charts-cfg';

import styles from './styles.less';

const FL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const Basic = (props) => {
  const genData = (count) => {
    let nameList = [
      '赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章', '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦', '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳', '酆', '鲍', '史', '唐', '费', '廉', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常', '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余', '元', '卜', '顾', '孟', '平', '黄', '和', '穆', '萧', '尹', '姚', '邵', '湛', '汪', '祁', '毛', '禹', '狄', '米', '贝', '明', '臧', '计', '伏', '成', '戴', '谈', '宋', '茅', '庞', '熊', '纪', '舒', '屈', '项', '祝', '董', '梁', '杜', '阮', '蓝', '闵', '席', '季', '麻', '强', '贾', '路', '娄', '危'
    ];
    let legendData = [];
    let seriesData = [];
    let selected = {};
    for (let i = 0; i < count; i++) {
      name = Math.random() > 0.65
        ? makeWord(5, 6)
        : makeWord(5, 6);
      legendData.push(name);
      seriesData.push({
        name: name,
        value: Math.round(Math.random() * 100000)
      });
      selected[name] = i < 6;
    }
    
    return {
      legendData: legendData,
      seriesData: seriesData,
      selected: selected
    };
    
    function makeWord(max, min) {
      let nameLen = Math.ceil(Math.random() * max + min);
      let name = [];
      for (let i = 0; i < nameLen; i++) {
        name.push(nameList[Math.round(Math.random() * nameList.length - 1)]);
      }
      return name.join('');
    }
  };
  const [form] = Form.useForm();
  let CHART = useRef([
    { key: 'statistic_pie', domRef: useRef(), des: '环境状态占比', ins: null }
  ]);
  const resizeHelper = chartUtils.resizeEvent(CHART);
  useEffect(() => {
    CHART.current.forEach(chart => {
      chartUtils.update(chart, genData(6));
    });
    resizeHelper.attach();
    return resizeHelper.remove();
  }, []);
  return (<div className={styles.basic}>
    <Card title={'基础信息'}>
      <Form
        form={form}
        {...FL}
        layout='vertical'
        initialValues={{
          timeout: 300,
          saveState: false
        }}
      >
        <Form.Item
          label='项目名称'
          name='name'
          rules={[
            {
              required: true,
              message: '请输入'
            }
          ]}
        >
          <Input placeholder='请输入云模板名称' />
        </Form.Item>
        <Form.Item
          label='项目描述'
          name='description'
          rules={[
            {
              message: '请输入'
            }
          ]}
        >
          <Input.TextArea placeholder='请输入描述' />
        </Form.Item>
        <Space style={{ float: 'right' }}>
          <Button type='primary' htmlType={'submit'} >完成</Button>
        </Space>
      </Form>
    </Card>
    <Card title={'项目统计'} style={{ marginTop: 24 }}>
      <Row style={{ display: 'flex', justifyContent: 'center' }}>
        {CHART.current.map(chart => <Col span={18}>
          <div className='chartPanel' style={{ position: 'relative' }}>
            <h2 style={{ position: 'relative', top: 120, left: 18 }}>云模板数量
              <h1 style={{ display: 'flex' }}>{CHART.number || 5}</h1>
            </h2>
            <div ref={chart.domRef} className='chartEle'></div>
          </div>
        </Col>)}
      </Row>
    </Card>
  </div>);
};

export default Eb_WP()(Basic);
