export class NonRetriableQueryError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'NonRetriableQueryError';
  }
}
