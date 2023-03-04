import { BudgetItem } from "./budget-item";
import { BudgetSummaryItem } from "./budget-summary-item";

export interface Budget {
    budgetItems: BudgetItem[];
    summaryItems: BudgetSummaryItem[];
}
