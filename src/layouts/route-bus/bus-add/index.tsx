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

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import {routeBusTypes, getRouteColor, vehcileTypes, getVehicleColor}  from "../../../app/routes-common";

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import AntDesign from '@expo/vector-icons/AntDesign';


const BusAdd = ({ navigation }): React.ReactElement => {

	const refAutoComplete = useRef(null);

	const GOOGLE_GEO_API_KEY="AIzaSyDmFlx79dIq9lzTupQGttpE8m8eQ5ZS5yA"

	const appStore = useStore(AppStore);

	const [loading, setLoading] = useState(true);

	const route = useRoute();

	const client = axios.create({
		baseURL: 'https://routes.lk:7007'
	});

	const [regNoFocus, setRegNoFocus] = React.useState<boolean>(false);
	const regNoCustomStyle = regNoFocus ? styles.inputContainerFocus : styles.inputContainer;

	const [titleFocus, setTitleFocus] = React.useState<boolean>(false);
	const titleCustomStyle = titleFocus ? styles.inputContainerFocus : styles.inputContainer;


	const [registrationNumberErrorMessage, setRegistrationNumberErrorMessage] = React.useState<string>("");

	const [titleErrorMessage, setTitleErrorMessage] = React.useState<string>("");

	

	const [journeyStoppingsErrorMessage, setJourneyStoppingsErrorMessage] = React.useState<string>("");

	const [returnJourneyStoppingsErrorMessage, setReturnJourneyStoppingsErrorMessage] = React.useState<string>("");



	const [selectedIndex, setSelectedIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const vehcileType = vehcileTypes[selectedIndex.row];

	const [selectedIndexBusType, setSelectedIndexBusType] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const routeType = routeBusTypes[selectedIndexBusType.row];


	const [selectedStopping, setSelectedStopping] = React.useState<string>("");



	const onVehicleTypeSelect = (index): void => {
		console.log("Slected index:"+index);
		setSelectedIndex(index);
		
		appStore.bus.setVehicleType(vehcileTypes[index-1].name);
	};

	const onTransportServiceSelect = (index): void => {
		setSelectedIndexTransportServices(index);
		appStore.bus.setTransportServiceId(transportServices[index-1]._id);
		appStore.bus.setTransportServiceName(transportServices[index-1].name);
		appStore.bus.setTransportServiceThemeColor(transportServices[index-1].themeColor);
	};

	const onBusTypeSelect = (index): void => {
		setSelectedIndexBusType(index);
		appStore.bus.setRouteType(routeBusTypes[index-1].name);
	};

	const isValidValues = (): any => {
		
		var inputValid =true;

		if(!appStore.bus.transportServiceId){
			console.log("$$$$"+appStore.bus.transportServiceId);
			setTransportServiceErrorMessage("Transport service is mandatory");	
			inputValid =false;
		}

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

	

	const onCreatePress1 = async() => {
		console.log(JSON.stringify(toJS(appStore.bus)));	
	}

	const onCreatePress = async() => {
		console.log(JSON.stringify(toJS(appStore.bus)));	


		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };
		  try {
			  
			  if(isValidValues()){
				const response: AxiosResponse = await client.post(`/buses/create`, appStore.bus , config);
				console.log(response.status);
				console.log(response.data.json); 
				appStore.bus.reset();
				navigation && navigation.navigate("BusHome", {reload: true});
			  }
			  
		  } catch(err) {
			console.log(err);
		  }  
	}

	

	const renderOptionBusTypes = (routeType): React.ReactElement => (
		<SelectItem key={routeType.name} title={evaProps => <View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
			<FontAwesome5 name="bus" size={24} color={getRouteColor(routeType.name)} />
			<Text style={{ paddingHorizontal: 5}}>{routeType.name}</Text>
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
		appStore.bus.setTitle(value);
	};

	

	const onNavigateToJourney = (): void => {
		setJourneyStoppingsErrorMessage("");
		navigation.navigate("BusJourneyList")
	};

	
	const onAddStopping = (stopping: string) => () =>  {
       console.log(stopping);
	   setSelectedStopping(stopping);
       // setUploadPhotos(prevState => !prevState);
    };

	const onDeleteStopping = (stopping: string) => () =>  {
		appStore.bus.deleteStopping(stopping);
	};

	
	
	return (
		
		<ScrollView>
			
			<View>
			
				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>Route No</Text>
					</View>
					<View style={regNoCustomStyle}>
						<TextInput style={styles.captionText} placeholder="01" onChangeText={onRegistrationNumberChange} value={appStore.bus.registrationNumber} onFocus={() => setRegNoFocus(true)} onBlur={() => setRegNoFocus(false)} />
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
						if(stopping == selectedStopping){
							return <TouchableOpacity style={{flexDirection: "row" ,borderWidth: 1, padding: 2, margin: 2, borderColor: "#222"}} onPress={onAddStopping(stopping)}>
										<Text style={{padding: 2}}>{stopping}</Text>
										<AntDesign style={{top: 4}} name="close" size={18} color="red" onPress={onDeleteStopping(stopping)} />
								</TouchableOpacity>
						}else{
							return <TouchableOpacity style={{flexDirection: "row" ,borderWidth: 1, padding: 2, margin: 2, borderColor: "#bbb"}} onPress={onAddStopping(stopping)}>
										<Text style={{padding: 2}}>{stopping}</Text>
										<AntDesign style={{top: 4}} name="close" size={18} color="red" onPress={onDeleteStopping(stopping)} />
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
					if(selectedStopping != ""){
						var index = appStore.routeBus.getIndex(selectedStopping);
						appStore.routeBus.addStoppingAtIndex(address,index+1);
						setSelectedStopping("");
					}else{
						appStore.routeBus.addStopping(address);
					}
					
				}}

				onFail={(error) => console.error(error)}
			
				predefinedPlaces={[]}
				query={{
					key: 'AIzaSyDmFlx79dIq9lzTupQGttpE8m8eQ5ZS5yA',
					language: 'en',
					components: 'country:lk',
					componentRestrictions:'country:lk',
					libraries: 'places'
				}}
			/>
					</View>	
					
				</View>

				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Road Type</Text>
						<View style={{ margin: 10}}>
							<Select
								placeholder='Default'
								value={routeType.name}
								selectedIndex={selectedIndexBusType}
								onSelect={(index: IndexPath) => onBusTypeSelect(index)}>
								{routeBusTypes.map(renderOptionBusTypes)}
							</Select>
						</View>
					</View>
				</View>
				
			</View>

			
			<Card style={{ margin: 10, borderRadius:10}} onPress={onNavigateToJourney}>	
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Timetables</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={onNavigateToJourney}/>
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
