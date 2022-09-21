export interface Transaction {
    id?: string;
    description: string,
    amount: number,
    date: String,
    type: string,
    category: string,
    subCategory: string,
    store: string,
    particulars: string
    tags: string[]
    notes: string
}
