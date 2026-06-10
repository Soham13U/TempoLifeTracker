/** Subset of expo-sqlite used by Tempo repos (native + web). */
export interface TempoDatabase {
  execAsync(source: string): Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  runAsync(source: string, params?: any): Promise<unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFirstAsync<T>(source: string, params?: any): Promise<T | null>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAllAsync<T>(source: string, params?: any): Promise<T[]>;
}
