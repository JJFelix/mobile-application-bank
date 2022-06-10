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
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Deposit({navigation}){
  const [isBorrow, setIsBorrow]= useState(false)
  const [isRepay, setIsRepay]= useState(true)
  const [loanAmount, setLoanAmount] = useState('')
  const [loanLimit, setLoanLimit] = useState('')
  const [borrowAmount, setBorrowAmount] = useState('')
  const [repayAmount , setRepayAmount] = useState('')
  const [userMadeRequest, setUserMadeRequest] = useState(false)
  const [accountNo, setAccountNo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [afterRequest, setAfterRequest] = useState(false)

  const getAccount=async ()=>{
    const acc = await AsyncStorage.getItem('accountNo');
    const loanAm = await AsyncStorage.getItem('loanAmount')
    const loanLim = await AsyncStorage.getItem('loanLimit')
    console.log('Asynced value Withdraw', acc);
    await setAccountNo(acc);
    await setLoanAmount(loanAm);
    await setLoanLimit(loanLim);
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

  const baseurl = "http://192.168.0.108:5000/loans";

  useEffect(()=>{
    if(userMadeRequest){
      setIsLoading(true)
      async function loan(){
        axios.post(baseurl, {
          borrowAmount: {borrowAmount},
          repayAmount: {repayAmount},
          accountNo: {accountNo},
        }).then((response)=>{
          console.log('Receiving the response...')
          AsyncStorage.setItem('balance', response.data.balance)
          AsyncStorage.setItem('loanLimit', response.data.loanLimit)
          AsyncStorage.setItem('loanAmount', response.data.loanAmount)
          AsyncStorage.setItem('ownedCurrencies', response.data.currencies)
          setUserMadeRequest(false)
          setIsLoading(false)
          setAfterRequest(true)
          if(response.data.balance=='false'){
            alert(response.data.message)
          }else{
            alert(response.data.message)
          }
        })
      }
      loan()
    }}, [userMadeRequest])

  const changeBorrowIcon=()=>{
    setIsBorrow(true)
    setIsRepay(false)
  }
  const changeRepayIcon=()=>{
    setIsBorrow(false)
    setIsRepay(true)
  }

  const makeUserRequest=()=>{
    if(borrowAmount=='' && repayAmount==''){
      if(isBorrow){
        alert('The Borrow amount is empty')
      }else{
        alert('The repay amount is empty')
      }
    }else{
      setUserMadeRequest(true)
    }
  }
    return(
        <View style={styles.body}>
          <ScrollView >
            <View style={styles.scroll}>
              <FontAwesome5 name='landmark' style={styles.icon}/>
              {isLoading?<ActivityIndicator/>:<Text>(-)</Text>}
              <Text style={{fontSize: 17, color: '#17b908', fontWeight:'600'}}>Outstanding Loan Balance:</Text><Text style={{fontSize: 15, color: '#fff'}}>{loanAmount}</Text>
              <Text style={{fontSize: 17, color: '#17b908', fontWeight:'600'}}>Loan Limit: </Text><Text style={{fontSize: 15, color: '#fff'}}>{loanLimit}</Text>
              <View style={styles.formContainer}>
                <View style={styles.optionsContainer}>
                  <Pressable 
                  style={styles.optionsButton}
                  onPress={changeBorrowIcon}>{
                    isBorrow?
                      <FontAwesome5 name='hand-holding-usd' style={{fontSize: 20, color: '#17b908'}}/>
                      :
                      <FontAwesome5 name='hand-holding-usd' style={{fontSize: 10, color: '#fff'}}/>
                  }
                    <Text> Borrow</Text>
                  </Pressable>
                  <Pressable 
                    style={styles.optionsButton}
                    onPress={changeRepayIcon}>{
                      isRepay?
                      <FontAwesome5 name='funnel-dollar' style={{fontSize: 20, color: '#17b908'}}/>
                      :
                      <FontAwesome5 name='btc' style={{fontSize: 10, color: '#fff'}}/>
                    }
                    <Text>Repay</Text>
                  </Pressable>
                </View>
                <View style={styles.form}>
                  <TextInput style={styles.input}
                    placeholder= {isBorrow? 'Amount To Borrow': 'Amount To Repay'}
                    keyboardType='numeric'
                    onChangeText={(value)=>isBorrow? setBorrowAmount(value):setRepayAmount(value)}
                    />
                  
                  <Pressable 
                    style={styles.submitButton}
                    onPress={makeUserRequest}
                    android_ripple={{color: '#ffffff'}}>
                    <Text style={styles.submitText}>Submit</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: '#02001fce',
    },
    scroll: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 25,
  },
    formContainer:{
      flex: 2,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    form:{
      flex: 2,
    },
    optionsContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      fontSize: 80,
      margin: 20,
      color: '#17b908',
    },
    input: {
      width: 330,
      backgroundColor: '#fff',
      borderRadius: 5,
      marginBottom: 20,
    },
    submitButton: {
      width: 330,
      backgroundColor: '#02001fef',
      marginTop: 20,
      marginBottom: 50,
      paddingBottom: 10,
      paddingTop: 5,
      borderRadius: 7,
    },
    submitText: {
      fontSize: 25,
      color: '#17b908',
      textAlign: 'center', 
      fontWeight: 'bold',
    },
    optionsButton:{
      margin: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 50,
      padding: 15
    }

})

export default Deposit