import bcrypt from 'bcrypt';

import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('hashed-value'));
  },
}));

const salt = 12;

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.encrypt('any-value');

    expect(hashSpy).toHaveBeenLastCalledWith('any-value', salt);
  });

  it('Should return a hash on success', async () => {
    const sut = makeSut();
    const hashedValue = await sut.encrypt('any-value');

    expect(hashedValue).toBe('hashed-value');
  });
});
