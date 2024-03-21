import { AddAccount, EmailValidator, Controller, HttpRequest, HttpResponse } from './signup-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError, success } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) return badRequest(new InvalidParamError('passwordConfirmation'))

      const isValidEmail = this.emailValidator.isValid(String(email))

      if (!isValidEmail) return badRequest(new InvalidParamError('email'))

      const account = await this.addAccount.add({ name, email, password })

      return success(account)
    } catch (error) {
      return serverError()
    }
  }
}
