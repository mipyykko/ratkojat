import {
  createStore,
  applyMiddleware,
  compose
} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'
import { AsyncStorage } from 'react-native'
import { persistStore } from 'redux-persist'
import reducers from '../reducers'

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ })

const store = createStore(
  reducers,
  undefined,
  compose(
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  )
)

// let's not use this yet
// persistStore(store)

export default store
