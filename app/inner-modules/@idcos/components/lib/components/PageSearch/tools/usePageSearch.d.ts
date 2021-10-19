import { SearchValues, PageSearchProps } from '../PageSearch.define';
export interface PageSearchOutput {
    /** 是否有搜索条件存在 */
    hasSearchValues: boolean;
    /** 搜索数据 */
    searchValues: SearchValues;
    /** 格式化的搜索数据 */
    values: Object;
    /** 实时的表单数据 */
    searchFormValues: SearchValues;
    /** 格式化的表单数据 */
    formValues: Object;
    /** 手动设定数据 */
    setSearchValues: Function;
    /** 渲染搜索结果标签载体dom的ref */
    searchResultTagsContainerRef: any;
}
export declare type UsePageSearchOutput = [PageSearchProps, PageSearchOutput];
export declare const usePageSearch: ({ defaultSearchValues, onChange, onSearch, ...props }: PageSearchProps) => UsePageSearchOutput;
