import { TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { Button, Card, CheckBox, List, Divider,Input } from "@ui-kitten/components";
import React,{useState,useEffect,useMemo} from "react";
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

	const [runningNo, setRunningNo ]= useState("");
	const [durationHours, setDurationHours ]= useState(2);
	const [durationMinutes, setDurationMinutes ]= useState(0);

	const [initialDuration, setInitialDuration] = useState
	({
		hours: 0,
		minutes: 0,
	});

	const [isDurationPickerVisible, setDurationPickerVisible] = useState(false);
	


	const [updated, setUpdated] = useState(false);

	const [runningDays, setRunningDays] = React.useState([2,3,4,5,6])
	
	const appStore = useStore(AppStore);

	const [initialized, setInitialized] = React.useState(false);

	const [runningNoFocus, setRunningNoFocus] = React.useState<boolean>(false);
	const runningNoCustomStyle = runningNoFocus ? styles.inputContainerFocus : styles.inputContainer;

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

	const onSetDurationPress = (): void => {
		setDurationPickerVisible(true);
	};

	
	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={onBackPress} />
	);

	
/*
	useEffectbck(() => {
			if(initialized == false){
			  var journeyWorkdaysNumbers = appStore.bus.journey.runningDays.split(',').map(function(item) {
				return parseInt(item, 10);
			  });
			//  setRunningDays(journeyWorkdaysNumbers);
			  console.log("##"+appStore.routeBus.journey.duration);
			  const hoursMatch = appStore.routeBus.journey.duration?.match(/(\d+)h/);
			  const minsMatch = appStore.routeBus.journey.duration?.match(/(\d+)mins/);

			  const hr = hoursMatch ? parseInt(hoursMatch[1]) : 0;
			  const min = minsMatch ? parseInt(minsMatch[1]) : 0;	
			  console.log("Hours:"+hr);			
			  console.log("Mins:"+min);			
			  setInitialDuration({ hours: hr, minutes:min});
									
			  setInitialized(true);
			}
			console.log("timetableIndex:"+route.params.timetableIndex+" turnIndex:"+route.params.turnIndex);

			//console.log("route.params.latitude:"+route.params.latitude);
		
	});
	*/

	

	const runningNoCustomStyle1 = useMemo(() => ({
			borderColor:'red',
			borderWidth: 1
		}), []);


	return (
	
		<ScrollView>
			
			
			<Card style={{ margin: 10, borderRadius:10}}>
				<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
					<Text style={{ padding: 5, paddingLeft: 10}}>Start</Text>
					<View style={{backgroundColor: "#F1F1F1"}}>
						<Pressable onPress={() => onSetDurationPress()}>
						<View pointerEvents="none">
							<Input placeholder="Start time..." value={appStore.routeBus.journey.duration}/>
						</View>
					</Pressable>
					</View>
				</View>
			</Card>

			<Card style={{ margin: 10, borderRadius:10}}>
				<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
					<Text style={{ padding: 5, paddingLeft: 10}}>Onboard Start</Text>
					<View style={{backgroundColor: "#F1F1F1"}}>
						<Pressable onPress={() => onSetDurationPress()}>
						<View pointerEvents="none">
							<Input placeholder="Onboard start time..." value={appStore.routeBus.journey.duration}/>
						</View>
					</Pressable>
					</View>
				</View>
			</Card>

			

			<View style={{ margin: 10}}>
				<View style={styles.labelContainer}>
					<Text style={styles.label}>Running No</Text>
				</View>
				<View>
					<TextInput placeholder="NB-2222" onChangeText={setRunningNo} value={runningNo} />
				</View>
			</View>
			

			<Card style={{ margin: 10, borderRadius:10}} onPress={() => navigation.navigate("RouteBusJourneyTurnCustomDurationsList", {timetableIndex: route.params.timetableIndex, turnIndex: route.params.turnIndex})}>
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Stopping Times</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("RouteBusJourneyTurnCustomDurationsList",{timetableIndex: route.params.timetableIndex, turnIndex: route.params.turnIndex})}/>
				</View>
			</Card>

			<Card style={{ margin: 10, borderRadius:10}} onPress={() => navigation.navigate("RouteBusJourneyTimetablesList", {id: appStore.routeBus.objectId})}>
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Assigned Busses</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("RouteBusJourneyTimetablesList", {id: appStore.routeBus.objectId})}/>
				</View>
			</Card>

			<TimerPickerModal
						    visible={isDurationPickerVisible}
              				setIsVisible={setDurationPickerVisible}
							hideDays={true}
							hideSeconds
							LinearGradient={LinearGradient}
							minuteLabel="mins"
							initialValue={initialDuration}
							padWithNItems={1}
							hourLabel="h"
							onConfirm={(pickedDuration) => {
								console.log("pickedDuration::"+pickedDuration.minutes);
								setDurationPickerVisible(false);
								if(pickedDuration.hours > 0){
									setInitialDuration({ hours: pickedDuration.hours, minutes:pickedDuration.minutes});
									//setDuration(pickedDuration.hours.toString()+"h "+pickedDuration.minutes.toString()+"mins");
									appStore.routeBus.journey.setDuration(pickedDuration.hours.toString()+"h "+pickedDuration.minutes.toString()+"mins");
								}else{
									setInitialDuration({ hours: 0, minutes:pickedDuration.minutes});
									//setDuration(pickedDuration.minutes.toString()+" mins");
									//initialDuration.minutes=pickedDuration.minutes;
									appStore.routeBus.journey.setDuration(pickedDuration.minutes.toString()+" mins");
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

	itemContentIcon: {
		fontSize: 20,
		color: '#666',
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
	
});


export default observer(BusJourneyAdd);
