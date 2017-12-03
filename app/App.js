import React, { Component } from 'react'
import { Provider } from 'react-redux'
import store from './store'
import RatkojatContainer from './containers/RatkojatContainer'

export default class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <RatkojatContainer />
      </Provider>
    )
  }
}
