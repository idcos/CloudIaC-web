import React from 'react';
import { Link } from 'react-router-dom';
import RoutesList from 'components/routes-list';
import { connect } from 'react-redux';
import { compose } from 'redux';
import reducer, { initialState } from './reducer';
import { injectReducer, injectSaga } from 'redux-injectors';
import saga from './saga';
import { Button } from 'antd';
import { Eb_WP } from 'components/error-boundary';

const KEY = 'Test';

class Test extends React.Component {
  fetchList = () => {
    this.props.dispatch({
      type: 'test/getList'
    });
  }

  render() {
    const { names } = this.props.testData;
    return (
      <>
        <h1>测试</h1>
        {names.map(it => (
          <p key={it.name}>
            name: {it.name} age: {it.age}
          </p>
        ))}
        <div>
          <Button onClick={() => {
            this.fetchList();
          }}
          >123</Button>
        </div>
        <ul>
          <li>
            <Link to='/test/sub1'>子路由1</Link>
          </li>
          <li>
            <Link to='/test/sub2'>结构示例</Link>
          </li>
        </ul>
        <RoutesList routes={this.props.routes} />
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    testData: state[KEY] || initialState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: KEY, reducer });
const withSaga = injectSaga({ key: KEY, saga });
const withEb = Eb_WP();

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withEb
)(Test);
