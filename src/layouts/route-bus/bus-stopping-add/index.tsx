import { TopNavigation, TopNavigationAction, Button, Card, Layout, List,  Select, IndexPath, SelectItem,Input } from "@ui-kitten/components";
import React,{useState,useEffect,useReducer} from "react";
import { ArrowIosBackIcon } from "../../../components/icons";

import { useRoute } from "@react-navigation/native"
import { StyleSheet, View , ScrollView,Text, TouchableOpacity,Pressable} from "react-native";
import { data } from "../../../scenes/libraries/data";
import AppStore from "../../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {noOfDays, noOfMinutes, noOfHours}  from "../../../app/routes-common";


import { TimerPickerModal } from "react-native-timer-picker";
import { LinearGradient } from "expo-linear-gradient";


import { format } from 'date-fns'
import { daysInWeek } from "date-fns/constants";


//export default inject("store")(observer(BusAddScreen));
const BusStoppingAdd = ({ navigation }): React.ReactElement => {

	const route = useRoute();
	//const [place, setPlace] = useState("");
	const [time, setTime ]= useState("");
	const [duration, setDuration ]= useState("");

	const [date, setDate ]= useState(new Date());
	const [place, setPlace] = useState("");
	const [latitude, setLatitude] = useState(7.183527);
	const [longitude, setLongitude] = useState(80.132246);
	const [index, setIndex] = useState(0);
	const [journeyType, setJourneyType] = useState("");
	const appStore = useStore(AppStore);

	const [initialized, setInitialized] = React.useState(false);

	const [locationErrorMessage, setLocationErrorMessage] = React.useState<string>("");

	const [timeErrorMessage, setTimeErrorMessage] = React.useState<string>("");

	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

	const [isDurationPickerVisible, setDurationPickerVisible] = useState(false);


	const [selectedDaysIndex, setSelectedDaysIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const selectedDays = noOfDays[selectedDaysIndex.row];
	const [durationNoOfDays, setDurationNoOfDays] = useState(noOfDays[0].value);

	const [selectedHoursIndex, setSelectedHoursIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const selectedHours = noOfHours[selectedHoursIndex.row];
	const [durationNoOfHours, setDurationNoOfHours] = useState(noOfHours[0].value);

	const [selectedMinutesIndex, setSelectedMinutesIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const selectedMinutes = noOfDays[selectedMinutesIndex.row];
	const [durationNoOfMinutes, setDurationNoOfMinutes] = useState(noOfMinutes[0].value);

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

	const isValidValues = (): any => {
		
		var inputValid =true;

		if(!place){
			setLocationErrorMessage("Location is mandatory");	
			inputValid =false;
		}

		
        return inputValid;
	}


	const handleTimeChange = (time, validTime) => {
		if (!validTime) return;
	
		setTime(time);
	  }
	  
	const handleConfirm = (date) => {
		//console.warn("A date has been picked: ", date);
		//setTime(date);
	//	var newdate  = new TZDate("2024-09-12T00:00:00Z", "Asia/Singapore");

		hideDatePicker();  
		//const timeZoneOffsetInMinutes = date.getTimezoneOffset();
		//console.log(">>"+timeZoneOffsetInMinutes);
  		//const utcTime = date.getTime() - (timeZoneOffsetInMinutes * 60000);
  		//const actualDate = new Date(utcTime); //setting the actual date on dateTimePicker renders the correct date on calendar.
		console.warn("A date has been actualDate: ", date);
		console.warn("A date has been actualDate: ", format(date, 'hh:mm a'));
		setTime(format(date, 'hh:mm a'));
		setDate(date);
		
	};

	useEffect(() => {
		if(initialized == false){
			if(route.params){
				if(route.params.id == "routebus-stopping"){
					setPlace(route.params.place);
					setLatitude(route.params.latitude);
					setLongitude(route.params.longitude);
					setDuration(route.params.duration);
					route.params.id="";
				}
				if(route.params.index)
					setIndex(route.params.index);
				setJourneyType(route.params.journeyType);	
				
			}
			const hoursMatch = appStore.routeBus.journey.duration?.match(/(\d+)h/);	
			const hr = hoursMatch ? parseInt(hoursMatch[1]) : 0;
			console.log("Hours:"+hr);	
			
			if(route.params?.duration != ""){
			  const hoursMatch = route.params?.duration?.match(/(\d+)h/);
			  const minsMatch = route.params?.duration?.match(/(\d+)mins/);

			  const hr = hoursMatch ? parseInt(hoursMatch[1]) : 0;
			  const min = minsMatch ? parseInt(minsMatch[1]) : 0;	
			
			  setInitialDuration({ hours: hr, minutes:min});

			}
				
			setDurationHourLimit({ max: hr, min:0});
			setInitialized(true);
		}
	});

	const reset = (): void => {
		setLatitude(7.183527);
		setLongitude(0.132246);
		setPlace(null);
		setTime(null);
	};

	const onSetStartLocationPress = (): void => {
		console.log("route.params.journeyType >>"+route.params.journeyType);
		navigation && navigation.navigate("LocationAdd", {id: "routebus-stopping", "journeyType": route.params.journeyType,latitude:latitude , longitude:longitude, placeName:place, returnroute: "RouteBusStoppingAddScreen" ,index: index , duration: duration});
	};

	const onDurationChange = (duration)  => () =>  {
		console.log("Duration:"+ duration.days+" days"+ duration.hours+" h"+duration.minutes+" mins");
	};

	const onNextStoppingPress = (): void => {
		console.log("Index::::"+index);
		if(isValidValues()){
			if(journeyType == "Journey"){
				if(index==0){
					appStore.bus.addJourneyStopping(place,latitude,longitude,time);	
				}else{
					appStore.bus.addJourneyStoppingAtIndex(place,latitude,longitude,index,time);
				}
			} else if(journeyType == "ReturnJourney"){
				if(index==0){
					appStore.bus.addReturnJourneyStopping(place,latitude,longitude,time);
				}else{
					appStore.bus.addReturnJourneyStoppingAtIndex(place,latitude,longitude,index,time);
				}
			}
			route.params.index=index+1;
			reset();
		}
		//setIndex(index+1)
		
		
	};

	

	const onSetDurationPress = (): void => {
		setDurationPickerVisible(true);
	};

	

	const onFinishPress = (): void => {
		if(isValidValues()){
			if(place !=null && journeyType == "RouteBusJourney"){
				if(index==0){
					appStore.routeBus.journey.addStopping(place,latitude.toString(),longitude.toString(),duration);
				}else{
					appStore.routeBus.journey.addStoppingAtIndex(place,latitude.toString(),longitude.toString(),index,duration);
				}
				console.log(JSON.stringify(appStore.routeBus));
				navigation.navigate("RouteBusJourneyStoppingsList");
			}else if(place !=null && journeyType == "RouteBusReturnJourney"){
				if(index==0){
					//appStore.routeBus.journey.addReturnJourneyStopping(place,latitude,longitude,time);
				}else{
					//appStore.routeBus.journey.addReturnJourneyStoppingAtIndex(place,latitude,longitude,index,time);
				}
				console.log(JSON.stringify(appStore.routeBus));
				navigation.navigate("RouteBusReturnJourneyList");
			}
		}	
	};

	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
	);

	const onNoOfDaysSelect = (index): void => {
		setSelectedDaysIndex(index);
		setDurationNoOfDays(noOfDays[index-1].value);
	};


	const renderOptionDays = (day): React.ReactElement => (
		<SelectItem key={day.key} title={evaProps => <View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
			<Text style={{ paddingHorizontal: 5}}>{day.value}</Text>
		</View>} />
	);

	const onNoOfHoursSelect = (index): void => {
		setSelectedHoursIndex(index);
		setDurationNoOfHours(noOfHours[index-1].value);
	};


	const renderOptionHours = (hour): React.ReactElement => (
		<SelectItem key={hour.key} title={evaProps => <View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
			<Text style={{ paddingHorizontal: 5}}>{hour.value}</Text>
		</View>} />
	);

	const onNoOfMinutesSelect = (index): void => {
		setSelectedMinutesIndex(index);
		setDurationNoOfMinutes(noOfMinutes[index-1].value);
	};


	const renderOptionMinutes = (minute): React.ReactElement => (
		<SelectItem key={minute.key} title={evaProps => <View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
			<Text style={{ paddingHorizontal: 5}}>{minute.value}</Text>
		</View>} />
	);

	

	

	return (
		
		<ScrollView>
			<TopNavigation title={props => (
				<Text style={{fontWeight: '500', fontSize: 18}}>
					Route Bus Add Stopping
				</Text>)} accessoryLeft={renderBackAction} />
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
				<Button style={styles.actionButton} onPress={()=>onNextStoppingPress()}>
				Next stopping
				</Button>
				<Button style={styles.actionButton} onPress={()=>onFinishPress()}>
				Finish
				</Button>
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
									setDuration(pickedDuration.hours.toString()+"h "+pickedDuration.minutes.toString()+"mins");
									setDuration(pickedDuration.minutes.toString()+" mins");
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
	actionButton: {
		flex: 2 , 
		margin: 10,
		borderRadius:50
	},
	item: {
		marginVertical: 8,
	},
	
	itemContent: {
		marginVertical: 8,
	},
	
});

//export default observer(BusJourneyAdd);
export default observer(BusStoppingAdd);
