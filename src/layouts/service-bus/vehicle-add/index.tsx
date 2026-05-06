import { Button, Card, Text, Select, IndexPath, SelectItem, Divider } from "@ui-kitten/components";
import React,{useEffect, useState, useRef} from "react";
import { StyleSheet, View, Modal, TextInput,ScrollView, ActivityIndicator, TouchableOpacity} from "react-native";
import { useFocusEffect, useRoute } from '@react-navigation/native';
import AppStore from "../../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";
import { toJS } from "mobx";
import {
	MaterialIcons as MDIcon,
} from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import VehiclePhotosAddCard from "../vehicle-photos-add/extra/vehiclephotos-add-card.component";

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import {routeTypes, getRouteColor, vehcileTypes, getVehicleColor}  from "../../../app/routes-common";

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import AntDesign from '@expo/vector-icons/AntDesign';

import Ionicons from '@expo/vector-icons/Ionicons';

const VehicleAdd = ({ navigation }): React.ReactElement => {

	const refAutoComplete = useRef(null);

	const GOOGLE_GEO_API_KEY="AIzaSyDmFlx79dIq9lzTupQGttpE8m8eQ5ZS5yA"

	const appStore = useStore(AppStore);

	const [loading, setLoading] = useState(true);

	const route = useRoute();

	const client = axios.create({
		baseURL: 'https://routes.lk:7007'
	});

	//const [title, setTitle] = useState('');
	//const [regNumber, setRegNumber] = useState('');
	//const [vehicleType, setVehicleType] = useState('');
	//const [noOfSeats, setNoOfSeats] = useState('');
	

	const [regNoFocus, setRegNoFocus] = React.useState<boolean>(false);
	const regNoCustomStyle = regNoFocus ? styles.inputContainerFocus : styles.inputContainer;

	const [titleFocus, setTitleFocus] = React.useState<boolean>(false);
	const titleCustomStyle = titleFocus ? styles.inputContainerFocus : styles.inputContainer;

	
	const [noOfSeatsFocus, setNoOfSeatsFocus] = React.useState<boolean>(false);
	const noOfSeatsCustomStyle = noOfSeatsFocus ? styles.inputContainerFocus : styles.inputContainer;


	const [registrationNumberErrorMessage, setRegistrationNumberErrorMessage] = React.useState<string>("");

	const [titleErrorMessage, setTitleErrorMessage] = React.useState<string>("");

	const [photosErrorMessage, setPhotosErrorMessage] = React.useState<string>("");

	const [journeyStoppingsErrorMessage, setJourneyStoppingsErrorMessage] = React.useState<string>("");

	const [returnJourneyStoppingsErrorMessage, setReturnJourneyStoppingsErrorMessage] = React.useState<string>("");



	const [selectedIndex, setSelectedIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const vehcileType = vehcileTypes[selectedIndex.row];

	const [selectedIndexBusType, setSelectedIndexBusType] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const routeType = routeTypes[selectedIndexBusType.row];



	const onVehicleTypeSelect = (index): void => {
		console.log("Slected index:"+index);
		setSelectedIndex(index);
		appStore.vehicle.setVehicleType(vehcileTypes[index-1].name);
	};

	const isValidValues = (): any => {
		
		var inputValid =true;

		if(!appStore.bus.registrationNumber){
			setRegistrationNumberErrorMessage("Vehicle registration number is mandatory");	
			inputValid =false;
		}

		if(!appStore.bus.title){
			setTitleErrorMessage("Title is mandatory");	
			inputValid =false;
		}

		if(appStore.bus.photos && appStore.bus.photos.length == 0){
			setPhotosErrorMessage("At least one photo should be there");
			inputValid =false;	
		}

		return inputValid;
		
	};

	

	const onCreatePress = async() => {
		//appStore.vehicle.addVehicle(title, regNumber,vehcileType.name,noOfSeats);
		//appStore.transportService.addVehicle(title, regNumber,vehcileType.name,noOfSeats);
		//console.log(JSON.stringify(toJS(appStore.transportService)));	
		//appStore.vehicle.addVehicle(title, regNumber,vehcileType.name,noOfSeats);
		console.log("#######");
		let vehicle = appStore.vehicle;
		appStore.transportService.addVehicle(vehicle.id, vehicle.title, vehicle.regNumber, vehicle.vehicleType, vehicle.noOfSeats);
		vehicle.photos.forEach(photo => {
			appStore.transportService.addVehiclePhoto(vehicle.id, photo);
		});
		console.log("####");
		console.log(JSON.stringify(toJS(appStore.transportService)));	
		navigation && navigation.goBack( {reload: true});
	}

	const onCreatePress1 = async() => {
		console.log(JSON.stringify(toJS(appStore.bus)));	


		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };
		  try {
			  
			  if(isValidValues()){
				const response: AxiosResponse = await client.post("/transportServices/"+appStore.transportService.id+"/vehicles/create", appStore.vehicle , config);
				console.log(response.status);
				console.log(response.data.json); 
				appStore.bus.reset();
				navigation && navigation.navigate("BusHome", {reload: true});
			  }
			  
		  } catch(err) {
			console.log(err);
		  }  
	}

	const renderOption = (vehcileType): React.ReactElement => (
		<SelectItem key={vehcileType.name} title={evaProps => <View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
			<FontAwesome5 name="bus" size={24} color={getVehicleColor(vehcileType.name)}  />
			<Text style={{ paddingHorizontal: 5}}>{vehcileType.name}</Text>
		</View>} />
	);

	

	const onRegistrationNumberChange = (value): void => {
		if(value.length != 0){
			setRegistrationNumberErrorMessage("");
		}
		appStore.vehicle.setRegNumber(value);
	};

	const onTitleChange = (value): void => {
		if(value.length != 0){
			setTitleErrorMessage("");
		}
		appStore.vehicle.setTitle(value);
	};

	
	

	const onNavigateToJourney = (): void => {
		setJourneyStoppingsErrorMessage("");
		navigation.navigate("BusJourneyList")
	};

	const onNavigateToBuses = (): void => {
		setReturnJourneyStoppingsErrorMessage("");
		navigation.navigate("BusReturnJourneyList")
	};

	const onPhotosPress = (): void => {
		console.log("photos presses");
		setPhotosErrorMessage("");
	};

	function errorMessageHandler(value) {
		setPhotosErrorMessage(value);
	}
	
	return (
		
		<ScrollView>

			<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
				<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
					<Text style={{ padding: 5, paddingLeft: 10}}>Vehicle Model</Text>
					<View style={{ margin: 10}}>
					<Select
						placeholder='Default'
						value={vehcileType.name}
						selectedIndex={selectedIndex}
						onSelect={(index: IndexPath) => onVehicleTypeSelect(index)}>
						{vehcileTypes.map(renderOption)}
					</Select>
				</View>
				</View>
			</View>
			
			<View>

				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>Title</Text>
					</View>
					<View style={titleCustomStyle}>
						<TextInput style={styles.captionText} placeholder="2010 Baby Rosa" onChangeText={onTitleChange}  value={appStore.vehicle.title} onFocus={() => setTitleFocus(true)} onBlur={() => setTitleFocus(false)} />
					</View>	
					{titleErrorMessage!="" && (
						<Text style={styles.errorLabel}>{titleErrorMessage}</Text>	
					)}
				</View>
			
				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>Reg. No</Text>
					</View>
					<View style={regNoCustomStyle}>
						<TextInput style={styles.captionText} placeholder="wpNF-9999" onChangeText={onRegistrationNumberChange} value={appStore.vehicle.regNumber} onFocus={() => setRegNoFocus(true)} onBlur={() => setRegNoFocus(false)} />
					</View>	
					{registrationNumberErrorMessage!="" && (
						<Text style={styles.errorLabel}>{registrationNumberErrorMessage}</Text>	
					)}
				</View>

				
			
				
				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>No of seats</Text>
					</View>
					<View style={noOfSeatsCustomStyle}>
						<TextInput style={styles.captionText} keyboardType='numeric' placeholder="30" onChangeText={appStore.vehicle.setNoOfSeats} value={appStore.vehicle.noOfSeats} onFocus={() => setNoOfSeatsFocus(true)} onBlur={() => setNoOfSeatsFocus(false)} />
					</View>
				</View>
				
			</View>
			<Card style={{ margin: 10, borderRadius:10}} onPress={onPhotosPress}>	
							<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
								<Text>Photos</Text>
								<VehiclePhotosAddCard navigation={navigation} errorMessageHandler={errorMessageHandler} update={false}/>
							</View>
							{photosErrorMessage!="" && (
									<Text style={styles.errorLabel}>{photosErrorMessage}</Text>	
							)}
			</Card>
			
			<View style={{flexDirection: "row", justifyContent: "space-between"}}>
				<Button size="giant" style={{ flex: 3 , margin: 5, borderRadius:50, margin: 10}} onPress={()=>onCreatePress()}>Add</Button>
			</View>
			
		</ScrollView>
		
		
		
	);
};

const styles = StyleSheet.create({
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
	item: {
		marginVertical: 8,
		padding: 0,
	},
	itemContentIcon: {
		fontSize: 20,
		color: '#666',
	}
	
});

export default observer(VehicleAdd);
