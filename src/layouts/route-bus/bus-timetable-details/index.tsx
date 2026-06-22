import { Select, TopNavigationAction, IndexPath,SelectItem } from "@ui-kitten/components";
import { Button, Card, CheckBox, List, Divider,Input } from "@ui-kitten/components";
import React,{useState,useEffect,useReducer} from "react";
import { useRoute } from "@react-navigation/native"
import { StyleSheet, View , ListRenderItemInfo,Image, TouchableOpacity,Pressable, Text} from "react-native";
import { Stopping } from "./extra/data";
import AppStore from "../../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";
import { toJS } from "mobx";
import {
	MaterialIcons as MDIcon
} from '@expo/vector-icons';

import { ScrollView } from 'react-native-virtualized-view';
import { DayPicker } from '@routeslk/react-native-picker-weekday'

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import {routeBusTimetableTypes, transportAuthorityTypes}  from "../../../app/routes-common";
import AntDesign from '@expo/vector-icons/AntDesign';
import { PlusOutlineIcon } from "../../../components/icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from 'date-fns'



//const RouteBusJourneyDetails = ({ navigation }): React.ReactElement => {
export default observer(React.forwardRef(({ navigation,addCallback, add },ref) => {

	const route = useRoute();

	const [data, setData] = useState([]);


	const [timetableType, setTimetableType] = useState("Everyday");

	const [runningDays, setRunningDays] = React.useState([2,3,4,5,6])
	
	const appStore = useStore(AppStore);

	const [initialized, setInitialized] = React.useState(false);

	const [selectedDaysSelected, setSelectedDaysSelected] = React.useState(false);

	const [selectedTurn, setSelectedTurn] = React.useState<string>("");
	
	const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  	const displayValue = routeBusTimetableTypes[selectedIndex.row];

	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
	const [date, setDate ]= useState(new Date());
	const [time, setTime] = useState("");


	const client = axios.create({
		baseURL: 'https://routes.lk:7007'
	});

	const onAddClosePress = (): void => {	
		
		addCallback(false);
		
	};

	const onStoppingEditPress = (stopping,index): void => {
		navigation && navigation.navigate("BusStoppingEditScreen", {id: "stopping-edit", "journeyType": "Journey","returnRoute": "Journey", oldLatitude: stopping.latitude, oldLongitude: stopping.longitude, place: stopping.place, latitude: stopping.latitude, longitude: stopping.longitude, time: stopping.time, index: index});
	};

	const onAddTurn = (startTime: string) => () =>  {
       console.log("Add after:"+startTime);
	  // appStore.routeBusTimetable.addTurn("",startTime,"",[],[]);
	   setDatePickerVisibility(true);
	  // JSON.stringify(toJS(appStore.routeBusTimetable));
	  // setSelectedStopping(stopping);
       // setUploadPhotos(prevState => !prevState);
    };

	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};

	const onDeleteTurn = (startTime: string) => () =>  {
		console.log("Delete:"+startTime);
		//appStore.routeBus.deleteStoppingPlaceByPlace(stopping);
	};

	const onTimetableAddPress = async() => {
		console.log("onTimetableAddPress");
		if(appStore.routeBusTimetable.type == ""){
			appStore.routeBusTimetable.setTimetableType(routeBusTimetableTypes[0]);
		}
		if(appStore.routeBusTimetable.type == "Selected Days"){
			if(appStore.routeBusTimetable.runningDays == ""){
			appStore.routeBusTimetable.setRunningDays(runningDays.toString());
			}
		}
		console.log(JSON.stringify(toJS(appStore.routeBusTimetable)));	
		console.log(JSON.stringify(toJS(appStore.routeBusTimetable.type+","+appStore.routeBusTimetable.runningDays.toString())));	
	    appStore.routeBus.journey.addTimetable(appStore.routeBusTimetable.type, appStore.routeBusTimetable.runningDays.toString(), appStore.routeBusTimetable.turns);
		addCallback();
		console.log("Routebus:"+appStore.routeBus);
		console.log(JSON.stringify(toJS(appStore.routeBus)));	
		setRunningDays([2,3,4,5,6]);
		setSelectedIndex(new IndexPath(0));
		setSelectedDaysSelected(false);

	}

	useEffect(() => {
		console.log("runningDays:"+runningDays);	
		if(route.params != null ){
			setTimetableType(route.params?.timetableType);
			if(route.params?.runningDays)
				setRunningDays(route.params?.runningDays);
		}
	
	}, []);

	const onTimetableAddPressbck = async() => {
		
		if(appStore.routeBusTimetable.type == ""){
			appStore.routeBusTimetable.setTimetableType(routeBusTimetableTypes[0]);
		}
		if(appStore.routeBusTimetable.type == "Selected Days"){
			if(appStore.routeBusTimetable.runningDays == ""){
			appStore.routeBusTimetable.setRunningDays(runningDays.toString());
			}
		}
		
		const config: AxiosRequestConfig = {
			headers: {
				'Accept': 'application/json',
				'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		};
		try {
			const response: AxiosResponse = await client.post(`/routebuses/create`, appStore.routeBus , config);
			console.log(response.status);
			console.log(response.data.json); 
			appStore.routeBus.reset();
			navigation && navigation.navigate("BusHome", {reload: true});
			
		} catch(err) {
			console.log(err);
		}  
	
	};

	
	const setSelectedDaysRunningDays = (value) => {
		setRunningDays(value);
		appStore.routeBusTimetable.setRunningDays(value.toString());
	}


	const handleConfirm = (date) => {
			
			hideDatePicker();  
			console.warn("A date has been actualDate: ", date);
			console.warn("A date has been actualDate: ", format(date, 'p'));
			setTime(format(date, 'hh:mm a'));
			setDate(date);
			appStore.routeBusTimetable.addTurn("",format(date, 'HH:mm'),"",[],[]);
			
	};
	
	const onRouteTimetableTypeSelect = (index): void => {
		setSelectedIndex(index);
		if(routeBusTimetableTypes[index-1] == "Selected Days"){
			console.log(routeBusTimetableTypes[index-1]);
			setSelectedDaysSelected(true);
		}else{
			setSelectedDaysSelected(false);
		}
		appStore.routeBusTimetable.setTimetableType(routeBusTimetableTypes[index-1]);
	};

	const renderOptionTimetableTypes = (timetableType): React.ReactElement => (
		<SelectItem key={timetableType} title={evaProps => <View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
			<Text style={{ paddingHorizontal: 5}}>{timetableType}</Text>
		</View>} />
	);

	useEffect(() => {
			
	});


	return (
	
		<ScrollView>
			
			<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
				<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
					
					<Card style={{ margin: 10}}>
						<Text style={styles.itemHeader}>Timetable Type</Text>
						<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
							<Text>{timetableType}</Text>
							<MDIcon name="arrow-forward" style={styles.itemContentIcon} />
						</View>
					</Card>

					{runningDays && timetableType == "SelectedDays" &&(
							<DayPicker
								weekdays={
									runningDays.split(',').map(function(item) {
										return parseInt(item, 10);
								})}
								setWeekdays={setSelectedDaysRunningDays}
								activeColor='#142169'
								textColor='white'
								inactiveColor='grey'
								itemStyles={{width: 35, height:35, color: "red", paddingHorizontal: 0, marginHorizontal: 5 ,marginVertical : 5}}
								dayTextStyle={{ fontSize: 10 }}
								wrapperStyles={{ marginVertical: 10, justifyContent: 'space-left' }}
							/>
						)}
					<Text style={{ padding: 5, paddingLeft: 10}}>Turns</Text>
					<View style={styles.inputContainer}>
						<View style={{flexDirection: "row", flexWrap: "wrap"}}>
						{appStore.routeBusTimetable.turns.map(function(turn, index){
							if(turn == selectedTurn){
								return <TouchableOpacity style={{flexDirection: "row" ,borderWidth: 1, padding: 2, margin: 2, borderColor: "#222"}} onPress={onAddTurn(turn.startTime)}>
											<Text style={{padding: 2}}>{turn.startTime}</Text>
											<AntDesign style={{top: 4}} name="close" size={18} color="red" onPress={onDeleteTurn(turn.startTime)} />
									</TouchableOpacity>
							}else{
								return <TouchableOpacity style={{flexDirection: "row" ,borderWidth: 1, padding: 2, margin: 2, borderColor: "#bbb"}} onPress={onAddTurn(turn.startTime)}>
											<Text style={{padding: 2}}>{turn.startTime}</Text>
											<AntDesign style={{top: 4}} name="close" size={18} color="red" onPress={onDeleteTurn(turn.startTime)} />
									</TouchableOpacity>
							}
							
						})}	
							<AntDesign style={{top: 0}} name="plus" size={30} color="black" onPress={onAddTurn("")} />
						</View>	
					</View>
				</View>
				
				<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
					<Button style={{ flex: 1 , margin: 2, borderRadius:50, margin: 10 }} onPress={()=>onTimetableAddPress()} >Add Timetable</Button>
				</View>
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
}));

const styles = StyleSheet.create({

	
	listContent: {
		paddingHorizontal: 32,
		paddingVertical: 8,
	},
	button: {
		marginVertical: 8,
	},
	itemHeader: {
		fontSize: 18,
		color: '#999',
	},
	itemContentIcon: {
		fontWeight: "500",
		fontSize: 22
	},
	item: {
		marginVertical: 8,
		marginHorizontal: 10
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
	
});

