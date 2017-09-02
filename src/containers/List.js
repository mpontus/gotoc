// @flow
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeGetBusinesses, getBusinessesFetching } from 'reducers/businesses';
import BusinessList from 'components/BusinessList';
import type { Business } from 'types/Business';

type Props = {
  fetching: boolean,
  businesses: Business[],
  onSelect: (business: Business) => void,
};

const mapStateToProps = () =>
  createStructuredSelector({
    fetching: getBusinessesFetching,
    businesses: makeGetBusinesses(),
  });

const enhance = connect(mapStateToProps);

const List = ({ fetching, businesses, onSelect }: Props) =>
  (<View>
    <BusinessList
      businesses={businesses}
      onSelect={(event, business) => onSelect(business)}
    />
    {fetching && <ActivityIndicator />}
  </View>);

export default enhance(List);
