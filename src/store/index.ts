import { createStore } from "redux";
import todoApp from "./reducers";

export const store = createStore(todoApp);
