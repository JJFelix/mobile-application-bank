import 'react-native-gesture-handler'
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
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

function PersonalPage({route, navigation}){

  const [accountNo, setAccountNo] = useState('');
  const [userName, setUserName] = useState('');
  const [balance, setBalance] = useState('');

  const getvalue=async ()=>{
    const acc = await AsyncStorage.getItem('accountNo')
    const name = await AsyncStorage.getItem('userName')
    const bal = await AsyncStorage.getItem('balance')
    console.log('Asynced value Personal Page secpond', acc);
    await setAccountNo(acc);
    await setBalance(bal);
    await setUserName(name);
  }

  useEffect(()=>{
    navigation.addListener('focus', async()=>{
      getvalue()
    })
  }, [])
  
  console.log('The realll', accountNo);

  const goToDeposit=()=>{
    navigation.navigate('Deposit')
  }
  const goToWithdraw=()=>{
    navigation.navigate('Withdraw')
  }
  const goToTransfer=()=>{
    navigation.navigate('Transfer')
  }
  const goToLoans=()=>{
    navigation.navigate('Loans')
  }
  const goToCurrencies=()=>{
    navigation.navigate('Currencies')
  }
  const withdrawIcon = <FontAwesome5 name='money-check' style={styles.actionsIcon}/>
  const depositIcon = <FontAwesome5 name='wallet' style={styles.actionsIcon}/>
  const transferIcon = <FontAwesome5 name='paper-plane' style={styles.actionsIcon}/>
  const loansIcon = <FontAwesome5 name='landmark' style={styles.actionsIcon}/>
  const currencyIcon = <FontAwesome5 name='money-bill-wave' style={styles.actionsIcon}/>
    return(
        <View style={styles.body}>
            <View style={styles.allDetailsContainer}>
              <View style={styles.detailsContainer}>
                <Text style={styles.greeting}>Good Morning</Text>
                <Text style={styles.details}>{userName}</Text>
                <Text style={styles.details}>Account: {accountNo}</Text>
                <Text style={styles.details}>Balance: {balance}</Text>
              </View>
                <FontAwesome5 name='user' style={styles.userIcon}/>
            </View>

            <View style={styles.actionsContainer}>
              <View style={styles.subActionsContainer}>
                <Pressable 
                  style={styles.actionsButton}
                  onPress={goToDeposit}
                >
                  {depositIcon}<Text style={styles.details}> Deposit</Text>
                </Pressable>

                <Pressable
                  style={styles.actionsButton}
                  onPress={goToWithdraw}
                >
                   {withdrawIcon}<Text style={styles.details}> Withdraw</Text>
                </Pressable>
              </View>

              <View style={styles.subActionsContainer}>
                <Pressable 
                  style={styles.actionsButton}
                  onPress={goToTransfer}
                >
                  {transferIcon}<Text style={styles.details}> Transfer</Text>
                </Pressable>
                <Pressable
                  style={styles.actionsButton}
                  onPress={goToLoans}
                >
                   {loansIcon}<Text style={styles.details}> Loans</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.otherActionContainer}>
              <Pressable 
                  style={styles.otherActionsButton}
                  onPress={goToCurrencies}
                >
                  <Text style={styles.details}> {currencyIcon} Buy/sell other Currencies</Text>
                </Pressable>
                <Pressable
                  style={styles.otherActionsButton}
                >
                   <Text style={styles.details}>{withdrawIcon} $ Be your Financial Start $</Text>
                </Pressable>
            </View>
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
  Button: {
    backgroundColor: '#ff2',
    width: 300,
  },
  allDetailsContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer:{
    flex: 1,
    flexDirection: 'column',
    margin: 20,
  },
  greeting: {
    color: '#ffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 7,
  },
  details: {
    fontSize: 20,
    fontWeight: '600',
    color: '#17b908',
    marginBottom: 7,
  },
  userIcon: {
    fontSize: 100,
    margin: 20
  },
  actionsContainer: {
    flex: 3,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dbdada',
    borderRadius: 10,
  },
  subActionsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsButton: {
    width: 130,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#02001fef',
    borderRadius: 100,
    padding: 15,
    margin: 20,
  },
  actionsIcon: {
    fontSize: 20,
    color: '#ffff'
  },
  otherActionContainer: {
    flex: 3,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otherActionsButton: {
    width:'100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#02001fef',
    borderRadius: 20,
    padding: 15,
    margin: 20
  }
})

export default PersonalPage