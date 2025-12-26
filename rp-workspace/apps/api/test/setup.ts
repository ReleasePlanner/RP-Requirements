// Mock de Winston para tests
jest.mock('nest-winston', () => ({
  WinstonModule: {
    forRootAsync: jest.fn(),
  },
}));

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
