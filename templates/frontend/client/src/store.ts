import { configureStore } from "@reduxjs/toolkit";
import { addInfrastructure } from "./dependencyInjection";

const configuration = {}; // TODO
const { container, TYPES } = addInfrastructure(configuration);

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
    books: withInjectedServices(),
    ui: uiReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      injectedBooksMiddleware,
      injectedApiMiddleware
    ),
});

export default store;
