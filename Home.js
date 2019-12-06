import React from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StackActions, NavigationActions } from 'react-navigation';

let user_ID;

export default class HomeScreen extends React.PureComponent {

    /* Logs user out of application */
    logOut = async () => {
        try {
            await AsyncStorage.setItem('isLoggedIn', "false");
            await AsyncStorage.setItem('user_ID', "");
            await AsyncStorage.setItem('user_type', "");
        } catch (e) {
            alert(e);
        }
    }

    goToLogin = () => {
        this.logOut();

        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    retrieveUserID = async () => {
        try {
            user_ID = await AsyncStorage.getItem('user_ID');
        } catch (error) {
            alert(error);
        }
    }

    render() {
        this.retrieveUserID();
        return (
            <View style={{ flex: 1, backgroundColor: "#BEED90" }}>
                <Icon name="power-off" size={40} color={'#007aff'} onPress={() => Alert.alert('Confirmation', 'Are you sure you want to log out?', [{ text: 'Cancel', }, { text: 'OK', onPress: () => this.goToLogin() },], { cancelable: false })} style={{ position: 'absolute', right: 15, top: 10, }} />
                <Text style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 13, position: 'absolute', right: 15, top: 55 }}>Log Out</Text>
            </View>
        );
    }
}