// @flow
import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import Rating from 'components/Rating';

type Props = {
  // TODO Better types
  review: any,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  details: {
    paddingLeft: 20,
  },
  user: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  text: {
    fontSize: 16,
  },
});

const ReviewItem = ({ review }: Props) => {
  const { rating, user, text } = review.toJS();

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.image_url }} style={styles.image} />
      <View style={styles.details}>
        <View>
          <Text style={styles.user}>
            {user.name}
          </Text>
        </View>
        <View>
          <Text style={styles.text}>
            {text}
          </Text>
        </View>
        <Rating rating={rating} />
      </View>
    </View>
  );
};

export default ReviewItem;
