// @flow
import React from 'react';
import { StyleSheet, ListView, View } from 'react-native';
import type { Business } from 'types/Business';
import BusinessListItem from './BusinessListItem';

type Props = {
  businesses: Business[],
  onSelect: (event: Event, business: Business) => any,
};

type State = {
  dataSource: ListView.DataSource,
};

const styles = StyleSheet.create({
  item: {
    marginBottom: 5,
  },
});

class BusinessList extends React.Component<void, Props, State> {
  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: (prev, next) => prev === next,
    }),
  };

  componentWillMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.props.businesses),
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.businesses),
    });
  }

  renderRow = (business: Business) =>
    (<View style={styles.item}>
      <BusinessListItem onSelect={this.props.onSelect} business={business} />
    </View>);

  render() {
    return (
      <ListView
        enableEmptySections
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
      />
    );
  }
}

export default BusinessList;
