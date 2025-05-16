declare global {
  namespace NodeJS {
    interface Global {
      __mockClient: {
        findUnique: jest.Mock;
      }
    }
  }
}

export {}; 