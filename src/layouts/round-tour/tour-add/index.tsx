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

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import TourPhotosAddCard from "../../round-tour/tour-photos-add/extra/tourphotos-add-card.component";

import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import {routeTypes, getRouteColor, vehcileTypes, getVehicleColor}  from "../../../app/routes-common";

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import AntDesign from '@expo/vector-icons/AntDesign';

import Ionicons from '@expo/vector-icons/Ionicons';
//import { Stopping } from "../bus-list/assets/data";

import { Datepicker, RangeDatepicker } from '@ui-kitten/components';


const BusAdd = ({ navigation }): React.ReactElement => {

	const refAutoComplete = useRef(null);

	const GOOGLE_GEO_API_KEY="AIzaSyDmFlx79dIq9lzTupQGttpE8m8eQ5ZS5yA"

	const appStore = useStore(AppStore);

	const [loading, setLoading] = useState(true);

	const [startDate, setStartDate] = React.useState<Date>(null);
	const [endDate, setEndDate] = React.useState<Date>(null);

	const route = useRoute();

	const client = axios.create({
		baseURL: 'https://routes.lk:7007'
	});


	const [titleFocus, setTitleFocus] = React.useState<boolean>(false);
	const titleCustomStyle = titleFocus ? styles.inputContainerFocus : styles.inputContainer;

	const [descriptionFocus, setDescriptionFocus] = React.useState<boolean>(false);
	const descriptionCustomStyle = descriptionFocus ? styles.inputContainerFocus : styles.inputContainer;

	const [noOfSeatsFocus, setNoOfSeatsFocus] = React.useState<boolean>(false);
	const noOfSeatsCustomStyle = noOfSeatsFocus ? styles.inputContainerFocus : styles.inputContainer;


	const [photosErrorMessage, setPhotosErrorMessage] = React.useState<string>("");

	const [transportServices, setTransportServices] = useState([]);
	const [selectedIndexTransportServices, setSelectedIndexTransportServices] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const transportService = transportServices[selectedIndexTransportServices.row]?.name;

	const [transportServiceErrorMessage, setTransportServiceErrorMessage] = React.useState<string>("");

	const [registrationNumberErrorMessage, setRegistrationNumberErrorMessage] = React.useState<string>("");

	const [titleErrorMessage, setTitleErrorMessage] = React.useState<string>("");

	const [descriptionErrorMessage, setDescriptionErrorMessage] = React.useState<string>("");


	const [journeyStoppingsErrorMessage, setJourneyStoppingsErrorMessage] = React.useState<string>("");

	const [returnJourneyStoppingsErrorMessage, setReturnJourneyStoppingsErrorMessage] = React.useState<string>("");



	const [selectedIndex, setSelectedIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const vehcileType = vehcileTypes[selectedIndex.row];

	
	const [selectedIndexBusType, setSelectedIndexBusType] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const routeType = routeTypes[selectedIndexBusType.row];


	const [selectedStopping, setSelectedStopping] = React.useState<string>("");

	const days = Array.from({ length: 10 }, (_, i) => ({
		key: (i + 1).toString(),
		value: `${i + 1}`
	}));

	const [selectedDaysIndex, setSelectedDaysIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const selectedDays = days[selectedDaysIndex.row];


	const onPhotosPress = (): void => {
		console.log("photos presses");
		setPhotosErrorMessage("");
	};

	function errorMessageHandler(value) {
		setPhotosErrorMessage(value);
	}


	const onNoOfDaysSelect = (index): void => {
		console.log("Slected index:"+index);
		setSelectedDaysIndex(index);
		
		appStore.tour.setNoOfDays(days[index-1].value);
	};

	const loadTransportServices = async() => {
			console.log("Load transport services...");
			const config: AxiosRequestConfig = {
				headers: {
				  'Accept': 'application/json',
				  'token': appStore.user.accessToken
				} as RawAxiosRequestHeaders,
			  };
			  try {	
				const response: AxiosResponse = await client.get(`/transportServices/list` , config);
				setLoading(false);
				console.log(response.status);
				console.log(response.data);
				if(response.data !=null && response.data.length > 0 ) {
					setTransportServices(response.data);  
					console.log("Name::"+response.data[0].name);
					console.log("Id::"+response.data[0]._id);
					appStore.bus.setTransportServiceId(response.data[0]._id);
					appStore.bus.setTransportServiceName(response.data[0].name);
					appStore.bus.setTransportServiceThemeColor(response.data[0].themeColor);
				}else{
					setTransportServiceErrorMessage("Please create Transport Service first.");
				}
			  } catch(err) {
				console.log(err);
				setLoading(false);
			  }  
			
		};

	useEffect(() => {
			const fetch = async ()=>{
				await loadTransportServices();
				setLoading(false);
			}
	
			fetch();	
	
		}, []);


	const onVehicleTypeSelect = (index): void => {
		console.log("Slected index:"+index);
		setSelectedIndex(index);
		
		appStore.tour.setVehicleType(vehcileTypes[index-1].name);
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

	const renderOption = (vehcileType): React.ReactElement => (
		<SelectItem key={vehcileType.name} title={evaProps => <View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
			<FontAwesome5 name="bus" size={24} color={getVehicleColor(vehcileType.name)}  />
			<Text style={{ paddingHorizontal: 5}}>{vehcileType.name}</Text>
		</View>} />
	);

	const renderOptionDays = (day): React.ReactElement => (
		<SelectItem key={day.key} title={evaProps => <View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
			<Text style={{ paddingHorizontal: 5}}>{day.value}</Text>
		</View>} />
	);

	const renderOptionBusTypes = (routeType): React.ReactElement => (
		<SelectItem key={routeType.name} title={evaProps => <View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
			<FontAwesome5 name="bus" size={24} color={getRouteColor(routeType.name)} />
			<Text style={{ paddingHorizontal: 5}}>{routeType.name}</Text>
		</View>} />
	);

	const renderOptionTransportService = (transportService): React.ReactElement => (
		<SelectItem key={transportService.name} title={evaProps => <View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
			<Text style={{ paddingHorizontal: 5}}>{transportService.name}</Text>
		</View>} />
	);

	const onRegistrationNumberChange = (value): void => {
		if(value.length != 0){
			setRegistrationNumberErrorMessage("");
		}
		appStore.bus.setRegistrationNumber(value);
	};

	const onTitleChange = (value): void => {
		if(value.length != 0){
			setTitleErrorMessage("");
		}
		appStore.tour.setTitle(value);
	};

	const onDescriptionChange = (value): void => {
		if(value.length != 0){
			setDescriptionErrorMessage("");
		}
		appStore.bus.setDescription(value);
	};

	const onNavigateToJourney = (): void => {
		setJourneyStoppingsErrorMessage("");
		navigation.navigate("TourStoppingsScreen")
	};


	const onSchedulesPress = (): void => {
		navigation.navigate("TourSchedules")
	};

	const onTransportServiceSelect = (index): void => {
		setSelectedIndexTransportServices(index);
		appStore.tour.setTransportServiceId(transportServices[index-1]._id);
		appStore.tour.setTransportServiceName(transportServices[index-1].name);
		appStore.tour.setTransportServiceThemeColor(transportServices[index-1].themeColor);
	};

	
	const onAddStopping = (stopping: string) => () =>  {
       console.log(stopping);
	   setSelectedStopping(stopping);
       // setUploadPhotos(prevState => !prevState);
    };

	const onDeleteStopping = (stopping: string) => () =>  {
		appStore.tour.deleteStoppingPlace(stopping);
	};

	
	
	return (
		
		<ScrollView keyboardShouldPersistTaps='handled'>
			
			<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
				<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
					<View style={{flexDirection: "row", justifyContent: "space-between"}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Transport Service</Text>
					</View>
					{transportServiceErrorMessage =="" && (
					<View style={{ margin: 10}}>
						<Select
							placeholder='Default'
							value={transportService}
							selectedIndex={selectedIndexTransportServices}
							onSelect={(index: IndexPath) => onTransportServiceSelect(index)}>
							{transportServices.map(renderOptionTransportService)}
						</Select>
					</View>
					)}
					{transportServiceErrorMessage!="" && (
						<Text style={styles.errorLabel}>{transportServiceErrorMessage}</Text>	
					)}
				</View>
			</View>

			<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>Title</Text>
					</View>
					<View style={titleCustomStyle}>
						<TextInput style={styles.captionText} placeholder="Colombo to Nallathanniya -  Sripada Wandana" onChangeText={onTitleChange} value={appStore.tour.title} onFocus={() => setTitleFocus(true)} onBlur={() => setTitleFocus(false)} />
					</View>	
					{titleErrorMessage!="" && (
						<Text style={styles.errorLabel}>{titleErrorMessage}</Text>	
					)}
				</View>
			

				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>Stopping Locations</Text>
					</View>
					<View style={styles.descriptionInputContainer}>
					<View style={{flexDirection: "row", flexWrap: "wrap"}}>
						
						{appStore.tour.stoppingsPlaces.map(function(stopping, index){
						if(stopping == selectedStopping){
							return <TouchableOpacity key={index} style={{flexDirection: "row" ,borderWidth: 1, padding: 2, margin: 2, borderColor: "#222"}} onPress={onAddStopping(stopping)}>
										<Text style={{padding: 2}}>{stopping.place}</Text>
										<AntDesign style={{top: 4}} name="close" size={18} color="red" onPress={onDeleteStopping(stopping)} />
								</TouchableOpacity>
						}else{
							return <TouchableOpacity key={index} style={{flexDirection: "row" ,borderWidth: 1, padding: 2, margin: 2, borderColor: "#bbb"}} onPress={onAddStopping(stopping)}>
										<Text style={{padding: 2}}>{stopping.place}</Text>
										<AntDesign style={{top: 4}} name="close" size={18} color="red" onPress={onDeleteStopping(stopping)} />
								</TouchableOpacity>
						}
						
					})}	
					
					</View>	
						<GooglePlacesAutocomplete
				ref={refAutoComplete}
				keyboardShouldPersistTaps={ "handled" }
				styles={{
					container:{
						
						borderColor: "grey",
						borderWidth: 1
					},
					textInputContainer: {
						marginTop: 0,
						borderColor: 'grey',
						borderWidth: 1
					},
					textInput: {
						height: 38,
						color: 'grey',
						fontSize: 16
					}
				}}
				
				  renderRow={(rowData) => {
					const title = rowData.structured_formatting.main_text;
					var address=""
					if(rowData.structured_formatting.secondary_text){
						var lastIndex=rowData.structured_formatting.secondary_text.lastIndexOf(",");
						if(lastIndex>0)
				    		address = rowData.structured_formatting.secondary_text.slice(0,lastIndex);
					}
					
					return (
					 <View style={{ padding: 0 }}>
					  
					  <Text style={{ fontSize: 14 }}>{title}</Text>
					  <Text style={{ fontSize: 14, color: '#777777',}}>{address}</Text>
					 </View>
					 );
					}}
				  placeholder='Enter Location'
				  textInputProps={{
					selectionColor:"#142169",
					cursorColor:"#142169"
				 }}
				  minLength={2}
				 

				fetchDetails={true}
				onPress={(data, details = null) => {
					// 'details' is provided when fetchDetails = true
					console.log(data);
					console.log("*****");
					console.log(data.description)
					
					var address=data.description;
					
					
					if(data.description.indexOf(",")>0){
					   var index=data.description.indexOf(",");
				       address = data.description.slice(0,index);
					}
					
					refAutoComplete.current?.setAddressText("");
					//setSearch({searchKeyword: data.description});
					//console.log("lat:lng"+details.geometry.location.lat+","+details.geometry.location.lng);
					if(selectedStopping != ""){
						var index = appStore.tour.getIndex(selectedStopping);
						appStore.tour.addStoppingPlaceAtIndex(address,details.geometry.location.lat,details.geometry.location.lng,index+1);
						setSelectedStopping("");
					}else{
						appStore.tour.addStoppingPlace(address,details.geometry.location.lat,details.geometry.location.lng);
						
						//place,latitude,longitude,title,remarks,plusDays,arrivalTime,departureTime,stayDuration
					}
					
				}}

				onFail={(error) => console.error(error)}

				predefinedPlaces={[]}
				debounce={200}
				timeout={20000}


				query={{
					key: 'AIzaSyDmFlx79dIq9lzTupQGttpE8m8eQ5ZS5yA',
					language: 'en',
					components: 'country:lk',
					componentRestrictions:'country:lk',
					libraries: 'places'
				}}
			/>
					</View>	
					{descriptionErrorMessage!="" && (
						<Text style={styles.errorLabel}>{descriptionErrorMessage}</Text>	
					)}
				</View>

			
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

			<Card style={{ margin: 10, borderRadius:10}} onPress={onPhotosPress}>	
							<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
								<Text>Photos</Text>
								<TourPhotosAddCard navigation={navigation} errorMessageHandler={errorMessageHandler} update={false}/>
							</View>
							{photosErrorMessage!="" && (
									<Text style={styles.errorLabel}>{photosErrorMessage}</Text>	
							)}
			</Card>

			<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>No of seats</Text>
					</View>
					<View style={noOfSeatsCustomStyle}>
						<TextInput style={styles.captionText} keyboardType='numeric' placeholder="30" onChangeText={appStore.tour.setNoOfSeats} value={appStore.tour.noOfSeats} onFocus={() => setNoOfSeatsFocus(true)} onBlur={() => setNoOfSeatsFocus(false)} />
					</View>
				</View>
			
			<View>
			
				
				
				
				
				
			</View>

			
			<Card style={{ margin: 10, borderRadius:10}} onPress={onNavigateToJourney}>	
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Stopping Locations</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={onNavigateToJourney}/>
				</View>
				{journeyStoppingsErrorMessage!="" && (
						<Text style={styles.errorLabel}>{journeyStoppingsErrorMessage}</Text>	
				)}
			</Card>

			<Card style={{ margin: 10, borderRadius:10}} onPress={onSchedulesPress}>	
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Schedules</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={onSchedulesPress}/>
				</View>
				{journeyStoppingsErrorMessage!="" && (
						<Text style={styles.errorLabel}>{journeyStoppingsErrorMessage}</Text>	
				)}
			</Card>

			
			<View style={{flexDirection: "row", justifyContent: "space-between"}}>
				<Button size="giant" style={{ flex: 3 , margin: 5, borderRadius:50, margin: 10}} onPress={()=>onCreatePress()}>Create</Button>
			</View>
			
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
