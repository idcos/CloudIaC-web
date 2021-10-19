import { FC, CSSProperties } from 'react';
import { Condition } from './PageSearch.define';
export interface PageSearchFieldProps extends Condition {
    /** 搜索条件表单的样式 */
    style?: CSSProperties;
    /** 搜索条件表单的值 */
    value?: any;
    /** 搜索条件表单值变化时调用 */
    onChange?: Function;
    /** 搜索条件表单触发搜索时调用 */
    onSearch?: Function;
    [propName: string]: any;
}
export interface PageSearchFieldTypeProps extends Condition {
    /** 搜索条件的中文 */
    name: string;
    /** 搜索条件表单的样式 */
    style?: CSSProperties;
    /** 搜索条件表单的值 */
    value?: any;
    /** 搜索条件表单值变化时调用 */
    onChange?: Function;
    /** 搜索条件表单触发搜索时调用 */
    onPageSearch?: Function;
    [propName: string]: any;
}
declare const PageSearchField: FC<PageSearchFieldProps>;
export default PageSearchField;
