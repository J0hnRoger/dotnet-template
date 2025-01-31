import { setupWorker } from "msw/browser";
import { handlers as budgetHandlers } from "../src/features/budget/budgetMocks";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers, ...budgetHandlers);
