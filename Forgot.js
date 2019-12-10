import React from 'react';
import { ScrollView, StyleSheet, View, Text, TextInput, Dimensions } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { Button } from 'native-base';

const { height } = Dimensions.get('window');

let db;

export default class ForgotScreen extends React.PureComponent {

    state = {
        screenHeight: height,
        resetUser: false,
        resetPass: false,
        buttonColor1: "blue",
        textColor1: "white",
        buttonColor2: "blue",
        textColor2: "white",
        ID_Num: "",
        tempUser: "",
        tempPass: ""
    };

    static navigationOptions = () => ({
        title: 'Kiwi',
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: '#653334'
        }
    });

    changeState = (choice) => {

        if (choice == 1) {
            this.setState({ resetUser: true });
            this.setState({ resetPass: false });

            this.setState({ buttonColor1: "yellow" });
            this.setState({ textColor1: "black" });

            this.setState({ buttonColor2: "blue" });
            this.setState({ textColor2: "white" });

        }
        else {
            this.setState({ resetUser: false });
            this.setState({ resetPass: true });

            this.setState({ buttonColor2: "yellow" });
            this.setState({ textColor2: "black" });

            this.setState({ buttonColor1: "blue" });
            this.setState({ textColor1: "white" });
        }

    }

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

    handleUsernameChange = (password) => { this.setState({ tempPass: password }); }
    handlePasswordChange = (username) => { this.setState({ tempUser: username }); }
    handleIDChange = (ID) => { this.setState({ ID_Num: ID }); }

    handleInfoChange = (button) => {

        if (button == 0) {
            db.transaction(tx => {
                let sql = "SELECT * FROM user WHERE u_ID = " + this.state.ID_Num + " AND u_password = '" + this.state.tempPass + "';";
                tx.executeSql(sql, [], (tx, results) => {
                    const len = results.rows.length;
                    if (!len) {
                        alert("Incorrect ID number or password!");
                    } else {
                        this.props.navigation.navigate("Info Change", { choice: 0, ID: this.state.ID_Num, });
                    }
                });
            }, (err) => {
                console.log('transaction error: ', err.message);
            });

        }
        else {
            db.transaction(tx => {
                let sql = "SELECT * FROM user WHERE u_ID = " + this.state.ID_Num + " AND u_name = '" + this.state.tempUser + "';";
                tx.executeSql(sql, [], (tx, results) => {
                    const len = results.rows.length;
                    if (!len) {
                        alert("Incorrect ID number or username!");
                    } else {
                        this.props.navigation.navigate("Info Change", { choice: 1, ID: this.state.ID_Num, });
                    }
                });
            }, (err) => {
                console.log('transaction error: ', err.message);
            });

        }

    }

    handleSubmit = (button) => {
        if (button == 0) {
            if (this.state.ID_Num == "" && this.state.tempPass == "") {
                alert("Nothing entered!");
            }
            else if (this.state.ID_Num == "") {
                alert("No ID number entered!");
            }
            else if (this.state.tempPass == "") {
                alert("No password entered!");
            }
            else {
                this.handleInfoChange(button);
            }
        }
        else {
            if (this.state.ID_Num == "" && this.state.tempUser == "") {
                alert("Nothing entered!");
            }
            else if (this.state.ID_Num == "") {
                alert("No ID number entered!");
            }
            else if (this.state.tempUser == "") {
                alert("No username entered!");
            }
            else {
                this.handleInfoChange(button);
            }
        }
    }

    showInput = () => {
        var Output = []

        if (this.state.resetUser) {
            Output.push(<Text key={0} style={styles.prompt}>Input your information.</Text>);
            Output.push(<TextInput key={1} style={{ fontSize: 20, padding: 10, width: "70%", alignSelf: "center" }} value={this.state.ID_Num} onChangeText={this.handleIDChange} placeholder="ID Number" underlineColorAndroid="grey" />);
            Output.push(<TextInput key={2} style={{ fontSize: 20, padding: 10, width: "70%", alignSelf: "center" }} value={this.state.tempPass} onChangeText={this.handleUsernameChange} placeholder="Password" underlineColorAndroid="grey" />);
            Output.push(<Button key={3} onPress={() => this.handleSubmit(0)} style={{ backgroundColor: "yellow", alignSelf: "center", width: '50%', justifyContent: "center", margin: 10 }}><Text style={{ color: "black", fontSize: 20 }}>Submit</Text></Button>);
        }
        else if (this.state.resetPass) {
            Output.push(<Text key={0} style={styles.prompt}>Input your information.</Text>);
            Output.push(<TextInput key={1} style={{ fontSize: 20, padding: 10, width: "70%", alignSelf: "center" }} value={this.state.ID_Num} onChangeText={this.handleIDChange} placeholder="ID Number" underlineColorAndroid="grey" />);
            Output.push(<TextInput key={2} style={{ fontSize: 20, padding: 10, width: "70%", alignSelf: "center" }} value={this.state.tempUser} onChangeText={this.handlePasswordChange} placeholder="Username" underlineColorAndroid="grey" />);
            Output.push(<Button key={3} onPress={() => this.handleSubmit(1)} style={{ backgroundColor: "yellow", alignSelf: "center", width: '50%', justifyContent: "center", margin: 10 }}><Text style={{ color: "black", fontSize: 20 }}>Submit</Text></Button>);
        }

        return Output
    }

    render() {
        return (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} scrollEnabled={true} onContentSizeChange={this.onContentSizeChange}>
                <View style={{ flex: 1, backgroundColor: "#BEED90" }}>
                    <Text style={styles.prompt}>Choose an option to reset.</Text>
                    <Button onPress={() => this.changeState(1)} style={{ backgroundColor: this.state.buttonColor1, alignSelf: "center", width: '75%', justifyContent: "center", margin: 10, borderRadius: 15 }}><Text style={{ color: this.state.textColor1, fontSize: 20 }}>Username</Text></Button>
                    <Button onPress={() => this.changeState(2)} style={{ backgroundColor: this.state.buttonColor2, alignSelf: "center", width: '75%', justifyContent: "center", margin: 10, borderRadius: 15 }}><Text style={{ color: this.state.textColor2, fontSize: 20 }}>Password</Text></Button>
                    {this.showInput()}
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