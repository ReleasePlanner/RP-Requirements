/**
 * Widget configuration types
 * 
 * Types for widget configuration objects
 */

/**
 * Base widget configuration interface
 */
export interface WidgetConfig {
  [key: string]: unknown;
}

/**
 * Stats overview widget configuration
 */
export interface StatsOverviewConfig extends WidgetConfig {
  showTotalRequirements?: boolean;
  showCompletedRequirements?: boolean;
  showInProgressRequirements?: boolean;
}

/**
 * Chart widget configuration
 */
export interface ChartConfig extends WidgetConfig {
  chartType?: 'bar' | 'line' | 'pie';
  dataSource?: string;
  showLegend?: boolean;
}

