import { SignUpController } from './signup';

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
  });
});
