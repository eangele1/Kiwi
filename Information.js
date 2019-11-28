import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class InformationScreen extends React.PureComponent {
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#BEED90" }}>
                <Text style={{ fontSize: 22, color: "black", paddingLeft: 10, paddingRight: 10 }}>Same here, testing 1 2 3.</Text>
            </View>
        );
    }
}