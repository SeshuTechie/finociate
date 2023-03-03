export interface Transaction {
    id?: string;
    description: string,
    amount: number,
    date: String,
    type: string,
    account: string,
    category: string,
    subCategory: string,
    store: string,
    mode: string,
    particulars: string,
    tags: string[],
    notes: string
}
