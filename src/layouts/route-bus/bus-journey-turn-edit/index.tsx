import { Button, Card, Text,Input } from "@ui-kitten/components";
import React,{useRef,useState} from "react";
import { StyleSheet, View, Pressable, TextInput,ScrollView} from "react-native";
import AppStore from "../../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";
import { toJS } from "mobx";
import { useRoute } from "@react-navigation/native"
import DateTimePickerModal from "react-native-modal-datetime-picker";

import {
	MaterialIcons as MDIcon
} from '@expo/vector-icons';
import { format } from 'date-fns';


export default observer(React.forwardRef(({ navigation,addCallback, add },ref) => {
	const route = useRoute();

	const appStore = useStore(AppStore);

	//const [runningNo, setRunningNo ]= useState("");
	const [runningNoFocus, setRunningNoFocus] = React.useState<boolean>(false);
	const runningNoCustomStyle = runningNoFocus ? styles.inputContainerFocus : styles.inputContainer;
	
	const [isDatePickerVisible, setDatePickerVisible] = useState(false);

	const [allowedBusIndex, setAllowedBusIndex] = React.useState<number>(-1);
	
	const refRBSheetActions = useRef();
	
	const refRBSheetDeleteConfirm = useRef();

	const [defaultDate, setDefaultDate] = React.useState<Date>(new Date());

	const refRBSheetEdit = useRef();

	const onSetOnboardStartPress = (): void => {
		setDatePickerVisible(true);
	};

	

	const handleEditModeConfirm = (date) => {	
		setDatePickerVisible(false);
		console.warn("A date has been actualDate: ", date);
		appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].updateOnboardStartTime(format(date, 'HH:mm'));
	};


	const hideEditModeDatePicker = () => {
		setDatePickerVisible(false);
	}

	const onNavigateToAllowedBuses = (): void => {
		navigation.navigate("RouteBusAllowedBusesList", {timetableIndex: route.params.timetableIndex, turnIndex: route.params.turnIndex, "journeyType": route.params?.journeyType})
	};

	const onNavigateToStoppingTimes = (): void => {
		if(route.params.journeyType == "RouteBusJourney"){
			navigation.navigate("RouteBusJourneyTurnCustomDurationsList",{timetableIndex: route.params.timetableIndex, turnIndex: route.params.turnIndex, "journeyType": route.params?.journeyType})
		}else if(route.params.journeyType == "RouteBusReturnJourney"){
			navigation.navigate("RouteBusReturnJourneyTurnCustomDurationsList",{timetableIndex: route.params.timetableIndex, turnIndex: route.params.turnIndex, "journeyType": route.params?.journeyType})
		}
	};


	


	
	// navigation && navigation.navigate("RouteBusJourneyTurnEdit",{ "timetableIndex": timetable_index, "turnIndex": index});
	
	return (
		
		<ScrollView>

				
			
			<View>
				 <Card style={{ margin: 10, borderRadius:10}}>
				<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
					<Text style={{ padding: 5, paddingLeft: 10}}>Start</Text>
					<View style={{backgroundColor: "#F1F1F1"}}>
						<Pressable>
						<View pointerEvents="none">
							{route.params?.journeyType == "RouteBusJourney" && (
							<Input placeholder="Start time..." value={appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].startTime}/>
							)}
							{route.params?.journeyType == "RouteBusReturnJourney" && (
							<Input placeholder="Start time..." value={appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex].startTime}/>
							)}
						</View>
					</Pressable>
					</View>
				</View>
			</Card>

			<Card style={{ margin: 10, borderRadius:10}}>
				<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
					<Text style={{ padding: 5, paddingLeft: 10}}>Onboard Start</Text>
					<View style={{backgroundColor: "#F1F1F1"}}>
						<Pressable onPress={() => onSetOnboardStartPress()}>
						<View pointerEvents="none">
							{route.params?.journeyType == "RouteBusJourney" && (
							<Input placeholder="Onboard start time..." value={appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].onboardStartTime}/>
							)}
							{route.params?.journeyType == "RouteBusReturnJourney" && (
							<Input placeholder="Onboard start time..." value={appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex].onboardStartTime}/>
							)}
						</View>
					</Pressable>
					</View>
				</View>
			</Card>

				
			<View style={{ margin: 10}}>
				<View style={styles.labelContainer}>
					<Text style={styles.label}>Running No</Text>
				</View>
				<View style={runningNoCustomStyle}>
					
					{route.params?.journeyType == "RouteBusJourney" && (
					<TextInput placeholder="KDW1" onChangeText={appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].setRunningNo} value={appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].runningNo} />
					)}
					{route.params?.journeyType == "RouteBusReturnJourney" && (
					<TextInput placeholder="KDW1" onChangeText={appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex].setRunningNo} value={appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex].runningNo} />
					)}
				</View>
			</View>

			<Card style={{ margin: 10, borderRadius:10}}>
				<Text style={{ padding: 5, paddingLeft: 10}}>Assigned Bus</Text>
				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>Reg. No</Text>
					</View>
					<View style={runningNoCustomStyle}>
						{route.params?.journeyType == "RouteBusJourney" && (
						<TextInput placeholder="NB-2323" onChangeText={appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].setRegistrationNo} value={appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].registrationNo} />
						)}
						{route.params?.journeyType == "RouteBusReturnJourney" && (
						<TextInput placeholder="NB-2323" onChangeText={appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex].setRegistrationNo} value={appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex].registrationNo} />
						)}
						
					</View>
				</View>
				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>License No</Text>
					</View>
					<View style={runningNoCustomStyle}>
						{route.params?.journeyType == "RouteBusJourney" && (
						<TextInput placeholder="12345" onChangeText={appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].setLicenseNo} value={appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].licenseNo} />
						)}
						{route.params?.journeyType == "RouteBusReturnJourney" && (
						<TextInput placeholder="12345" onChangeText={appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex].setLicenseNo} value={appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex].licenseNo} />
						)}
						
					</View>
				</View>
			</Card>

			<Card style={{ margin: 10, borderRadius:10}} onPress={onNavigateToAllowedBuses}>
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Either Buses</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={onNavigateToAllowedBuses}/>
				</View>
			</Card>

			<Card style={{ margin: 10, borderRadius:10}} onPress={onNavigateToStoppingTimes}>
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Stopping Times</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={onNavigateToStoppingTimes}/>
				</View>
			</Card>
				
			</View>

			<DateTimePickerModal
							isVisible={isDatePickerVisible}
							mode="time"
							date={defaultDate} 
							timeZoneName={'Asia/Colombo'} 
							onConfirm={handleEditModeConfirm}
							onCancel={hideEditModeDatePicker}/>	


		

			
		</ScrollView>
		
		
		
	);
}));

const styles = StyleSheet.create({
	listContent: {
		paddingHorizontal: 32,
		paddingVertical: 8,
	},
	listContainer: {
		flex: 1,
		padding: 25,
	},
	button: {
		marginVertical: 8,
	},
	listButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 10,
	},
		listLabel: {
		fontSize: 16,
	},
	errorLabel: {
		color: "#8B0000", 
		fontSize:12,
		padding: 10
	},
	captionText: {
		fontFamily: 'opensans-regular',
		color: '#333',
		flex: 1 
	},
	label: {
		color:"#142169"
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
	item: {
		marginVertical: 8,
		marginHorizontal: 10
	},
	itemHeader: {
		fontWeight: "500",
		fontSize: 18
	},
	listIconDelete: {
		fontSize: 26,
		color: '#710e07',
		width: 60,
	},
	listIconEdit: {
		fontSize: 26,
		color: '#6a5703',
		width: 60,
	},

	itemSelected: {
		marginVertical: 8,
		marginHorizontal: 10,
		borderWidth: 1,
		borderColor: "#aaa"
	},
	itemContentIcon: {
		fontSize: 20,
		color: '#666',
	}
	
});
