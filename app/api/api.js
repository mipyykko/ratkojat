import axios from 'axios'
import qs from 'qs'
const DOMParser = require('xmldom').DOMParser

const RATKOJAT_URL = 'http://www.ratkojat.fi/hae'
const RATKOJAT_QUERY_PARAMS = {
  s: '',
  c: 100,
  p: 1
}

  function buildSearchUrl (search, page) {
    const query = qs.stringify({ ...RATKOJAT_QUERY_PARAMS, s: search, p: page })
    return `${RATKOJAT_URL}?${query}`
  }

  export default async function submitQuery (search, page) {
    const url = buildSearchUrl(search, page)
    console.log('at submitquery, url: ' + url)
    // return ({results: [], hasNextPage: true}) // for debug, let's not spam
    try {
      const doc = await axios.get(
        url,
      { 
        timeout: 1000
      })
        .then(response => parseResponse(response))
      //console.log(doc)
      const hasNextPage = checkNextPage(doc)
      return ({results: getWords(doc), hasNextPage})
    } catch (error) {
      return ({ results: [], error, hasNextPage: false })
    }
  }

  function parseResponse (response) {
    console.log('parsing response')
    var replaceMap = {
      '&laquo': '«',
      '&raquo': '»',
      '&auml': 'ä',
      '&ouml': 'ö'
    }
    // also strip any scripts that may cause DOMParser to choke
    response.data = response.data
      .replace(
        new RegExp(Object.keys(replaceMap).join('|'), 'gi'),
        matched => {
          return replaceMap[matched]
        }
      )
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // DOMParser doesn't actually like being inside a promise, so this has to be done?
    return new DOMParser().parseFromString(response.data, 'text/html')
  }

  function getWords (doc) {
    /*
      layout:
      (first) <tbody>
        each <tr>: <td>word</td><td><a>meaning</a></td><td>description</td>
    */
    var wordtable = doc.getElementsByTagName('tbody')[0]
    if (!wordtable) {
      return []
    }
    // hae:
    var wordlines = wordtable.getElementsByTagName('tr')
    var wordArray = []
    for (var i = 0; i < wordlines.length; ++i) {
      var wordline = wordlines[i].getElementsByTagName('td')
      var word = {
        word: wordline[0].childNodes[0].data,
        meaning: wordline[1].childNodes[1].childNodes[0].data,
        description: wordline[2].childNodes[0]
          ? wordline[2].childNodes[0].data
          : ''
      }
      wordArray.push(word)
    }
    console.log(wordArray)
    return wordArray
  }

  function checkNextPage (doc) {
    var uls = doc.getElementsByTagName('ul')
    if (uls && uls.length > 2) {
      // if there's 2 or less - 'none found' so there's no pagination
      var pagination = uls[1]
      var pagelist = pagination.getElementsByTagName('li')
      console.log(pagelist)
      if (pagelist && pagelist.length > 2 && pagelist[pagelist.length - 2].getAttribute('class') !== 'active') {
        // the last page is not active, so there's more to get
        return true
      }
    }
    return false
  }
