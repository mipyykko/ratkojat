import React, { Component } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  View
} from 'react-native'
import { List, ListItem } from 'react-native-elements'

export default class WordList extends Component {
  constructor (props) {
    super(props)
    this.state = { results: [], loading: false }
  }

  componentWillReceiveProps () {
    this.setState({ results: this.props.results, loading: this.props.loading })
  }

  render () {
    if (this.state.results && this.state.results.length > 0) {
      return (
        <ScrollView style={{ flex: 1, width: Dimensions.get('window').width }}>
          <List>
            {this.state.results.map((item, i) => {
              return (
                <ListItem
                  hideChevron
                  key={'item.word' + i}
                  title={item.word}
                  rightTitle={item.meaning}
                  subtitle={item.description}
                  subtitleNumberOfLines={2}
                  rightTitleStyle={{ color: '#0000A0' }}
                  onPress={() => {
                    this.setState({ search: item.word })
                    this.submitSearch()
                  }}
                />
              )
            })}
          </List>
          {this.props.loading && <ActivityIndicator size='small' />}
        </ScrollView>
      )
    } else if (this.props.loading) {
      return (
        <View style={{ flex: 1, width: Dimensions.get('window').width }}>
          <ActivityIndicator size='small' />
        </View>
      )
    } else {
      return (
        <View style={{ flex: 1, width: Dimensions.get('window').width }}>
          <Text>Ei löytynyt!</Text>
        </View>
      )
    }
  }
}
