import { SignUpController } from './signup';

import {
  MissingParamError,
  InvalidParamError,
  ServerError,
} from '../../errors';

import {
  EmailValidator,
  AccountModel,
  AddAccount,
  AddAccountModel,
  HttpRequest,
} from './signup-protocols';

import { ok, serverError, badRequest } from '../../helpers/http-helper';

const makeEmailValidatorFactory = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeFakeAccountFactory = (): AccountModel => ({
  id: 'valid-id',
  name: 'valid-name',
  email: 'valid-email@mail.com',
  password: 'valid-password',
});

const makeAddAccountFactory = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccountFactory()));
    }
  }

  return new AddAccountStub();
};

const makeFakeRequestFactory = (): HttpRequest => ({
  body: {
    name: 'any-name',
    email: 'any-email@mail.com',
    password: 'any-password',
    passwordConfirmation: 'any-password',
  },
});

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
}

const makeSutFactory = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorFactory();
  const addAccountStub = makeAddAccountFactory();
  const sut = new SignUpController(emailValidatorStub, addAccountStub);

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
  };
};

describe('SignUp Controller', () => {
  it('Should return 400 if no name is provided', async () => {
    const { sut } = makeSutFactory();

    const httpRequest = {
      body: {
        email: 'any-email@mail.com',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
  });

  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSutFactory();

    const httpRequest = {
      body: {
        name: 'any-name',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSutFactory();

    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email@mail.com',
        passwordConfirmation: 'any-password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  it('Should return 400 if no password confirmation is provided', async () => {
    const { sut } = makeSutFactory();

    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email@mail.com',
        password: 'any-password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('passwordConfirmation')),
    );
  });

  it('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSutFactory();

    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email@mail.com',
        password: 'any-password',
        passwordConfirmation: 'invalid-password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError('passwordConfirmation')),
    );
  });

  it('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSutFactory();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpResponse = await sut.handle(makeFakeRequestFactory());
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSutFactory();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    await sut.handle(makeFakeRequestFactory());
    expect(isValidSpy).toHaveBeenCalledWith('any-email@mail.com');
  });

  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSutFactory();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeFakeRequestFactory());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSutFactory();

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const httpResponse = await sut.handle(makeFakeRequestFactory());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSutFactory();

    const addSpy = jest.spyOn(addAccountStub, 'add');

    await sut.handle(makeFakeRequestFactory());
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any-name',
      email: 'any-email@mail.com',
      password: 'any-password',
    });
  });

  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSutFactory();

    const httpResponse = await sut.handle(makeFakeRequestFactory());
    expect(httpResponse).toEqual(ok(makeFakeAccountFactory()));
  });
});
