import { EmailValidator, AddAccount, AddAccountModel, AccountModel } from './signup-protocols'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { SignUpController } from './signup'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

function makeSut (): SutTypes {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()

  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

function makeEmailValidator (): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid = (email: string): boolean => { return true }
  }

  return new EmailValidatorStub()
}

function makeAddAccount (): AddAccount {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid-id',
        name: 'valid-name',
        email: 'valid@gmail.com',
        password: 'valid-password'
      }

      return await new Promise(resolve => { resolve(fakeAccount) })
    }
  }

  return new AddAccountStub()
}

describe('SignUd Controller', () => {
  it('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'johndoe@gmail.com',
        password: 'johndoepassword',
        passwordConfirmation: 'johndoepassword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'John Doe',
        password: 'johndoepassword',
        passwordConfirmation: 'johndoepassword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toStrictEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no passowrd is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        passwordConfirmation: 'johndoepassword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toStrictEqual(new MissingParamError('password'))
  })

  it('Should return 400 if no passowrdConfirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'johndoepassword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toStrictEqual(new MissingParamError('passwordConfirmation'))
  })

  it('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'password',
        passwordConfirmation: 'invalidpassword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toStrictEqual(new InvalidParamError('passwordConfirmation'))
  })

  it('Should return 400 if invalid an email is provided', async () => {
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
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toStrictEqual(new InvalidParamError('email'))

    jest.clearAllMocks()
  })

  it('Should call email validator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'john@gmail.com',
        password: 'johndoepassword',
        passwordConfirmation: 'johndoepassword'
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)

    jest.clearAllMocks()
  })

  it('Should return 500 if Email validor throw', async () => {
    const { emailValidatorStub, sut } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'invalid-email@gmail.com',
        password: 'johndoepassword',
        passwordConfirmation: 'johndoepassword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toStrictEqual(new ServerError())

    jest.clearAllMocks()
  })
  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'john@gmail.com',
        password: 'johndoepassword',
        passwordConfirmation: 'johndoepassword'
      }
    }
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'johndoepassword'
    })

    jest.clearAllMocks()
  })

  it('Should return 500 if AddAccount throw', async () => {
    const { addAccountStub, sut } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => { throw new Error() })

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'invalid-email@gmail.com',
        password: 'johndoepassword',
        passwordConfirmation: 'johndoepassword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toStrictEqual(new ServerError())

    jest.clearAllMocks()
  })

  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'valid-name',
        email: 'valid@gmail.com',
        password: 'valid-password',
        passwordConfirmation: 'valid-password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toStrictEqual({
      id: 'valid-id',
      name: 'valid-name',
      email: 'valid@gmail.com',
      password: 'valid-password'
    })
  })
})
