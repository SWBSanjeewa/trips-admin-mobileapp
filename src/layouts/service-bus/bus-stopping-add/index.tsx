import { TopNavigation, TopNavigationAction, Button, Card, Layout, List, Divider,Input } from "@ui-kitten/components";
import React,{useState,useEffect,useReducer} from "react";
import { ArrowIosBackIcon } from "../../../components/icons";

import { useRoute } from "@react-navigation/native"
import { StyleSheet, View , ScrollView,Text, TouchableOpacity,Pressable} from "react-native";
import { data } from "../../../scenes/libraries/data";
import AppStore from "../../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { format } from 'date-fns'


//export default inject("store")(observer(BusAddScreen));
const BusStoppingAdd = ({ navigation }): React.ReactElement => {

	const route = useRoute();
	//const [place, setPlace] = useState("");
	const [time, setTime ]= useState("");
	const [date, setDate ]= useState(new Date());
	const [place, setPlace] = useState("");
	const [latitude, setLatitude] = useState(7.183527);
	const [longitude, setLongitude] = useState(80.132246);
	const [index, setIndex] = useState(0);
	const [journeyType, setJourneyType] = useState("");
	const appStore = useStore(AppStore);

	const [locationErrorMessage, setLocationErrorMessage] = React.useState<string>("");

	const [timeErrorMessage, setTimeErrorMessage] = React.useState<string>("");

	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

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

		if(!time){
			setTimeErrorMessage("Time is mandatory");	
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
		if(route.params){
			if(route.params.id == "stopping"){
				setPlace(route.params.place);
				setLatitude(route.params.latitude);
				setLongitude(route.params.longitude);
				route.params.id="";
			}
			if(route.params.index)
				setIndex(route.params.index);
			setJourneyType(route.params.journeyType);
			
			
		}
	});

	const reset = (): void => {
		setLatitude(7.183527);
		setLongitude(0.132246);
		setPlace(null);
		setTime(null);
	};

	const onSetStartLocationPress = (): void => {
		navigation && navigation.navigate("LocationAdd", {id: "stopping", "journeyType": route.params.journeyType,latitude:latitude , longitude:longitude, placeName:place, returnroute: "BusStoppingAddScreen" ,index: index });
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
			if(place !=null && journeyType == "Journey"){
				if(index==0){
					appStore.bus.addJourneyStopping(place,latitude,longitude,time);
				}else{
					appStore.bus.addJourneyStoppingAtIndex(place,latitude,longitude,index,time);
				}
				console.log(JSON.stringify(appStore.bus));
				navigation.navigate("BusJourneyList");
			}else if(place !=null && journeyType == "ReturnJourney"){
				if(index==0){
					appStore.bus.addReturnJourneyStopping(place,latitude,longitude,time);
				}else{
					appStore.bus.addReturnJourneyStoppingAtIndex(place,latitude,longitude,index,time);
				}
				console.log(JSON.stringify(appStore.bus));
				navigation.navigate("BusReturnJourneyList");
			}
		}	
	};

	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
	);

	

	

	return (
		
		<ScrollView>
			<TopNavigation title={props => (
				<Text style={{fontWeight: '500', fontSize: 18}}>
					Add Stopping
				</Text>)} accessoryLeft={renderBackAction} />
			<Card style={styles.item}	>
				<View>
					<Pressable onPress={() => onSetStartLocationPress()}>
						<View pointerEvents="none">
							<Input placeholder="Location..." value={place}/>
						</View>
					</Pressable>
					{locationErrorMessage!="" && (
						<Text style={styles.errorLabel}>{locationErrorMessage}</Text>	
					)}
					<Pressable onPress={() => onSetTimePress()}>
						<View pointerEvents="none">
							<Input placeholder="Time..." value={time}/>
						</View>
					</Pressable>
					{timeErrorMessage!="" && (
						<Text style={styles.errorLabel}>{timeErrorMessage}</Text>	
					)}
					
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
	
});

//export default observer(BusJourneyAdd);
export default observer(BusStoppingAdd);
