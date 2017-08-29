// @flow
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { StyleSheet, Image, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { grey } from 'material-colors';
import Section from 'components/Section';
import Rating from 'components/Rating';
import { makeGetBusiness } from 'reducers/businesses';
import type { Business } from 'types/Business';

const mapStateToProps = () =>
  createStructuredSelector({
    business: makeGetBusiness(),
  });

const enhance = connect(mapStateToProps);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  details: {
    paddingHorizontal: 5,
  },
  image: {
    height: 170,
  },
  title: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontFamily: 'sans-serif-light',
    fontWeight: '100',
    color: grey['900'],
  },
  ratingContainer: {
    height: 28,
    justifyContent: 'flex-end',
  },
  text: {
    fontSize: 16,
    color: grey['800'],
  },
});

type Props = {
  business: Business,
};

class BusinessDetails extends React.Component<void, Props, void> {
  render() {
    const {
      name,
      rating,
      image_url: image,
      display_phone: phone,
      location: { display_address: [addressLine1, addressLine2] },
    } = this.props.business;

    return (
      <View style={styles.container}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <View style={styles.title}>
          {name &&
            <View style={styles.nameContainer}>
              <Text style={styles.name}>
                {name}
              </Text>
            </View>}
          {rating &&
            <View style={styles.ratingContainer}>
              <Rating size={20} rating={rating} />
            </View>}
        </View>
        {phone &&
          <Section icon={<Icon name="md-call" size={20} />}>
            <View>
              <Text style={styles.text}>
                {phone}
              </Text>
            </View>
          </Section>}
        {addressLine1 &&
          <Section icon={<Icon name="md-pin" size={20} />}>
            <View>
              <Text style={styles.text}>
                {addressLine1}
              </Text>
            </View>
            {addressLine2 &&
              <View>
                <Text style={styles.text}>
                  {addressLine2}
                </Text>
              </View>}
          </Section>}
      </View>
    );
  }
}

export default enhance(BusinessDetails);
