/**
 * Layout with tab's header.
 */
import React from 'react';
import styled from 'styled-components';
import { PageHeader } from 'antd';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled(PageHeader)`
  border-bottom: 1px solid #ebebeb;
  &.ant-page-header.has-footer {
    padding: 8px 16px 0;
  }
  .ant-page-header-footer {
    margin-top: 0;
    .ant-tabs .ant-tabs-nav .ant-tabs-tab {
      font-size: 14px;
    }
  }
`;

const Title = styled.div`
  font-size: 18px;
  color: #232323;
  font-weight: 500;
`;

const Content = styled.div`
  flex: 1;
  height: calc(100% - 90px);
  position: relative;
  padding: 16px;
  overflow-y: auto;
  background-color: #f5f5f5;
  .ant-form-item-control-input-content {
    word-break: break-all;
  }
`;

/**
 * LayoutWithTabs
 * @param {string | ReactNode} title page's title
 * @param {any} children main content, overflow-y: auto
 * @param {Ant-design Tabs} tabHeader just tab head, not tab content
 * <Tabs><Tabs.TabPane tab={string} key={string} /></Tabs>
 */
const LayoutWithTabs = ({
  title = 'Tabs shown below ↓',
  tabHeader,
  children
}) => {
  return (
    <Container>
      <Header
        title={<Title>{title}</Title>}
        footer={tabHeader}
      />
      <Content>
        {children}
      </Content>
    </Container>
  );
};

export default LayoutWithTabs;