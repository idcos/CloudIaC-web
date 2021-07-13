/**
 * Common Layout
 *  ______________________
 * |______________________| Header
 * |                      |
 * |       Content        | Body
 * |______________________|
 * |______________________| Footer [Optional]
 */
import React from 'react';
import styled from 'styled-components';
import { ArrowLeftOutlined } from '@ant-design/icons';
import history from 'utils/history';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  min-height: 60px;
  border-bottom: solid 1px #E6E6E6;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const BackIcon = styled(ArrowLeftOutlined)`
  color: #242424;;
  font-weight: 500;
  font-size: 18px;
  margin-right: 10px;
`;

const Title = styled.div`
  color: #242424;
  font-size: 18px;
  margin-right: 10px;
  font-weight: 500;
`;

const ExtraTitle = styled.div``;

const Content = styled.div`
  flex: 1;
  height: ${props => props.withFooter ? 'calc(100% - 100px)' : 'calc(100% - 50px)'};
  position: relative;
  padding: 24px;
  overflow-y: auto;
  background-color: #E6F0F0;
  .ant-form-item-control-input-content {
    word-break: break-all;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  height: 49px;
  border-top: 1px solid #ebebeb;
`;

/**
 * Detail Page Layout
 * @param {string | ReactNode} title page's title
 * @param {ReactNode} extraTitle node append after title
 * @param {ReactNode} extraHeader node append end of header
 * @param {any} children main content, overflow-y: auto
 * @param {boolean | function} onBack always set `true`, unless you want handle back behaviour yourself
 * @param {CSSObject} contentStyle maybe customize content container's style
 * @param {ReactNode} footer footer bar's content
 */
const CommonLayout = ({
  title,
  extraTitle,
  extraHeader,
  children,
  onBack,
  contentStyle = {},
  footer
}) => {
  // handle back
  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack();
    } else {
      history.goBack();
    }
  };

  return (
    <Container>
      <Header>
        {extraHeader && <>{extraHeader}</>}
      </Header>
      <Content style={contentStyle} withFooter={footer}>{children}</Content>
      {footer ? <Footer>{footer}</Footer> : null}
    </Container>
  );
};

export default CommonLayout;
