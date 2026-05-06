import { BottomNavigation, BottomNavigationTab, Button, Card, List, Text ,Input, IndexPath, SelectItem} from "@ui-kitten/components";
import React,{useState,useEffect,useCallback,useRef, forwardRef} from "react";
import { TextInput, ListRenderItemInfo, StyleSheet, View , ScrollView,SafeAreaView, ActivityIndicator} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Bus } from "./extra/data";

import { CachedImage } from '@georstat/react-native-image-cache';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SafeAreaLayout } from "./../../../components/safe-area-layout.component";

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import AppStore from "../../../store/AppStore";
import { useStore } from "mobx-store-provider";
import { HomeOutlineIcon, PersonOutlineIcon } from "../../../components/icons";
import { useFocusEffect } from '@react-navigation/native';
import EvilIcons from '@expo/vector-icons/EvilIcons';

import { TranportServiceSuggestions}  from "./extra/transportservices-auto-suggestions"

const client = axios.create({
	baseURL: 'https://routes.lk:7007'
});

import { useSafeAreaInsets } from "react-native-safe-area-context";

import {routeTypes, getRouteColor, vehcileTypes, getVehicleColor}  from "../../../app/routes-common";

//import * as Device from 'expo-device';
//import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { AutocompleteDropdown ,IAutocompleteDropdownRef} from 'react-native-autocomplete-dropdown';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AntDesign from '@expo/vector-icons/AntDesign';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { toJS } from "mobx";


//export default ({ navigation , search}): React.ReactElement => {
export default React.forwardRef(({ navigation,searchCallback, search },ref) => {
	
	const { refFrom, refTo ,refScrollView} = ref;
	//const refAutoCompleteFrom = useRef();

	const refAutoCompleteTo = useRef();

	const insetsConfig = useSafeAreaInsets();

	const routeTypeRef = useRef<typeof IAutocompleteDropdownRef>();

	const GOOGLE_GEO_API_KEY="AIzaSyDmFlx79dIq9lzTupQGttpE8m8eQ5ZS5yA"

	const route = useRoute();

	//const [busses, setBusses] = useState([]);

	
	const [searchClose, setSearchClose] = React.useState(false);

	const [forceRefresh, setForceRefresh] = React.useState(false);

	const [localSearch, setLocalSearch] = React.useState(true);

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

	const [selectedIndexBusType, setSelectedIndexBusType] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const searchRouteType = routeTypes[selectedIndexBusType.row];

	const ItemSeparatorComponent = () => <View style={{ height: 1, width: '100%', backgroundColor: '#d8e1e6' }} />

	const InputComponent = () => <TextInput  value={appStore.searchContext.type} />
	

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

	//  ExponentPushToken[OyLQqtNccNC_aSC5SchhdR]
	/*
	async function registerForPushNotificationsAsync() {
		if (Platform.OS === 'android') {
		  Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		  });
		}
	  
		if (Device.isDevice) {
		  const { status: existingStatus } = await Notifications.getPermissionsAsync();
		  let finalStatus = existingStatus;
		  if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		  }
		  console.log("Permission Granted:"+finalStatus);
		  if (finalStatus !== 'granted') {
			handleRegistrationError('Permission not granted to get push token for push notification!');
			return;
		  }
		  console.log();
		  const projectId =
			Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
		  if (!projectId) {
			handleRegistrationError('Project ID not found');
		  }
		  try {
			const pushTokenString = (
			  await Notifications.getExpoPushTokenAsync({
				projectId,
			  })
			).data;
			console.log(pushTokenString);
			return pushTokenString;
		  } catch (e: unknown) {
			handleRegistrationError(`${e}`);
		  }
		} else {
		  handleRegistrationError('Must use physical device for push notifications');
		}
	  }
		*/
	// /byRouteType/:routeType"
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
			console.log("routeType::####"+appStore.bus.routeType);
			
			const response: AxiosResponse = await client.get(searchUrl, config);
			console.log(response.status);
			console.log(response.data);  
			//setBusses(response.data); 
			appStore.busses.reset();
			response.data.forEach((element) => appStore.busses.addBus(element.id,element.objectId,element.transportServiceId,element.transportServiceName,element.transportServiceThemeColor,element.vehicleType,element.routeType,element.registrationNumber,element.title,element.description,element.stoppings,element.photos, element.journey.stoppings[0].latitude,element.journey.stoppings[0].longitude,element.returnJourney.stoppings[0].longitude,element.returnJourney.stoppings[0].longitude));
			console.log(">>>"+appStore.busses.busses.length);
			var owner = isBusOwner(); 
			console.log("Is owner::"+owner);
		  } catch(err) {
			console.log(searchUrl);
			console.log(err);
			
		  }  
		  setLoading(false);
	};

	const searchBussesBck = async(searchUrl) => {
		JSON.stringify(appStore.searchContext);
	}
	
	const searchBusses = async(searchUrl) => {
		setLoading(true);
		const config: AxiosRequestConfig = {
			params: {
				"routeType": appStore.searchContext.type,
				"transportServiceName": appStore.searchContext.transportServiceName,
				"from": appStore.searchContext.from,
				"to": appStore.searchContext.to,
			},
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


	const onSearchClosePress = (): void => {	
		appStore.searchContext.reset();
		searchCallback(false);
		loadBusses("/buses/getAll");	
	};

	const onSearchPress = (): void => {
		console.log(JSON.stringify(toJS(appStore.searchContext)));	
		searchBusses("/buses/search");
		//loadBusses("/buses/search/routeType/"+appStore.searchContext.type+
		//"/transportService/"+appStore.searchContext.transportServiceName+
		//"/from/"+appStore.searchContext.from+
		//"/to/"+appStore.searchContext.to);
	};


	const onItemPress = (info: ListRenderItemInfo<Bus>): void => {
		
		
		const bus = appStore.busses.busses[info.index];
		console.log(bus.title);
		//console.log(" info.item._id"+ info.item._id+" journeyStartLatitude:"+bus.journey.stoppings[0].latitude);
		navigation && navigation.navigate("BusDetails", { id: bus.id , journeyStartLatitude: bus.journeyStartLatitude, journeyStartLongitude: bus.journeyStartLongitude, returnJourneyStartLatitude: bus.returnJourneyStartLatitude, returnJourneyStartLongitude: bus.returnJourneyStartLongitude});
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

	function searchCloseOk(){
		if(localSearch)
			return true;
		else{
			if(!search){
				return true;
			}
		}
		return false;
	};


	const renderItem = (info: ListRenderItemInfo<Bus>, index): React.ReactElement => (
		<Card
			style={styles.item}
			header={() => renderItemHeader(info)}
			//footer={() => renderItemFooter(info)}
			onPress={() => onItemPress(info)}
		>
			
			<Text category="h5">{info.item.title}</Text>
			<View style={{flexDirection: "row"}}>
				<Text>
				{info.item.stoppings.map(function(stopping, index){	
					if(index==0 ){
						return <Text style={{ color: "grey"}}>{stopping.place}</Text>	
					}else{
						return <Text style={{ color: "grey"}}>- {stopping.place}</Text>	
					}							
				})}	
				</Text>
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

	const onBusTypeSelect = (index): void => {
		setSelectedIndexBusType(index);
		appStore.searchContext.setType(routeTypes[index-1].name);
	};
	
	/*
	useEffect(() => {
		registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));
	}, []);
	*/
	
	const renderOptionBusTypes = (routeType): React.ReactElement => (
		<SelectItem key={routeType.name} title={evaProps => <View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
			<FontAwesome5 name="bus" size={24} color={getRouteColor(routeType.name)} />
			<Text style={{ paddingHorizontal: 5}}>{routeType.name}</Text>
		</View>} />
	);

	const onRouteTypeSelect = (value): void => {
		console.log("Selected route Id:"+value?.id);
		appStore.searchContext.setRouteTypeIndex(value?.id);
		appStore.searchContext.setType(value?.title);
	};

	/*
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
	*/

	// appStore.bus.setRouteType("school-service");
	useFocusEffect(
		React.useCallback(() => {
			
			console.log("reload::::"+route.params?.reload);
			if(route.params?.reload){
				loadBusses("/buses/byRouteType/"+appStore.bus.routeType);
			}else{
				setLoading(false);
			}
			console.log("busses:::"+appStore.busses.busses.length);
			
		  return () => {
			
		  };
		}, [route.params?.reload])
	);
	
	const onClearPress = useCallback(() => {
		setTransportServiceSuggestionsList(null)
	  }, [])
	
	  const onOpenSuggestionsList = useCallback(isOpened => {}, [])

	return (
		<SafeAreaLayout style={styles.parentContainer}>
		
		<ScrollView ref={refScrollView } keyboardShouldPersistTaps="always"> 
			
			{search && (
				//!appStore.searchContext.close && (
				<View>  
					<View style={{  padding: 1, margin: 5 ,flexDirection: "row", justifyContent: "flex-end"}}>
						
						<AntDesign style={{top: 4}} name="close" size={18} color="#444" onPress={onSearchClosePress} />
					</View>
					
					<View style={{  padding: 1, margin: 0,borderColor: "#eee", borderWidth: 0 ,flexDirection: "column", justifyContent: "flex-start"}}>
							<Text style={{  padding: 1, margin: 1, paddingLeft: 5}}>Route Type</Text>			
							<View style={{ margin: 2}}>
							<AutocompleteDropdown
								ref={routeTypeRef}
								containerStyle={{ flexGrow: 1, flexShrink: 1 }}
								clearOnFocus={false}
								closeOnBlur={true}
								closeOnSubmit={false}
								initialValue={{ id: appStore.searchContext.routeTypeIndex }} // or just '2'
								onSelectItem={onRouteTypeSelect}
								ItemSeparatorComponent={ItemSeparatorComponent}
								inputContainerStyle={{
									backgroundColor: '#eee',
									borderRadius: 25,
								}}
								dataSet={[
									{ id: '1', title: 'Any' },
									{ id: '2', title: 'staff-service' },
									{ id: '3', title: 'school-service' },
									{ id: '4', title: 'route' },
									{ id: '5', title: 'other' },
								]}/>
						</View>
					</View>
					<View style={{  padding: 1, margin: 1,borderColor: "#eee", borderWidth: 0 ,flexDirection: "column", justifyContent: "flex-start"}}>
							<Text style={{  padding: 1, margin: 1, paddingLeft: 5}}>Transport Service</Text>			
							<TranportServiceSuggestions/>
					</View>
					<View style={{  padding: 1, margin: 1 ,flexDirection: "column", justifyContent: "flex-start"}}>
							<Text style={{  padding: 1, margin: 1, paddingLeft: 5}}>From</Text>	
							<View>
							<GooglePlacesAutocomplete
								keyboardShouldPersistTaps={'always'}
								ref={refFrom }
								styles={{
									container:{
										borderColor: "#fff",
										borderWidth: 1,
										backgroundColor: '#eee',
										borderRadius: 25,		 
									},
									textInputContainer: {
										marginTop: 2,
										padding: 5,
										borderColor: 'green',
										backgroundColor: '#11',
										borderWidth: 0,
										borderRadius: 25,
									},
									textInput: {
										height: 25,
										color: '#111',
										fontSize: 16, 
										backgroundColor: '#eee',
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
									placeholder={appStore.searchContext.from}
									
									textInputProps={{
										selectionColor:"#142169",
										cursorColor:"#142169",
										placeholderTextColor:"#444"
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
					
										refFrom.current?.setAddressText(address);
										setSearchFrom(address);
										appStore.searchContext.setFrom(address);
										//setSearch({searchKeyword: data.description});
										
										
									}}

									onFail={(error) => console.error(error)}
									predefinedPlaces={[]}
									minLength={3}
									debounce={200}
									timeout={20000}
									query={{
										key: 'AIzaSyDmFlx79dIq9lzTupQGttpE8m8eQ5ZS5yA',
										language: 'en',
										components: 'country:lk',
										componentRestrictions:'country:lk',
									}}
								/>
						
						</View>

						<View style={{  padding: 1, margin: 1,borderColor: "#eee", borderWidth: 0 ,flexDirection: "column", justifyContent: "flex-start"}}>
							<Text style={{  padding: 1, margin: 1, paddingLeft: 5}}>To</Text>	
							<View>
							<GooglePlacesAutocomplete
							    keyboardShouldPersistTaps="always"
								ref={refTo }
								styles={{
									container:{
										borderColor: "#fff",
										borderWidth: 1,
										backgroundColor: '#eee',
										borderRadius: 25,		 
									},
									textInputContainer: {
										marginTop: 2,
										padding: 5,
										borderColor: 'green',
										backgroundColor: '#11',
										borderWidth: 0,
										borderRadius: 25,
									},
									textInput: {
										height: 25,
										color: '#111',
										fontSize: 16, 
										backgroundColor: '#eee',
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
									placeholder={appStore.searchContext.to}
									textInputProps={{
										selectionColor:"#142169",
										cursorColor:"#142169",
										placeholderTextColor:"#444"
									}}
									minLength={3}
									
									
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

										
					
										refTo.current.setAddressText(address);
										appStore.searchContext.setTo(address);
										setSearchTo(address);
										//setSearch({searchKeyword: data.description});
										
										
									}}

									onFail={(error) => console.error(error)}

									debounce={200}
									timeout={20000}
									predefinedPlaces={[]}
								
									query={{
										key: 'AIzaSyDmFlx79dIq9lzTupQGttpE8m8eQ5ZS5yA',
										language: 'en',
										components: 'country:lk',
										componentRestrictions:'country:lk',
									}}
								/>
						</View>
						</View>
					</View>
					<View style={{paddingTop: 10, paddingRight: 20,flexDirection: "row", justifyContent: "flex-end"}}>
						<Button size="small" onPress={()=>onSearchPress()}>Search</Button>
					</View>
					
					</View>
				
				//)
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
				data={appStore.busses.busses}
				renderItem={renderItem}
			/>
				</ScrollView>
			
		</SafeAreaLayout>
	);
});

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
