import React, { useState } from 'react';
import { List, Typography, notification } from 'antd';
import { RightOutlined } from "@ant-design/icons";
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';
import EmptyGen from 'components/empty-gen';
import OrgModal from 'components/orgModal';
import { connect } from "react-redux";
import { compose } from 'redux';
import changeOrg from "utils/changeOrg";
import { t } from 'utils/i18n';
import getPermission from "utils/permission";
import { IAC_PUBLICITY_HOST } from 'constants/types';
import orgsAPI from 'services/orgs';
import styles from './styles.less';

const Orgs = ({ orgs, userInfo, dispatch }) => {

  const [ visible, setVisible ] = useState(false),
    [ opt, setOpt ] = useState(null);

  const isEmpty = (orgs.list || []).length === 0;
  const { SYS_OPERATOR } = getPermission(userInfo);

  const resfreshGlobalOrg = () => {
    dispatch({
      type: 'global/getOrgs',
      payload: {
        status: 'enable'
      }
    });
  };

  const operation = async ({ doWhat, payload }, cb) => {
    try {
      const method = {
        add: (param) => orgsAPI.create(param)
      };
      const res = await method[doWhat]({
        ...payload
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: t('define.message.opSuccess')
      });
      resfreshGlobalOrg();
      cb && cb();
    } catch (e) {
      cb && cb(e);
      notification.error({
        message: t('define.message.opFail'),
        description: e.message
      });
    }
  };

  const toggleVisible = () => {
    if (visible) {
      setOpt(null);
    }
    setVisible(!visible);
  };


  return isEmpty ? (
    !SYS_OPERATOR ?
      <EmptyGen
        imgName='contact-admin.png'
        title={t('define.project.noPermission')}
        description={t('define.page.selectOrg.empty.noPermission.des')}
        linkText={t('define.page.selectOrg.org')}
        linkUrl={`${IAC_PUBLICITY_HOST}/markdown/docs/mkdocs/manual/org-project-role.md`}
      /> :
      <>
        <EmptyGen
          imgName='new-org.png'
          title={t('define.page.selectOrg.new')}
          imgClickFn={() => {
            setOpt('add');
            toggleVisible();
          }}
          description={t('define.page.selectOrg.empty.des')}
          linkText={t('define.page.selectOrg.org')}
          linkUrl={`${IAC_PUBLICITY_HOST}/markdown/docs/mkdocs/manual/org-project-role.md`}
        />
        {
          visible && <OrgModal
            visible={visible}
            toggleVisible={toggleVisible}
            opt={opt}
            operation={operation}
          />
        }
      </>
  ) : (<Layout style={{ backgroundColor: '#F5F8F8', paddingRight: 0 }} contentStyle={{ backgroundColor: '#F5F8F8' }}>
    <div className={styles.orgsList}>
      <div className='header'>
        <div className='title'>{t('define.page.selectOrg.title')}</div>
        <div className='des'>{t('define.page.selectOrg.des')}</div>
      </div>
      <div className='list'>
        <List
          itemLayout='horizontal'
          dataSource={orgs.list}
          split={false}
          renderItem={(item, index) => (
            <>
              {index !== 0 ? <div className='divider'></div> : null}
              <List.Item
                onClick={() => {
                  changeOrg({ orgId: item.id, dispatch });
                }}
              >
                <List.Item.Meta
                  title={item.name}
                  description={
                    <Typography.Paragraph
                      title={item.description || '-'}
                      ellipsis={{
                        rows: 2,
                        expandable: true,
                        onExpand: (e) => {
                          e.stopPropagation();
                        }
                      }}
                    >
                      {item.description || '-'}
                    </Typography.Paragraph>
                  }
                />
                <div>
                  <RightOutlined />
                </div>
              </List.Item>
            </>
          )}
        />
        <div className='divider'></div>
        <div 
          className='create'
          onClick={() => {
            setOpt('add');
            toggleVisible();
          }}
        >
          <div className='create_main'>
            +{t('define.page.sysSet.org.action.create')}
          </div>
          <div>
            <RightOutlined />
          </div>
        </div>
      </div>
    </div>
    {
      visible && <OrgModal
        visible={visible}
        toggleVisible={toggleVisible}
        opt={opt}
        operation={operation}
      />
    }
  </Layout>);
};

const mapStateToProps = (state) => {
  return {
    orgs: state.global.get('orgs').toJS(),
    userInfo: state['global'].get('userInfo').toJS()
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
