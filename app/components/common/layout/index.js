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

const LayoutWrapper = styled.div`
  height: 100%;
  overflow: auto;
  padding: 24px;
  background-color: #E6F0F0;
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
   background-color: #E6F0F0;
   margin-top: 24px;
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
    <LayoutWrapper style={style}>
      <Container style={containerStyle}>
        {extraHeader ? (<Header>{extraHeader}</Header>) : null}
        <Content 
          id='idcos-layout-content' 
          // 注意：#idcos-layout-content谨慎改动！！！
          // 影响范围：全局搜索‘idcos-layout-content’定位影响范围
          // 影响原因：在固钉和锚点当中使用过，改动其样式请回归测试固钉（Affix）和锚点（Anchor）功能
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
 