import { MissingParamError } from '../errors/missing-param-error'
import { SignUpController } from './signup'

function makeSut (): SignUpController {
  return new SignUpController()
}

describe('SignUd Controller', () => {
  it('Should return 400 if no name is provided', () => {
    const sut = makeSut()
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
    const sut = makeSut()
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
    const sut = makeSut()
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
    const sut = makeSut()
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
})
