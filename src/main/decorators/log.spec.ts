import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';
import { LogControllerDecorator } from './log';
import { serverError, ok } from '../../presentation/helpers/http-helper';
import { LogErrorRepository } from '../../data/protocols/log-error-repository';
import { AccountModel } from '../../domain/models/account';

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}

const makeFakeRequestFactory = (): HttpRequest => ({
  body: {
    name: 'any-name',
    email: 'any-email@mail.com',
    password: 'any-password',
    passwordConfirmation: 'any-password',
  },
});

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error();

  fakeError.stack = 'any-stack';

  return serverError(fakeError);
};

const makeFakeAccountFactory = (): AccountModel => ({
  id: 'valid-id',
  name: 'valid-name',
  email: 'valid-email@mail.com',
  password: 'valid-password',
});

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise(resolve => resolve(ok(makeFakeAccountFactory())));
    }
  }

  return new ControllerStub();
};

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }

  return new LogErrorRepositoryStub();
};

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub,
  );

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
  };
};

describe('LogController Decorator', () => {
  it('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');

    await sut.handle(makeFakeRequestFactory());
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequestFactory());
  });

  it('Should return the same result of the controller', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequestFactory());
    expect(httpResponse).toEqual(ok(makeFakeAccountFactory()));
  });

  it('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');

    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(
        new Promise(resolve => resolve(makeFakeServerError())),
      );

    await sut.handle(makeFakeRequestFactory());
    expect(logSpy).toHaveBeenCalledWith('any-stack');
  });
});
