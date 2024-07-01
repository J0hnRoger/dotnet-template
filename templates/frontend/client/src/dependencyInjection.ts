import "reflect-metadata";
import { Container, injectable } from "inversify";

// From Application Layer
interface IApiService {}

interface ILoggerService {}

@injectable()
class ApiService implements IApiService {
  async fetch(url: string, options: RequestInit) {
    const response = await fetch(url, options);
    return response.json();
  }
}

@injectable()
class LoggerService implements ILoggerService {
  log(message: string) {
    console.log(message);
  }
}

const TYPES = {
  ApiService: Symbol.for("ApiService"),
  LoggerService: Symbol.for("LoggerService"),
};

export const addInfrastructure = (configuration) => {
  const container = new Container();
  // TODO: Access configuration for create instances
  container.bind<ApiService>(TYPES.ApiService).to(ApiService);
  container.bind<LoggerService>(TYPES.LoggerService).to(LoggerService);

  return { container, TYPES };
};
