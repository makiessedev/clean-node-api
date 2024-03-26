import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'
import { Encrypter } from '../../data/protocols/encrypter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise((resolve) => { resolve('hash') })
  }
}))

interface SutType {
  sut: Encrypter
  salt: number
}

function makeSut (): SutType {
  const salt = 12
  const sut = new BcryptAdapter(salt)

  return {
    sut,
    salt
  }
}

describe('', () => {
  it('Should call bcrypt with correct value', async () => {
    const { sut, salt } = makeSut()

    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('Should return a hash on success', async () => {
    const { sut } = makeSut()

    const hash = await sut.encrypt('any_value')

    expect(hash).toEqual('hash')
  })
})
