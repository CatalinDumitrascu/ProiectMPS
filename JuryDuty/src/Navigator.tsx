/* Navigate through scenes */

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack'
// Import scenens for stack
import Splash from './auth/Splash'
import Login from './auth/Login'

const Navigator = createStackNavigator(
    {
        Splash: Splash,
        Login: Login, 
    },
    {
      initialRouteName: "Splash",     
      headerMode: "none",
    }
  );

  
  
  export const Navigation = createAppContainer(Navigator);