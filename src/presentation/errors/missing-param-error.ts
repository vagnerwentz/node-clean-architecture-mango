export class MissingParamError extends Error {
  constructor(paramName: string) {
    super(`Missing param: ${paramName}`);
    this.name = 'MissingParamName'; /* Setando nome do erro com o da classe */
  }
}
