import React from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator, Text, TextInput, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { openDatabase } from 'react-native-sqlite-storage';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { Button } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';

let db;

export default class InformationScreen extends React.PureComponent {

    state = {
        user_ID: 0,
        user_type: "",
        tableHead: [],
        tableData: [],
        classes: [],
        firstNameSort: null,
        lastNameSort: null,
        currClass: "",
        classNames: [],
        add_new_student: false
    };

    retrieveUserIDAndType = async () => {
        try {
            let userID = await AsyncStorage.getItem('user_ID');
            this.setState({ user_ID: userID });
            let usertype = await AsyncStorage.getItem('user_type');
            this.setState({ user_type: usertype });

            this.addHead();
            this.setClasses();
            this.populateTable(0);

        } catch (error) {
            alert(error);
        }
    }

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
        this.retrieveUserIDAndType();
        db = openDatabase({ name: 'KIWI.db', createFromLocation: 1 }, this.openSuccess, this.openError);
    }

    componentWillUnmount() {
        this.closeDatabase();
    }

    firstNameSort = (idx) => {
        db.transaction(tx => {

            let sql = "";

            if (this.state.firstNameSort == null || this.state.firstNameSort) {
                sql = "SELECT r_firstname, r_lastname, r_last_check_in FROM roster WHERE r_userID = " + this.state.user_ID + " AND r_class = " + this.state.classes[idx] + " ORDER BY (r_firstname) ASC;";
                this.setState({ firstNameSort: false });
            }
            else {
                sql = "SELECT r_firstname, r_lastname, r_last_check_in FROM roster WHERE r_userID = " + this.state.user_ID + " AND r_class = " + this.state.classes[idx] + " ORDER BY (r_firstname) DESC;";
                this.setState({ firstNameSort: true });
            }

            tx.executeSql(sql, [], (tx, results) => {
                const len = results.rows.length;
                if (!len) {
                } else {
                    var dataArr = [];

                    for (let index = 0; index < len; index++) {

                        var tempArr = [];

                        const user = results.rows.item(index);

                        tempArr.push(user.r_firstname);
                        tempArr.push(user.r_lastname);

                        tempArr.push(user.r_last_check_in);

                        tempArr.push("Delete");

                        dataArr.push(tempArr);

                    }
                    this.setState({ tableData: dataArr });
                }
            });
        }, (err) => {
            console.log('transaction error: ', err.message);
        });
    }

    lastNameSort = (idx) => {
        db.transaction(tx => {

            let sql = "";

            if (this.state.lastNameSort == null || this.state.lastNameSort) {
                sql = "SELECT r_firstname, r_lastname, r_last_check_in FROM roster WHERE r_userID = " + this.state.user_ID + " AND r_class = " + this.state.classes[idx] + " ORDER BY (r_lastname) ASC;";
                this.setState({ lastNameSort: false });
            }
            else {
                sql = "SELECT r_firstname, r_lastname, r_last_check_in FROM roster WHERE r_userID = " + this.state.user_ID + " AND r_class = " + this.state.classes[idx] + " ORDER BY (r_lastname) DESC;";
                this.setState({ lastNameSort: true });
            }

            tx.executeSql(sql, [], (tx, results) => {
                const len = results.rows.length;
                if (!len) {
                } else {
                    var dataArr = [];

                    for (let index = 0; index < len; index++) {

                        var tempArr = [];

                        const user = results.rows.item(index);

                        tempArr.push(user.r_firstname);
                        tempArr.push(user.r_lastname);

                        tempArr.push(user.r_last_check_in);

                        tempArr.push("Delete");

                        dataArr.push(tempArr);

                    }
                    this.setState({ tableData: dataArr });
                }
            });
        }, (err) => {
            console.log('transaction error: ', err.message);
        });
    }

    addHead = () => {

        if (this.state.user_type == "student") {
            var Output = [];

            Output.push("Days");
            Output.push("Time");
            Output.push("Room");
            Output.push("Professor");
            Output.push("Class");

            this.setState({ tableHead: Output });
        }
        else {
            var Output = [];

            const first_name = () => (
                <Button onPress={() => this.firstNameSort(this.state.classNames.indexOf(this.state.currClass))} style={{ backgroundColor: "blue", justifyContent: "center" }}><Text style={{ color: "white", fontSize: 12 }}>First Name</Text></Button>
            );

            const last_name = () => (
                <Button onPress={() => this.lastNameSort(this.state.classNames.indexOf(this.state.currClass))} style={{ backgroundColor: "blue", justifyContent: "center" }}><Text style={{ color: "white", fontSize: 12 }}>Last Name</Text></Button>
            );

            Output.push(first_name());
            Output.push(last_name());
            Output.push("Checked in?");
            Output.push("Delete?");

            this.setState({ tableHead: Output });
        }

    }

    setClasses = () => {

        db.transaction(tx => {
            let sql = "SELECT ui_classes FROM user_info WHERE ui_ID = " + this.state.user_ID + ";";
            tx.executeSql(sql, [], (tx, results) => {
                const len = results.rows.length;
                if (!len) {
                } else {

                    const user = results.rows.item(0);

                    var array = user.ui_classes.split(',');

                    this.setState({ classes: array });

                }
            });

        }, (err) => {
            console.log('transaction error: ', err.message);
        });



    }

    populateTable = (idx) => {

        if (this.state.user_type == "student") {
            db.transaction(tx => {
                var dataArr = [];
                let sql = "SELECT c_date, c_time, c_roomnum, c_professor, c_classname FROM classes WHERE c_ID = " + this.state.classes[0] + ";";
                tx.executeSql(sql, [], (tx, results) => {
                    const len = results.rows.length;
                    if (!len) {
                    } else {
                        var tempArr = [];

                        const classInfo = results.rows.item(0);

                        tempArr.push(classInfo.c_date);

                        var array = classInfo.c_time.split('.');
                        array.pop();
                        var string = array.join("");

                        tempArr.push(this.militaryToNormalTime(string));

                        tempArr.push(classInfo.c_roomnum);
                        tempArr.push(classInfo.c_professor);
                        tempArr.push(classInfo.c_classname);

                        dataArr.push(tempArr);
                    }
                });

                sql = "SELECT c_date, c_time, c_roomnum, c_professor, c_classname FROM classes WHERE c_ID = " + this.state.classes[1] + ";";
                tx.executeSql(sql, [], (tx, results) => {
                    const len = results.rows.length;
                    if (!len) {
                    } else {
                        var tempArr = [];

                        const classInfo = results.rows.item(0);

                        tempArr.push(classInfo.c_date);

                        var array = classInfo.c_time.split('.');
                        array.pop();
                        var string = array.join("");

                        tempArr.push(this.militaryToNormalTime(string));

                        tempArr.push(classInfo.c_roomnum);
                        tempArr.push(classInfo.c_professor);
                        tempArr.push(classInfo.c_classname);

                        dataArr.push(tempArr);
                    }
                });

                sql = "SELECT c_date, c_time, c_roomnum, c_professor, c_classname FROM classes WHERE c_ID = " + this.state.classes[2] + ";";
                tx.executeSql(sql, [], (tx, results) => {
                    const len = results.rows.length;
                    if (!len) {
                    } else {
                        var tempArr = [];

                        const classInfo = results.rows.item(0);

                        tempArr.push(classInfo.c_date);

                        var array = classInfo.c_time.split('.');
                        array.pop();
                        var string = array.join("");

                        tempArr.push(this.militaryToNormalTime(string));

                        tempArr.push(classInfo.c_roomnum);
                        tempArr.push(classInfo.c_professor);
                        tempArr.push(classInfo.c_classname);

                        dataArr.push(tempArr);
                    }
                });

                sql = "SELECT c_date, c_time, c_roomnum, c_professor, c_classname FROM classes WHERE c_ID = " + this.state.classes[3] + ";";
                tx.executeSql(sql, [], (tx, results) => {
                    const len = results.rows.length;
                    if (!len) {
                    } else {
                        var tempArr = [];

                        const classInfo = results.rows.item(0);

                        tempArr.push(classInfo.c_date);

                        var array = classInfo.c_time.split('.');
                        array.pop();
                        var string = array.join("");

                        tempArr.push(this.militaryToNormalTime(string));

                        tempArr.push(classInfo.c_roomnum);
                        tempArr.push(classInfo.c_professor);
                        tempArr.push(classInfo.c_classname);

                        dataArr.push(tempArr);
                    }
                    this.setState({ tableData: dataArr });
                });

            }, (err) => {
                console.log('transaction error: ', err.message);
            });
        }
        else {
            db.transaction(tx => {

                var tempArr1 = [];

                let sql = "SELECT r_firstname, r_lastname, r_last_check_in FROM roster WHERE r_userID = " + this.state.user_ID + " AND r_class = " + this.state.classes[idx] + ";";
                tx.executeSql(sql, [], (tx, results) => {
                    const len = results.rows.length;
                    if (!len) {
                    } else {
                        var dataArr = [];

                        for (let index = 0; index < len; index++) {

                            var tempArr = [];

                            const user = results.rows.item(index);

                            tempArr.push(user.r_firstname);
                            tempArr.push(user.r_lastname);

                            tempArr.push(user.r_last_check_in);

                            tempArr.push("Delete");

                            dataArr.push(tempArr);

                        }
                        this.setState({ tableData: dataArr });
                    }
                });

                sql = "SELECT c_classname FROM classes WHERE c_ID = " + this.state.classes[0] + ";";
                tx.executeSql(sql, [], (tx, results) => {
                    const len = results.rows.length;
                    if (!len) {
                    } else {
                        const classInfo = results.rows.item(0);

                        tempArr1.push(classInfo.c_classname);
                    }
                });

                sql = "SELECT c_classname FROM classes WHERE c_ID = " + this.state.classes[1] + ";";
                tx.executeSql(sql, [], (tx, results) => {
                    const len = results.rows.length;
                    if (!len) {
                    } else {
                        const classInfo = results.rows.item(0);

                        tempArr1.push(classInfo.c_classname);
                    }
                });

                sql = "SELECT c_classname FROM classes WHERE c_ID = " + this.state.classes[2] + ";";
                tx.executeSql(sql, [], (tx, results) => {
                    const len = results.rows.length;
                    if (!len) {
                    } else {
                        const classInfo = results.rows.item(0);

                        tempArr1.push(classInfo.c_classname);
                    }
                });

                sql = "SELECT c_classname FROM classes WHERE c_ID = " + this.state.classes[3] + ";";
                tx.executeSql(sql, [], (tx, results) => {
                    const len = results.rows.length;
                    if (!len) {
                    } else {
                        const classInfo = results.rows.item(0);

                        tempArr1.push(classInfo.c_classname);
                    }
                    this.setState({ classNames: tempArr1 });
                    this.setState({ currClass: this.state.classNames[idx] });
                });

            }, (err) => {
                console.log('transaction error: ', err.message);
            });
        }
    }

    deleteStudent = (index) => {

        var names = this.state.tableData;

        db.transaction(tx => {
            let sql = "DELETE FROM roster WHERE r_userID = " + this.state.user_ID + " AND r_firstname = '" + names[index][0] + "' AND r_lastname = '" + names[index][1] + "';";
            tx.executeSql(sql, [], (tx, results) => {
                alert('Deleted successfuly!');
            });
            this.populateTable(this.state.classNames.indexOf(this.state.currClass));
        }, (err) => {
            console.log('transaction error: ', err.message);
        });

    }

    insertStudent = (index) => {

        var names = this.state.tableData;

        db.transaction(tx => {
            let sql = "INSERT INTO roster VALUES (" + this.state.user_ID + ", '" + this.state.firstName + "', '" + this.state.lastName + "', 0, " + this.state.classes[index] + ");";
            tx.executeSql(sql, [], (tx, results) => {
                alert('Inserted successfuly!');
                this.setState({ add_new_student: false });
                this.setState({ firstName: "" });
                this.setState({ lastName: "" });
            });
            this.populateTable(this.state.classNames.indexOf(this.state.currClass));
        }, (err) => {
            console.log('transaction error: ', err.message);
        });

    }

    showID = (state) => {
        var Output = [];

        if (!state) {
            if (this.state.user_type == 'student') {
                Output.push(<Text key={0} style={{ fontSize: 22, color: "black", paddingLeft: 10, paddingRight: 10 }}>{"Student ID: " + this.state.user_ID}</Text>);
                Output.push(
                    <Table key={1} borderStyle={{ borderColor: 'transparent' }}>
                        <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text} />
                        {
                            this.state.tableData.map((rowData, index) => (
                                <TableWrapper key={index} style={styles.row}>
                                    {
                                        rowData.map((cellData, cellIndex) => (
                                            <Cell key={cellIndex} data={cellData} textStyle={styles.text} />
                                        ))
                                    }
                                </TableWrapper>
                            ))
                        }
                    </Table>
                );
            }
            else {

                const element = (index) => (
                    <Icon style={{ alignSelf: "center" }} name="trash" color={"blue"} size={20} onPress={() => this.deleteStudent(index)} />
                );

                Output.push(<Text key={0} style={{ fontSize: 22, color: "black", paddingLeft: 10, paddingRight: 10 }}>{"Professor ID: " + this.state.user_ID}</Text>);

                Output.push(
                    <Icon key={1}
                        name="user-plus"
                        size={40}
                        color={'blue'}
                        onPress={() => this.setState({ add_new_student: true })}
                        style={{
                            position: 'absolute',
                            right: 20,
                            top: 30,
                        }}
                    />
                );

                for (let index = 0; index < this.state.classes.length; index++) {

                    let idx = index;

                    Output.push(<Button key={idx + 2} onPress={() => this.populateTable(idx)} style={{ backgroundColor: "blue", width: '20%', justifyContent: "center", margin: 10, borderRadius: 15 }}><Text style={{ color: "white", fontSize: 15 }}>{this.state.classNames[idx]}</Text></Button>);
                }

                Output.push(<Text key={6} style={{ fontSize: 22, color: "black", paddingLeft: 10, paddingRight: 10 }}>{"Current class: " + this.state.currClass}</Text>);

                Output.push(
                    <Table key={7} borderStyle={{ borderColor: 'transparent' }}>
                        <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text} />
                        {
                            this.state.tableData.map((rowData, index) => (
                                <TableWrapper key={index} style={styles.row}>
                                    {
                                        rowData.map((cellData, cellIndex) => (
                                            <Cell key={cellIndex} data={cellIndex === 3 ? element(index) : cellData} textStyle={styles.text} />
                                        ))
                                    }
                                </TableWrapper>
                            ))
                        }
                    </Table>
                );

                Output.push(<Image key={8} style={{ width: "30%", height: "30%", resizeMode: "stretch", position: 'absolute', right: 110, top: 70 }} source={require('./assets/images/boi.png')} />);
            }
        }
        return Output;
    }

    handleSubmit = () => {
        if (this.state.firstName == "" && this.state.lastName == "") {
            alert("Nothing entered!");
        }
        else if (this.state.firstName == "") {
            alert("No first name entered!");
        }
        else if (this.state.lastName == "") {
            alert("No last name entered!");
        }
        else {
            this.insertStudent(this.state.classNames.indexOf(this.state.currClass));
        }
    }

    handleFirstNameChange = (fName) => { this.setState({ firstName: fName }); }
    handleLastNameChange = (lName) => { this.setState({ lastName: lName }); }

    showNameInput = (state) => {

        Output = []

        if (state) {
            Output.push(
                <ScrollView key={0} contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: 'center', }} style={{ flex: 1 }} scrollEnabled={true} onContentSizeChange={this.onContentSizeChange}>

                    <Text style={styles.prompt}>Input information.</Text>
                    <TextInput style={{ fontSize: 20, padding: 10, width: "70%", alignSelf: "center" }} value={this.state.firstName} onChangeText={this.handleFirstNameChange} placeholder="First Name" underlineColorAndroid="grey" />
                    <TextInput style={{ fontSize: 20, padding: 10, width: "70%", alignSelf: "center" }} value={this.state.lastName} onChangeText={this.handleLastNameChange} placeholder="Last Name" underlineColorAndroid="grey" />
                    <Button onPress={() => this.handleSubmit()} style={{ backgroundColor: "yellow", alignSelf: "center", width: '50%', justifyContent: "center", margin: 10 }}><Text style={{ color: "black", fontSize: 20 }}>Submit</Text></Button>

                    <View style={{ position: 'absolute', left: 30, top: 30 }}>
                        <Icon
                            name="arrow-left"
                            size={40}
                            color={'#007aff'}
                            onPress={() => this.setState({ add_new_student: false })}
                        />
                    </View>

                </ScrollView>
            );
        }

        return Output;

    }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: "#BEED90" }}>
                {this.showID(this.state.add_new_student)}
                {this.showNameInput(this.state.add_new_student)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    head: { height: 40, backgroundColor: '#D3D3D3' },
    text: { margin: 6, fontSize: 12 },
    row: { flexDirection: 'row', backgroundColor: 'white' },
    prompt: {
        fontSize: 27.5,
        color: "black",
        textAlign: "center",
        padding: 20,
        paddingTop: 50
    }
});