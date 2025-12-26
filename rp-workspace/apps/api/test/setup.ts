// Mock de Winston para tests
jest.mock('nest-winston', () => ({
  WinstonModule: {
    forRootAsync: jest.fn(),
  },
}));

// Nota: bcrypt está mockeado en __mocks__/bcrypt.js para evitar problemas con módulos nativos en CI

// Configuración global de tests
beforeAll(async () => {
  // Configuración inicial si es necesaria
});

afterAll(async () => {
  // Limpieza después de todos los tests
});

afterEach(() => {
  // Limpieza después de cada test
  jest.clearAllMocks();
});
