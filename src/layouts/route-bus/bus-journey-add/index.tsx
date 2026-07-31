import { Button, Card, Text,Input } from "@ui-kitten/components";
import React,{useRef,useState} from "react";
import { StyleSheet, View, Pressable, TextInput,ScrollView} from "react-native";
import AppStore from "../../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute } from "@react-navigation/native"
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TimerPickerModal } from "react-native-timer-picker";

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

	const [isRunningTimePickerVisible, setRunningTimePickerVisible] = useState(false);
		

	const [defaultDate, setDefaultDate] = React.useState<Date>(new Date());

	const refRBSheetEdit = useRef();

	const [initialRunningTime, setInitialRunningTime] = useState
		({
			hours: 0,
			minutes: 0,
		});
	

	

	const onSetOnboardStartPress = (): void => {
		setDatePickerVisible(true);
	};

	

	const handleEditModeConfirm = (date) => {	
		setDatePickerVisible(false);
		console.warn("A date has been actualDate: ", date);
		if(route.params?.journeyType == "RouteBusReturnJourney"){
			appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex].updateOnboardStartTime(format(date, 'HH:mm'));
		}else if(route.params?.journeyType == "RouteBusJourney"){
			appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].updateOnboardStartTime(format(date, 'HH:mm'));
		}
	};


	const hideEditModeDatePicker = () => {
		setDatePickerVisible(false);
	}

	const onRunningTimePress = (): void => {
		setRunningTimePickerVisible(true);
	};

	
	// navigation && navigation.navigate("RouteBusJourneyTurnEdit",{ "timetableIndex": timetable_index, "turnIndex": index});
	
	return (
		
		<ScrollView>


			

			<Card style={{ margin: 10, borderRadius:10}} onPress={() => navigation.navigate("RouteBusJourneyStoppingsList", {id: appStore.bus.id, journeyType: route.params?.journeyType})}>
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Stoppings</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("RouteBusJourneyStoppingsList",{id: appStore.bus.id,journeyType: route.params?.journeyType})}/>
				</View>
			</Card>

			<Card style={{ margin: 10, borderRadius:10}} onPress={() => navigation.navigate("RouteBusJourneyTimetablesList", {id: appStore.routeBus.id,journeyType: route.params?.journeyType})}>
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Timetables</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("RouteBusJourneyTimetablesList", {id: appStore.routeBus.id, journeyType: route.params?.journeyType})}/>
				</View>
			</Card>

				
			

			<DateTimePickerModal
							isVisible={isDatePickerVisible}
							mode="time"
							date={defaultDate} 
							timeZoneName={'Asia/Colombo'} 
							onConfirm={handleEditModeConfirm}
							onCancel={hideEditModeDatePicker}/>	
			
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
									if(route.params?.journeyType == "RouteBusJourney"){
										appStore.routeBus.journey.setRunningTime(pickedDuration.hours.toString()+"h "+pickedDuration.minutes.toString()+"mins");
									}
									else if(route.params?.journeyType == "RouteBusReturnJourney"){
										appStore.routeBus.returnJourney.setRunningTime(pickedDuration.hours.toString()+"h "+pickedDuration.minutes.toString()+"mins");
									}
								}else{
									setInitialRunningTime({ hours: 0, minutes:pickedDuration.minutes});
									//setDuration(pickedDuration.minutes.toString()+" mins");
									//initialDuration.minutes=pickedDuration.minutes;
									
									if(route.params?.journeyType == "RouteBusJourney"){
										appStore.routeBus.journey.setRunningTime(pickedDuration.minutes.toString()+" mins");
									}
									else if(route.params?.journeyType == "RouteBusReturnJourney"){
										appStore.routeBus.returnJourney.setRunningTime(pickedDuration.minutes.toString()+" mins");
									}
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
