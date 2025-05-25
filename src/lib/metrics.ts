import { Counter, register, collectDefaultMetrics } from 'prom-client';

collectDefaultMetrics();

export const cacheHitTotal = new Counter({
  name: 'cache_hit_total',
  help: 'Total number of cache hits',
  labelNames: ['cache_type'],
});

export const cacheMissTotal = new Counter({
  name: 'cache_miss_total',
  help: 'Total number of cache misses',
  labelNames: ['cache_type'],
});

export { register }; 