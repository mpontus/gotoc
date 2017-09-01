// @flow
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeGetBusinesses } from 'reducers/businesses';
import BusinessList from 'components/BusinessList';
import type { Business } from 'types/Business';

type Props = {
  businesses: Business[],
  onSelect: (business: Business) => void,
};

const mapStateToProps = () =>
  createStructuredSelector({
    businesses: makeGetBusinesses(),
  });

const enhance = connect(mapStateToProps);

const List = ({ businesses, onSelect }: Props) =>
  (<BusinessList
    businesses={businesses}
    onSelect={(event, business) => onSelect(business)}
  />);

export default enhance(List);
