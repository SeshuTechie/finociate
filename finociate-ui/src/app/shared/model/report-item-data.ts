import { ReportItemEntry } from "./report-item-entry";

interface EntryMap {
    [key: string]: ReportItemEntry[];
}

export interface ReportItemData {
    title: string,
    groupByFields: string[],
    displayType: string,
    aggregationType: string,
    valueType: string,
    itemEntries: EntryMap,
}
