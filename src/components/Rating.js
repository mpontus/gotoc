// @flow
import R from 'ramda';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const nthRatingIcon = rating => {
  const adjustedRating = Math.round(rating * 2) / 2;

  return n => {
    const ratingDifference = adjustedRating - n;

    if (ratingDifference <= 0) return 'md-star-outline';
    if (ratingDifference <= 0.5) return 'md-star-half';
    return 'md-star';
  };
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

type Props = {
  rating: number,
};

const Rating = ({ rating, ...rest }: Props) =>
  (<View style={styles.container}>
    {R.range(0, 5)
      .map(nthRatingIcon(rating))
      /* eslint-disable react/no-array-index-key */
      .map((icon, i) => <Icon key={i} name={icon} {...rest} />)
    /* eslint-enable react/no-array-index-key */
    }
  </View>);

export default Rating;
