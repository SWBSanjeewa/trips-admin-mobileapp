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

import {routeBusTypes, getRouteColor, operatorTypes, transportAuthorityTypes}  from "../../../app/routes-common";

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

	const [routeNoFocus, setRouteNoFocus] = React.useState<boolean>(false);
	const routeNoCustomStyle = routeNoFocus ? styles.inputContainerFocus : styles.inputContainer;

	const [titleFocus, setTitleFocus] = React.useState<boolean>(false);
	const titleCustomStyle = titleFocus ? styles.inputContainerFocus : styles.inputContainer;


	const [routeNoErrorMessage, setRouteNoErrorMessage] = React.useState<string>("");

	const [titleErrorMessage, setTitleErrorMessage] = React.useState<string>("");

	

	const [journeyStoppingsErrorMessage, setJourneyStoppingsErrorMessage] = React.useState<string>("");

	const [returnJourneyStoppingsErrorMessage, setReturnJourneyStoppingsErrorMessage] = React.useState<string>("");



	const [selectedOperatorIndex, setSelectedOperatorIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const operatorType = operatorTypes[selectedOperatorIndex.row];

	const [selectedIndexBusType, setSelectedIndexBusType] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const routeType = routeBusTypes[selectedIndexBusType.row];

	const [selectedIndexTransportAuthorityType, setSelectedIndexTransportAuthorityType] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const transportAuthorityType = transportAuthorityTypes[selectedIndexTransportAuthorityType.row];


	const [selectedStopping, setSelectedStopping] = React.useState<string>("");
	

	const onBusTypeSelect = (index): void => {
		setSelectedIndexBusType(index);
		appStore.routeBus.setTypeOfService(routeBusTypes[index-1].name);
	};

	const onOperatorTypeSelect = (index): void => {
		setSelectedOperatorIndex(index);
		appStore.routeBus.setOperator(operatorTypes[index-1].name);
	};

	const onTransportAuthorityTypeSelect = (index): void => {
		setSelectedIndexTransportAuthorityType(index);
		appStore.routeBus.setTransportAuthority(transportAuthorityTypes[index-1].name);
	};


	

	const isValidValues = (): any => {
		
		var inputValid =true;

		
		return inputValid;
		
	};

	

	const onCreatePress1= async() => {
		console.log(JSON.stringify(toJS(appStore.routeBus)));	
	}

	const onCreatePress = async() => {
		console.log(JSON.stringify(toJS(appStore.routeBus)));	


		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };
		  try {
			  
			  if(isValidValues()){
				const response: AxiosResponse = await client.post(`/routebuses/create`, appStore.routeBus , config);
				console.log(response.status);
				console.log(response.data.json); 
				appStore.routeBus.reset();
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

	

	const onRouteNoChange = (value): void => {
		if(value.length != 0){
			setRouteNoErrorMessage("");
		}
		appStore.routeBus.setRouteNo(value);
	};

	const onTitleChange = (value): void => {
		if(value.length != 0){
			setTitleErrorMessage("");
		}
		appStore.routeBus.setTitle(value);
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

	const onDeleteStoppingPlace = (stopping: string) => () =>  {
		appStore.routeBus.deleteStoppingPlaceByPlace(stopping);
	};

	
	
	return (
		
		<ScrollView keyboardShouldPersistTaps='handled'>
			
			<View>

				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Transport Authority Type</Text>
						<View style={{ margin: 10}}>
							<Select
								placeholder='Default'
								value={transportAuthorityType.name}
								selectedIndex={selectedIndexTransportAuthorityType}
								onSelect={(index: IndexPath) => onTransportAuthorityTypeSelect(index)}>
								{transportAuthorityTypes.map(renderOptionBusTypes)}
							</Select>
						</View>
					</View>
				</View>

				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Service Type</Text>
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

				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Operator Type</Text>
						<View style={{ margin: 10}}>
							<Select
								placeholder='Default'
								value={operatorType.name}
								selectedIndex={selectedOperatorIndex}
								onSelect={(index: IndexPath) => onOperatorTypeSelect(index)}>
								{operatorTypes.map(renderOptionBusTypes)}
							</Select>
						</View>
					</View>
				</View>
			
				
				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>Title</Text>
					</View>
					<View style={titleCustomStyle}>
						<TextInput style={styles.captionText} placeholder="Kandy to Comobo" onChangeText={onTitleChange} value={appStore.routeBus.title} onFocus={() => setTitleFocus(true)} onBlur={() => setTitleFocus(false)} />
					</View>	
					{titleErrorMessage!="" && (
						<Text style={styles.errorLabel}>{titleErrorMessage}</Text>	
					)}
				</View>

				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>Route No</Text>
					</View>
					<View style={routeNoCustomStyle}>
						<TextInput style={styles.captionText} placeholder="01" onChangeText={onRouteNoChange} value={appStore.routeBus.routeNo} onFocus={() => setRouteNoFocus(true)} onBlur={() => setRouteNoFocus(false)} />
					</View>	
					{routeNoErrorMessage!="" && (
						<Text style={styles.errorLabel}>{routeNoErrorMessage}</Text>	
					)}
				</View>

			

				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>Stopping Locations</Text>
					</View>
					<View style={styles.descriptionInputContainer}>
					<View style={{flexDirection: "row", flexWrap: "wrap"}}>
					{appStore.routeBus.stoppingPlaces.map(function(stopping, index){
						if(stopping == selectedStopping){
							return <TouchableOpacity style={{flexDirection: "row" ,borderWidth: 1, padding: 2, margin: 2, borderColor: "#222"}} onPress={onAddStopping(stopping)}>
										<Text style={{padding: 2}}>{stopping.place}</Text>
										<AntDesign style={{top: 4}} name="close" size={18} color="red" onPress={onDeleteStoppingPlace(stopping.place)} />
								</TouchableOpacity>
						}else{
							return <TouchableOpacity style={{flexDirection: "row" ,borderWidth: 1, padding: 2, margin: 2, borderColor: "#bbb"}} onPress={onAddStopping(stopping)}>
										<Text style={{padding: 2}}>{stopping.place}</Text>
										<AntDesign style={{top: 4}} name="close" size={18} color="red" onPress={onDeleteStoppingPlace(stopping.place)} />
								</TouchableOpacity>
						}
						
					})}	
					</View>	
						<GooglePlacesAutocomplete
				keyboardShouldPersistTaps={ "handled" }
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
					
					if(selectedStopping != ""){
						var index = appStore.routeBus.getIndex(selectedStopping);
						appStore.routeBus.addStoppingPlaceAtIndex(address,details.geometry.location.lat.toString(),details.geometry.location.lng.toString(),index+1);
						setSelectedStopping("");
					}else{
						appStore.routeBus.addStoppingPlace(address,details.geometry.location.lat.toString(),details.geometry.location.lng.toString());
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
					
				</View>

				
				
			</View>

			
		
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
