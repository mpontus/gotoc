// @flow
import React from 'react';
import { StyleSheet, ListView, View } from 'react-native';
import type { Business } from 'types/Business';
import BusinessListItem from './BusinessListItem';

type Props = {
  dataSource: ListView.DataSource,
};

const styles = StyleSheet.create({
  item: {
    marginBottom: 5,
  },
});

const BusinessList = ({ dataSource }: Props): React.Element<*> =>
  (<ListView
    enableEmptySections
    dataSource={dataSource}
    renderRow={(business: Business) =>
      (<View style={styles.item}>
        <BusinessListItem business={business} />
      </View>)}
  />);

export default BusinessList;
