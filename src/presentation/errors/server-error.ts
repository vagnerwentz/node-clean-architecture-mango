export class ServerError extends Error {
  constructor() {
    super('Internal server error.');
    this.name = 'ServerError'; /* Setando nome do erro com o da classe */
  }
}
