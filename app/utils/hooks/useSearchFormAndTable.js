import { useState, useMemo } from 'react';
import omit from 'lodash/omit';
import noop from 'lodash/noop';
import { useDeepCompareEffect } from './useDeepCompareEffect.jsx';

// 搜索表单和表格关联封装
export const useSearchFormAndTable = (props) => {

  const {
    /** 需要自定义的分页属性 */ 
    pagination = {}, 
    /** 默认搜索参数 */ 
    defaultSearchParams,
    /** 表格数据 */
    tableData = { list: [], total: 0 },
    /** 额外的参数，外部自行维护 */
    extraParams = {},
    /** 触发搜索 */
    onSearch = noop
  } = props || {};

  const { 
    /** 分页搜索参数 */
    paginate: defaultPaginate = { current: 1, pageSize: 10 },
    /** 表单搜索参数 */
    form: defaultFormParams = {},
    /** 排序搜索参数 */
    sorter: defaultSorter = {},
    /** 表格过滤搜索参数 */
    filters: defaultFilters = {}
  } = defaultSearchParams || {};

  const [ paginate, setPaginate ] = useState(defaultPaginate);
  const [ formParams, setFormParams ] = useState(defaultFormParams);
  const [ sorter, setSorter ] = useState(defaultSorter);
  const [ filters, setFilters ] = useState(defaultFilters);

  /**
   * searchParams[0] 可直接用于搜索的集成参数
   * searchParams[1] 各个搜索模块的map
   */
  const searchParams = useMemo(() => {
    return [
      { ...paginate, ...sorter, ...formParams, ...extraParams, ...filters },
      {
        paginate,
        sorter,
        formParams,
        extraParams,
        filters
      }
    ];
  }, [ paginate, formParams, sorter, extraParams ]);

  useDeepCompareEffect(() => {
    onSearch(...searchParams);
  }, [searchParams]);

  /** 改变搜索参数 */
  const onChangeFormParams = (changeParams) => {
    setFormParams(preValue => ({ ...preValue, ...changeParams }));
    resetPageCurrent();
  };

  // 重置页码
  const resetPageCurrent = () => {
    setPaginate(({ pageSize }) => ({ current: 1, pageSize }));
  };

  /** 分页、排序、筛选变化时触发 同步各搜索模块参数 */
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
    /** tableProps 关联预置表格属性
     *  -dataSource 当前页数据
     *  -pagination 关联预置分页属性
     */
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
    onChangeFormParams,
    resetPageCurrent,
    setPaginate,
    setFormParams,
    setSorter,
    setFilters
  };
};