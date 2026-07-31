import { TopNavigation, TopNavigationAction, Button, Card, Layout, List, Divider,Input, Text } from "@ui-kitten/components";
import React,{useState,useEffect,useReducer} from "react";
import { ArrowIosBackIcon } from "../../../components/icons";

import { useRoute } from "@react-navigation/native"
import { StyleSheet, View , ScrollView,Image, TouchableOpacity,Pressable} from "react-native";
import AppStore from "../../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";

import { TimerPickerModal } from "react-native-timer-picker";
import { LinearGradient } from "expo-linear-gradient";

const BusStoppingEdit = ({ navigation }): React.ReactElement => {

	const route = useRoute();
	const [place, setPlace] = useState("");
	const [oldLatitude, setOldLatitude] = useState("");
	const [oldLongitude, setOldLongitude] = useState("");
	const [latitude, setLatitude] = useState(0);
	const [longitude, setLongitude] = useState(0);
	const [duration, setDuration] = useState("");
	const [time, setTime] = useState("");
	const [date, setDate ]= useState(new Date());
	const [initialized, setInitialized] = useState(false);

	const [isDurationPickerVisible, setDurationPickerVisible] = useState(false);

	const [locationErrorMessage, setLocationErrorMessage] = React.useState<string>("");

	const [timeErrorMessage, setTimeErrorMessage] = React.useState<string>("");

	const appStore = useStore(AppStore);

	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

	const [durationHourLimit, setDurationHourLimit] = useState
			({
				max: 24,
				min: 0,
			});
	
		const [initialDuration, setInitialDuration] = useState
			({
				hours: 0,
				minutes: 0,
			});

	const showDatePicker = () => {
		setDatePickerVisibility(true);
	};

	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};


	const handleTimeChange = (time, validTime) => {
		if (!validTime) return;
	
		setTime(time);
	}

	const isValidValues = (): any => {
		
		var inputValid =true;

		if(!place){
			setLocationErrorMessage("Location is mandatory");	
			inputValid =false;
		}

		
        return inputValid;
	}
	  
	

	
	useEffect(() => {
		console.log("###"+route.params.id);
		
		if(initialized==false){	
			if(route.params.id == "routebus-stopping-edit"){	
				setPlace(route.params.place);
				setOldLatitude(route.params.oldLatitude);
				setOldLongitude(route.params.oldLongitude);
				setLatitude(route.params.latitude);
				setLongitude(route.params.longitude);	
				setDuration(route.params.duration);
				console.log("## "+route.params.place+","+route.params.latitude+","+route.params.longitude, route.params.duration);

				if(route.params?.duration != ""){
					console.log(">>>>"+route.params?.duration);
					const hoursMatch = route.params?.duration?.match(/(\d+)h/);
					const minsMatch = route.params?.duration?.match(/(\d+) mins/);
					console.log(">>"+minsMatch);
					const hr = hoursMatch ? parseInt(hoursMatch[1]) : 0;
					const min = minsMatch ? parseInt(minsMatch[1]) : 0;	
					console.log("Setting initial values:"+min);
					setInitialDuration({ hours: hr, minutes:min});
					console.log("#####"+appStore.routeBus.runningTime);
					
					const hoursMatchMax = appStore.routeBus.runningTime?.match(/(\d+)h/);
					
					
					const hrMax = hoursMatchMax ? parseInt(hoursMatchMax[1]) : 0;
					setDurationHourLimit({ max: hrMax, min:0});

				}
						
					
			    }
			//setTime(route.params.time);
			//setDate(timeFrom12hto24h(route.params.time));
			setInitialized(true);
		}		
	});

	const onSetStartLocationPress = (): void => {
		console.log("## onSetStartLocationPress"+route.params);
		console.log("journeyType: "+route.params.journeyType+" latitude:"+latitude+" , longitude:"+longitude+", placeName:"+place+",  oldLatitude: "+oldLatitude+", oldLongitude: "+oldLongitude+", time:"+ time+", returnroute: BusStoppingEditScreen , parentReturnRoute: "+route.params?.returnRoute);
		// navigation && navigation.navigate("LocationAdd", {id: "stopping", "journeyType": route.params.journeyType,latitude:latitude , longitude:longitude, placeName:place, returnroute: "BusStoppingAddScreen" });
		navigation && navigation.navigate("LocationAdd", {id: "routebus-stopping-edit","journeyType": route.params.journeyType ,latitude:latitude , longitude:longitude, placeName:place,  oldLatitude: oldLatitude, oldLongitude: oldLongitude, time: time, returnroute: "RouteBusStoppingEditScreen", parentReturnRoute: route.params.returnRoute, duration: duration});
	};

	const onUpdatePress = (): void => {
		if(isValidValues()){
			if(route.params.journeyType == "RouteBusJourney"){
				appStore.routeBus.journey.updateStopping(oldLatitude, oldLongitude, place,latitude.toString(),longitude.toString(),duration);
				navigation.navigate('RouteBusJourneyStoppingsList',{"journeyType": route.params.journeyType});
			} else if(route.params.journeyType == "RouteBusReturnJourney"){
				appStore.routeBus.returnJourney.updateStopping(oldLatitude, oldLongitude, place,latitude.toString(),longitude.toString(),duration);
				navigation.navigate('RouteBusJourneyStoppingsList',{"journeyType": route.params.journeyType});
			}
		}
	};

	const onAddStoppingPress = (): void => {
		console.log("Index :::"+route.params.index);
		navigation && navigation.navigate("RouteBusStoppingAddScreen",{ "index": route.params.index+1, "journeyType": route.params.journeyType});
	}

	const onStoppingDeletePress = (): void => {
		if(route.params.journeyType == "RouteBusJourney"){
			appStore.routeBus.journey.deleteStoppingById(oldLatitude,oldLongitude);
			navigation.navigate('RouteBusJourneyStoppingsList',{"journeyType": route.params.journeyType});
		} else if(route.params.journeyType == "RouteBusReturnJourney"){
			appStore.routeBus.returnJourney.deleteStoppingById(oldLatitude,oldLongitude);
			navigation.navigate('RouteBusJourneyStoppingsList',{"journeyType": route.params.journeyType});
		}
	};

	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
	);

	const onSetDurationPress = (): void => {
		setDurationPickerVisible(true);
	};

	return (
		
		<ScrollView>
			{route.params?.journeyType == "RouteBusReturnJourney" && (
				<TopNavigation accessoryLeft={renderBackAction} title="Route Bus Edit Return Stopping"/>
			)}
			{route.params?.journeyType == "RouteBusJourney" && (
				<TopNavigation accessoryLeft={renderBackAction} title="Route Bus Edit Stopping"/>
			)}
			

			
			<Card style={{ margin: 5}}>
			
							<View style={{   marginVertical:10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
							<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
								<Text style={{ padding: 5, paddingLeft: 10}}>Location</Text>
								<View style={{backgroundColor: "#F1F1F1"}}>
									<Pressable onPress={() => onSetStartLocationPress()}>
									<View pointerEvents="none">
										<Input placeholder="Location..." value={place}/>
									</View>
								</Pressable>
								{locationErrorMessage!="" && (
									<Text style={styles.errorLabel}>{locationErrorMessage}</Text>	
								)}
								</View>
								
							</View>
						</View>
			
							
							<View style={{   marginVertical:10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
							<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
								<Text style={{ padding: 5, paddingLeft: 10}}>Duration</Text>
								<View style={{backgroundColor: "#F1F1F1"}}>
									<Pressable onPress={() => onSetDurationPress()}>
									<View pointerEvents="none">
										<Input placeholder="Duration from start..." value={duration}/>
									</View>
								</Pressable>
								
								</View>
								
								
							</View>
						</View>
							
						</Card>
			<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
				<Button style={{ flex: 3 , margin: 5, backgroundColor: "#D69200" , borderRadius:50, margin: 10, borderColor: "#D69200" }} onPress={()=>onUpdatePress()} >Update</Button>
				<Button style={{ flex: 3 , margin: 5, borderRadius:50, margin: 10}} onPress={()=>onAddStoppingPress()} >Add Next</Button>
				<Button style={{ flex: 3 , margin: 5, backgroundColor: "#B12048", borderRadius:50, margin: 10, borderColor: "#B12048"}} onPress={()=>onStoppingDeletePress()}>Delete</Button>
			</View>

			
						<TimerPickerModal
						    visible={isDurationPickerVisible}
              				setIsVisible={setDurationPickerVisible}
							hideDays={true}
							hideSeconds
							LinearGradient={LinearGradient}
							hourLimit={durationHourLimit}
							minuteLabel="mins"
							initialValue={initialDuration}
							padWithNItems={1}
							hourLabel="h"
							onConfirm={(pickedDuration) => {
								console.log("pickedDuration::"+pickedDuration.minutes);
								setDurationPickerVisible(false);
								if(pickedDuration.hours > 0){
									setInitialDuration({ hours: pickedDuration.hours, minutes:pickedDuration.minutes});
									setDuration(pickedDuration.hours.toString()+"h "+pickedDuration.minutes.toString()+"mins");
								}else{
									setInitialDuration({ hours: 0, minutes:pickedDuration.minutes});
									setDuration(pickedDuration.minutes.toString()+"mins");
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
	errorLabel: {
		color: "#8B0000", 
		fontSize:12,
		padding: 10
	},
	parentContainer: {
		flex: 1,
		flexDirection: "row",
		
	},
	listContent: {
		paddingHorizontal: 32,
		paddingVertical: 8,
	},
	nextButton: {
		marginVertical: 8,
	},

	item: {
		marginVertical: 8,
	},
	
	itemContent: {
		marginVertical: 8,
	},
	
});

//export default observer(BusJourneyAdd);
export default observer(BusStoppingEdit);
