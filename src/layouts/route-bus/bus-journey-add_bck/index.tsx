import { TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { Button, Card, CheckBox, List, Divider,Input } from "@ui-kitten/components";
import React,{useState,useEffect,useReducer} from "react";
import { useRoute } from "@react-navigation/native"
import { StyleSheet, View , TextInput,Image, TouchableOpacity,Pressable, Text} from "react-native";
import { Stopping } from "./extra/data";
import AppStore from "../../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";
import { DayPicker } from '@routeslk/react-native-picker-weekday'
import { ScrollView } from 'react-native-virtualized-view';
import { TimerPickerModal } from "react-native-timer-picker";
import { LinearGradient } from "expo-linear-gradient";
import {
	MaterialIcons as MDIcon,
} from '@expo/vector-icons';
import { ArrowIosBackIcon } from "../../../components/icons";



const BusJourneyAdd = ({ navigation }): React.ReactElement => {

	const route = useRoute();

	const [data, setData] = useState([]);

	const [runningTime, setRunningTime ]= useState("");
	const [runningTimeHours, setDRunningTimeHours ]= useState(2);
	const [drunningTimeMinutes, setRunningTimeMinutes ]= useState(0);

	const [initialRunningTime, setInitialRunningTime] = useState
	({
		hours: 0,
		minutes: 0,
	});

	const [isRunningTimePickerVisible, setRunningTimePickerVisible] = useState(false);
	


	const [updated, setUpdated] = useState(false);

	const [distance, setDistance] = React.useState<string>("");
	const [distanceFocus, setDistanceFocus] = React.useState<boolean>(false);
	const distanceCustomStyle = distanceFocus ? styles.inputContainerFocus : styles.inputContainer;

	const [runningDays, setRunningDays] = React.useState([2,3,4,5,6])
	
	const appStore = useStore(AppStore);

	const [initialized, setInitialized] = React.useState(false);

	const [copyFromChecked, setCopyFromChecked] = React.useState(false);

	const [copyFromDisabled, setCopyFromDisabled] = React.useState(appStore.bus.journey.stoppings.length >0 );
	

	const onStoppingEditPress = (stopping,index): void => {
		navigation && navigation.navigate("BusStoppingEditScreen", {id: "stopping-edit", "journeyType": "Journey","returnRoute": "Journey", oldLatitude: stopping.latitude, oldLongitude: stopping.longitude, place: stopping.place, latitude: stopping.latitude, longitude: stopping.longitude, time: stopping.time, index: index});
	};


	const onStoppingAddPress = (): void => {
		appStore.bus.setJourneyRunningDays(runningDays.toString());
		navigation && navigation.navigate("BusStoppingAddScreen",{ "journeyType": "Journey"});
	};


	const onBackPress = (): void => {
		appStore.bus.setJourneyRunningDays(runningDays.toString());
		navigation && navigation.goBack();
	};

	const onCopyFromChecked = (): void => {
		setCopyFromChecked(!copyFromChecked);
		appStore.bus.stoppings.forEach(stopping => {
			console.log(">>"+stopping);
            appStore.bus.addJourneyStopping(stopping.place,stopping.latitude,stopping.longitude,"00.00 AM");
        });
		setCopyFromDisabled(true);
	};

	const onRunningTimePress = (): void => {
		setRunningTimePickerVisible(true);
	};

	
	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={onBackPress} />
	);

	

	useEffect(() => {
			if(initialized == false){
			  var journeyWorkdaysNumbers = appStore.bus.journey.runningDays.split(',').map(function(item) {
				return parseInt(item, 10);
			  });
			  setRunningDays(journeyWorkdaysNumbers);
			  console.log("##"+appStore.routeBus.journey.runningTime);
			  const hoursMatch = appStore.routeBus.journey.runningTime?.match(/(\d+)h/);
			  const minsMatch = appStore.routeBus.journey.runningTime?.match(/(\d+)mins/);

			  const hr = hoursMatch ? parseInt(hoursMatch[1]) : 0;
			  const min = minsMatch ? parseInt(minsMatch[1]) : 0;	
			  console.log("Hours:"+hr);			
			  console.log("Mins:"+min);			
			  setInitialRunningTime({ hours: hr, minutes:min});
									
			  setInitialized(true);
			}
		
	});


	return (
	
		<ScrollView>
			<DayPicker
						weekdays={runningDays}
						setWeekdays={setRunningDays}
						activeColor='#142169'
						textColor='white'
						inactiveColor='grey'
						/>
			<Card style={{ margin: 10, borderRadius:10}}>
			<View style={{ margin: 10}}>
								<View style={styles.labelContainer}>
									<Text style={styles.label}>Distance</Text>
								</View>
								<View style={distanceCustomStyle}>
									<TextInput placeholder="100" onChangeText={setDistance} value={distance} />
								</View>
							</View>
			</Card>
			<Card style={{ margin: 10, borderRadius:10}}>
				<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
					<Text style={{ padding: 5, paddingLeft: 10}}>Onbaord duration</Text>
					<View style={{backgroundColor: "#F1F1F1"}}>
						<Pressable onPress={() => onRunningTimePress()}>
						<View pointerEvents="none">
							<Input placeholder="Onboard duration..." value={appStore.routeBus.journey.runningTime}/>
						</View>
					</Pressable>
					
					</View>
					
					
				</View>
			</Card>

			<Card style={{ margin: 10, borderRadius:10}}>
				<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
					<Text style={{ padding: 5, paddingLeft: 10}}>Running Time</Text>
					<View style={{backgroundColor: "#F1F1F1"}}>
						<Pressable onPress={() => onRunningTimePress()}>
						<View pointerEvents="none">
							<Input placeholder="Running time..." value={appStore.routeBus.journey.runningTime}/>
						</View>
					</Pressable>
					
					</View>
					
					
				</View>
			</Card>
			

			<Card style={{ margin: 10, borderRadius:10}} onPress={() => navigation.navigate("RouteBusJourneyStoppingsList", {id: appStore.bus.id})}>
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Stoppings</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("BusReturnJourneyStoppings",{id: appStore.bus.id, latitude: appStore.bus.journey.stoppings[0].latitude,  longitude: appStore.bus.journey.stoppings[0].longitude})}/>
				</View>
			</Card>

			<Card style={{ margin: 10, borderRadius:10}} onPress={() => navigation.navigate("RouteBusJourneyTimetablesList", {id: appStore.routeBus.objectId})}>
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Timetables</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("RouteBusJourneyTimetablesList", {id: appStore.routeBus.objectId})}/>
				</View>
			</Card>

			<TimerPickerModal
						    visible={isRunningTimePickerVisible}
              				setIsVisible={setRunningTimePickerVisible}
							hideDays={true}
							hideSeconds
							LinearGradient={LinearGradient}
							minuteLabel="mins"
							initialValue={initialRunningTime}
							padWithNItems={1}
							hourLabel="h"
							onConfirm={(pickedDuration) => {
								console.log("pickedDuration::"+pickedDuration.minutes);
								setRunningTimePickerVisible(false);
								if(pickedDuration.hours > 0){
									setInitialRunningTime({ hours: pickedDuration.hours, minutes:pickedDuration.minutes});
									//setDuration(pickedDuration.hours.toString()+"h "+pickedDuration.minutes.toString()+"mins");
									appStore.routeBus.journey.setRunningTime(pickedDuration.hours.toString()+"h "+pickedDuration.minutes.toString()+"mins");
								}else{
									setInitialRunningTime({ hours: 0, minutes:pickedDuration.minutes});
									//setDuration(pickedDuration.minutes.toString()+" mins");
									//initialDuration.minutes=pickedDuration.minutes;
									appStore.routeBus.journey.setRunningTime(pickedDuration.minutes.toString()+" mins");
								}
							}}
							
							
							styles={{

								button:{
								  fontSize: 10,
								  fontWeight: "bold"
								},
								
								pickerLabel: {
									fontSize: 16,
									fontWeight: "600",
									color: "#888888",
								},
								
								pickerItem: {
									fontSize: 24,
									color: "#cccccc",
								},
								
								selectedPickerItem: {
									fontSize: 28,
									fontWeight: "bold",
									color: "#000000",
								}
							}}
						/>

			
		</ScrollView>
		
		
		
	);
};

const styles = StyleSheet.create({

	
	listContent: {
		paddingHorizontal: 32,
		paddingVertical: 8,
	},
	button: {
		marginVertical: 8,
	},

	item: {
		marginVertical: 8,
		marginHorizontal: 10
	},
	
	itemContent: {
		marginVertical: 8,
	},
	labelContainer: {
        backgroundColor: "white", // Same color as background
        alignSelf: "flex-start", // Have View be same width as Text inside
        paddingHorizontal: 3, // Amount of spacing between border and first/last letter
        marginStart: 10, // How far right do you want the label to start
        zIndex: 1, // Label must overlap border
        elevation: 1, // Needed for android
        shadowColor: "white", // Same as background color because elevation: 1 creates a shadow that we don't want
        position: "absolute", // Needed to be able to precisely overlap label with border
        top: -12, // Vertical position of label. Eyeball it to see where label intersects border.
    },
    inputContainer: {
		flex: 1,
		flexDirection: "row", 
		justifyContent: "space-between",
		borderColor: "#ddd",
        borderWidth: 1, // Create border
        borderRadius: 8, // Not needed. Just make it look nicer.
        padding: 8, // Also used to make it look nicer
        zIndex: 0, // Ensure border has z-index of 0
    },
	inputContainerFocus: {
		flex: 1,
		flexDirection: "row", 
		justifyContent: "space-between",
		borderColor: "#142169",
        borderWidth: 1, // Create border
        borderRadius: 8, // Not needed. Just make it look nicer.
        padding: 8, // Also used to make it look nicer
        zIndex: 0, // Ensure border has z-index of 0
    },

	itemContentIcon: {
		fontSize: 20,
		color: '#666',
	},
	label: {
		color:"#142169"
	}
	
});


export default observer(BusJourneyAdd);
