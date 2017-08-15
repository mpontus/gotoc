// @flow
import type { Region } from 'types/Region';

export const REGION_CHANGE: string = 'REGION_CHANGE';

export const regionChange = (region: Region) => ({
  type: REGION_CHANGE,
  payload: region,
});
