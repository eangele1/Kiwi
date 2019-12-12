import React from 'react';
import { StyleSheet, View, Text, Alert,  Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StackActions, NavigationActions } from 'react-navigation';
import qrcode from "./assets/images/qrcode.png";
import SQLite from 'react-native-sqlite-storage';

let user_ID;
let db;

export default class HomeScreen extends React.PureComponent {

  state = {
    lastname: "", firstname: ""
  };

  openSuccess() {
      console.log("Database is open!");
      console.log(user_ID);
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

//look at this
/*
      db.transaction(tx => {
          let sql = "SELECT ui_first_name FROM user_info WHERE ui_ID = '100111222';";
          tx.executeSql(sql, [], (tx, results) => {
              //firstname = results.rows.item(0);
              //console.log(firstname);

          });
      });
*/

db.transaction(tx => {
    let sql = "SELECT ui_first_name FROM user_info WHERE ui_ID = " + user_ID + ";";
    tx.executeSql(sql, [], (tx, results) => {
        const user = results.rows.item(0);

        this.setState({ firstname: user.ui_first_name });

    });
});

db.transaction(tx => {
    let sql = "SELECT ui_last_name FROM user_info WHERE ui_ID = " + user_ID + ";";
    tx.executeSql(sql, [], (tx, results) => {
        const user = results.rows.item(0);

        this.setState({ lastname: user.ui_last_name });

    });
});

  }

  async componentDidMount() {
    console.log("Open database?");
      db = SQLite.openDatabase({ name: "KIWI", createFromLocation: "KIWI.db" }, this.openSuccess, this.openError);
      this.retrieveName();
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
            user_ID = await AsyncStorage.getItem('user_ID');
        } catch (error) {
            alert(error);
        }
    }

    render() {
        this.retrieveUserID();
        return (
            <View style={{ flex: 1, backgroundColor: "#BEED90" }}>
            <Text style={{ color: "black", textAlign:"center", marginTop:75, fontFamily: 'Roboto', fontSize: 30}}>{this.state.firstname +" "+ this.state.lastname}</Text>
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
        width: "50%",
        resizeMode: "contain",
        alignSelf: "center",
        marginTop: 25
    }
});
