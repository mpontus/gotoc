// @flow
import React from 'react';
import BusinessDetailsView from 'containers/BusinessDetailsView';

type Props = {
  businessId: string,
};

const BusinessDetailsScreen = ({ businessId }: Props) =>
  <BusinessDetailsView id={businessId} />;

export default BusinessDetailsScreen;
