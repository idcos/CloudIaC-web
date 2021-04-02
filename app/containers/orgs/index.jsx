import React, { useEffect } from 'react';
import { List, Tag } from 'antd';
import { Link } from 'react-router-dom';

import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';
import { connect } from "react-redux";
import { compose } from 'redux';

const Orgs = ({ orgs, dispatch }) => {

  const changeCurOrg = (orgId) => {
    dispatch({
      type: 'global/set-curOrg',
      payload: {
        orgId
      }
    });
  };

  return <Layout
    extraHeader={<PageHeader
      title='组织'
      breadcrumb={false}
    />}
  >
    <div className='container-inner-width whiteBg withPadding'>
      <List
        itemLayout='horizontal'
        dataSource={orgs.list}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={<Link
                to={`/org/${item.guid}/ct`}
                onClick={() => {
                  changeCurOrg(item.guid);
                }}
              >
                {item.name}
              </Link>}
              description={item.description || '-'}
            />
          </List.Item>
        )}
      />
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
