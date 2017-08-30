// @flow
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import BusinessDetails from 'components/BusinessDetails';
import { makeGetBusiness } from 'reducers/businesses';
import type { Business } from 'types/Business';

type InternalProps = {
  business: Business,
};

const mapStateToProps = () =>
  createStructuredSelector({
    business: makeGetBusiness(),
  });

const enhance = connect(mapStateToProps);

const BusinessDetailsView = ({ business }: InternalProps) =>
  <BusinessDetails business={business} />;

export default enhance(BusinessDetailsView);
