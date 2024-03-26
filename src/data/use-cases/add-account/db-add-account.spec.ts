import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

interface SutType {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

function makeSut (): SutType {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)

  return {
    sut,
    encrypterStub
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
})
