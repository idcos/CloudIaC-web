import React, { useContext, useEffect, useImperativeHandle } from 'react';
import { Form, Row, Col, Radio, Select, Input, Button, Spin, Space } from 'antd';
import intersection from 'lodash/intersection';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import vcsAPI from 'services/vcs';
import Coder from "components/coder";
import FormPageContext from '../form-page-context';
import styles from './styles.less';

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
};

export default () => {

  const { 
    isCreate, 
    type, 
    formData, 
    setFormData, 
    setCurrent, 
    stepRef, 
    formDataToParams, 
    linkToPolicyGroupList, 
    create,
    createLoading,
    update,
    updateLoading,
    check,
    checkLoading,
    ready
  } = useContext(FormPageContext);
  const [form] = Form.useForm();

  useEffect(() => {
    if (ready) {
      const formValues = formData[type] || {};
      const { vcsId, repoId, repoRevision } = formValues;
      form.setFieldsValue(formValues);
      if (vcsId) {
        fetchRepoOptions({ vcsId });
      }
      if (vcsId && repoId) {
        fetchRepoBranchOptions({ vcsId, repoId });
        fetchRepoTagOptions({ vcsId, repoId });
      }
      if (vcsId && repoId && repoRevision) {
        fetchReadmeText({
          vcsId, 
          repoId, 
          repoRevision
        });
      }
    }
  }, [ready]);

  // vcs选项
  const {
    data: vcsOptions = [],
    loading: vcsLoading
  } = useRequest(
    () => requestWrapper(
      vcsAPI.searchVcs.bind(null, { 
        status: 'enable',
        isShowDefaultVcs: true,
        pageSize: 0
      })
    ), {
      formatResult: res => (res.list || []).map(it => ({ label: it.name, value: it.id }))
    }
  );

  // 仓库选项
  const {
    data: repoOptions = [],
    loading: repoLoading,
    run: fetchRepoOptions,
    mutate: mutateRepoOptions
  } = useRequest(
    ({ vcsId, q }) => requestWrapper(
      vcsAPI.listRepo.bind(null, {
        vcsId,
        currentPage: 1,
        pageSize: 50,
        q
      })
    ),
    {
      manual: true,
      debounceInterval: 300,
      formatResult: data => {
        const { repoId, repoFullName } = form.getFieldsValue();
        const hasSelectedItem = (data.list || []).find((it) => it.id === repoId);
        if (repoId && repoFullName && !hasSelectedItem) {
          return [ ...data.list, { id: repoId, fullName: repoFullName }].map(it => ({ label: it.fullName, value: it.id }));
        } else {
          return (data.list || []).map(it => ({ label: it.fullName, value: it.id }));
        }
      }
    }
  );

  // 仓库分支选项
  const {
    data: repoBranchOptions = [],
    loading: repoBranchLoading,
    run: fetchRepoBranchOptions,
    mutate: mutateRepoBranchOptions
  } = useRequest(
    ({ vcsId, repoId }) => requestWrapper(
      vcsAPI.listRepoBranch.bind(null, {
        vcsId,
        repoId
      })
    ),
    {
      manual: true,
      formatResult: data => (data || []).map(it => ({ label: it.name, value: it.name }))
    }
  );

  // 仓库标签选项
  const {
    data: repoTagOptions = [],
    loading: repoTagLoading,
    run: fetchRepoTagOptions,
    mutate: mutateRepoTagOptions
  } = useRequest(
    ({ vcsId, repoId }) => requestWrapper(
      vcsAPI.listRepoTag.bind(null, {
        vcsId,
        repoId
      })
    ),
    {
      manual: true,
      formatResult: data => (data || []).map(it => ({ label: it.name, value: it.name }))
    }
  );

  // 查询readme信息
  const {
    data: readmeText = undefined,
    loading: readmeTextLoading,
    run: fetchReadmeText,
    mutate: mutateReadmeText
  } = useRequest(
    ({ vcsId, repoId, repoRevision }) => requestWrapper(
      vcsAPI.readme.bind(null, {
        vcsId,
        repoId,
        repoRevision
      })
    ),
    {
      manual: true,
      formatResult: data => data.content || ''
    }
  );

  const onValuesChange = (changedValues, allValues) => {
    const changedKeys = Object.keys(changedValues);
    const { vcsId, repoId, repoRevision } = allValues || {};
    if (changedKeys.includes('vcsId')) {
      // 切换vcs需要将关联的数据源【仓库、分支、标签】清空 ，再重新查询数据源
      !!repoOptions.lenngth && mutateRepoOptions([]);
      !!repoBranchOptions.lenngth && mutateRepoBranchOptions([]);
      !!repoTagOptions.lenngth && mutateRepoTagOptions([]);
      form.setFieldsValue({
        repoId: undefined,
        repoFullName: undefined,
        repoRevision: undefined,
        branch: undefined,
        gitTags: undefined,
        dir: undefined
      });
      if (vcsId) {
        fetchRepoOptions({ vcsId });
      }
    }
    if (changedKeys.includes('repoId')) {
      // 切换仓库需要将关联的数据源【分支、标签】清空 ，再重新查询数据源
      !!repoBranchOptions.lenngth && mutateRepoBranchOptions([]);
      !!repoTagOptions.lenngth && mutateRepoTagOptions([]);
      form.setFieldsValue({
        repoFullName: (repoOptions.find(it => it.value === changedValues.repoId) || {}).label,
        repoRevision: undefined,
        branch: undefined,
        gitTags: undefined,
        dir: undefined
      });
      if (vcsId && repoId) {
        fetchRepoBranchOptions({ vcsId, repoId });
        fetchRepoTagOptions({ vcsId, repoId });
      }
    }
    // readme参数依赖是否变化
    const readmeParamsChange = intersection(changedKeys, [ 'vcsId', 'repoId', 'branch' ]).length > 0;
    if (readmeParamsChange) {
      if (changedValues.repoRevision) {
        fetchReadmeText({
          vcsId, 
          repoId, 
          repoRevision
        });
      } else {
        readmeText !== undefined && mutateReadmeText(undefined);
      }
    }
  };

  const onSearchRepos = (value) => {
    const vcsId = form.getFieldValue('vcsId');
    vcsId && fetchRepoOptions({ vcsId, q: value });
  };

  const next = async () => {
    const formValues = await form.validateFields();
    const params = formDataToParams({ ...formData, [type]: formValues });
    await check(params);
    setFormData(preValue => ({ ...preValue, [type]: formValues }));
    setCurrent(preValue => preValue + 1);
  };

  const onUpdate = async () => {
    const formValues = await form.validateFields();
    const params = formDataToParams({ ...formData, [type]: formValues });
    await check(params);
    update(params);
  };

  useImperativeHandle(stepRef, () => ({
    onFinish: async (index) => {
      const formValues = await form.validateFields();
      const params = formDataToParams({ ...formData, [type]: formValues });
      await check(params);
      setFormData(preValue => ({ ...preValue, [type]: formValues }));
      setCurrent(index);
    }
  }));

  return (
    <Row gutter={16} className={styles.sourceForm}>
      <Col span={11}>
        <Form form={form} {...FL} onValuesChange={onValuesChange}>
          <Form.Item 
            name='source' 
            wrapperCol={{ offset: 5, span: 19 }}
            initialValue='vcs'
          >
            <Radio.Group>
              <Radio value='vcs'>VCS</Radio>
              <Radio value='registry'>Registry</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item noStyle={true} shouldUpdate={true}>
            {({ getFieldValue }) => {
              const source = getFieldValue('source');
              switch (source) {
              case 'vcs':
                return (
                  <>
                    <Form.Item 
                      label='VCS'
                      name='vcsId' 
                      rules={[{ required: true, message: '请选择' }]}
                    >
                      <Select 
                        placeholder='请选择VCS'
                        optionFilterProp='label'
                        showSearch={true}
                        loading={vcsLoading}
                        options={vcsOptions}
                      />
                    </Form.Item>
                    <Form.Item 
                      label='代码仓库'
                      name='repoId'
                      rules={[{ required: true, message: '请选择' }]}
                    >
                      <Select 
                        loading={repoLoading}
                        optionFilterProp='label'
                        options={repoOptions}
                        showSearch={true}
                        filterOption={false}
                        onDropdownVisibleChange={(open) => open && onSearchRepos()}
                        onSearch={onSearchRepos}
                        placeholder='请输入仓库名称搜索'
                      />
                    </Form.Item>
                    <Form.Item
                      name='repoFullName'
                      hidden={true}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item 
                      label='分支/标签'
                      name='repoRevision'
                      rules={[{ required: true, message: '请选择' }]}
                    >
                      <Select 
                        placeholder='请选择分支/标签'
                        loading={repoBranchLoading || repoTagLoading}
                        onChange={(value, option) => {
                          if (option.type === 'branch') {
                            form.setFieldsValue({ branch: value, gitTags: '' });
                          } else {
                            form.setFieldsValue({ gitTags: value, branch: '' });
                          }
                        }}
                      >
                        <Select.OptGroup label='分支'>
                          {repoBranchOptions.map(it => <Select.Option value={it.value} type='branch'>{it.label}</Select.Option>)}
                        </Select.OptGroup>
                        <Select.OptGroup label='标签'>
                          {repoTagOptions.map(it => <Select.Option value={it.value} type='gitTags'>{it.label}</Select.Option>)}
                        </Select.OptGroup>
                      </Select>
                    </Form.Item>
                    <Form.Item 
                      label='分支'
                      name='branch'
                      hidden={true}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item 
                      label='标签'
                      name='gitTags'
                      hidden={true}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item 
                      label='目录'
                      name='dir'
                    >
                      <Input placeholder='请填写目录' />
                    </Form.Item>
                  </>
                );
              case 'registry':
                return (
                  <>
                    <Form.Item 
                      label='策略组'
                      name=''
                      rules={[{ required: true, message: '请选择' }]}
                    >
                      <Select 
                        placeholder='请选择策略组'
                        optionFilterProp='label'
                        showSearch={true}
                        loading={false}
                        options={[]}
                      />
                    </Form.Item>
                    <Form.Item 
                      label='版本'
                      name=''
                      rules={[{ required: true, message: '请选择' }]}
                    >
                      <Select 
                        placeholder='请选择版本'
                        optionFilterProp='label'
                        showSearch={true}
                        loading={false}
                        options={[]}
                      />
                    </Form.Item>
                  </>
                );
              default:
                return;
              }
            }}
          </Form.Item>
          <Form.Item 
            wrapperCol={{ span: 19, offset: 5 }}
          >
            {isCreate ? (
              <Space>
                <Button type='primary' onClick={next}>下一步</Button>
              </Space>
            ) : (
              <Space>
                <Button onClick={linkToPolicyGroupList}>取消</Button>     
                <Button type='primary' onClick={onUpdate} loading={updateLoading}>提交</Button>     
              </Space>
            )}
          </Form.Item>
        </Form>
      </Col>
      <Col span={13} className='readme-info'>
        <div className='title'>Readme</div>
        <div className='code-wrapper'>
          {readmeTextLoading ? <Spin /> : (
            readmeText ? (
              <Coder value={readmeText} style={{ height: '100%' }} />
            ) : (
              <div className='empty-text'>
                {readmeText === undefined ? (
                  <span>选择VCS、仓库、分支/标签查看策略组说明</span>
                ) : (
                  <span>未获取重复组说明</span>
                )}
              </div>
            )
          )}
        </div>
      </Col>
    </Row>
  );
};