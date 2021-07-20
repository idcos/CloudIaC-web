import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './styles.less';

import { Row, Col } from 'antd';

import BreadcrumbWrapper from './breadcrumb';

const PageHeader = (props) => {
  const { breadcrumb, title, des, subDes, renderFooter, location, match, curOrg, className } = props;
  return <div className={`${styles.pageHeader} ${className}`}>
    <div>
      { breadcrumb && <BreadcrumbWrapper
        location={location}
        params={match.params}
        externalData={{
          curOrg
        }}
      />}
      <Row className='header-wrapper' type='flex' align='middle' justify='space-around'>
        <Col span={14}>
          <h2 className='title reset-styles'>
            {title}
            <span className='des'>{des}</span>
          </h2>
        </Col>
        <Col span={10}>
          <p className='subDes reset-styles'>{subDes}</p>
        </Col>
      </Row>
      {Function.prototype.isPrototypeOf(renderFooter) && renderFooter()}
    </div>
  </div>;
};


export default connect((state) => {
  return {
    curOrg: state.global.get('curOrg')
  };
})(withRouter(PageHeader));
