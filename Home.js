import React from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StackActions, NavigationActions } from 'react-navigation';

export default class HomeScreen extends React.PureComponent {

    /* Logs user out of application */
    logOut = async () => {
        try {
            await AsyncStorage.setItem('isLoggedIn', "false");
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

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#BEED90" }}>
                <Icon name="power-off" size={40} color={'#007aff'} onPress={() => Alert.alert('Log Out', 'Are you sure you want to log out?', [{ text: 'Cancel', }, { text: 'OK', onPress: () => this.goToLogin() },], { cancelable: false })} style={{ position: 'absolute', right: 15, top: 10, }} />
                <Text style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 13, position: 'absolute', right: 15, top: 55 }}>Log Out</Text>
            </View>
        );
    }
}