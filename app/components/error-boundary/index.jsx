import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { Button, Result } from 'antd';
import { t } from 'utils/i18n';
import styles from './styles.less';
export default class Eb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
    };
  }

  componentDidCatch(error, info) {
    this.setState({
      error: error,
      errorInfo: info,
    });
  }

  handleClick = () => {
    window.location.href = '/';
  };

  render() {
    const { errorInfo, error } = this.state;
    if (errorInfo) {
      console.error(`%c ${error.toString()} ${errorInfo.componentStack}`, "color:red"); //eslint-disable-line
      return (
        <div className={styles.EB}>
          <Result
            status='error'
            title={t('define.errPage.result.title')}
            subTitle={t('define.errPage.result.subTitle')}
            extra={[
              <Button type='primary' onClick={this.handleClick}>
                {t('define.action.backHome')}
              </Button>,
            ]}
          ></Result>
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
export const Eb_WP = () => WrapperC => {
  class WithEbC extends React.Component {
    render() {
      return (
        <Eb>
          <WrapperC {...this.props} />
        </Eb>
      );
    }
  }
  return hoistNonReactStatics(WithEbC, WrapperC);
};
