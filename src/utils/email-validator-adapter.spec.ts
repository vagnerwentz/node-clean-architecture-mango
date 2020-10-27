import validator from 'validator';

import { EmailValidatorAdapter } from './email-validator-adapter';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

const makeSutFactory = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe('EmailValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = makeSutFactory();

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);

    const emailIsValid = sut.isValid('invalid-email@mail.com');
    expect(emailIsValid).toBe(false);
  });

  it('Should return true if validator returns true', () => {
    const sut = makeSutFactory();
    const emailIsValid = sut.isValid('valid-email@mail.com');
    expect(emailIsValid).toBe(true);
  });

  it('Should call validator with correct email', () => {
    const sut = makeSutFactory();

    const isEmailSpy = jest.spyOn(validator, 'isEmail');

    sut.isValid('any-email@mail.com');
    expect(isEmailSpy).toHaveBeenCalledWith('any-email@mail.com');
  });
});
