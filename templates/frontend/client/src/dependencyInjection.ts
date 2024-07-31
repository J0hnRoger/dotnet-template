import { asClass, asFunction, createContainer } from "awilix";
import { storeProvider } from "./store";

// From Application Layer
interface IApiService {
  fetchAll<T>(): Array<T>;
}

interface ILogger {
  logInformation(message: string);
}

const createLogger = () => {
  return {
    logInformation: (message) => console.info(message),
  };
};

class ApiService {
  constructor() {}
  public fetchAll<T>(): Array<T> {
    return [];
  }

  public dispose() {}
}

// Helper
export type DIServices = {
  store: ReturnType<typeof storeProvider>;
  apiService: IApiService;
  logger: ILogger;
};

export const DIContainer = createContainer<DIServices>({
  injectionMode: "PROXY",
}).register({
  store: asFunction(storeProvider, {
    lifetime: "SINGLETON",
  }),
  apiService: asClass(ApiService, {
    lifetime: "SINGLETON",
    dispose: (apiService) => {
      apiService.dispose();
    },
  }),
  logger: asFunction(createLogger, {
    lifetime: "SINGLETON",
  }),
});
