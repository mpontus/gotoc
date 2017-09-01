// @flow
import React from 'react';
import { View } from 'react-native';
import type { List } from 'immutable';
import ReviewItem from './ReviewItem';

type Props = {
  reviews: List<any>,
};

const ReviewList = ({ reviews }: Props) =>
  (<View>
    {reviews.map(review =>
      <ReviewItem key={review.get('url')} review={review} />,
    )}
  </View>);

export default ReviewList;
