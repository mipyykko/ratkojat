import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native'
import { SearchBar } from 'react-native-elements'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
// import {ActionCreators} from '../actions'
// import axios from 'axios'
import WordList from '../components/WordList'
import * as actions from '../actions'

// const DOMParser = require('xmldom').DOMParser;

class RatkojatContainer extends Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.setState({
      search: '',
      page: 1,
      loading: false
    })
  }
      
  render () {
    return (
      <View style={styles.container}>
        <SearchBar
          textInputRef='searchBar'
          clearIcon
          onClearText={() => this.searchBar = ''}
          onSubmitEditing={(event) => this.props.submitSearch(event.nativeEvent.text)}
          autoCorrect={false}
          autoCapitalize='none'
          containerStyle={{
            width: '100%',
            marginBottom: 20
          }}
          inputStyle={{
            textAlign: 'center'
          }}
        />
        <WordList 
          results={this.props.results} 
          loading={this.props.loading} 
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    margin: 10
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
})

function mapStateToProps (state) {
  console.log('mapstatetoprops', state)
  return {
    search: state.words.search,
    loading: state.words.loading,
    results: state.words.results
  }
}

function mapDispatchToProps (dispatch) {
  return {
    submitSearch: (search) => {
      dispatch(actions.submitSearch(search, 1))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RatkojatContainer)
