import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  Pressable,
  Alert,
  ToastAndroid,
  Modal,
  ActivityIndicator,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import GlobalStyle from './Styles/GlobalStyle';
//import {Dropdown} from 'react-native-material-dropdown';
//import SelectDropdown from 'react-native-select-dropdown'
//import {Select, Option, OptionList, updatePosition } from 'react-native-dropdown'
import {Picker} from '@react-native-picker/picker'

function ForexPage({navigation}){

    const[fromCurrency, setFromCurrency] = useState('AUD')
    const[toCurrency, setToCurrency] = useState('AUD')
    const[amount, setAmount] = useState('')
    const [userMadeRequest, setUserMadeRequest] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState('Result')

    const baseurl = "http://192.168.0.108:5000/currencies";
    
    useEffect(()=>{
        if(userMadeRequest){
            setIsLoading(true)
            async function changeCurrency(){
                axios.post(baseurl, {
                    amount: {amount},
                    fromCurrency: {fromCurrency},
                    toCurrency: {toCurrency}
                }).then((response)=>{
                    console.log('Receiving the response...')
                    setUserMadeRequest(false)
                    setIsLoading(false)
                    if(response.data.success=='false'){
                        alert(response.data.message)
                    }else{
                        setResult(response.data.result)
                    }
                })
            }
            changeCurrency()
            console.log('Request Made')
        }
    }, [userMadeRequest])

    const goToForex=()=>{
        navigation.navigate('Home')
    }
    const goToHome=()=>{
        navigation.navigate('Home')
    }
    const goToLogin=()=>{
        navigation.navigate('Login')
    }
    const goToRegister=()=>{
        navigation.navigate('Register')
    }

    const makeUserRequest=()=>{
        if(amount==''){
            alert('Please enter Amount of currency to change');
        }else{
            setUserMadeRequest(true)
        }
    }

    return(
        <View style={styles.body}>
            <ScrollView>
                <View style={styles.scroll}>
                    {isLoading?<ActivityIndicator/>:<Text>(-)</Text>}
                    <Text style={styles.text}>
                    From: 
                    </Text>
                    <Picker
                        selectedValue={fromCurrency}
                        style={styles.picker}
                        onValueChange={(itemValue, itemIndex) =>
                            setFromCurrency(itemValue)
                        }>
                        <Picker.Item label="Australian Dollar" value="AUD" />
                        <Picker.Item label="British Pound" value="GBP" />
                        <Picker.Item label="Canandian Dollar" value="CAD" />
                        <Picker.Item label="China Yuan" value="CNY" />
                        <Picker.Item label="Egyptian Pound" value="EGP" />
                        <Picker.Item label="Euro" value="EUR" />
                        <Picker.Item label="Indian rupee" value="INR" />
                        <Picker.Item label="Israel Shekel" value="ISL" />
                        <Picker.Item label="Japanese Yen" value="JPY" />
                        <Picker.Item label="Kenyan Shillings" value="KES" />
                        <Picker.Item label="Nigerian Naira" value="NGN" />
                        <Picker.Item label="Singapore Dollar" value="SGD" />
                        <Picker.Item label="South African rand" value="ZAR" />
                        <Picker.Item label="Swiss Franc" value="CHF" />
                        <Picker.Item label="united states dollar" value="USD" />
                    </Picker>
                    <TextInput
                        placeholder='Amount'
                        keyboardType='numeric'
                        style={styles.inputAmount}
                        onChangeText={(value)=>setAmount(value)}
                    />

                    <Text style={styles.text}>
                        To: 
                    </Text>
                    <Picker
                        selectedValue={toCurrency}
                        style={styles.picker}
                        onValueChange={(itemValue, itemIndex) =>
                            setToCurrency(itemValue)
                        }>
                        <Picker.Item label="Australian Dollar" value="AUD" />
                        <Picker.Item label="British Pound" value="GBP" />
                        <Picker.Item label="Canandian Dollar" value="CAD" />
                        <Picker.Item label="China Yuan" value="CNY" />
                        <Picker.Item label="Egyptian Pound" value="EGP" />
                        <Picker.Item label="Euro" value="EUR" />
                        <Picker.Item label="Indian rupee" value="INR" />
                        <Picker.Item label="Israel Shekel" value="ISL" />
                        <Picker.Item label="Japanese Yen" value="JPY" />
                        <Picker.Item label="Kenyan Shillings" value="KES" />
                        <Picker.Item label="Nigerian Naira" value="NGN" />
                        <Picker.Item label="Singapore Dollar" value="SGD" />
                        <Picker.Item label="South African rand" value="ZAR" />
                        <Picker.Item label="Swiss Franc" value="CHF" />
                        <Picker.Item label="united states dollar" value="USD" />
                    </Picker>
                    <TextInput
                        placeholder={result}
                        placeholderTextColor='red'
                        keyboardType='numeric'
                        style={styles.inputAmount}
                    />

                    <Pressable
                        style={styles.convertButton}
                        onPress={makeUserRequest}
                        android_ripple={{color: '#ffffff'}}
                    >

                        <Text style={styles.ConvertText}>Convert</Text>
                    </Pressable>

                    <View style={styles.navigationBottom}>
                        <Pressable 
                            onPress={goToHome}
                            hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}>
                            <FontAwesome5 name="home" style={GlobalStyle.icon} />
                        </Pressable>
                        <Pressable      
                            onPress={goToForex}
                            hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}>
                            <FontAwesome5 name="chart-line" style={GlobalStyle.activeIcon} />
                        </Pressable>
                        <Pressable 
                            onPress={goToLogin}
                            hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}>
                            <FontAwesome5 name="unlock" style={GlobalStyle.icon} />
                        </Pressable>
                        <Pressable 
                            onPress={goToRegister}
                            hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}>
                            <FontAwesome5 name="user-plus" style={GlobalStyle.icon} />
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </View>
        
    )
}

const styles=StyleSheet.create({
    body:{
        flex: 1,
        backgroundColor:'#02001fb9',
    },
    scroll: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    inputContainer:{
        flex: 1
    },
    text: {
        color: '#17b908',
        fontSize: 40,
        marginTop: 30,
        fontWeight: 'bold',
    },
    inputCurrency: {
        width: '100%',
        backgroundColor: '#dfdfec',
        marginTop: 10,
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600'
    },
    inputAmount: {
        width: '80%',
        backgroundColor: '#dfdfec',
        marginTop: 30,
        marginBottom: 10,
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600'
    },
    convertButton: {
        width: '100%',
        backgroundColor: '#02001fef',
        marginTop: 20,
        marginBottom: 145,
        paddingBottom: 10,
        paddingTop: 5,
        borderRadius: 7,
    },
    ConvertText: {
        fontSize: 30,
        color: '#17b908',
        textAlign: 'center', 
        fontWeight: 'bold',
    },
    nav: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -35
    },
    navigationBottom:{
        flexDirection: 'row',
    }, 
    picker:{
        width: '100%',
        backgroundColor: '#dfdfec',
        marginTop: 10,
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600'
    }
})

export default ForexPage