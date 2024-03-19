import { InvalidParamError } from '../errors/invalid-param-error'
import { MissingParamError } from '../errors/missing-param-error'
import { EmailValidator } from '../protocols/email-validator'
import { SignUpController } from './signup'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

function makeSut (): SutTypes {
  class EmailValidatorStub implements EmailValidator {
    isValid = (email: string): boolean => { return true }
  }

  const emailValidatorStub = new EmailValidatorStub()

  const sut = new SignUpController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUd Controller', () => {
  it('Should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'johndoe@gmail.com',
        password: 'johndoepassword',
        passwordConfirmation: 'johndoepassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'John Doe',
        password: 'johndoepassword',
        passwordConfirmation: 'johndoepassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toStrictEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no passowrd is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        passwordConfirmation: 'johndoepassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toStrictEqual(new MissingParamError('password'))
  })

  it('Should return 400 if no passowrdConfirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'johndoepassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toStrictEqual(new MissingParamError('passwordConfirmation'))
  })

  it('Should return 400 if invalid an email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { return false })

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'invalid-email@gmail.com',
        password: 'johndoepassword',
        passwordConfirmation: 'johndoepassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toStrictEqual(new InvalidParamError('email'))

    jest.clearAllMocks()
  })
})
