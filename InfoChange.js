import React from 'react';
import { ScrollView, StyleSheet, View, Text, TextInput, Dimensions, Alert } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { Button } from 'native-base';

let ID;
let db;

const { height } = Dimensions.get('window');

export default class InformationScreen extends React.PureComponent {

    state = {
        screenHeight: height,
        newUser: "",
        newPass: ""
    };

    static navigationOptions = () => ({
        title: 'Kiwi',
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: '#653334'
        }
    });

    openSuccess() { console.log("Database is open!"); }
    openError(err) { console.log("Error: ", err); }

    closeDatabase = () => {
        if (db) {
            console.log("Closing database.");
            db.close();
        } else {
            console.log("Database was not OPEN?!");
        }
    }

    async componentDidMount() { db = openDatabase({ name: 'KIWI.db', createFromLocation: 1 }, this.openSuccess, this.openError); }

    componentWillUnmount() {
        this.closeDatabase();
    }

    handleUsernameChange = (username) => { this.setState({ newUser: username }); }
    handlePasswordChange = (password) => { this.setState({ newPass: password }); }

    handleInfoChange = (choice) => {

        if (choice == 0) {
            db.transaction(tx => {
                let sql = "SELECT * FROM user WHERE u_ID = " + ID + " AND u_name = '" + this.state.newUser + "';";
                tx.executeSql(sql, [], (tx, results) => {
                    const len = results.rows.length;
                    if (!len) {
                        let sql = "UPDATE user SET u_name = '" + this.state.newUser + "' WHERE u_ID = " + ID + ";";
                        tx.executeSql(sql, [], (tx, results) => {
                            Alert.alert('Success!', 'Your username has been changed.', [{ text: 'OK', onPress: () => this.props.navigation.popToTop({ onGoBack: () => this.refresh(), }) },], { cancelable: false });
                        });
                    } else {
                        alert("Please use a different username.");
                    }
                });
            }, (err) => {
                console.log('transaction error: ', err.message);
            });

        }
        else {
            db.transaction(tx => {
                let sql = "UPDATE user SET u_password = '" + this.state.newPass + "' WHERE u_ID = " + ID + ";";
                tx.executeSql(sql, [], (tx, results) => {
                    Alert.alert('Success!', 'Your password has been changed.', [{ text: 'OK', onPress: () => this.props.navigation.popToTop({ onGoBack: () => this.refresh(), }) },], { cancelable: false });
                });
            }, (err) => {
                console.log('transaction error: ', err.message);
            });

        }

    }

    handleSubmit = (choice) => {
        if (choice == 0) {
            if (this.state.newUser == "") {
                alert("No username entered!");
            }
            else {
                this.handleInfoChange(choice);
            }
        }
        else {
            if (this.state.newPass == "") {
                alert("No password entered!");
            }
            else {
                this.handleInfoChange(choice);
            }
        }
    }

    showPage = (choice) => {
        var Output = []

        if (choice == 0) {
            Output.push(<Text key={0} style={styles.prompt}>Enter a new username.</Text>);
            Output.push(<TextInput key={2} style={{ fontSize: 20, padding: 10, width: "70%", alignSelf: "center" }} value={this.state.newUser} onChangeText={this.handleUsernameChange} placeholder="Username" underlineColorAndroid="grey" />);
            Output.push(<Button key={3} onPress={() => this.handleSubmit(0)} style={{ backgroundColor: "yellow", alignSelf: "center", width: '50%', justifyContent: "center", margin: 10 }}><Text style={{ color: "black", fontSize: 20 }}>Submit</Text></Button>);
        }
        else {
            Output.push(<Text key={0} style={styles.prompt}>Enter a new password.</Text>);
            Output.push(<TextInput key={2} style={{ fontSize: 20, padding: 10, width: "70%", alignSelf: "center" }} value={this.state.newPass} onChangeText={this.handlePasswordChange} placeholder="Password" underlineColorAndroid="grey" />);
            Output.push(<Button key={3} onPress={() => this.handleSubmit(1)} style={{ backgroundColor: "yellow", alignSelf: "center", width: '50%', justifyContent: "center", margin: 10 }}><Text style={{ color: "black", fontSize: 20 }}>Submit</Text></Button>);
        }

        return Output
    }

    render() {

        const { navigation } = this.props;

        const choice = navigation.getParam('choice');

        ID = navigation.getParam('ID');

        return (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} scrollEnabled={true} onContentSizeChange={this.onContentSizeChange}>
                <View style={{ flex: 1, backgroundColor: "#BEED90" }}>
                    {this.showPage(choice)}
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    prompt: {
        fontSize: 27.5,
        color: "black",
        textAlign: "center",
        padding: 20,
        paddingTop: 50
    }
});