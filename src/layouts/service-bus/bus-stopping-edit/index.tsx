import { TopNavigation, TopNavigationAction, Button, Card, Layout, List, Divider,Input, Text } from "@ui-kitten/components";
import React,{useState,useEffect,useReducer} from "react";
import { ArrowIosBackIcon } from "../../../components/icons";

import { useRoute } from "@react-navigation/native"
import { StyleSheet, View , ScrollView,Image, TouchableOpacity,Pressable} from "react-native";
import AppStore from "../../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";
import { showMessage } from "react-native-flash-message";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from 'date-fns'

const BusStoppingEdit = ({ navigation }): React.ReactElement => {

	const route = useRoute();
	const [place, setPlace] = useState("");
	const [oldLatitude, setOldLatitude] = useState("");
	const [oldLongitude, setOldLongitude] = useState("");
	const [latitude, setLatitude] = useState(0);
	const [longitude, setLongitude] = useState(0);
	const [time, setTime] = useState("");
	const [date, setDate ]= useState(new Date());
	const [initialized, setInitialized] = useState(false);

	const [locationErrorMessage, setLocationErrorMessage] = React.useState<string>("");

	const [timeErrorMessage, setTimeErrorMessage] = React.useState<string>("");

	const appStore = useStore(AppStore);

	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

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

		if(!time){
			setTimeErrorMessage("Time is mandatory");	
			inputValid =false;
		}
        return inputValid;
	}
	  
	const handleConfirm = (date) => {
		
		hideDatePicker();  
		console.warn("A date has been actualDate: ", date);
		console.warn("A date has been actualDate: ", format(date, 'p'));
		setTime(format(date, 'hh:mm a'));
		setDate(date);
		
	};

	const timeFrom12hto24h = time12h => {
		const [time, meridiem] = time12h.split(" ");
		let [hours, minutes] = time.split(":");
		if (hours === "12") hours = "00";
		if (meridiem === "PM") hours = parseInt(hours, 10) + 12;
		return new Date("2025-01-01 "+ hours+":"+minutes )
	  };
	  

	useEffect(() => {
		console.log("###"+route.params.id);
		if(route.params.id == "stopping-edit"){	
			setPlace(route.params.place);
			setOldLatitude(route.params.oldLatitude);
			setOldLongitude(route.params.oldLongitude);
			setLatitude(route.params.latitude);
			setLongitude(route.params.longitude);	
			console.log("## "+route.params.place+","+route.params.latitude+","+route.params.longitude, route.params.time);
		}
		if(initialized==false){	
			setTime(route.params.time);
			setDate(timeFrom12hto24h(route.params.time));
			setInitialized(true);
		}		
	});

	const onSetStartLocationPress = (): void => {
		console.log("## onSetStartLocationPress"+route.params);
		navigation && navigation.navigate("LocationAdd", {id: "stopping-edit","journeyType": route.params.journeyType ,latitude:latitude , longitude:longitude, placeName:place,  oldLatitude: oldLatitude, oldLongitude: oldLongitude, time: time, returnroute: "BusStoppingEditScreen", parentReturnRoute: route.params.returnRoute});
	};

	const onUpdatePress = (): void => {
		if(isValidValues()){
			if(route.params.journeyType == "Journey"){
				appStore.bus.updateJourneyStopping(oldLatitude, oldLongitude, place,latitude,longitude,time);
				navigation.navigate('BusJourneyList');
			} else if(route.params.journeyType == "ReturnJourney"){
				appStore.bus.updateReturnJourneyStopping(oldLatitude, oldLongitude, place,latitude,longitude,time);
				navigation.navigate('BusReturnJourneyList');
			}
		}
	};

	const onAddStoppingPress = (): void => {
		console.log("Index :::"+route.params.index);
		navigation && navigation.navigate("BusStoppingAddScreen",{ "index": route.params.index+1, "journeyType": route.params.journeyType});
	}

	const onStoppingDeletePress = (): void => {
		if(route.params.journeyType == "Journey"){
			appStore.bus.deleteJourneyStoppingById(oldLatitude,oldLongitude);
			navigation.navigate('BusJourneyList');
		} else if(route.params.journeyType == "ReturnJourney"){
			appStore.bus.deleteReturnJourneyStoppingById(oldLatitude,oldLongitude);
			navigation.navigate('BusReturnJourneyList');
		}
	};

	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
	);

	const onSetTimePress = (): void => {
		setDatePickerVisibility(true);
	};

	return (
		
		<ScrollView>
			<TopNavigation accessoryLeft={renderBackAction} title="Edit Stopping"/>

			<Card style={styles.item}>
				<View>
					<Pressable onPress={() => onSetStartLocationPress()}>
						<View pointerEvents="none">
							<Input placeholder="Start Location..." value={place}/>
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
				<Button style={{ flex: 3 , margin: 5, backgroundColor: "#D69200" , borderRadius:50, margin: 10, borderColor: "#D69200" }} onPress={()=>onUpdatePress()} >Update</Button>
				<Button style={{ flex: 3 , margin: 5, borderRadius:50, margin: 10}} onPress={()=>onAddStoppingPress()} >Add Next</Button>
				<Button style={{ flex: 3 , margin: 5, backgroundColor: "#B12048", borderRadius:50, margin: 10, borderColor: "#B12048"}} onPress={()=>onStoppingDeletePress()}>Delete</Button>
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

	item: {
		marginVertical: 8,
	},
	
	itemContent: {
		marginVertical: 8,
	},
	
});

//export default observer(BusJourneyAdd);
export default observer(BusStoppingEdit);
