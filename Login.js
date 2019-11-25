import React from 'react';
import { KeyboardAvoidingView, Image, StyleSheet, View } from 'react-native';
import logo from "./assets/images/logo.png"
import SQLite from 'react-native-sqlite-storage';
import Button from "./components/Button.js";
import FormTextInput from "./components/FormTextInput.js";

export default class LoginScreen extends React.PureComponent {

    static navigationOptions = {
        /* turns off default header for the screen */
        header: null,
    };

    state = {
        username: "",
        password: "",
    };

    handleAuth = () => {
        alert("Now signing in...soon.");
    }

    handleUsernameChange = (username) => {
        this.setState({ username: username });
    }

    handlePasswordChange = (password) => {
        this.setState({ password: password });
    }

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

    render() {
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