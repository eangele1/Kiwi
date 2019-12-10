import React from 'react';
import { KeyboardAvoidingView, Image, StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { StackActions, NavigationActions, NavigationEvents } from 'react-navigation';
import logo from "./assets/images/logo.png";
import { openDatabase } from 'react-native-sqlite-storage';
import Button from "./components/Button.js";
import FormTextInput from "./components/FormTextInput.js";
import AsyncStorage from '@react-native-community/async-storage';

let db;

export default class LoginScreen extends React.PureComponent {

    static navigationOptions = {
        /* turns off default header for the screen */
        header: null,
    };

    state = {
        username: "",
        password: "",
        isLoggedIn: false,
        isReady: false
    };

    /* Logs user in the application */
    logIn = async (u_ID, u_type) => {
        try {
            await AsyncStorage.setItem('isLoggedIn', "true");
            await AsyncStorage.setItem('user_ID', u_ID.toString());
            await AsyncStorage.setItem('user_type', u_type);
        } catch (e) {
            alert(e);
        }
    }

    /* Loads the state of application (first load is isLoggedIn = false) */
    checkLoginState = async () => {
        try {
            let loginState = await AsyncStorage.getItem('isLoggedIn');
            if (loginState == null) {
                this.setState({ isLoggedIn: false });
                this.manageScreens();
            }
            else {
                loginState = (loginState == 'true');
                this.setState({ isLoggedIn: loginState });
                this.manageScreens();
            }
        } catch (error) {
            alert(error);
        }
    }

    manageScreens = () => {
        if (this.state.isLoggedIn == true) {
            this.setState({ isReady: true });
            this.goToMainMenu();
        }
        else {
            this.setState({ isReady: true });
        }
    }

    goToMainMenu = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'MainMenu' })],
        });
        this.props.navigation.dispatch(resetAction);
    }

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

    handleAuth = () => {

        db.transaction(tx => {
            let sql = "SELECT u_ID, u_type FROM user WHERE u_name = '" + this.state.username + "' AND u_password = '" + this.state.password + "';";
            tx.executeSql(sql, [], (tx, results) => {
                const len = results.rows.length;
                if (!len) {
                    alert("Incorrect username or password!");
                } else {
                    const user = results.rows.item(0);
                    this.logIn(user.u_ID, user.u_type);
                    this.checkLoginState();
                }
            });
        });

    }

    handleUsernameChange = (username) => { this.setState({ username: username }); }
    handlePasswordChange = (password) => { this.setState({ password: password }); }

    handleLoginPress = () => {
        if (this.state.username == "" && this.state.password == "") {
            alert("No username or password entered!");
        }
        else if (this.state.username == "") {
            alert("No username entered!");
        }
        else if (this.state.password == "") {
            alert("No password entered!");
        }
        else {
            this.handleAuth();
        }
    }

    async componentDidMount() {
        this.checkLoginState();
        db = openDatabase({ name: 'KIWI.db', createFromLocation: 1 }, this.openSuccess, this.openError);
    }

    componentWillUnmount() {
        this.closeDatabase();
    }

    renderPlaceholder() {
        return (
            <View style={{ flex: 1, backgroundColor: "#BEED90", alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#000000" />
                <Text>Now Loading</Text>
            </View>
        )
    }

    refresh = () => {
        db = openDatabase({ name: 'KIWI.db', createFromLocation: 1 }, this.openSuccess, this.openError);
    }

    render() {

        if (!this.state.isReady) {
            return this.renderPlaceholder();
        }

        return (
            <View style={styles.container}>
                <NavigationEvents onDidFocus={() => this.refresh()} />
                <Image source={logo} style={styles.logo} />
                <View style={styles.form}>
                    <FormTextInput
                        value={this.state.username}
                        onChangeText={this.handleUsernameChange}
                        placeholder={"Username"}
                    />
                    <FormTextInput
                        value={this.state.password}
                        onChangeText={this.handlePasswordChange}
                        placeholder={"Password"}
                    />
                    <Button label={"Sign In"} onPress={this.handleLoginPress} />
                    <Text style={styles.forgot} onPress={() => this.props.navigation.navigate("Forgot")}>Forgot Username or Password?</Text>
                </View>
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
    logo: {
        flex: 1,
        width: "50%",
        resizeMode: "contain",
        alignSelf: "center",
        marginTop: 25
    },
    form: {
        flex: 1,
        justifyContent: "center",
        width: "80%"
    },
    forgot: {
        color: "#007aff",
        fontSize: 16,
        marginTop: 10,
        textAlign: "center"
    }
});