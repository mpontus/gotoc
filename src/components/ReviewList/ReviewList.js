// @flow
import React from 'react';
import { ImmutableListView } from 'react-native-immutable-list-view';
import type { Review } from 'types/Review';
import ReviewItem from './ReviewItem';

type Props = {
  reviews: Review[],
};

const renderRow = review => <ReviewItem review={review} />;

const ReviewList = ({ reviews }: Props) =>
  (<ImmutableListView
    enableEmptySections
    immutableData={reviews}
    renderRow={renderRow}
  />);

export default ReviewList;
