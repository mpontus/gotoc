// @flow
import React from 'react';
import ListBusinesses from 'containers/List';
import type { Navigator } from 'react-native-navigation';

type Props = {
  navigator: Navigator,
};

const ListScreen = ({ navigator }: Props) =>
  (<ListBusinesses
    onSelect={business =>
      navigator.push({
        screen: 'gotoc.Details',
        title: business.name,
        passProps: {
          id: business.id,
        },
      })}
  />);

export default ListScreen;
