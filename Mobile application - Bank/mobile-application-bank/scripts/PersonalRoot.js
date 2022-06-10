import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  Pressable,
  Alert,
  ToastAndroid,
  Modal,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPreset, CardStyleInterpolators} from '@react-navigation/stack';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import Loans from './Loans';
import Transfer from './Transfer';
import PersonalPage from './personalPage';
import Currencies from './currencies'


const Stack = createStackNavigator()
function PersonalRoot(){
    return(
        <NavigationContainer independent={true}>
            <Stack.Navigator
            screenOptions={{
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid
            }}
            >
                <Stack.Screen
                    name="My Account"
                    component={PersonalPage}
                />
                <Stack.Screen
                    name='Deposit'
                    component={Deposit}
                />
                <Stack.Screen
                    name='Withdraw'
                    component={Withdraw}
                />
                <Stack.Screen
                    name='Transfer'
                    component={Transfer}
                />
                <Stack.Screen
                    name='Loans'
                    component={Loans}
                />
                 <Stack.Screen
                    name='Currencies'
                    component={Currencies}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default PersonalRoot