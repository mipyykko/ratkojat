import {
  SUBMIT_SEARCH,
  SEARCH_NEXT_PAGE,
  SEARCH_DATA_RECEIVED,
  LOADING,
  SEARCH_SUCCESSFUL,
  SEARCH_FAILED
} from '../actions/types'

const initialState = {
  search: '',
  page: 1,
  data: '',
  results: [],
  loading: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SUBMIT_SEARCH:
      currentResults = (action.payload.search !== state.search) ? [] : state.results    
      return { ...state, search: action.payload.search, page: action.payload.page, results: currentResults, loading: true }
    case SEARCH_NEXT_PAGE:
      return { ...state, /* search: action.payload.search, */ page: state.page++, loading: true }
    case SEARCH_DATA_RECEIVED:
      console.log('REDUCER: received ', action.payload, ' current state' , state)
      return { ...state, results: [...state.results, ...action.payload.results]  }
    case SEARCH_SUCCESSFUL:
      return { ...state, loading: false }
    case SEARCH_FAILED:
      return { ...state, results: [], loading: false }
    case LOADING:
      return { ...state, loading: true }
    default:
      return state
  }
}
