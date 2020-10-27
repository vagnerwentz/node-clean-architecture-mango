import { EmailValidatorAdapter } from './email-validator-adapter';

describe('EmailValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter();
    const emailIsValid = sut.isValid('invalid-mail@mail.com');
    expect(emailIsValid).toBe(false);
  });
});
