// @flow
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeGetBusinesses } from 'reducers/map';
import { requestBusinessDetails } from 'actions/listing';
import BusinessList from 'components/BusinessList';
import type { Business } from 'types/Business';

type Props = {
  businesses: Business[],
  handleSelectBusiness: (business: Business) => void,
};

const mapStateToProps = () =>
  createStructuredSelector({
    businesses: makeGetBusinesses(),
  });

const enhance = connect(mapStateToProps, {
  handleSelectBusiness: requestBusinessDetails,
});

const List = ({ businesses, handleSelectBusiness }: Props) =>
  (<BusinessList
    businesses={businesses}
    onSelect={(event, business) => handleSelectBusiness(business)}
  />);

export default enhance(List);
