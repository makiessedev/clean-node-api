import { SignUpController } from './signup'

describe('SignUd Controller', () => {
  it('Should return 400 if no name is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'johndoe@gmail.com',
        password: 'johndoepassword',
        passwordConfirmation: 'johndoepassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})