import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { openDatabase } from 'react-native-sqlite-storage';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { Button } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';

let db;

export default class ArchiveScreen extends React.PureComponent {

    militaryToNormalTime = (string) => {
        var date = new Date("February 04, 2011 " + string);
        var hours = date.getHours();
        var am = true;
        if (hours > 12) {
            am = false;
            hours -= 12;
        } else if (hours == 12) {
            am = false;
        } else if (hours == 0) {
            hours = 12;
        }

        var minutes = date.getMinutes();

        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        var timeString = hours + ":" + minutes + (am ? "AM" : "PM");
        return timeString;
    }

    state = {
        tableHead: [],
        tableData: [],
        tableIDs: [],
        dateSort: null,
        locationSort: null,
        user_ID: 0
    };

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

    async componentDidMount() {
        this.retrieveUserID();
        db = openDatabase({ name: 'KIWI.db', createFromLocation: 1 }, this.openSuccess, this.openError);
    }

    componentWillUnmount() {
        this.closeDatabase();
    }

    retrieveUserID = async () => {
        try {
            let userID = await AsyncStorage.getItem('user_ID');
            this.setState({ user_ID: userID });

            this.addButtons();
            this.populateTable();

        } catch (error) {
            alert(error);
        }
    }

    dateSort = () => {
        db.transaction(tx => {

            let sql = "";

            if (this.state.dateSort == null || this.state.dateSort) {
                sql = "SELECT a_ID, a_eventID, a_date, a_time, e_locationname, e_name FROM archive, events WHERE a_ID = " + this.state.user_ID + " AND a_eventID == e_ID ORDER BY (a_date) ASC;";
                this.setState({ dateSort: false });
            }
            else {
                sql = "SELECT a_ID, a_eventID, a_date, a_time, e_locationname, e_name FROM archive, events WHERE a_ID = " + this.state.user_ID + " AND a_eventID == e_ID ORDER BY (a_date) DESC;";
                this.setState({ dateSort: true });
            }

            tx.executeSql(sql, [], (tx, results) => {
                const len = results.rows.length;
                if (!len) {
                } else {

                    var idArr = [];
                    var dataArr = [];

                    for (let index = 0; index < len; index++) {

                        var tempArr1 = [];
                        var tempArr2 = [];

                        const user = results.rows.item(index);

                        tempArr1.push(user.a_ID);
                        tempArr1.push(user.a_eventID);

                        tempArr2.push(user.a_date);

                        var array = user.a_time.split('.');
                        array.pop();
                        var string = array.join("");

                        tempArr2.push(this.militaryToNormalTime(string));
                        tempArr2.push(user.e_locationname);
                        tempArr2.push(user.e_name);
                        tempArr2.push("Delete");

                        idArr.push(tempArr1);

                        dataArr.push(tempArr2);

                    }

                    this.setState({ tableIDs: idArr });
                    this.setState({ tableData: dataArr });

                }
            });
        }, (err) => {
            console.log('transaction error: ', err.message);
        });
    }

    locationSort = () => {
        db.transaction(tx => {

            let sql = "";

            if (this.state.locationSort == null || this.state.locationSort) {
                sql = "SELECT a_ID, a_eventID, a_date, a_time, e_locationname, e_name FROM archive, events WHERE a_ID = " + this.state.user_ID + " AND a_eventID == e_ID ORDER BY (e_locationname) ASC;";
                this.setState({ locationSort: false });
            }
            else {
                sql = "SELECT a_ID, a_eventID, a_date, a_time, e_locationname, e_name FROM archive, events WHERE a_ID = " + this.state.user_ID + " AND a_eventID == e_ID ORDER BY (e_locationname) DESC;";
                this.setState({ locationSort: true });
            }

            tx.executeSql(sql, [], (tx, results) => {
                const len = results.rows.length;
                if (!len) {
                } else {

                    var idArr = [];
                    var dataArr = [];

                    for (let index = 0; index < len; index++) {

                        var tempArr1 = [];
                        var tempArr2 = [];

                        const user = results.rows.item(index);

                        tempArr1.push(user.a_ID);
                        tempArr1.push(user.a_eventID);

                        tempArr2.push(user.a_date);

                        var array = user.a_time.split('.');
                        array.pop();
                        var string = array.join("");

                        tempArr2.push(this.militaryToNormalTime(string));
                        tempArr2.push(user.e_locationname);
                        tempArr2.push(user.e_name);
                        tempArr2.push("Delete");

                        idArr.push(tempArr1);

                        dataArr.push(tempArr2);

                    }

                    this.setState({ tableIDs: idArr });
                    this.setState({ tableData: dataArr });

                }
            });
        }, (err) => {
            console.log('transaction error: ', err.message);
        });
    }

    addButtons = () => {

        var Output = [];

        const date = () => (
            <Button onPress={() => this.dateSort()} style={{ backgroundColor: "blue", justifyContent: "center" }}><Text style={{ color: "white", fontSize: 12 }}>Date</Text></Button>
        );

        const loc_name = () => (
            <Button onPress={() => this.locationSort()} style={{ backgroundColor: "blue", justifyContent: "center" }}><Text style={{ color: "white", fontSize: 12 }}>Location</Text></Button>
        );

        Output.push(date());
        Output.push("Time");
        Output.push(loc_name());
        Output.push("Name");
        Output.push("Delete?");

        this.setState({ tableHead: Output });

    }

    populateTable = () => {
        db.transaction(tx => {
            let sql = "SELECT a_ID, a_eventID, a_date, a_time, e_locationname, e_name FROM archive, events WHERE a_ID = " + this.state.user_ID + " AND a_eventID == e_ID;";
            tx.executeSql(sql, [], (tx, results) => {
                const len = results.rows.length;
                if (!len) {
                } else {

                    var idArr = [];
                    var dataArr = [];

                    for (let index = 0; index < len; index++) {

                        var tempArr1 = [];
                        var tempArr2 = [];

                        const user = results.rows.item(index);

                        tempArr1.push(user.a_ID);
                        tempArr1.push(user.a_eventID);

                        tempArr2.push(user.a_date);

                        var array = user.a_time.split('.');
                        array.pop();
                        var string = array.join("");

                        tempArr2.push(this.militaryToNormalTime(string));
                        tempArr2.push(user.e_locationname);
                        tempArr2.push(user.e_name);
                        tempArr2.push("Delete");

                        idArr.push(tempArr1);

                        dataArr.push(tempArr2);

                    }

                    this.setState({ tableIDs: idArr });
                    this.setState({ tableData: dataArr });

                }
            });
        }, (err) => {
            console.log('transaction error: ', err.message);
        });
    }

    deleteEvent = (index) => {

        var IDs = this.state.tableIDs;

        var eventID = IDs[index][1];

        db.transaction(tx => {
            let sql = "DELETE FROM archive WHERE a_ID = " + this.state.user_ID + " AND a_eventID = " + eventID + ";";
            tx.executeSql(sql, [], (tx, results) => {
                alert('Deleted successfuly!');
            });
            this.populateTable();
        }, (err) => {
            console.log('transaction error: ', err.message);
        });

    }

    render() {
        const element = (index) => (
            <Icon style={{ alignSelf: "center" }} name="trash" color={"blue"} size={20} onPress={() => this.deleteEvent(index)} />
        );

        return (
            <View style={{ flex: 1, backgroundColor: "#BEED90" }}>
                <Table borderStyle={{ borderColor: 'black' }}>
                    <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text} />
                    {
                        this.state.tableData.map((rowData, index) => (
                            <TableWrapper key={index} style={styles.row}>
                                {
                                    rowData.map((cellData, cellIndex) => (
                                        <Cell key={cellIndex} data={cellIndex === 4 ? element(index) : cellData} textStyle={styles.text} />
                                    ))
                                }
                            </TableWrapper>
                        ))
                    }
                </Table>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    head: { height: 40, backgroundColor: '#D3D3D3' },
    text: { margin: 6, fontSize: 12 },
    row: { flexDirection: 'row', backgroundColor: 'white' }
});