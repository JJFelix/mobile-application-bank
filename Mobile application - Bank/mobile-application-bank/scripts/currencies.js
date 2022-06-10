import axios from 'axios';
import React, {useState, useEffect} from 'react';
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
  FlatList,
  ActivityIndicator,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Currencies({navigation}){
    const [fromCurrency, setFromCurrency] = useState('AUD')
    const [toCurrency, setToCurrency] = useState('AUD')
    const [amount, setAmount] = useState('')
    const [accountNo, setAccountNo] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [userMadeRequest, setUserMadeRequest] = useState(false)
    const [afterRequest, setAfterRequest] = useState(false)
    const [MyCurrencies, setCurrencies] = useState([
        {name: 'Ksh', amount: 5000.00},
        {name: 'Dollar', amount: 17.90},
        {name: 'Euros', amount: 14.00},
        {name: 'Yemen', amount: 11.92},
        {name: 'Rand', amount: 45.89},
        {name: 'Tzsh', amount: 8000.00},
        {name: 'CaD', amount: 78.97},
        {name: 'CaD', amount: 78.97},
        {name: 'CaD', amount: 78.97},
        {name: 'CaD', amount: 78.97},
        {name: 'CaD', amount: 78.97},
        {name: 'CaD', amount: 78.97},
    ]);

    const getAccount=async ()=>{
        const acc = await AsyncStorage.getItem('accountNo');
        const loanAm = await AsyncStorage.getItem('loanAmount')
        const loanLim = await AsyncStorage.getItem('loanLimit')
        var ownedCurrencies = await AsyncStorage.getItem('ownedCurrencies')
        const url = "http://10.96.218.24:5000/myCurrencies"
        console.log('Asynced value Withdraw', acc);
        await setAccountNo(acc);
        ownedCurrencies = ownedCurrencies.replace(/\'/g, '"');
        ownedCurrencies = JSON.parse(ownedCurrencies)
        var data = []
            for(let key in ownedCurrencies){
                var object={
                    name: key,
                    amount: ownedCurrencies[key]
                }
                data.push(object)
            }
        await setCurrencies(data)
        //await setLoanAmount(loanAm);
        //await setLoanLimit(loanLim);
    }

    useEffect(()=>{
        navigation.addListener('focus', async()=>{
          getAccount()
        })
    }, [])
    
    useEffect(()=>{
        if(afterRequest){
            getAccount()
        }
    }, [afterRequest])

    const baseurl = "http://192.168.0.108:5000/trade";
    useEffect(()=>{
        if(userMadeRequest){
            setIsLoading(true)
            async function trade(){
                axios.post(baseurl, {
                    accountNo: {accountNo},
                    fromCurrency: {fromCurrency},
                    toCurrency: {toCurrency},
                    amount: {amount}
                }).then((response)=>{
                    console.log('Receiving the response...')
                    AsyncStorage.setItem('ownedCurrencies', response.data.currencies)
                    console.log(response.data)
                    alert(response.data.message)
                    setIsLoading(false)
                    setUserMadeRequest(false)
                    setAfterRequest(true)
                })
            }
            trade() 
        } 
           

    }, [userMadeRequest])

    const makeUserRequest=()=>{
        if(amount==''){
          alert('Enter amount')
        }else{
          setUserMadeRequest(true)
        }
      }

    return(
        <View style={styles.body}>
           <FontAwesome5 name='money-bill-wave' style={styles.icon}/>
           {isLoading?<ActivityIndicator/>:<Text>(-)</Text>}
           <Text style={{fontSize: 17, fontWeight: '600', color:'#17b908'}}>Change Your money to Other Currencies</Text>
           <Text style={{fontSize: 17, fontWeight: '600', color:'#17b908', marginTop: 10}}>Sell: (Currencies you own):</Text>
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

                    <Text style={{fontSize: 17, fontWeight: '600', color:'#17b908', marginTop: 20}}>Buy: </Text>    
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
            style={styles.input}
            keyboardType='numeric'
            placeholder='Amount to change (Amount of the owned currency)'
            onChangeText={(value)=>setAmount(value)}
           />
           <Pressable
            style={styles.convertButton}
            onPress={makeUserRequest}
            android_ripple={{color: '#ffffff'}}
           >
               <Text style={styles.convertText}>Convert</Text>
           </Pressable>
           <Text style={{color: '#fff', fontSize: 20, marginTop: -30}}>Your Currencies</Text>
            <FlatList
                style={styles.flastList}
                keyExtractor={(currency, index)=>index.toString()}
                data={MyCurrencies}
                renderItem={({item})=>(
                <View style={styles.currrenciesContainer}>
                    <Text style={styles.currencyName}>{item.name}</Text>
                    <Text style={styles.amount}>{item.amount}</Text>
                </View>
            )} />
        </View>
   
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#02001fce'
    },
    input: {
        width: '95%',
        borderRadius: 5,
        backgroundColor: '#fff',
        margin: 10
    },
    icon: {
        fontSize: 60,
        margin: 20,
        marginBottom: 5,
        color: '#fff',
        fontWeight: '100'
      },
      convertButton: {
        width: '95%',
        backgroundColor: '#02001fef',
        marginTop: 20,
        marginBottom: 50,
        paddingBottom: 10,
        paddingTop: 5,
        borderRadius: 7,
      },
      convertText: {
        fontSize: 25,
        color: '#17b908',
        textAlign: 'center', 
        fontWeight: 'bold',
      },
      currrenciesContainer: {
          flex: 1,
          width: '100%',
          justifyContent: 'space-around',
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#02001fef',
          margin: 10,
          marginRight: 10,
      },
      flastList: {
          flexGrow: 1,
          width: '95%',
          
      },
      amount:{
          color: '#ffee00',
          fontSize: 20,
      },
      currencyName: {
          fontSize: 25,
          fontWeight: '300',
          color: '#17b908'

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

export default Currencies