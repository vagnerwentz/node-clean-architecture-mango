import {
  Encrypter,
  AddAccountModel,
  AccountModel,
  AddAccountRepository,
} from './db-add-account-protocols';
import { DbAddAccount } from './db-add-account';

const makeEncrypterFactory = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed-password'));
    }
  }

  return new EncrypterStub();
};

const makeAddAccountRepositoryFactory = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid-id',
        name: 'valid-name',
        email: 'valid-email@mail.com,',
        password: 'hashed-password',
      };
      return new Promise(resolve => resolve(fakeAccount));
    }
  }

  return new AddAccountRepositoryStub();
};

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeSutFactory = (): SutTypes => {
  const encrypterStub = makeEncrypterFactory();
  const addAccountRepositoryStub = makeAddAccountRepositoryFactory();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
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

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSutFactory();

    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const accountData = {
      name: 'valid-name',
      email: 'valid-email@mail.com,',
      password: 'valid-password',
    };

    const promise = sut.add(accountData);

    await expect(promise).rejects.toThrow();
  });

  it('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSutFactory();

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    const accountData = {
      name: 'valid-name',
      email: 'valid-email@mail.com,',
      password: 'valid-password',
    };

    await sut.add(accountData);

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid-name',
      email: 'valid-email@mail.com,',
      password: 'hashed-password',
    });
  });

  it('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSutFactory();

    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const accountData = {
      name: 'valid-name',
      email: 'valid-email@mail.com,',
      password: 'valid-password',
    };

    const promise = sut.add(accountData);

    await expect(promise).rejects.toThrow();
  });
});
