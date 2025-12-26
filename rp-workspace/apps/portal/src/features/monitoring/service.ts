import api from '@/lib/axios';

export interface MetricsSummary {
  requests: {
    total: number;
    byEndpoint: Record<string, { count: number; avgResponseTime: number; errors: number }>;
    byStatusCode: Record<number, number>;
    avgResponseTime: number;
  };
  errors: {
    total: number;
    byType: Record<string, number>;
    byEndpoint: Record<string, number>;
    recent: Array<{
      errorType: string;
      message: string;
      endpoint: string;
      method: string;
      timestamp: string;
    }>;
  };
  performance: {
    current: {
      cpuUsage: number;
      memoryUsage: number;
      heapUsed: number;
      heapTotal: number;
      timestamp: string;
    } | null;
    average: {
      cpuUsage: number;
      memoryUsage: number;
      heapUsed: number;
      heapTotal: number;
    };
    max: {
      memoryUsage: number;
      heapUsed: number;
    };
  };
  uptime: number;
}

export interface DetailedHealth {
  status: string;
  timestamp: string;
  uptime: number;
  system: {
    memory: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
      arrayBuffers: number;
    };
    cpu: {
      user: number;
      system: number;
    };
    uptime: number;
    pid: number;
    platform: string;
    nodeVersion: string;
  };
  memory: {
    used: number;
    heapUsed: number;
    heapTotal: number;
    max: {
      memoryUsage: number;
      heapUsed: number;
    };
    average: {
      memoryUsage: number;
      heapUsed: number;
      heapTotal: number;
    };
  };
  requests: {
    total: number;
    avgResponseTime: number;
    errorRate: number;
    byStatusCode: Record<number, number>;
  };
  errors: {
    total: number;
    byType: Record<string, number>;
    recent: Array<{
      errorType: string;
      message: string;
      endpoint: string;
      method: string;
      timestamp: string;
    }>;
  };
}

export const MonitoringService = {
  async getMetrics(window?: number): Promise<MetricsSummary> {
    const params = window ? { window: window.toString() } : {};
    const response = await api.get('/monitoring/metrics', { params });
    return response.data;
  },

  async getRequestMetrics(window?: number) {
    const params = window ? { window: window.toString() } : {};
    const response = await api.get('/monitoring/metrics/requests', { params });
    return response.data;
  },

  async getErrorMetrics(window?: number) {
    const params = window ? { window: window.toString() } : {};
    const response = await api.get('/monitoring/metrics/errors', { params });
    return response.data;
  },

  async getPerformanceMetrics() {
    const response = await api.get('/monitoring/metrics/performance');
    return response.data;
  },

  async getDetailedHealth(): Promise<DetailedHealth> {
    const response = await api.get('/monitoring/health/detailed');
    return response.data;
  },

  async getSystemResources() {
    const response = await api.get('/monitoring/system');
    return response.data;
  },
};

