// @flow
import type { Region } from 'types/Region';

type Layout = {
  width: number,
  height: number,
};

export const REGION_CHANGE: string = 'REGION_CHANGE';
export const LAYOUT_CHANGE: string = 'LAYOUT_CHANGE';

export const regionChange = (region: Region) => ({
  type: REGION_CHANGE,
  payload: { region },
});

export const mapLayout = (layout: Layout) => ({
  type: LAYOUT_CHANGE,
  payload: { layout },
});
