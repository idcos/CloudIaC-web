/**
 * PageCard
 */
import { FC, ReactNode } from 'react';
export interface PageCardPropsStrict {
    /** Card's title */
    title?: string;
    /** Actions at end of title */
    extra?: ReactNode;
    /** Card's tabs header */
    tabHeader?: ReactNode;
    /** Extra title */
    extraTitle?: ReactNode;
    /** Whether has flag or not */
    noFlag?: boolean;
    /** ClassName */
    className?: string;
}
export interface PageCardProps extends PageCardPropsStrict {
    [propName: string]: any;
}
export declare const PageCard: FC<PageCardProps>;
