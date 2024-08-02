export const crudMessage = (crudOp: string, entity: any, data?: any) =>
  `CRUD ${crudOp} error:\n${entity}\n${
    data ? '\nwith data:\n' + JSON.stringify(data, null, 2) : ''
  }`;

export class DeleteError extends Error {
  constructor(message: string, data?: any) {
    super(crudMessage('delete', message, data));
    console.error(message);
  }
}

export class CreateError extends Error {
  constructor(message: string, data?: any) {
    super(crudMessage('create', message, data));
    console.error(message);
  }
}

export class ReadError extends Error {
  constructor(message: string, data?: any) {
    super(crudMessage('read', message, data));
    console.error(message);
  }
}

export class UpdateError extends Error {
  constructor(message: string, data?: any) {
    super(crudMessage('update', message, data));
    console.error(message);
  }
}

export class SearchError extends Error {
  constructor(message: string, data?: any) {
    super(crudMessage('search', message, data));
    console.error(message);
  }
}
