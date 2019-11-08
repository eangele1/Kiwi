import { KeyboardAvoidingView, Image, Stylesheet, View } from 'react-native';
import logo from "../assets/images/logo.png"
import SQLite from 'react-native-sqlite-storage';

state = {
    email: "",
    password: "",
    emailTouched: false,
    passwordTouched: false,
}

export default class HomeScreen extends React.PureComponent {
    render() {
        return (
            <KeyboardAvoidingView style={styles.container}>
                <Image source={logo} style={styles.logo} />
                <View style={styles.form}>
                    <Text style={{ textAlign: "center" }}>This has nothing in it. For now...</Text>
                </View>
            </KeyboardAvoidingView>
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
        width: "100%",
        resizeMode: "contain",
        alignSelf: "center"
    },
    form: {
        flex: 1,
        justifyContent: "center",
        width: "80%"
    }
});