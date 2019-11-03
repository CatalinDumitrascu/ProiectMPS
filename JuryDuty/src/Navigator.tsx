/* Navigate through scenes */

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack'
// Import scenens for stack
import Splash from './auth/Splash'
import HomeScreen from './auth/HomeScreen'
import Login from './auth/Login'
import JurySetup from './auth/JurySetup'
import Rounds from './main/Rounds'
import VotingScreen from './main/VotingScreen'

const Navigator = createStackNavigator(
    {
        Splash: Splash,
        HomeScreen: HomeScreen,
        Login: Login, 
        JurySetup: JurySetup,
        Rounds: Rounds,
        VotingScreen: VotingScreen
    },
    {
      initialRouteName: "Splash",     
      headerMode: "none",
    }
  );

export const Navigation = createAppContainer(Navigator);