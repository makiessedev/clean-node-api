import { DbAddAccount } from './db-add-account'

describe('DbAddAccount use case', () => {
  it('Shoudl call Encrypt with correct password', async () => {
    class EncrypterStub {
      async encrypt (value: string): Promise<string> {
        return await new Promise(resolve => { resolve('hashed_password') })
      }
    }

    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)

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
