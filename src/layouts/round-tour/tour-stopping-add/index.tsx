import { Button, Card, Text, Select, IndexPath, SelectItem, Input } from "@ui-kitten/components";
import React,{useEffect, useState, useRef} from "react";
import { StyleSheet, View, Modal, TextInput,ScrollView, Pressable} from "react-native";
import { useFocusEffect, useRoute } from '@react-navigation/native';
import AppStore from "../../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";
import { toJS } from "mobx";
import {
	MaterialIcons as MDIcon,
	Entypo as Entypo,
} from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import TourPhotosAddCard from "../../round-tour/tour-photos-add/extra/tourphotos-add-card.component";

import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import {routeTypes }  from "../../../app/routes-common";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { format } from 'date-fns'




const BusAdd = ({ navigation }): React.ReactElement => {

	const refAutoComplete = useRef(null);

	const appStore = useStore(AppStore);

	const [date, setDate ]= useState(new Date());

	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
	

	const [index, setIndex] = useState(0);

	const waitingTime = [
			{key: "0 mins", value: "No waiting"},
			{key: "1 mins", value: "1 mins"},
			{key: "2 mins", value: "2 mins"},
			{key: "5 mins", value: "5 mins"},
			{key: "10 mins", value: "10 mins"},
			{key: "15 mins", value: "15 mins"},
			{key: "30 mins",value: "30 mins"},
			{key: "45 mins",value: "45 mins"},
			{key: "1 hour",value: "1 hour"},
			{key: "2 hours",value: "2 hours"},
			{key: "2 hours",value: "3 hour"},
			{key: "2 hours",value: "4 hours"}]
	
	const [selectedWaitingIndex, setSelectedWatingTimeIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const selectedWaitingTime = waitingTime[selectedWaitingIndex.row];

	const route = useRoute();

	const client = axios.create({
		baseURL: 'https://routes.lk:7007'
	});


	const [titleFocus, setTitleFocus] = React.useState<boolean>(false);
	const titleCustomStyle = titleFocus ? styles.inputContainerFocus : styles.inputContainer;

	
	const [titleErrorMessage, setTitleErrorMessage] = React.useState<string>("");

	const [locationErrorMessage, setLocationErrorMessage] = React.useState<string>("");
	
	const [timeErrorMessage, setTimeErrorMessage] = React.useState<string>("");
	
	const [selectedIndex, setSelectedIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	
	
	const [selectedIndexBusType, setSelectedIndexBusType] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const routeType = routeTypes[selectedIndexBusType.row];


	const days = Array.from({ length: 10 }, (_, i) => ({
		key: (i + 1).toString(),
		value: `${i + 1}`
	}));

	const [selectedDaysIndex, setSelectedDaysIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const selectedDays = days[selectedDaysIndex.row];



	const onNoOfDaysSelect = (index): void => {
		console.log("Slected index:"+index);
		setSelectedDaysIndex(index);
		
		appStore.tour.setNoOfDays(days[index-1].value);
	};

	

	/*
	useFocusEffect(
		React.useCallback(() => {
		
			if(route.params?.reload){
				loadTransportServices();
				setLoading(false);
			}
			
		  return () => {
			
		  };
		}, [route.params?.reload])
	);
		*/
	
	
	const onTransportServiceCreatePress = () => {
		appStore.transportService.addOwner(appStore.user.name, appStore.user.mobileNumber);
		navigation && navigation.navigate("TransportServiceAdd");
	}

	const isValidValues = (): any => {
		
		var inputValid =true;


		if(!appStore.tour.title){
			setTitleErrorMessage("Title is mandatory");	
			inputValid =false;
		}

		if(appStore.tour.photos && appStore.tour.photos.length == 0){
			setPhotosErrorMessage("At least one photo should be there");
			inputValid =false;	
		}

		return inputValid;
		
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

	

	const onCreatePress1 = async() => {
		console.log(JSON.stringify(toJS(appStore.tour)));	
	}

	const onCreatePress = async() => {
		console.log(JSON.stringify(toJS(appStore.tour)));	


		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };
		  try {
			  
			  if(isValidValues()){
				const response: AxiosResponse = await client.post(`/tours/create`, appStore.tour , config);
				console.log(response.status);
				console.log(response.data.json); 
				appStore.bus.reset();
				navigation && navigation.navigate("TourList", {reload: true});
			  }
			  
		  } catch(err) {
			console.log(err);
		  }  
	}

	

	const renderOptionDays = (day): React.ReactElement => (
		<SelectItem key={day.key} title={evaProps => <View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
			<Text style={{ paddingHorizontal: 5}}>{day.value}</Text>
		</View>} />
	);

	
	

	
	const onTitleChange = (value): void => {
		if(value.length != 0){
			setTitleErrorMessage("");
		}
		appStore.tour.setTitle(value);
	};

	const onSetStartLocationPress = (): void => {
		navigation && navigation.navigate("LocationAdd", {id: "stopping",latitude:appStore.stopping.latitude , longitude:appStore.stopping.longitude, placeName:appStore.stopping.place, returnroute: "TourStoppingAddScreen" ,index: index });
	};

	const onSetTimePress = (): void => {
		setDatePickerVisibility(true);
	};

	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};

	const onWaitingTimeSelect = (index): void => {
		console.log("Slected index:"+index);
		setSelectedWatingTimeIndex(index);
		appStore.stopping.setWaitingTime(waitingTime[index-1].value);
	};

	const renderOptionWaitingTime = (waiting): React.ReactElement => (
			<SelectItem key={waiting.key} title={evaProps => <View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
				<Text style={{ paddingHorizontal: 5}}>{waiting.value}</Text>
			</View>} />
		);

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

	

	
	return (
		
		<ScrollView keyboardShouldPersistTaps='handled'>
			
			<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
				<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
					<Text style={{ padding: 5, paddingLeft: 10}}>No Of Days</Text>
					<View style={{ margin: 10}}>
					<Select
						placeholder='Default'
						value={appStore.tour.noOfDays}
						selectedIndex={selectedIndex}
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
					<TextInput style={styles.captionText} placeholder="Breakfast, Lunch, Safari" onChangeText={onTitleChange} value={appStore.tour.title} onFocus={() => setTitleFocus(true)} onBlur={() => setTitleFocus(false)} />
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
			
			
			<View>	
				
			</View>

			
			

			

           
			
			<View style={{flexDirection: "row", justifyContent: "space-between"}}>
				<Button size="giant" style={{ flex: 3 , margin: 5, borderRadius:50, margin: 10}} onPress={()=>onCreatePress()}>Create</Button>
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
	datepicker: {
		width: 200,
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
	descriptionInputContainer: {
		flex: 1,
		flexDirection: "column", 
		justifyContent: "space-between",
		borderColor: "#ddd",
        borderWidth: 1, // Create border
        borderRadius: 8, // Not needed. Just make it look nicer.
        padding: 8, // Also used to make it look nicer
        zIndex: 0, // Ensure border has z-index of 0
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
	disbaleText: {
		fontSize: 16,
		color: '#b1b0abff',
	},
	item: {
		marginVertical: 8,
		padding: 0,
	},
	itemContentIcon: {
		fontSize: 20,
		color: '#666',
	}
	
});

export default observer(BusAdd);
