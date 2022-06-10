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

function Auth({route, navigation}){

    const backToLogin=()=>{
        navigation.navigate('Login')
    }

    const goToPersonalPage=()=>{
        navigation.navigate('personalPage')
    }
    return(
        <View style={styles.body}>
            <Text style={styles.title}>2-Auth Authentication</Text>
            <Text>Received params: {JSON.stringify(route.params)}</Text>
           <Text style={styles.text}>
               A 4 digit code has beeen sent to your phone Number 0796417598
           </Text> 
           <TextInput
                style={styles.codeInput}
                placeholder='Enter Code'
                keyboardType='numeric'
           />
           <Pressable
                style={styles.submitButton}
                onPress={goToPersonalPage}
                android_ripple={{color: '#ffffff'}}
           >
               <Text style={styles.submitText}>Submit</Text>
           </Pressable>

           <Pressable
                style={styles.submitButton}
                onPress={backToLogin}
                android_ripple={{color: '#ffffff'}}
           >
               <Text style={styles.cancelText}>Cancel</Text>
           </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#02001fce',
    },
    title: {
        fontSize: 40,
        fontWeight: '800',
        marginBottom: 40, 
        marginTop: -55,
        textAlign: 'center',
    },
    text: {
        color: '#dfdfec',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '500',
        fontFamily: 'Verdana'
    },
    codeInput: {
        backgroundColor: '#dfdfec',
        width: '82%',
        borderRadius: 7,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        margin: 20,
    },
    submitButton: {
        backgroundColor: '#02001fb9',
        width: '82%',
        marginTop: 25,
        borderRadius: 7,
        paddingBottom: 10,
        paddingTop: 10,
    },
    submitText: {
        textAlign: 'center',
        color: '#17b908',
        fontSize: 25,
        fontWeight: 'bold',
    },
    cancelText: {
        textAlign: 'center',
        color: '#ff0000',
        fontSize: 25,
        fontWeight: 'bold',
    }
})

export default Auth