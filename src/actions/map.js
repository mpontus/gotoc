// @flow
import type { Region } from 'types/Region';

export const REGION_CHANGE: string = 'REGION_CHANGE';
export const REGION_SETTLED: string = 'REGION_SETTLED';

export const regionChange = (region: Region) => ({
  type: REGION_CHANGE,
  payload: region,
});

export const regionSettled = (region: Region) => ({
  type: REGION_SETTLED,
  payload: region,
});
