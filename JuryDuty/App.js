// First screen on stack

import React from 'react';
import { Navigation }  from './src/Navigator'
import storeFactory from './src/res/store'
import { Provider } from 'react-redux'

// Redux store
const store = storeFactory({})

export default class App extends React.Component{

  // Just go to the next one
  render() {
      return (
        <Provider store={store}>
            <Navigation/>      
        </Provider>           
      );
    }
  }