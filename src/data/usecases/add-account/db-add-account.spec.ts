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

const makeFakeAccountFactory = (): AccountModel => ({
  id: 'valid-id',
  name: 'valid-name',
  email: 'valid-email@mail.com,',
  password: 'hashed-password',
});

const makeFakeAccountDataFactory = (): AddAccountModel => ({
  name: 'valid-name',
  email: 'valid-email@mail.com,',
  password: 'valid-password',
});

const makeAddAccountRepositoryFactory = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccountFactory()));
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

    await sut.add(makeFakeAccountDataFactory());

    expect(encryptSpy).toHaveBeenCalledWith('valid-password');
  });

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSutFactory();

    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const promise = sut.add(makeFakeAccountDataFactory());

    await expect(promise).rejects.toThrow();
  });

  it('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSutFactory();

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    await sut.add(makeFakeAccountDataFactory());

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

    const promise = sut.add(makeFakeAccountDataFactory());

    await expect(promise).rejects.toThrow();
  });

  it('Should return an account on success', async () => {
    const { sut } = makeSutFactory();

    const account = await sut.add(makeFakeAccountDataFactory());

    expect(account).toEqual(makeFakeAccountFactory());
  });
});
