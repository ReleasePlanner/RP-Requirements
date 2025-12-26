// Mock manual de bcrypt para Jest
// Este archivo se usa automáticamente cuando Jest encuentra imports de 'bcrypt'

const mockCompare = jest.fn();
const mockHash = jest.fn();

module.exports = {
  compare: mockCompare,
  hash: mockHash,
  genSalt: jest.fn((rounds) => Promise.resolve(`salt_${rounds}`)),
  hashSync: jest.fn((password, rounds) => `hashed_${password}_${rounds}`),
  compareSync: jest.fn((password, hash) => password === hash),
  // Exportar los mocks para configuración en tests
  __mockCompare: mockCompare,
  __mockHash: mockHash,
};

