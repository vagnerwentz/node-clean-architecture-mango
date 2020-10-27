import validator from 'validator';

import { EmailValidatorAdapter } from './email-validator-adapter';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

describe('EmailValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter();

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);

    const emailIsValid = sut.isValid('invalid-mail@mail.com');
    expect(emailIsValid).toBe(false);
  });

  it('Should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter();
    const emailIsValid = sut.isValid('valid-mail@mail.com');
    expect(emailIsValid).toBe(true);
  });
});
