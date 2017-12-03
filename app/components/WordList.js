import React, { Component } from 'react'
// import { connect } from 'react-redux'
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  View
} from 'react-native'
import { List, ListItem } from 'react-native-elements'
import * as actions from '../actions'

export default class WordList extends Component {
  constructor (props) {
    super(props)
    this.state = { results: [], loading: false } 
  }

  componentWillReceiveProps (nextProps) {
    console.log("received props: ", nextProps)
    if (this.props.search !== nextProps.search) {
      this.setState({ results: nextProps.results, loading: nextProps.loading })
    }
  }

  render () {
    console.log("rendering", this.props)
    if (this.props.results && this.props.results.length > 0) {
      return (
        <ScrollView style={{ flex: 1, width: Dimensions.get('window').width }}>
          <List>
            {this.props.results && this.props.results.map((item, i) => {
              var key = 'item.word' + i
              return (
                <ListItem
                  hideChevron
                  key={key}
                  title={item.word}
                  rightTitle={item.meaning}
                  subtitle={item.description}
                  subtitleNumberOfLines={2}
                  rightTitleStyle={{ color: '#0000A0' }}
                  /*onPress={this.props.submitSearch(item.word)}*/
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
          <Text style={{width: '100%', textAlign: 'center'}}>Ei löytynyt!</Text>
        </View>
      )
    }
  }
}

// function mapStateToProps (state) {
//   console.log('mapstateprops ', state.wordsReducer && state.wordsReducer.results)
//   return {
//     search: state.wordsReducer && state.wordsReducer.search,
//     loading: state.wordsReducer && state.wordsReducer.loading,
//     results: state.wordsReducer && state.wordsReducer.results
//   }
// }

// function mapDispatchToProps (dispatch) {
//   return {
//     submitSearch: (search) => {
//       dispatch(actions.submitSearch(search, 1))
//     }
//   }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(WordList)
