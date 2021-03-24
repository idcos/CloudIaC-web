import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import styles from './styles.less';

import { Breadcrumb, Row, Col } from 'antd';

export default withRouter((props) => {
  const { breadcrumb, title, des, subDes, renderFooter, location, match } = props;
  return <div className={styles.pageHeader}>
    <div className='container-inner-width'>
      { breadcrumb && <BreadcrumbWrapper
        location={location}
        params={match.params}
      />}
      <Row type='flex' align='middle' justify='space-around'>
        <Col span={14}>
          <h2 className='title'>{title}</h2>
          <p className='des'>{des}</p>
        </Col>
        <Col span={10}>
          <p className='subDes'>{subDes}</p>
        </Col>
      </Row>
    </div>
  </div>;
});


const isRouteParamValues = (routeParams, pathSnippet) => Object.keys(routeParams).every(it => routeParams[it] === pathSnippet);

const breadcrumbNameMap = {
  ct: '云模板',
  setting: '设置',
  createCT: '创建云模板'
};

const BreadcrumbWrapper = ({ location, params }) => {
  const pathSnippets = location.pathname.split('/').filter(i => i);

  const extraBreadcrumbItems = pathSnippets.map((snippet, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    const isLastOne = index == pathSnippets.length - 1;
    return (
      <Breadcrumb.Item key={url}>
        <Link
          to={url}
          disabled={isLastOne || index == 0}
        >
          {
            isRouteParamValues(params, snippet) ?
              snippet :
              breadcrumbNameMap.hasOwnProperty(snippet) && breadcrumbNameMap[snippet]
          }
        </Link>
      </Breadcrumb.Item>
    );
  });

  const breadcrumbItems = [
    <Breadcrumb.Item key='/'>
      <Link to='/'>组织</Link>
    </Breadcrumb.Item>
  ].concat(extraBreadcrumbItems);

  return <div className='breadcrumbWrapper'>
    <Breadcrumb>{breadcrumbItems}</Breadcrumb>
  </div>;
};
