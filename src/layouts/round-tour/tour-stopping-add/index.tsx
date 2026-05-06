import { TopNavigation, TopNavigationAction, Button, Card, IndexPath, Select, SelectItem,Input } from "@ui-kitten/components";
import React,{useState,useEffect,useReducer} from "react";
import { ArrowIosBackIcon } from "../../../components/icons";

import { useRoute } from "@react-navigation/native"
import { StyleSheet, View , ScrollView,Text, TextInput,Pressable} from "react-native";
import { data } from "../../../scenes/libraries/data";
import AppStore from "../../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { format } from 'date-fns'


//export default inject("store")(observer(BusAddScreen));
const TourStoppingAdd = ({ navigation }): React.ReactElement => {

	const route = useRoute();
	//const [place, setPlace] = useState("");
	//const [time, setTime ]= useState("");
	const [date, setDate ]= useState(new Date());
	//const [place, setPlace] = useState("");
	///const [latitude, setLatitude] = useState(7.183527);
	//const [longitude, setLongitude] = useState(80.132246);
	const [index, setIndex] = useState(0);
	//const [journeyType, setJourneyType] = useState("");
	const appStore = useStore(AppStore);

	const [locationErrorMessage, setLocationErrorMessage] = React.useState<string>("");

	const [timeErrorMessage, setTimeErrorMessage] = React.useState<string>("");

	const [titleErrorMessage, setTitleErrorMessage] = React.useState<string>("");

	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

	const [titleFocus, setTitleFocus] = React.useState<boolean>(false);
	const titleCustomStyle = titleFocus ? styles.inputContainerFocus : styles.inputContainer;

	const days = Array.from({ length: appStore.tour.noOfDays }, (_, i) => ({
		key: (i + 1).toString(),
		value: `${i + 1}`
	}));

	const [selectedDaysIndex, setSelectedDaysIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const selectedDays = days[selectedDaysIndex.row];

	 const waitingTime = [
		{key: "15 mins", value: "15 mins"},
		{key: "30 mins",value: "30 mins"},
		{key: "45 mins",value: "45 mins"},
		{key: "1 hour",value: "1 hour"},
		{key: "2 hours",value: "2 hours"},
		{key: "2 hours",value: "3 hour"},
		{key: "2 hours",value: "4 hours"}]

	const [selectedWaitingIndex, setSelectedWatingTimeIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const selectedWaitingTime = waitingTime[selectedWaitingIndex.row];


	const showDatePicker = () => {
		setDatePickerVisibility(true);
	};

	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};

	const renderOptionDays = (day): React.ReactElement => (
		<SelectItem key={day.key} title={evaProps => <View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
			<Text style={{ paddingHorizontal: 5}}>{day.value}</Text>
		</View>} />
	);

	const renderOptionWaitingTime = (waiting): React.ReactElement => (
		<SelectItem key={waiting.key} title={evaProps => <View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
			<Text style={{ paddingHorizontal: 5}}>{waiting.value}</Text>
		</View>} />
	);

	const onNoOfDaysSelect = (index): void => {
		console.log("Slected index:"+index);
		setSelectedDaysIndex(index);
		
		appStore.stopping.setDay(days[index-1].value);
	};

	const onWaitingTimeSelect = (index): void => {
		console.log("Slected index:"+index);
		setSelectedWatingTimeIndex(index);
		appStore.stopping.setWaitingTime(waitingTime[index-1].value);
	};

	const isValidValues = (): any => {
		
		var inputValid =true;

		
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
		//setTime(format(date, 'hh:mm a'));
		appStore.stopping.setTime(format(date, 'hh:mm a'));
		setDate(date);
		
	};

	useEffect(() => {
		if(route.params){
			if(route.params.id == "stopping"){
				appStore.stopping.setPlace(route.params.place);
				appStore.stopping.setLatitude(route.params.latitude);
				appStore.stopping.setLongitude(route.params.longitude);
				console.log(route.params.place+">>"+route.params.latitude+","+route.params.longitude);
				//setPlace(route.params.place);
				//setLatitude(route.params.latitude);
				//setLongitude(route.params.longitude);
				route.params.id="";
			}
			if(route.params.index)
				setIndex(route.params.index);
		}
	});

	const onTitleChange = (value): void => {
		if(value.length != 0){
			setTitleErrorMessage("");
		}
		appStore.stopping.setTitle(value);
	};


	const reset = (): void => {
		appStore.stopping.reset();
		//setLatitude(7.183527);
		//setLongitude(0.132246);
		//setPlace(null);
		//setTime(null);
	};

	const onSetStartLocationPress = (): void => {
		navigation && navigation.navigate("LocationAdd", {id: "stopping",latitude:appStore.stopping.latitude , longitude:appStore.stopping.longitude, placeName:appStore.stopping.place, returnroute: "TourStoppingAddScreen" ,index: index });
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

	const onSetTimePress = (): void => {
		setDatePickerVisibility(true);
	};

	const onFinishPress = (): void => {
		if(isValidValues()){
			if(appStore.stopping.place !=null || appStore.stopping.title !=null ){
				if(index==0){
					appStore.tour.addStopping(appStore.stopping.title,appStore.stopping.place,appStore.stopping.latitude,appStore.stopping.longitude,appStore.stopping.day,appStore.stopping.time,appStore.stopping.waitingTime);
				}else{
					appStore.tour.addStoppingAtIndex(appStore.stopping.title,appStore.stopping.place,appStore.stopping.latitude,appStore.stopping.longitude,appStore.stopping.day,appStore.stopping.time,appStore.stopping.waitingTime,index);
				}
				console.log(JSON.stringify(appStore.stopping));
				navigation.navigate("TourAdd");
			}
		}	
	};

	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
	);

	
	// add duration support
	// time is optional
	// duration for lunch would be enough Lunch (12.00 -2.00)
	// it is upto the operator to set fix place or 

	/*
title: types.optional(types.string, ""),   // Lunch, Start 2nd Day, End 1st Day
  remarks: types.optional(types.string, ""),   //
  place: types.optional(types.string, ""),
  latitude: types.optional(types.number, 0.0),
  longitude: types.optional(types.number, 0.0),
  plusDays: types.optional(types.number, 0.0),
  arrivalTime: types.string,
  departureTime: types.string,
  stayDuration: types.string

	*/

	return (
		
		<ScrollView>
			<TopNavigation title={props => (
				<Text style={{fontWeight: '500', fontSize: 18}}>
					Add Tour Stopping
				</Text>)} accessoryLeft={renderBackAction} />
				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Day</Text>
						<View style={{ margin: 10}}>
						<Select
							placeholder='Default'
							value={appStore.stopping.day}
							selectedIndex={selectedDaysIndex}
							onSelect={(index: IndexPath) => onNoOfDaysSelect(index)}>
							{days.map(renderOptionDays)}
						</Select>
					</View>
					</View>
				</View>
				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>Title</Text>
					</View>
					<View style={titleCustomStyle}>
						<TextInput style={styles.captionText} placeholder="Breakfast, Lunch, Safari ..." onChangeText={onTitleChange} value={appStore.bus.title} onFocus={() => setTitleFocus(true)} onBlur={() => setTitleFocus(false)} />
					</View>	
					{titleErrorMessage!="" && (
						<Text style={styles.errorLabel}>{titleErrorMessage}</Text>	
					)}
				</View>
				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Location</Text>
						<View style={{ margin: 10}}>
							<Pressable onPress={() => onSetStartLocationPress()}>
								<View pointerEvents="none">
									<Input placeholder="Location..." value={appStore.stopping.place}/>
								</View>
							</Pressable>
							{locationErrorMessage!="" && (
								<Text style={styles.errorLabel}>{locationErrorMessage}</Text>	
							)}
						</View>
					</View>
				</View>
				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Time</Text>
						<View style={{ margin: 10}}>
							<Pressable onPress={() => onSetTimePress()}>
								<View pointerEvents="none">
									<Input placeholder="Time..." value={appStore.stopping.time}/>
								</View>
							</Pressable>
							{timeErrorMessage!="" && (
								<Text style={styles.errorLabel}>{timeErrorMessage}</Text>	
							)}
						</View>
					</View>
				</View>

				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Waiting</Text>
						<View style={{ margin: 10}}>
						<Select
							placeholder='Default'
							value={appStore.stopping.waitingTime}
							selectedIndex={selectedWaitingIndex}
							onSelect={(index: IndexPath) => onWaitingTimeSelect(index)}>
							{waitingTime.map(renderOptionWaitingTime)}
						</Select>
					</View>
					</View>
				</View>

				
				
			
			<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
				<Button style={styles.actionButton} onPress={()=>onNextStoppingPress()}>
				Next stopping
				</Button>
				<Button style={styles.actionButton} onPress={()=>onFinishPress()}>
				Finish
				</Button>
			</View>
			<DateTimePickerModal
				isVisible={isDatePickerVisible}
				date={date}
				mode="time"
				timeZoneName={'Asia/Colombo'} 
				onConfirm={handleConfirm}
				onCancel={hideDatePicker}/>	
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
	captionText: {
		fontFamily: 'opensans-regular',
		color: '#333',
		flex: 1 
	},
});

//export default observer(BusJourneyAdd);
export default observer(TourStoppingAdd);


