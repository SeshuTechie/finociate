import { ReportRowDef } from "./report-row-def";

export interface ReportDef {
    id?: string;
    name: string,
    description: string,
    rowDefList: ReportRowDef[],
}