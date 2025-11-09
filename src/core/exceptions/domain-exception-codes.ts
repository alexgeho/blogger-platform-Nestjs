//если специфических кодов будет много лучше разнести их в соответствующие модули
export enum DomainExceptionCode {
  //common
  NotFound = 404,
  BadRequest = 400,
  InternalServerError = 'InternalServerError',
  Forbidden = 403,
  ValidationError = 400,
  //auth
  Unauthorized = 401,
  EmailNotConfirmed = 409,
  ConfirmationCodeExpired = 410,
  PasswordRecoveryCodeExpired = 410,
  //...
}
