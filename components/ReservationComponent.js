import React, { Component } from 'react';
import { Text, View , ScrollView, Picker, Switch, Button, StyleSheet, Modal, Alert}  from 'react-native';
import { Card } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import * as Animatable from 'react-native-animatable';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import * as Calender from 'expo-calendar';

class Reservation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guests: 1,
            smoking: false,
            date: ''
        }
    }

    static naviagtionOptions = {
        title: 'Reservation Table'
    }

    async obtainCalendarPermission() {
        let permission = await Permissions.getAsync(Permissions.CALENDAR);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.CALENDAR);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to calendar');
            }
        }
        return permission;
    }

    async addReservationToCalendar(date) {
        await this.obtainCalendarPermission();

        let dateMs = Date.parse(date);
        let startDate = new Date(dateMs);
        let endDate = new Date(dateMs + 2 * 60 * 60 * 1000);

        await Calendar.createEventAsync(Calendar.DEFAULT, {
            title: 'Con Fusion Table Reservation',
            startDate: startDate,
            endDate: endDate,
            timeZone: 'Asia/Hong_Kong',
            location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
        });
    }

    handleReservation() {
        const smoke = this.state.smoking ? 'yes' : 'No';
        console.log(JSON.stringify(this.state));
        Alert.alert(
            'Your Reservation Ok?',
            'Number of Guests: ' + this.state.guests +'\nSmoking? ' + smoke + '\ndate and Time: '+ this.state.date,
             [
                {
                    text: 'Cancel',
                    onPress: () => this.resetForm(),
                    style: 'cancel'
                },
                {
                    title: 'Ok',
                    onPress: () => {
                        this.presentLocalNotification(this.state.guests);
                        this.addReservationToCalendar(this.state.date);
                        this.resetForm();
                    }
                }
            ],
            { cancelable: false}
        )
    }

    resetForm() {
        this.setState ({
            guests: 1,
            smoking: false,
            date: ''
        });
    }

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        } 
        else {
            if (Platform.OS === 'android') {
                Notifications.createChannelAndroidAsync('notify', {
                    name: 'notify',
                    sound: true,
                    vibrate: true,
                });
            }
        }
        return permission;
    }

    async presentLocalNotification(guests) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation',
            body: `Reservation for ${guests} requested`,
            ios: {
                sound: true
            },
            android: {
                channelId: 'notify',
                color: '#512DA8'
            }
        });
    }


    render() {
        return(
            <ScrollView>
                <Animatable.View animation="zoomIn" duration={2000} delay={1000} useNativeDriver={true}>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>
                            Number of Guests
                        </Text>
                        <Picker
                            style={styles.formItem}
                            selectedValue={this.state.guests}
                            onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue}) }
                            >
                                <Picker.Item label='1' value='1' />
                                <Picker.Item label='2' value='2' />
                                <Picker.Item label='3' value='3' />
                                <Picker.Item label='4' value='4' />
                                <Picker.Item label='5' value='5' />
                                <Picker.Item label='6' value='6' />
                        </Picker>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>
                            Smoking / Non-Smoking?
                        </Text>
                        <Switch
                            style={styles.formItem}
                            value={this.state.smoking}
                            trackColor='#512DA8'
                            onValueChange={(value) => this.setState({smoking: value})}
                            >


                        </Switch>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>
                            Date and Time
                        </Text>
                        <DatePicker
                            style={{flex: 2, marginRight: 20}}
                            date={this.state.date}
                            format=''
                            mode="datetime"
                            placeholder="select date and Time"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                            }}
                            onDateChange={(date) => this.setState({date: date})}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Button
                            title='Reserve'
                            color='#512DA8'
                            onPress={() => this.handleReservation()}
                            accessibilityLabel='Learn more about this button'
                            />
                    </View>
                    
                </Animatable.View>
            </ScrollView>
        );

    }
}


const styles =  StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2,    
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
}); 

export default Reservation;