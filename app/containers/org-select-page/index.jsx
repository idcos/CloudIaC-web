import React from 'react';
import { List, Typography } from 'antd';
import { RightOutlined } from "@ant-design/icons";
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';
import { connect } from "react-redux";
import { compose } from 'redux';
import changeOrg from "utils/changeOrg";
import styles from './styles.less';

const Orgs = ({ orgs, dispatch }) => {

  return <Layout style={{ backgroundColor: '#F5F8F8', paddingRight: 0 }} contentStyle={{ backgroundColor: '#F5F8F8' }}>
    <div className={styles.orgsList}>
      <div className='header'>
        <div className='title'>选择您的组织</div>
        <div className='des'>您可以选择以下任意一个组织</div>
      </div>
      <div className='list'>
        <List
          itemLayout='horizontal'
          dataSource={orgs.list}
          split={false}
          renderItem={(item, index) => (
            <>
              {index !== 0 ? <div className='divider'></div> : null}
              <List.Item 
                onClick={() => {
                  changeOrg({ orgId: item.id, dispatch });
                }}
              >
                <List.Item.Meta
                  title={item.name}
                  description={
                    <Typography.Paragraph
                      title={item.description || '-'}
                      ellipsis={{
                        rows: 2,
                        expandable: true,
                        onExpand: (e) => {
                          e.stopPropagation();
                        }
                      }}
                    >
                      {item.description || '-'}
                    </Typography.Paragraph>
                  }
                />
                <div>
                  <RightOutlined />
                </div>
              </List.Item>
            </>
          )}
        />
      </div>
    </div>
  </Layout>;
};

const mapStateToProps = (state) => {
  return {
    orgs: state.global.get('orgs').toJS()
  };
};

const withConnect = connect(
  mapStateToProps
);
const withEB = Eb_WP();

export default compose(
  withConnect,
  withEB
)(Orgs);
