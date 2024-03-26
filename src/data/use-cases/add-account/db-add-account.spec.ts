import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

interface SutType {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

function makeSut (): SutType {
  class EncrypterStub {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password') })
    }
  }

  const encrypterStub = new EncrypterStub()
  const sut = new DbAddAccount(encrypterStub)

  return {
    sut,
    encrypterStub
  }
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
})
