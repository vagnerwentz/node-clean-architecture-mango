import { SignUpController } from './signup';

import { MissingParamError } from '../errors/missing-param-error';

describe('SignUp Controller', () => {
  it('Should return 400 if no name is provided', () => {
    const sut = new SignUpController();

    const httpRequest = {
      body: {
        email: 'any-email@mail.com',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  it('Should return 400 if no email is provided', () => {
    const sut = new SignUpController();

    const httpRequest = {
      body: {
        name: 'any-name',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('Should return 400 if no password is provided', () => {
    const sut = new SignUpController();

    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email@mail.com',
        passwordConfirmation: 'any-password',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });
});
