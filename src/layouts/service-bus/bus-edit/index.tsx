import { Button, Card, Text, Select, IndexPath, SelectItem , Input} from "@ui-kitten/components";
import React,{useEffect, useState, useRef} from "react";
import { StyleSheet, View, TextInput, PermissionsAndroid,ScrollView, Platform, TouchableOpacity} from "react-native";
import AppStore from "../../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";
import { toJS } from "mobx";
import {
	MaterialIcons as MDIcon,
} from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import BusPhotosAddCard from "../bus-photos-add/extra/busphotos-add-card.component";

import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import RBSheet from 'react-native-raw-bottom-sheet';
import { routeTypes, getRouteColor , vehcileTypes, getVehicleColor} from "../../../app/routes-common";

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import AntDesign from '@expo/vector-icons/AntDesign';

const BusEdit = ({ navigation }): React.ReactElement => {

	const refAutoComplete = useRef();

	const GOOGLE_GEO_API_KEY="AIzaSyDmFlx79dIq9lzTupQGttpE8m8eQ5ZS5yA"

	const appStore = useStore(AppStore);

	const refRBSheetRegistrationNumberEdit = useRef();

	const refRBSheetTitleEdit = useRef();

	const refRBSheetDescriptionEdit = useRef();

	const refRBSheetNoOfSeatsEdit = useRef();

	const client = axios.create({
		baseURL: 'https://routes.lk:7007'
	});

	const [regNoFocus, setRegNoFocus] = React.useState<boolean>(false);
	const regNoCustomStyle = regNoFocus ? styles.inputContainerFocus : styles.inputContainer;

	const [titleFocus, setTitleFocus] = React.useState<boolean>(false);
	const titleCustomStyle = titleFocus ? styles.inputContainerFocus : styles.inputContainer;

	const [descriptionFocus, setDescriptionFocus] = React.useState<boolean>(false);
	const descriptionCustomStyle = descriptionFocus ? styles.inputContainerFocus : styles.inputContainer;

	const [noOfSeatsFocus, setNoOfSeatsFocus] = React.useState<boolean>(false);
	const noOfSeatsCustomStyle = noOfSeatsFocus ? styles.inputContainerFocus : styles.inputContainer;

	const [registrationNumberErrorMessage, setRegistrationNumberErrorMessage] = React.useState<string>("");

	const [titleErrorMessage, setTitleErrorMessage] = React.useState<string>("");

	const [descriptionErrorMessage, setDescriptionErrorMessage] = React.useState<string>("");

	const [photosErrorMessage, setPhotosErrorMessage] = React.useState<string>("");

	const [journeyStoppingsErrorMessage, setJourneyStoppingsErrorMessage] = React.useState<string>("");

	const [returnJourneyStoppingsErrorMessage, setReturnJourneyStoppingsErrorMessage] = React.useState<string>("");

	const [transportServices, setTransportServices] = useState([]);
	const [selectedIndexTransportServices, setSelectedIndexTransportServices] = React.useState<IndexPath | IndexPath[]>(new IndexPath(-1));
	const transportService = transportServices[selectedIndexTransportServices.row]?.name;

	const [selectedStopping, setSelectedStopping] = React.useState<number>(0);

	const data = [
		'Van',
		'Mini Bus',
		'Bus',
		'Luxury Bus',
	];

	const [selectedIndex, setSelectedIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const vehcileType = vehcileTypes[selectedIndex.row].name;


	const [selectedIndexBusType, setSelectedIndexBusType] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const routeType = routeTypes[selectedIndexBusType.row].name;


	const onSelectColor = ({ hex }) => {
		console.log(hex);
		appStore.transportService.setThemeColor(hex);
	};

	const onVehicleTypeSelect = (index): void => {
		setSelectedIndex(index);
		appStore.bus.setVehicleType(vehcileTypes[index-1].name);
	};

	
	const onBusTypeSelect = (index): void => {
		setSelectedIndexBusType(index);
		appStore.bus.setRouteType(routeTypes[index-1].name);
	};

	const getIndexNumber = (vehicleType): number => {	
		var myindex = 0;
		vehcileTypes.map(function(element, index){
			if(element.name == vehicleType){
				myindex=index;
			}
		});
		return myindex;
	};

	const getRouteTypeIndexNumber = (routeType): number => {
	
		var myindex = 0;
		routeTypes.map(function(element, index){
			if(element.name == routeType){
				myindex=index;
			}
		});
		return myindex;
	};

	const getTransportServiceIndexNumber = (transportServiceName): number => {
	
		var myindex = 0;
		data.map(function(element, index){
			if(element == transportServiceName){
				console.log("index:::"+index);
				myindex=index;
			}
		});
		return myindex;
	};

	async function hasAndroidPermission() {
		if (Platform.OS === 'android') {
			const permission = PermissionsAndroid.PERMISSIONS.READ_CONTACTS;
			const hasPermission = await PermissionsAndroid.check(permission);
			if (hasPermission) {
				console.log("Contacts permission already given::");
				return true;
			}
			const status = await PermissionsAndroid.request(permission);
			console.log("Contacts permission status::"+status);
			return status === 'granted';
		}
		return true;
	}

	useEffect(() => {
		
		var indexNo = getIndexNumber(appStore.bus.vehicleType)
        setSelectedIndex(new IndexPath(indexNo));

		var routeTypeIndexNo = getRouteTypeIndexNumber(appStore.bus.routeType)
        setSelectedIndexBusType(new IndexPath(routeTypeIndexNo));

		var transportServiceIndexNo = getTransportServiceIndexNumber(appStore.bus.transportServiceName)
        setSelectedIndexTransportServices(new IndexPath(transportServiceIndexNo));

	}, []);
	
	
	const onUpdatePress = async() => {
		console.log(JSON.stringify(toJS(appStore.transportService)));	

		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };
		  try {
			  if(isValidValues()){
				console.log("Input is valid...");
				const response: AxiosResponse = await client.post(`/buses/update`, appStore.bus , config);
				console.log(response.status);
				console.log(response.data.json); 
				//navigation && navigation.navigate("BusDetails",{reload: true});
			  }
		  } catch(err) {
			console.log(err);
		  }  
	}

	const onUpdatePress1 = async() => {
		console.log(JSON.stringify(toJS(appStore.bus)));	
	}

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

		if(!appStore.bus.description){
			setDescriptionErrorMessage("Description is mandatory");	
			inputValid =false;
		}

		if(appStore.bus.photos && appStore.bus.photos.length == 0){
			setPhotosErrorMessage("At least one photo should be there");
			inputValid =false;	
		}

		if(appStore.bus.journey && appStore.bus.journey.stoppings && appStore.bus.journey.stoppings.length < 2){
			setJourneyStoppingsErrorMessage("At least 2 stoppings should be there");
			inputValid =false;	
		}

		if(appStore.bus.returnJourney && appStore.bus.returnJourney.stoppings && appStore.bus.returnJourney.stoppings.length < 2){
			setReturnJourneyStoppingsErrorMessage("At least 2 stoppings should be there");
			inputValid =false;	
		}
		return inputValid;
		
	};

	const renderOption = (vehcileType): React.ReactElement => (
		<SelectItem title={evaProps => <View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
			<FontAwesome5 name="bus" size={24} color={getVehicleColor(vehcileType.name)} />
			<Text style={{ paddingHorizontal: 5}}>{vehcileType.name}</Text>
		</View>} />
	);

	const renderOptionBusTypes = (routeType): React.ReactElement => (
		<SelectItem title={evaProps => <View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
			<FontAwesome5 name="bus" size={24} color={getRouteColor(routeType.name)} />
			<Text style={{ paddingHorizontal: 5}}>{routeType.name}</Text>
		</View>} />
	);

	const onRegistrationNumberChange = (value): void => {
		if(value?.length == 0){
			setRegistrationNumberErrorMessage("Vehicle registration number should be non empty");
		}else{
			setRegistrationNumberErrorMessage("");
		}
		appStore.bus.setRegistrationNumber(value)
	};

	const onTitleChange = (value): void => {
		if(value?.length == 0){
			setTitleErrorMessage("Title should be non empty");	
		}else{
			setTitleErrorMessage("");
		}
		appStore.bus.setTitle(value)
	};

	function errorMessageHandler(value) {
		setPhotosErrorMessage(value);
	}

	const onAddStopping = (index: number) => () =>  {
		console.log("selectedIndex::"+index);
		setSelectedStopping(index);
		// setUploadPhotos(prevState => !prevState);
	 };
 
	 const onDeleteStopping = (index: number) => () =>  {
		 appStore.bus.deleteStopping(index);
	 };
	
	return (
		
		<ScrollView>
			
			<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
				<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
					<View style={{flexDirection: "row", justifyContent: "space-between"}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Transport Service</Text>
					</View>
					
					<View style={{ margin: 10}}>
						<View><Text style={{ margin: 5, padding: 10, backgroundColor: "#eee"}}>{appStore.bus.transportServiceName}</Text></View>
					</View>
				</View>
			</View>

			<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
				<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
					<Text style={{ padding: 5, paddingLeft: 10}}>Route Type</Text>
					<View style={{ margin: 10}}>
						<Select
							placeholder='Default'
							value={routeType}
							selectedIndex={selectedIndexBusType}
							onSelect={(index: IndexPath) => onBusTypeSelect(index)}>
							{routeTypes.map(renderOptionBusTypes)}
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
						value={vehcileType}
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
						<Text style={styles.label}>Reg. No</Text>
					</View>
					<View style={regNoCustomStyle}>
						<TextInput style={styles.captionText} placeholder="wpNF-9999" onChangeText={onRegistrationNumberChange} value={appStore.bus.registrationNumber} onFocus={() => setRegNoFocus(true)} onBlur={() => setRegNoFocus(false)} />
					</View>	
					{registrationNumberErrorMessage!="" && (
						<Text style={styles.errorLabel}>{registrationNumberErrorMessage}</Text>	
					)}
				</View>

				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>Title</Text>
					</View>
					<View style={titleCustomStyle}>
						<TextInput style={styles.captionText} placeholder="Kandy to Comobo" onChangeText={onTitleChange} value={appStore.bus.title} onFocus={() => setTitleFocus(true)} onBlur={() => setTitleFocus(false)} />
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
					{appStore.bus.stoppings.map(function(stopping, index){
						if(index == selectedStopping){
							return <TouchableOpacity key={"stopping_"+stopping.place}  style={{flexDirection: "row" ,borderWidth: 1, padding: 2, margin: 2, borderColor: "#222"}} onPress={onAddStopping(index)}>
										<Text style={{padding: 2}}>{stopping.place}</Text>
										<AntDesign style={{top: 4}} name="close" size={18} color="red" onPress={onDeleteStopping(index)} />
								</TouchableOpacity>
						}else{
							return <TouchableOpacity key={"stopping_"+stopping.place}   style={{flexDirection: "row" ,borderWidth: 1, padding: 2, margin: 2, borderColor: "#bbb"}} onPress={onAddStopping(index)}>
										<Text style={{padding: 2}}>{stopping.place}</Text>
										<AntDesign style={{top: 4}} name="close" size={18} color="red" onPress={onDeleteStopping(index)} />
								</TouchableOpacity>
						}
						
					})}	
					</View>	
						<GooglePlacesAutocomplete
				ref={refAutoComplete}
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
				  onPress={(data, details = null) => {
					// 'details' is provided when fetchDetails = true
					console.log(data);
					console.log("*****");
					console.log(data.description)
				}}

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
					console.log("selectedIndex>>"+selectedIndex);
					if(selectedStopping > -1){
						console.log("####");
						appStore.bus.addStoppingAtIndex(address,details.geometry.location.lat,details.geometry.location.lng,"0.00AM",selectedStopping+1);
						setSelectedStopping(appStore.bus.stoppings.length-1);
					}else{
						appStore.bus.addStopping(address,details.geometry.location.lat,details.geometry.location.lng,"0.00AM");
					}
					
				}}

				onFail={(error) => console.error(error)}
			//AIzaSyBkNB1ivtCIuocCyLouDqAScIa755yctxs
			//
				query={{
					key: 'AIzaSyDmFlx79dIq9lzTupQGttpE8m8eQ5ZS5yA',
					language: 'en',
					components: 'country:lk',
					componentRestrictions:'country:lk',
				}}
			/>
					</View>	
					{descriptionErrorMessage!="" && (
						<Text style={styles.errorLabel}>{descriptionErrorMessage}</Text>	
					)}
				</View>

				
				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>No of seats</Text>
					</View>
					<View style={noOfSeatsCustomStyle}>
						<TextInput style={styles.captionText} keyboardType='numeric' placeholder="30" onChangeText={appStore.bus.setNoOfSeats} value={appStore.bus.noOfSeats} onFocus={() => setNoOfSeatsFocus(true)} onBlur={() => setNoOfSeatsFocus(false)} />
					</View>
				</View>

				
				
			</View>

			
			<Card style={{ margin: 10, borderRadius:10}} onPress={() => navigation.navigate("BusJourneyList")}>	
				<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
					<Text>Photos</Text>
					<BusPhotosAddCard navigation={navigation} errorMessageHandler={errorMessageHandler} update={true}/>
				</View>
				{photosErrorMessage!="" && (
					<Text style={styles.errorLabel}>{photosErrorMessage}</Text>	
				)}
			</Card>
			
			<Card style={{ margin: 10, borderRadius:10}} onPress={() => navigation.navigate("BusJourneyList")}>	
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Journey</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("BusJourneyList")}/>
				</View>
				{journeyStoppingsErrorMessage!="" && (
					<Text style={styles.errorLabel}>{journeyStoppingsErrorMessage}</Text>	
				)}
			</Card>

			<Card style={{ margin: 10, borderRadius:10}} onPress={() => navigation.navigate("BusReturnJourneyList")}>
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Return Journey</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("BusReturnJourneyList")}/>
				</View>
				{returnJourneyStoppingsErrorMessage!="" && (
					<Text style={styles.errorLabel}>{returnJourneyStoppingsErrorMessage}</Text>	
				)}
			</Card>

			<Card style={{ margin: 10, borderRadius:10}} onPress={() => navigation.navigate("BusDriversList",{readOnly: false})}>
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Drivers</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("BusDriversList",{readOnly: false})}/>
				</View>
			</Card>

			<Card style={{ margin: 10, borderRadius:10}} onPress={() => navigation.navigate("BusPassengers",{readOnly: false})}>
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Passengers</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("BusPassengers",{readOnly: false})}/>
				</View>
			</Card>
			

			<View style={{flexDirection: "row", justifyContent: "space-between"}}>
				<Button size="giant" style={{ flex: 3 , margin: 5, borderRadius:50, margin: 10}} onPress={()=>onUpdatePress()}>Update</Button>
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
	label: {
		color:"#142169"
	},
	captionText: {
		fontFamily: 'opensans-regular',
		color: '#333',
		flex: 1 
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
		borderColor: "#142169",
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

export default observer(BusEdit);
