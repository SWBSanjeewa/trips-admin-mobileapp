import { BottomNavigation, BottomNavigationTab, Button, Card, List, Text } from "@ui-kitten/components";
import React,{useState,useEffect,useCallback,useRef, forwardRef} from "react";
import { ImageBackground, ListRenderItemInfo, StyleSheet, View , ScrollView,Platform, ActivityIndicator} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Bus } from "../extra/data";

import { CachedImage } from '@georstat/react-native-image-cache';

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import AppStore from "../../../../store/AppStore";
import { useStore } from "mobx-store-provider";
import { HomeOutlineIcon, PersonOutlineIcon } from "../../../../components/icons";
import { useFocusEffect } from '@react-navigation/native';
import EvilIcons from '@expo/vector-icons/EvilIcons';

import { TranportServiceSuggestions}  from "../extra/transportservices-auto-suggestions"

const client = axios.create({
	baseURL: 'https://routes.lk:7007'
});

import {routeTypes, getRouteColor, vehcileTypes, getVehicleColor}  from "../../../../app/routes-common";

//import * as Device from 'expo-device';
//mport * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default ({ navigation , search, ref}): React.ReactElement => {
//export default React.forwardRef(({ navigation, search },refFrom) => {
//export const BusListCard = React.forwardRef(({navigation,search},ref) => {
	

	//const refAutoCompleteFrom = useRef();

	const refAutoCompleteTo = useRef();

	const GOOGLE_GEO_API_KEY="AIzaSyDmFlx79dIq9lzTupQGttpE8m8eQ5ZS5yA"

	const route = useRoute();

	const [busses, setBusses] = useState([]);

	const [forceRefresh, setForceRefresh] = React.useState(false);

	const [loading, setLoading] = useState(true);

	const [routeType, setRouteType] = React.useState("");

	const [transportService, setTransportService] = React.useState("");

	const [transportServiceId, setTransportServiceId] = React.useState("");

	const [expoPushToken, setExpoPushToken] = React.useState("");

	const [transportServiceSuggestionsList, setTransportServiceSuggestionsList] = useState(null)

	const dropdownController = useRef(null)

  	const searchRef = useRef(null);

	const [searchFrom, setSearchFrom] = React.useState("");

	const [searchTo, setSearchTo] = React.useState("");
	

	const appStore = useStore(AppStore);

	const [reload, setReload] = React.useState(false);
	
	const isBusOwner = (): boolean => {
		
		console.log("isBusOwner"+appStore.user.mobileNumber);
		if(appStore.user.role == "admin"){
			console.log("role is admin");
			return true;
		}
		
		appStore.bus.owners.map(function(owner, index){
			console.log("owner:"+owner);
			if(owner == appStore.user.mobileNumber){
				return true;
			}
		});
		console.log("not admin and owner:");

		return false;
	};

	function handleRegistrationError(errorMessage: string) {
		alert(errorMessage);
		throw new Error(errorMessage);
	  }

	

	const loadBusses = async(searchUrl) => {
		setLoading(true);
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };
		  try {
			console.log("appStore.user.accessToken::####"+appStore.user.accessToken);
			const userId = appStore.user.mobileNumber;
			
			const response: AxiosResponse = await client.get(searchUrl, config);
			console.log(response.status);
			console.log(response.data);  
			setBusses(response.data); 
			var owner = isBusOwner(); 
			console.log("Is owner::"+owner);
		  } catch(err) {
			console.log(searchUrl);
			console.log(err);
			
		  }  
		  setLoading(false);
		
	};
	

	const onItemPress = (info: ListRenderItemInfo<Bus>): void => {
		console.log("#### ref:"+ref.current.getAddressText());
		console.log("id:::"+busses[info.index]);
		const bus = busses[info.index];

		//console.log(" info.item._id"+ info.item._id+" journeyStartLatitude:"+bus.journey.stoppings[0].latitude);
		navigation && navigation.navigate("BusDetails", { id: info.item.id , journeyStartLatitude: bus.journey.stoppings[0].latitude, journeyStartLongitude: bus.journey.stoppings[0].longitude, returnJourneyStartLatitude: bus.returnJourney.stoppings[0].latitude, returnJourneyStartLongitude: bus.returnJourney.stoppings[0].longitude});
	};

	const renderItemHeader = (info: ListRenderItemInfo<Bus>): React.ReactElement => (
		<View>
			<View style={{padding: 5,flexDirection: "row", justifyContent: "flex-end"}}>
				<Button size="small" style={{ backgroundColor: getRouteColor(info.item.routeType) ,borderColor: getRouteColor(info.item.routeType)}} onPress={()=>onRouteTypePress(info.item.routeType)}>{info.item.routeType}</Button>
			</View>
			<CachedImage
				resizeMode="cover"
				style={styles.itemHeader} source={info.item.photos[0]} />
		</View>
	);

	const renderItemFooter = (info: ListRenderItemInfo<Bus>): React.ReactElement => (
		<View style={styles.itemFooter}>
			<View style={styles.itemAuthoringContainer}>
				<Text category="s2">{info.item.description}</Text>
			</View>
		</View>
	);

	const [selectedIndex, setSelectedIndex] = React.useState(0);

	
	const onSelect = (index: number): void => {
		if(index == 1)
			navigation.navigate("UserProfile");
	};

	const onTransportServicePress = (item): void => {
		
		setTransportService(item.transportServiceName);
		setTransportServiceId(item.transportServiceId);

		var url;
		if(routeType == ""){
			url = "/buses/byTransportService/"+item.transportServiceId;
		}else{
			url = "/buses/search/routeType/"+routeType+"/transportService/"+item.transportServiceId;
		}
		console.log("url::"+url);
		loadBusses(url);	
	};

	const onRouteTypePress = (routeType): void => {
		setRouteType(routeType);
		var url;
		if(transportService == ""){
			url = "/buses/byRouteType/"+routeType;
		}else{
			url = "/buses/search/routeType/"+routeType+"/transportService/"+transportServiceId;
		}
		console.log("url::"+url);
		loadBusses(url);	
	};

	

	const onTransportServiceClosePress = (): void => {
		setTransportService("");
		setTransportServiceId("");
		var url;
		if(routeType == ""){
			url = "/buses/getAll";
		}else{
			url = "/buses/byRouteType/"+routeType;
		}
		loadBusses(url);	
	};

	const onRouteTypeClosePress = (): void => {
		setRouteType("");
		var url;
		if(transportService == ""){
			url = "/buses/getAll";
		}else{
			url = "/buses/byTransportService/"+transportServiceId;
		}
		loadBusses(url);	
	};




	const renderItem = (info: ListRenderItemInfo<Bus>, index): React.ReactElement => (
		<Card
			style={styles.item}
			header={() => renderItemHeader(info)}
			//footer={() => renderItemFooter(info)}
			onPress={() => onItemPress(info)}>
			
			<Text category="h5">{info.item.title}</Text>
			<Text style={{ color: "grey" }}>{info.item.description}</Text>
			<View style={{flexDirection: "row"}}>
			{info.item.stoppings.map(function(stopping, index){	
				if(index==0 ){
					return <Text style={{ color: "grey"}}>{stopping}</Text>	
				}else{
					return <Text style={{ color: "grey"}}>- {stopping}</Text>	
				}							
			})}	
			</View>
			<View style={{paddingTop: 10, flexDirection: "row", justifyContent: "space-between"}}>
				{info.item.registrationNumber && (
				<Button appearance='ghost'  size="small"  style={{ borderColor:"#142169", borderWidth: 2}} >{info.item.registrationNumber}</Button>
				)}	
				<Button size="small" style={{ backgroundColor: info.item.transportServiceThemeColor,borderColor: info.item.transportServiceThemeColor}} onPress={()=>onTransportServicePress(info.item)}>{info.item.transportServiceName}</Button>
			</View>
			
		</Card>
	);

	const getTransportServiceSuggestions = useCallback(async q => {
		const filterToken = q.toLowerCase()
		console.log('getSuggestions', q)
		if (typeof q !== 'string' || q.length < 3) {
		  setTransportServiceSuggestionsList(null)
		  return
		}
		setLoading(true)
		
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
			//setTransportServices(response.data); 
			const items = await response.data;
			const suggestions = items
		  	.filter(item => item.name.toLowerCase().includes(filterToken))
			.map(item => ({
				id: item._id,
				title: item.name,
			}))
			setTransportServiceSuggestionsList(suggestions)
			setLoading(false) 
		  } catch(err) {
			console.log(err);
			setLoading(false);
		  }  
		
		
	  }, [])

	
	
	

	
	
	useFocusEffect(
		React.useCallback(() => {
			console.log("reload::::"+route.params?.reload);
			//if(route.params?.reload){
				loadBusses("/buses/getAll");
			//}
			
		  return () => {
			
		  };
		}, [route.params?.reload])
	);
	
	const onClearPress = useCallback(() => {
		setTransportServiceSuggestionsList(null)
	  }, [])
	
	  const onOpenSuggestionsList = useCallback(isOpened => {}, [])

	return (
		<ScrollView style={styles.parentContainer} > 

			{search && (
				<>
					<View style={{  padding: 1, margin: 5 ,flexDirection: "row", justifyContent: "space-between"}}>
						<Text style={styles.errorLabel}>Search Box</Text>
					</View>
					<View style={{  padding: 1, margin: 1,borderColor: "#eee", borderWidth: 1 ,flexDirection: "column", justifyContent: "flex-start"}}>
							<Text style={{  padding: 1, margin: 1}}>Route Type</Text>	
							<AutocompleteDropdown
								containerStyle={{ flexGrow: 1, flexShrink: 1 }}
								clearOnFocus={false}
								closeOnBlur={true}
								closeOnSubmit={false}
								initialValue={{ id: '2' }} // or just '2'
								dataSet={[
									{ id: '1', title: 'Alpha' },
									{ id: '2', title: 'Beta' },
									{ id: '3', title: 'Gamma' },
								]}/>
						
					</View>
					<View style={{  padding: 1, margin: 1,borderColor: "#eee", borderWidth: 1 ,flexDirection: "column", justifyContent: "flex-start"}}>
							<Text style={{  padding: 1, margin: 1}}>Transport Service</Text>			
							<TranportServiceSuggestions/>
					</View>

					

					<View style={{  padding: 1, margin: 1,borderColor: "#eee", borderWidth: 1 ,flexDirection: "column", justifyContent: "flex-start"}}>
							<Text style={{  padding: 1, margin: 1}}>From</Text>	
							<View>
							<GooglePlacesAutocomplete
								ref={ref}
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
					
										ref.current?.setAddressText(address);
										setSearchFrom(address);
										//setSearch({searchKeyword: data.description});
										
										
									}}

									onFail={(error) => console.error(error)}
								
									query={{
										key: 'AIzaSyBkNB1ivtCIuocCyLouDqAScIa755yctxs',
										language: 'en',
										components: 'country:lk',
										componentRestrictions:'country:lk',
									}}
								/>
						
						</View>

						<View style={{  padding: 1, margin: 1,borderColor: "#eee", borderWidth: 1 ,flexDirection: "column", justifyContent: "flex-start"}}>
							<Text style={{  padding: 1, margin: 1}}>To</Text>	
							<View>
							<GooglePlacesAutocomplete
								ref={refAutoCompleteTo}
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

										
					
										refAutoCompleteTo.current?.setAddressText(address);
										setSearchTo(address);
										//setSearch({searchKeyword: data.description});
										
										
									}}

									onFail={(error) => console.error(error)}

									
								
									query={{
										key: 'AIzaSyBkNB1ivtCIuocCyLouDqAScIa755yctxs',
										language: 'en',
										components: 'country:lk',
										componentRestrictions:'country:lk',
									}}
								/>
						</View>
						</View>
					</View>
					
					</>
				
			)}

			{routeType!="" && (
				<View style={{  padding: 10, margin: 5,borderColor: "#eee", borderWidth: 1 ,flexDirection: "row", justifyContent: "space-between"}}>
					<Text style={styles.errorLabel}>Route Type = {routeType}</Text>	
					<EvilIcons name="close" size={24} color="black" onPress={()=>onRouteTypeClosePress()}/>
				</View>
			)}

			{transportService!="" && (
				<View style={{  padding: 10, margin: 5,borderColor: "#eee", borderWidth: 1 ,flexDirection: "row", justifyContent: "space-between"}}>
					<Text style={styles.errorLabel}>Transport Service = {transportService}</Text>	
					<EvilIcons name="close" size={24} color="black" onPress={()=>onTransportServiceClosePress()}/>
				</View>
			)}

			{loading && (
			<ActivityIndicator/>
			)}

			<List
				contentContainerStyle={styles.listContent}
				data={busses}
				renderItem={renderItem}
			/>
			<View style={{ marginBottom: 0 }}>
				<BottomNavigation
					appearance="noIndicator"
					selectedIndex={selectedIndex}
					onSelect={onSelect}>
					<BottomNavigationTab title='Home'
						icon={HomeOutlineIcon}/>
					<BottomNavigationTab title='Profile'
						icon={PersonOutlineIcon}/>
					</BottomNavigation>
			</View>
			</ScrollView>
		
	);
};

const styles = StyleSheet.create({

	inputContainerLabel: {
		flex: 1,
		flexDirection: "row", 
		justifyContent: "space-between",
        padding: 2, // Also used to make it look nicer
    },
	inputContainerFocus: {
		flex: 5,
		flexDirection: "row", 
		justifyContent: "space-between",
		borderColor: "#142169",
        borderWidth: 1, // Create border
        borderRadius: 8, // Not needed. Just make it look nicer.
        padding: 2, // Also used to make it look nicer
        zIndex: 0, // Ensure border has z-index of 0
    },
	parentContainer: {
		//flexWrap: "wrap",
		//alignSelf: "center",
		flex: 1	
	},
	
	listContent: {
		paddingHorizontal: 0,
		paddingVertical: 0
	},
	item: {
		marginVertical: 18,
	    marginHorizontal: 8
	},
	itemHeader: {
		height: 220,
	},
	itemContent: {
		marginVertical: 8,
	},
	itemFooter: {
		flexDirection: "row",
		marginHorizontal: -8,
	},
	iconButton: {
		paddingHorizontal: 0,
	},
	itemAuthoringContainer: {
		flex: 1,
		justifyContent: "center",
		marginHorizontal: 16,
	},
});
