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
import PersonalRoot from './PersonalRoot';
import Auth from './2auth';

const Stack = createStackNavigator();

function AuthRoot(){
    return(
        <NavigationContainer independent={true}>
            <Stack.Navigator
                screenOptions={{
                    header: ()=>null,
                    ...TransitionPresets.FadeFromBottomAndroid,
                    
                }}
            >
                <Stack.Screen
                    name='personalPage'
                    component={PersonalRoot}
                    options={{ tabBarLabel: 'My Account' }}
                />
                <Stack.Screen
                    name="Auth"
                    component={Auth}
                />
                
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AuthRoot