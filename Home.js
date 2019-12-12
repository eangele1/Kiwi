import React from 'react';
import { StyleSheet, View, Text, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StackActions, NavigationActions } from 'react-navigation';
import qrcode from "./assets/images/qrcode.png";
import { openDatabase } from 'react-native-sqlite-storage';

let db;

export default class HomeScreen extends React.PureComponent {

    state = {
        fullName: "",
        user_ID: 0,
    };

    openSuccess() {
        console.log("Database is open!");
    }

    openError(err) {
        console.log("Error: ", err);
    }

    closeDatabase = () => {
        if (db) {
            console.log("Closing database.");
            db.close();
        } else {
            console.log("Database was not OPEN?!");
        }
    }
    retrieveName = () => {

        db.transaction(tx => {
            let sql = "SELECT ui_first_name, ui_last_name FROM user_info WHERE ui_ID = " + this.state.user_ID + ";";
            tx.executeSql(sql, [], (tx, results) => {
                const user = results.rows.item(0);

                this.setState({ fullName: user.ui_first_name + " " + user.ui_last_name });

            });
        });

    }

    async componentDidMount() {
        db = openDatabase({ name: 'KIWI.db', createFromLocation: 1 }, this.openSuccess, this.openError);
        this.retrieveUserID();
    }

    componentWillUnmount() {
        this.closeDatabase();
    }
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
            let userID = await AsyncStorage.getItem('user_ID');
            this.setState({ user_ID: userID });
            this.retrieveName();
        } catch (error) {
            alert(error);
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#BEED90" }}>
                <Text style={{ color: "black", textAlign: "center", marginTop: 60, fontFamily: 'Roboto', fontSize: 30 }}>{this.state.fullName}</Text>
                <Image source={qrcode} style={styles.qrcode} />
                <Icon name="power-off" size={40} color={'#007aff'} onPress={() => Alert.alert('Confirmation', 'Are you sure you want to log out?', [{ text: 'Cancel', }, { text: 'OK', onPress: () => this.goToLogin() },], { cancelable: false })} style={{ position: 'absolute', right: 15, top: 10, }} />
                <Text style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 13, position: 'absolute', right: 15, top: 55 }}>Log Out</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#BEED90",
        alignItems: "center",
        justifyContent: "space-between"
    },
    qrcode: {
        flex: 1,
        width: "40%",
        resizeMode: "contain",
        alignSelf: "center",
        marginTop: 250
    }
});
