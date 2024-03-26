import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'
import { AccountModel, AddAccountModel, AddAccountRepository } from './db-add-account-protocols'

interface SutType {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

function makeSut (): SutType {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  }
}

function makeEncrypter (): Encrypter {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password') })
    }
  }

  return new EncrypterStub()
}

function makeAddAccountRepository (): AddAccountRepository {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid name',
        email: 'valid@gmail.com',
        password: 'hashed_password'
      }
      return await new Promise(resolve => { resolve(fakeAccount) })
    }
  }

  return new AddAccountRepositoryStub()
}

describe('DbAddAccount use case', () => {
  it('Shoudl call Encrypt with correct password', async () => {
    const { sut, encrypterStub } = makeSut()

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const AccountData = {
      name: 'valid name',
      email: 'valid@gmail.com',
      password: 'valid password'
    }
    await sut.add(AccountData)

    expect(encryptSpy).toHaveBeenCalledWith('valid password')
  })

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()

    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))

    const AccountData = {
      name: 'valid name',
      email: 'valid@gmail.com',
      password: 'valid password'
    }

    const promise = sut.add(AccountData)

    await expect(promise).rejects.toThrow()
  })

  it('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const AccountData = {
      name: 'valid name',
      email: 'valid@gmail.com',
      password: 'valid password'
    }
    await sut.add(AccountData)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid name',
      email: 'valid@gmail.com',
      password: 'hashed_password'
    })
  })

  it('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))

    const AccountData = {
      name: 'valid name',
      email: 'valid@gmail.com',
      password: 'valid password'
    }

    const promise = sut.add(AccountData)

    await expect(promise).rejects.toThrow()
  })
})
