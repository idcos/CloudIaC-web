import React, { useEffect } from 'react';
import { List } from 'antd';
import { RightOutlined } from "@ant-design/icons";

import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';
import { connect } from "react-redux";
import { compose } from 'redux';

import history from 'utils/history';

import styles from './styles.less';

const Orgs = ({ orgs, dispatch }) => {

  const changeCurOrg = (orgId) => {
    dispatch({
      type: 'global/set-curOrg',
      payload: {
        orgId
      }
    });
    dispatch({
      type: 'global/getProjects',
      payload: {
        orgId
      }
    });
    history.push(`/org/${orgId}/m-org-ct`);
  };

  return <Layout >
    <div className='container-inner-width'>
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
                    changeCurOrg(item.id);
                  }}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={item.description || '-'}
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
