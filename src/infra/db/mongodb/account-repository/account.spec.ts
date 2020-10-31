import { MongoHelper } from '../helpers/mongo-helper';

import { AccountMongoRepository } from './account';

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  };

  it('Should return an account on success', async () => {
    const sut = makeSut();
    const account = await sut.add({
      name: 'valid-name',
      email: 'valid-email@mail.com',
      password: 'valid-password',
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('valid-name');
    expect(account.email).toBe('valid-email@mail.com');
    expect(account.password).toBe('valid-password');
  });
});
