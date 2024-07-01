import { configureStore } from "@reduxjs/toolkit";
import { addInfrastructure } from "./dependencyInjection";
import { jobOfferApi } from "./features/jobOffering/infrastructure/jobOfferApi";

import jobOfferReducer from "./features/jobOffering";
import uiReducer from "./core/ui";
import notificationReducer from "./core/notifications";
import { setupListeners } from "@reduxjs/toolkit/query/react";

const configuration = {}; // TODO
const { container, TYPES } = addInfrastructure();

// Fonction utilitaire pour récupérer les noms des paramètres d'une fonction
const getParamNames = (func) => {
  const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
  const ARGUMENT_NAMES = /([^\s,]+)/g;
  const fnStr = func.toString().replace(STRIP_COMMENTS, "");
  const result = fnStr
    .slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")"))
    .match(ARGUMENT_NAMES);
  if (result === null) return [];
  return result;
};

export const withInjectedServices = (middleware) => {
  const paramNames = getParamNames(middleware);

  const dependencies = paramNames.map((param) => container.get(TYPES[param]));

  return middleware(...dependencies);
};

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

setupListeners(store.dispatch);

export default store;
