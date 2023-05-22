import { Transaction } from "./transaction";

export interface TextPattern {
    id?: string,
    name: string,
    identifier: string,
    pattern: string,
    datePattern: string,
    otherValues: Transaction
}