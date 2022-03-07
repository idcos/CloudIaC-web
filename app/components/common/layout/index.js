import React from 'react';
import styled from 'styled-components';
import { GLOBAL_SCROLL_DOM_ID } from 'constants/types';

const LayoutWrapper = styled.div`
  height: 100%;
  overflow: auto;
  padding: 24px 0;
  background-color: #ffffff;
`;
 
const Container = styled.div`
   display: flex;
   flex-direction: column;
 `;
 
const Header = styled.div`
   min-height: 60px;
 `;
 
const Content = styled.div`
   flex: 1;
   position: relative;
   overflow-y: auto;
   background-color: #ffffff;
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
  extraHeader,
  children,
  contentStyle = {},
  footer,
  style,
  containerStyle
}) => {
 
  return (
    <LayoutWrapper style={style} id={GLOBAL_SCROLL_DOM_ID} >
      <Container style={containerStyle}>
        {extraHeader ? (<Header>{extraHeader}</Header>) : null}
        <Content 
          style={contentStyle}
          withFooter={footer}
        >
          {children}
        </Content>
        {footer ? <Footer>{footer}</Footer> : null}
      </Container>
    </LayoutWrapper>
  );
};
 
export default CommonLayout;
 