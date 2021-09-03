import { useState, useMemo } from 'react';
import omit from 'lodash/omit';
import noop from 'lodash/noop';
import { useDeepCompareEffect } from './useDeepCompareEffect.jsx';

// 搜索表单和表格关联封装
export const useSearchFormAndTable = (props) => {

  const {
    pagination = {},
    defaultParams,
    tableData = { list: [], total: 0 },
    extendParams = {},
    onSearch = noop
  } = props || {};

  const { 
    paginate: defaultPaginate = { current: 1, pageSize: 10 },
    form: defaultFormParams = {},
    sorter: defaultSorter = {},
    filters: defaultFilters = {}
  } = defaultParams || {};

  const [ paginate, setPaginate ] = useState(defaultPaginate);
  const [ formParams, setFormParams ] = useState(defaultFormParams);
  const [ sorter, setSorter ] = useState(defaultSorter);
  const [ filters, setFilters ] = useState(defaultFilters);

  const searchParams = useMemo(() => {
    return [
      { ...paginate, ...sorter, ...formParams, ...extendParams, ...filters },
      {
        paginate,
        sorter,
        formParams,
        extendParams,
        filters
      }
    ];
  }, [ paginate, formParams, sorter, extendParams ]);

  useDeepCompareEffect(() => {
    onSearch(...searchParams);
  }, [searchParams]);

  // 改变搜索参数
  const onChangeFormParams = (changeParams, options) => {
    const {
      isMerge = true // 是否合并原参数
    } = options || {};
    if (isMerge) {
      setFormParams(preValue => ({ ...preValue, ...changeParams }));
    } else {
      setFormParams(changeParams);
    }
    setPaginate(({ pageSize }) => ({ current: 1, pageSize }));
  };

  const onTableChange = (pagination, filters, sorter, { action }) => {
    const { current, pageSize } = pagination;
    const { field, order } = sorter;
    switch (action) {
      case 'paginate':
        setPaginate({ current, pageSize });
        break;
      case 'filter':
        setPaginate({ current: 1, pageSize });
        setFilters(filters);
        break;
      case 'sort':
        setSorter({ field, order });
        break;
      default:
        break;
    }
  };

  return {
    tableProps: {
      dataSource: tableData.list,
      pagination: {
        current: paginate.current,
        pageSize: paginate.pageSize,
        total: tableData.total,
        showSizeChanger: true,
        showTotal: (total) => `共${total}条`,
        ...omit(pagination, ['current', 'pageSize', 'total', 'onChange'])
      },
      onChange: onTableChange 
    },
    searchParams,
    onChangeFormParams
  };
};