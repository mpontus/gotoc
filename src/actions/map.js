import { createAction } from 'redux-actions';
import { applySpec, unapply, zipObj } from 'ramda';

export const REGION_CHANGE = 'REGION_CHANGE';

export const regionChange = createAction(
  REGION_CHANGE,
  applySpec({
    region: unapply(
      zipObj(['latitude', 'longitude', 'latitudeDelta', 'longitudeDelta'])
    )
  })
);
