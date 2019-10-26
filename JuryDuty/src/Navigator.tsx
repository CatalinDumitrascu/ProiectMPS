/* Navigate through scenes */

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack'
// Import scenens for stack
import Splash from './auth/Splash'
import HomeScreen from './auth/HomeScreen'
import Login from './auth/Login'
import JurySetup from './auth/JurySetup'
import UsersList from './main/UsersList'

const Navigator = createStackNavigator(
    {
        Splash: Splash,
        HomeScreen: HomeScreen,
        Login: Login, 
        JurySetup: JurySetup,
        UsersList: UsersList
    },
    {
      initialRouteName: "Splash",     
      headerMode: "none",
    }
  );

export const Navigation = createAppContainer(Navigator);