import { ServerError } from '../errors/server-error'
import { HttpResponse } from '../protocols/http'

export function badRequest (error: Error): HttpResponse {
  return {
    statusCode: 400,
    body: error
  }
}

export function serverError (): HttpResponse {
  return {
    statusCode: 500,
    body: new ServerError()
  }
}

export function success (data: any): HttpResponse {
  return {
    statusCode: 200,
    body: data
  }
}
