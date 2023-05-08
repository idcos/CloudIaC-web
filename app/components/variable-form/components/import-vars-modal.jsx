import React, { useState } from 'react';
import { Modal, Table, Collapse } from 'antd';
import { t } from 'utils/i18n';
const { Panel } = Collapse;

export default (props) => {

  const { visible, defaultScope, varList, importVars = [], onClose, onFinish } = props;
  const [ selectedListVital, setSelectedListVital ] = useState({
    keys: [],
    rows: []
  });
  const [ selectedListRest, setSelectedListRest ] = useState({
    keys: [],
    rows: []
  });

  const importVarsVital = importVars && importVars.filter((v) => {
    return !!v.description && (v.description.indexOf('(必填)') != -1 || v.description.indexOf('（必填）') != -1) || v.value === '' || !!v.required;
  });

  const importVarsRest = importVars && importVars.filter((v) => {
    return !(!!v.description && (v.description.indexOf('(必填)') != -1 || v.description.indexOf('（必填）') != -1) || v.value === '' || !!v.required);
  });
  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      width: 180,
      ellipsis: true
    }, 
    {
      title: 'value',
      dataIndex: 'value',
      width: 180,
      ellipsis: true
    }, 
    {
      title: t('define.des'),
      dataIndex: 'description',
      width: 180,
      ellipsis: true
    } 
  ];

  const rowSelectionVital = {
    columnWidth: 26,
    selectedRowKeys: selectedListVital.keys,
    getCheckboxProps: (record) => {
      const hasSameName = !!varList.find(it => it.name === record.name);
      if (hasSameName) {
        return { disabled: true };
      } 
      return null;
    },
    onChange: (keys, rows) => {
      setSelectedListVital({
        keys,
        rows
      });
    }
  };


  const rowSelectionRest = {
    columnWidth: 26,
    selectedRowKeys: selectedListRest.keys,
    getCheckboxProps: (record) => {
      const hasSameName = !!varList.find(it => it.name === record.name);
      if (hasSameName) {
        return { disabled: true };
      } 
      return null;
    },
    onChange: (keys, rows) => {
      setSelectedListRest({
        keys,
        rows
      });
    }
  };

  const onCancel = () => {
    reset();
    onClose();
  };

  const onOk = () => {
    const paramsVital = selectedListVital.rows.map((it) => ({
      type: 'terraform',
      sensitive: false,
      scope: defaultScope,
      ...it
    }));
    const paramsRest = selectedListRest.rows.map((it) => ({
      type: 'terraform',
      sensitive: false,
      scope: defaultScope,
      ...it
    }));
    onFinish([ ...paramsVital, ...paramsRest ], () => {
      reset();
      onClose();
    });
  };

  const reset = () => {
    setSelectedListVital({
      keys: [],
      rows: []
    });
    setSelectedListRest({
      keys: [],
      rows: []
    });
  };
  
  return (
    <Modal 
      width={720} 
      title={t('define.import')}
      visible={visible} 
      onCancel={onCancel} 
      onOk={onOk}
      className='antd-modal-type-table'
      cancelButtonProps={{ 
        className: 'ant-btn-tertiary' 
      }}
    >
      <Table 
        columns={columns} 
        dataSource={importVarsVital}
        scroll={{ x: 'min-content', y: 350 }} 
        pagination={false} 
        rowKey={(record) => record.name}
        rowSelection={rowSelectionVital}
      />
      <Collapse ghost={true}>
        <Panel header={t('define.variable.rest')} forceRender={true}>
          <Table 
            columns={columns} 
            dataSource={importVarsRest}
            scroll={{ x: 'min-content', y: 350 }} 
            pagination={false} 
            rowKey={(record) => record.name}
            rowSelection={rowSelectionRest}
          />
        </Panel>
      </Collapse>
    </Modal>
  );
};
