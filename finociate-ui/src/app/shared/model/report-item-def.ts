import { TransactionCriteria } from "./transaction-criteria";

export interface ReportItemDef {
    title: string,
    criteriaList: TransactionCriteria[]
    groupByFields: string[],
    aggregationType: string,
    valueType: string,
    displayType: string,
}