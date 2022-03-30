import React from 'react';
import styles from './styles.less';
import { Tabs } from 'antd';

const { TabPane } = Tabs;
const d = [{ eip: "35%" }, { slb: "35%" }, { vpc: "35%" }, { obs: "35%" }, { sms: "35%" }];

const Item = ({ i, obj }) => {
  return (
    <div className={styles.data_item}>
      <div>{i}</div>
      <div>eip</div>
      <div>--</div>
      <div>35%</div>
    </div>
  );
};
export const EnvStat = () => {
  return (
    <div className={styles.envStat_content}>
      <h2>概览详情</h2>
      <h3>环境状态占比</h3>
      <div>
        {d.map((value, i) => {
          return <Item obj={value} i={i + 1} />;
        })}
      </div>
    </div>
  );
};

export const ResStat = () => {
  return (
    <div>ResStat</div>
  );
};

export const ProjectStat = () => {
  return (
    <div className={styles.projectStat}>
      <h2>环境资源数量</h2>
      <Tabs defaultActiveKey='1' onChange={(v) => console.log(v)}>
        <TabPane tab='上月' key='1'>
          <div>
            {d.map((value, i) => {
              return <Item obj={value} i={i + 1} />;
            })}
          </div>
        </TabPane>
        <TabPane tab='本月' key='2'>
          <div>
            {d.map((value, i) => {
              return <Item obj={value} i={i + 1} />;
            })}
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export const ResGrowTrend = () => {
  return (
    <div>
      
    </div>
  );
};
