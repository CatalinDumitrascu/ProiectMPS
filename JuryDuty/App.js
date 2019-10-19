// First screen on stack

import React from 'react';
import { Navigation }  from './src/Navigator'

export default class App extends React.Component{

  // Just go to the next one
  render() {
      return (
            <Navigation/>         
      );
    }
  }