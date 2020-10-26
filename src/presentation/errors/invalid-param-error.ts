export class InvalidParamError extends Error {
  constructor(paramName: string) {
    super(`Invalid param: ${paramName}`);
    this.name = 'InvalidParamName'; /* Setando nome do erro com o da classe */
  }
}
