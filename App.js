/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Dimensions
} from "react-native"
import axios from 'axios'
import WordList from './App/Components/WordList'

const DOMParser = require("xmldom").DOMParser;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      page: 1,
      loading: false,
      results: []
    };
  }

  submitSearch = async () => {
    await this.setState({ results: [], page: 1, loading: true })
    var maxLoad = 0
    // maxLoad prevents spam in testing
    while (this.state.loading && ++maxLoad < 10) {
      console.log(this.state)
      await axios
        .get("http://www.ratkojat.fi/hae", {
          params: {
            s: this.state.search,
            c: 100,
            p: this.state.page
          }
        })
        .then(response => {
          console.log(response)
          // these somehow caused errors
          var replaceMap = {
            "&laquo": "«",
            "&raquo": "»",
            "&auml": "ä",
            "&ouml": "ö"
          };
          // also strip any scripts that may cause DOMParser to choke
          response.data = response.data
            .replace(
              new RegExp(Object.keys(replaceMap).join("|"), "gi"),
              matched => {
                return replaceMap[matched];
              }
            )
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
          // DOMParser doesn't actually like being inside a promise, so this has to be done?
          return new DOMParser().parseFromString(response.data, "text/html");
        })
        .then(doc => {
          /*
            layout:
            (first) <tbody>
              each <tr>: <td>word</td><td><a>meaning</a></td><td>description</td>
          */
          var wordtable = doc.getElementsByTagName('tbody')[0];
          // hae:
          if (wordtable /* && wordtable.childNodes.length > 1*/) {
            var wordlines = wordtable.getElementsByTagName('tr');
            var wordArray = [];
            for (var i = 0; i < wordlines.length; ++i) {
              var wordline = wordlines[i].getElementsByTagName('td');
              var word = {
                word: wordline[0].childNodes[0].data,
                meaning: wordline[1].childNodes[1].childNodes[0].data,
                description: wordline[2].childNodes[0]
                  ? wordline[2].childNodes[0].data
                  : ""
              };
              wordArray.push(word);
            }
            console.log(wordArray);
            this.setState({ results: [...this.state.results, ...wordArray]})
            this.forceUpdate();
          }
          var uls = doc.getElementsByTagName('ul')
          if (uls.length <= 2) {
            // "none found" so there's no pagination
            this.setState({ loading: false })
          } else {
            var pagination = uls[1]
            var pagelist = pagination.getElementsByTagName('li')
            console.log(pagelist)
            if (pagelist && pagelist.length > 2 && pagelist[pagelist.length - 2].getAttribute('class') != 'active') {
              // the last page is not active, so there's more to get
              this.setState({ loading: true, page: ++this.state.page })
            } else {
              this.setState({ loading: false })
            }
          }
          // ryhmittele:
          // if (wordtable && wordtable.childNodes.length > 1) {
          //   var words = wordtable.getElementsByTagName('td')[1].getElementsByTagName('a');
          //   var wordArray = [];
          //   for (var i = 0; i < words.length; ++i) {
          //     wordArray.push(words[i].childNodes[0].data);
          //   }
          //   this.setState({results: wordArray});
          //   console.log(wordArray);
          // }
        });
      }
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={{
            textAlign: "center",
            height: 40,
            width: "100%",
            borderWidth: 0
          }}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={search => this.setState({ search })}
          value={this.state.search}
          onSubmitEditing={this.submitSearch}
        />
        <WordList results={this.state.results} loading={this.state.loading} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    margin: 10
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
