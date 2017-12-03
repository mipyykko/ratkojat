import {
  SUBMIT_SEARCH,
  SEARCH_NEXT_PAGE,
  SEARCH_DATA_RECEIVED,
  SEARCH_SUCCESSFUL,
  SEARCH_FAILED
} from './types'
import submitQuery from '../api/api'

export function submitSearch (search, page) {
  return async (dispatch) => {
    var nextPage = true
    var maxLoad = 10
    dispatch({type: SUBMIT_SEARCH, payload: { search, page }})
    try {
      while (nextPage && --maxLoad > 0) {
        await submitQuery(search, page)
          .then(async (response) => {
            console.log(response)
            if (response.error) {
              throw response
            }
            dispatch({type: SEARCH_DATA_RECEIVED, payload: { results: response.results }})
            if (response.hasNextPage && maxLoad > 0) {
              page++
              nextPage = true
              dispatch({type: SUBMIT_SEARCH, payload: { search, page }})
            } else {
              nextPage = false
              dispatch({type: SEARCH_SUCCESSFUL})
            }
        })
          .catch(async (response) => {
            dispatch({type: SEARCH_FAILED, payload: { error: response }})
            nextPage = false
          })
      }
    } catch (response) {
      dispatch({type: SEARCH_FAILED, payload: { error: response }})
    }
  }
}
