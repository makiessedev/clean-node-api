import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator'

describe('Email validator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isValid = sut.isValid('invalid_email@email')

    expect(isValid).toBe(false)
  })

  it('Should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(true)

    const isValid = sut.isValid('valid_email@mail.com')

    expect(isValid).toBe(true)
  })
})
