/* Navigate through scenes */

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack'
// Import scenens for stack
import Splash from './auth/Splash'

const Navigator = createStackNavigator(
    {
        Splash: Splash,
    },
    {
      initialRouteName: "Splash",      
      headerMode: "none",
    }
  );

  
  
  export const Navigation = createAppContainer(Navigator);