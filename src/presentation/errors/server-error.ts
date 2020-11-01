export class ServerError extends Error {
  constructor(stack: string) {
    super('Internal server error.');
    this.name = 'ServerError'; /* Setando nome do erro com o da classe */
    this.stack = stack;
  }
}
