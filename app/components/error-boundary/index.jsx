import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { Button, Result, Row, Space, Typography } from 'antd';
import styles from './styles.less';
import { CloseCircleOutlined } from '@ant-design/icons';

export default class Eb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null
    };
  }

  componentDidCatch(error, info) {
    this.setState({
      error: error,
      errorInfo: info
    });
  }

  handleClick = () => {
    window.location.href = '/';
  }

  render() {
    const { errorInfo, error } = this.state;
    if (errorInfo) {
      console.error(`%c ${error.toString()} ${errorInfo.componentStack}`, "color:red"); //eslint-disable-line
      return (
        <div className={styles.EB}>
          <Result
            status='error'
            title='加载出现了一点问题'
            subTitle='请刷新页面重试'
            extra={[
              <Button type='primary' onClick={this.handleClick}>回到首页</Button>
            ]}
          >
            {/* Error Stack Info */}
            {/* <Row align='middle'>
              <Typography.Paragraph>
                <Space>
                  {<CloseCircleOutlined className={styles.error} />}
                  {error.toString()}
                </Space>
              </Typography.Paragraph>
              <Typography.Paragraph>
                <Space>
                  {<CloseCircleOutlined className={styles.error} />}
                  {errorInfo.componentStack.toString()}
                </Space>
              </Typography.Paragraph>
            </Row> */}
          </Result>
        </div>
      );
    }
    return this.props.children;
  }
}


/**
 * 包装函数，避免了直接在render中return最外层包装
 * @return {function(*=)}
 * @constructor
 */
export const Eb_WP = () => (WrapperC) => {
  class WithEbC extends React.Component {
    render() {
      return <Eb><WrapperC {...this.props}/></Eb>;
    }
  }
  return hoistNonReactStatics(WithEbC, WrapperC);
};
