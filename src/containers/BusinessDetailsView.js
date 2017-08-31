// @flow
import React from 'react';
import { Linking } from 'react-native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, withHandlers, lifecycle } from 'recompose';
import BusinessDetails from 'components/BusinessDetails';
import { makeGetBusiness } from 'reducers/businesses';
import { makeGetBusinessReviews } from 'reducers/businessReviews';
import { makeGetBusinessReviewsFetching } from 'reducers/businessReviewsFetching';
import { visitBusinessDetails } from 'actions/navigation';
import type { Business } from 'types/Business';

const mapStateToProps = () =>
  createStructuredSelector({
    business: makeGetBusiness(),
    reviews: makeGetBusinessReviews(),
    reviewsFetching: makeGetBusinessReviewsFetching(),
  });

const enhance = compose(
  connect(mapStateToProps, { visitBusinessDetails }),
  lifecycle({
    componentDidMount() {
      const { visitBusinessDetails, business } = this.props;

      visitBusinessDetails(business, null);
    },
  }),
  withHandlers({
    onAddressPress: ({ business }) => () => {
      const { address1, city } = business.location;
      const query = `${address1}, ${city}`;

      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${query}`,
      );
    },
    onPhonePress: ({ business }) => () => {
      Linking.openURL(`tel:${business.phone}`);
    },
  }),
);

type Props = {
  business: Business,
  reviews: ?(Review[]),
  reviewsFetching: boolean,
  onAddressPress: (event: Event) => void,
  onPhonePress: (event: Event) => void,
};

const BusinessDetailsView = ({
  business,
  reviews,
  reviewsFetching,
  onAddressPress,
  onPhonePress,
}: Props) =>
  (<BusinessDetails
    business={business}
    reviews={reviews}
    reviewsFetching={reviewsFetching}
    onAddressPress={onAddressPress}
    onPhonePress={onPhonePress}
  />);

export default enhance(BusinessDetailsView);
