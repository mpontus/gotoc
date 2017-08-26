// @flow
import React from 'react';
import { ListView } from 'react-native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeGetBusinesses } from 'reducers/map';
import BusinessList from 'components/BusinessList';
import type { Business } from 'types/Business';

type Props = {
  businesses: Business[],
};

type State = {
  dataSource: ListView.DataSource,
};

const mapStateToProps = () =>
  createStructuredSelector({
    businesses: makeGetBusinesses(),
  });

const enhance = connect(mapStateToProps);

class List extends React.Component<void, Props, State> {
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

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.businesses),
    });
  }

  render() {
    return <BusinessList dataSource={this.state.dataSource} />;
  }
}

export default enhance(List);
