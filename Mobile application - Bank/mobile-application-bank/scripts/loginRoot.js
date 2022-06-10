import 'react-native-gesture-handler'
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
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import LoginPage from './LoginPage';
import AuthRoot from './2authRoot'

const Stack = createStackNavigator();

function LoginRoot(){
    return(
        <NavigationContainer independent={true}>
            <Stack.Navigator
                screenOptions={{
                    ...TransitionPresets.FadeFromBottomAndroid,
                    headerTitleAlign: 'center',
                    headerStyle: {backgroundColor: '#02001fef'},
                    headerTitleStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#dfdfec'
                    },
                }}
            >
                <Stack.Screen
                    name="Login"
                    component={LoginPage}
                    options={{headerShown: true}}
                />
                <Stack.Screen
                    name='AuthRoot'
                    component={AuthRoot}
                    options={{headerShown: false}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default LoginRoot