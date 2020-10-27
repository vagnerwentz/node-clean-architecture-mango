import { Encrypter } from '../../protocols/encrypter';
import { DbAddAccount } from './db-add-account';

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
}

const makeEncrypterFactory = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed-password'));
    }
  }

  return new EncrypterStub();
};

const makeSutFactory = (): SutTypes => {
  const encrypterStub = makeEncrypterFactory();
  const sut = new DbAddAccount(encrypterStub);

  return {
    sut,
    encrypterStub,
  };
};

describe('DbAddAccount Usecase', () => {
  it('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSutFactory();

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

    const accountData = {
      name: 'valid-name',
      email: 'valid-email@mail.com,',
      password: 'valid-password',
    };

    await sut.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith('valid-password');
  });
});
