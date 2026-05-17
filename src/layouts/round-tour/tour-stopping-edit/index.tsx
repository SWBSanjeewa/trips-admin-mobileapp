import { TopNavigation, TopNavigationAction, Button, Select, IndexPath, SelectItem, Divider,Input, Text } from "@ui-kitten/components";
import React,{useState,useEffect,useReducer} from "react";
import { ArrowIosBackIcon } from "../../../components/icons";

import { useRoute } from "@react-navigation/native"
import { StyleSheet, View , ScrollView,TextInput, TouchableOpacity,Pressable} from "react-native";
import AppStore from "../../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";
import { showMessage } from "react-native-flash-message";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from 'date-fns'

const TourStoppingEdit = ({ navigation }): React.ReactElement => {

	const route = useRoute();
	const [title, setTitle] = useState("");
	const [place, setPlace] = useState("");
	const [oldLatitude, setOldLatitude] = useState("");
	const [oldLongitude, setOldLongitude] = useState("");
	const [latitude, setLatitude] = useState(0);
	const [longitude, setLongitude] = useState(0);
	const [time, setTime] = useState("");
	const [waitingTime, setWaitingTime] = useState("30 mins");
	const [day, setDay] = useState("1");
	const [date, setDate ]= useState(new Date());
	const [initialized, setInitialized] = useState(false);

	const [index, setIndex] = useState(0);

	const [locationErrorMessage, setLocationErrorMessage] = React.useState<string>("");
	const [timeErrorMessage, setTimeErrorMessage] = React.useState<string>("");

	const [titleErrorMessage, setTitleErrorMessage] = React.useState<string>("");
	const [titleFocus, setTitleFocus] = React.useState<boolean>(false);
	const titleCustomStyle = titleFocus ? styles.inputContainerFocus : styles.inputContainer;
	

	const appStore = useStore(AppStore);

	const daysbck = Array.from({ length: appStore.tour.noOfDays }, (_, i) => ({
		key: (i + 1).toString(),
		value: `${i + 1}`
	}));

	const days = [
		{ key: "1", value: "1" },
		{ key: "2", value: "2" }
	];
	
	const [selectedDayIndex, setSelectedDayIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const selectedDay = days[selectedDayIndex.row];
	
	const waitingTimes = [
	{key: "15 mins", value: "15 mins"},
	{key: "30 mins",value: "30 mins"},
	{key: "45 mins",value: "45 mins"},
	{key: "1 hour",value: "1 hour"},
	{key: "2 hours",value: "2 hours"},
	{key: "2 hours",value: "3 hour"},
	{key: "2 hours",value: "4 hours"}]
	
	const [selectedWaitingIndex, setSelectedWatingTimeIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const selectedWaitingTime = waitingTimes[selectedWaitingIndex.row];

	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

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
	
		const onNoOfDaySelect = (index): void => {
			console.log("Slected index:"+index+" value:"+days[index-1].value);
			setSelectedDayIndex(index);
			setDay(days[index-1].value);
			
			appStore.stopping.setDay(days[index-1].value);
		};
	
		const onWaitingTimeSelect = (index): void => {
			console.log("Slected index:"+index);
			setSelectedWatingTimeIndex(index);
			setWaitingTime(waitingTimes[index-1].value);
			appStore.stopping.setWaitingTime(waitingTimes[index-1].value);
		};
	


	const handleTimeChange = (time, validTime) => {
		if (!validTime) return;
	
		setTime(time);
	}

	const onTitleChange = (value): void => {
		if(value.length != 0){
			setTitleErrorMessage("");
		}
		setTitle(value);
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

	const getNumberOfDaysIndexNumber = (noOfDays): number => {
		var myindex = 0;
		days.map(function(element, index){
			if(element == noOfDays){
				myindex=index;
			}
		});
		return myindex;
	};

	const getWaitingTimeIndexNumber = (waitingTime): number => {
		var myindex = 0;
		waitingTimes.map(function(element, index){
			if(element == waitingTime){
				myindex=index;
			}
		});
		return myindex;
	};
	  
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
			setTitle(route.params.title);
			setOldLatitude(route.params.oldLatitude);
			setOldLongitude(route.params.oldLongitude);
			setLatitude(route.params.latitude);
			setLongitude(route.params.longitude);	
			setDay(route.params.day);
			setWaitingTime(route.params.waitingTime);
			//console.log("## "+route.params.place+","+route.params.latitude+","+route.params.longitude, route.params.time);
			console.log("## Day:"+route.params.day);
			console.log("## waitingTime:"+route.params.waitingTime);
			
			var selectedDayIndexNo = getNumberOfDaysIndexNumber(route.params.day);
			console.log("## selectedDayIndexNo:"+selectedDayIndexNo);
			setSelectedDayIndex(new IndexPath(selectedDayIndexNo));

			var selectedWaitingTimeIndexNo = getWaitingTimeIndexNumber(route.params.waitingTime);
			setSelectedWatingTimeIndex(new IndexPath(selectedWaitingTimeIndexNo));


		}
		if(initialized==false){	
			setTime(route.params.time);
			setDate(timeFrom12hto24h(route.params.time));
			setInitialized(true);
		}		
	}, []);


	

	const onSetStartLocationPress1 = (): void => {
		console.log("## onSetStartLocationPress"+route.params);
		navigation && navigation.navigate("LocationAdd", {id: "stopping-edit","journeyType": route.params.journeyType ,latitude:latitude , longitude:longitude, placeName:place,  oldLatitude: oldLatitude, oldLongitude: oldLongitude, time: time, returnroute: "BusStoppingEditScreen", parentReturnRoute: route.params.returnRoute});
	};

	const onSetStartLocationPress = (): void => {
		navigation && navigation.navigate("LocationAdd", {id: "stopping",latitude:appStore.stopping.latitude , longitude:appStore.stopping.longitude, placeName:appStore.stopping.place, returnroute: "TourStoppingAddScreen" ,index: index });
	};

	const onUpdatePress = (): void => {
		//if(isValidValues()){
			console.log(">>>"+time);
			console.log(">>>"+waitingTime);
			console.log(">>>"+day);
			appStore.tour.updateStopping(oldLatitude, oldLongitude,title,place,latitude,longitude,time,day,waitingTime);
			navigation.navigate('TourStoppingsScreen');
		//}
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

			<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Day</Text>
						<View style={{ margin: 10}}>
						<Select
							placeholder='Default'
							value={day}
							selectedIndex={selectedDayIndex}
							onSelect={(index: IndexPath) => onNoOfDaySelect(index)}>
							{days.map(renderOptionDays)}
						</Select>
					</View>
					</View>
				</View>
				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Title</Text>
						<View style={{ margin: 10}}>	
							<Input placeholder="Breakfast, Lunch, Safari ..." value={title} onChangeText={(value)=>onTitleChange(value)} />
							{titleErrorMessage!="" && (
								<Text style={styles.errorLabel}>{titleErrorMessage}</Text>	
							)}
						</View>
					</View>
				</View>
				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Location</Text>
						<View style={{ margin: 10}}>
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
				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Time</Text>
						<View style={{ margin: 10}}>
							<Pressable onPress={() => onSetTimePress()}>
								<View pointerEvents="none">
									<Input placeholder="Time..." value={time}/>
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
							value={waitingTime}
							selectedIndex={selectedWaitingIndex}
							onSelect={(index: IndexPath) => onWaitingTimeSelect(index)}>
							{waitingTimes.map(renderOptionWaitingTime)}
						</Select>
					</View>
					</View>
				</View>

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
export default observer(TourStoppingEdit);
