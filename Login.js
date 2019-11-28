import React from 'react';
import { KeyboardAvoidingView, Image, StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import logo from "./assets/images/logo.png";
import SQLite from 'react-native-sqlite-storage';
import Button from "./components/Button.js";
import FormTextInput from "./components/FormTextInput.js";
import AsyncStorage from '@react-native-community/async-storage';

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
    logIn = async () => {
        try {
            await AsyncStorage.setItem('isLoggedIn', "true");
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

    handleAuth = () => {

        /* INSERT DATABASE CODE HERE */

        if (this.state.username == "letme" && this.state.password == "inplease") {
            this.logIn();
            this.goToMainMenu();
        }
        else {
            alert("Incorrect username or password!");
        }
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
    }

    renderPlaceholder() {
        return (
            <View style={{ flex: 1, backgroundColor: "#BEED90", alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#000000" />
                <Text>Now Loading</Text>
            </View>
        )
    }

    render() {

        if (!this.state.isReady) {
            return this.renderPlaceholder();
        }

        return (
            <View style={styles.container}>
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
    }
});