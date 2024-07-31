import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { addInfrastructure } from "./dependencyInjection";
import { jobOfferApi } from "./features/jobOffering/infrastructure/jobOfferApi";

import jobOfferReducer from "./features/jobOffering";
import uiReducer from "./core/ui";
import notificationReducer from "./core/notifications";
import { setupListeners } from "@reduxjs/toolkit/query/react";

const coreMiddlewares = [];

const featureMiddlewares = [];

const store = configureStore({
  reducer: {
    jobOffer: jobOfferReducer,
    ui: uiReducer,
    notification: notificationReducer,
    [jobOfferApi.reducerPath]: jobOfferApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(jobOfferApi.middleware),
  devTools: process.env.NODE_ENV !== "production", // Activer les DevTools uniquement en mode développement
});

export type AppStore = typeof store;

// Expose store as singleton
export function storeProvider(): AppStore {
  return store;
}

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

setupListeners(store.dispatch);

export default store;
