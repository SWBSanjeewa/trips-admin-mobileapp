import { BottomNavigation, BottomNavigationTab, Button, Card, List, Text ,Input, IndexPath, SelectItem} from "@ui-kitten/components";
import React,{useState,useEffect,useCallback,useRef, forwardRef} from "react";
import { TextInput, ListRenderItemInfo, StyleSheet, View , ScrollView,Pressable, ActivityIndicator} from "react-native";
import { useRoute } from "@react-navigation/native";
import { RouteBus } from "./extra/data";

import { CachedImage } from '@georstat/react-native-image-cache';
import { Image } from 'expo-image';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SafeAreaLayout } from "./../../../components/safe-area-layout.component";

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import AppStore from "../../../store/AppStore";
import { useStore } from "mobx-store-provider";
import { HomeOutlineIcon, PersonOutlineIcon } from "../../../components/icons";
import { useFocusEffect } from '@react-navigation/native';
import EvilIcons from '@expo/vector-icons/EvilIcons';

import {routeBusTypes, operatorTypes, getRouteBusThemePhotoUrl, getSelectedDaysFromNumbers}  from "../../../app/routes-common";

import { TranportServiceSuggestions}  from "./extra/transportservices-auto-suggestions";
import { StoppingsSuggestions}  from "./extra/stoppings-auto-suggestions";

const client = axios.create({
	baseURL: 'https://routes.lk:7007'
});

import { useSafeAreaInsets } from "react-native-safe-area-context";

import {routeTypes, getRouteColor, vehcileTypes, getTourTypeColor}  from "../../../app/routes-common";

//import * as Device from 'expo-device';
//import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { AutocompleteDropdown ,IAutocompleteDropdownRef} from 'react-native-autocomplete-dropdown';

import AntDesign from '@expo/vector-icons/AntDesign';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { toJS } from "mobx";

import DateTimePickerModal from "react-native-modal-datetime-picker";

import { format ,add} from 'date-fns'

export default React.forwardRef(({ navigation,searchCallback, search },ref) => {
	
	const { refFrom, refTo ,refScrollView} = ref;
	//const refAutoCompleteFrom = useRef();

	const refAutoCompleteTo = useRef();

	const insetsConfig = useSafeAreaInsets();

	const routeTypeRef = useRef<typeof IAutocompleteDropdownRef>();

	const GOOGLE_GEO_API_KEY="AIzaSyDmFlx79dIq9lzTupQGttpE8m8eQ5ZS5yA"

	const route = useRoute();

	const [selectedDate, setSelectedDate] = useState();
	
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

	
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

	const [defaultDate, setDefaultDate] = React.useState<Date>(new Date());

	const [searchFrom, setSearchFrom] = React.useState("");

	const [searchTo, setSearchTo] = React.useState("");

	const [selectedIndexBusType, setSelectedIndexBusType] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const searchRouteType = routeTypes[selectedIndexBusType.row];

	const ItemSeparatorComponent = () => <View style={{ height: 1, width: '100%', backgroundColor: '#d8e1e6' }} />

	const InputComponent = () => <TextInput  value={appStore.searchContext.type} />
	

	const appStore = useStore(AppStore);

	const [reload, setReload] = React.useState(false);

	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};
	
	const isTourOwner = (): boolean => {
		
		console.log("isBusOwner"+appStore.user.mobileNumber);
		if(appStore.user.role == "admin"){
			console.log("role is admin");
			return true;
		}

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
	const loadRouteBuses = async(searchUrl) => {
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
			appStore.routeBuses.reset();
			response.data.forEach((element) => appStore.routeBuses.addRouteBus(element._id,element.title,element.routeNo,element.operator,element.transportAuthority,element.typeOfService,element.stoppingPlaces, element.distance, element.runningTime,element.journey,element.returnJourney));
			console.log(">>>"+appStore.routeBuses.routeBuses.length);
			//var owner = isBusOwner(); 
			//console.log("Is owner::"+owner);
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
				"from": appStore.searchContext.from,
				"to": appStore.searchContext.to,
			},
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };
		  console.log("appStore.searchContext.from::"+appStore.searchContext.from);
		  console.log("appStore.searchContext.to::"+appStore.searchContext.to);
		  try {
			console.log("appStore.user.accessToken::####"+appStore.user.accessToken);
			const userId = appStore.user.mobileNumber;
			
			const response: AxiosResponse = await client.get(searchUrl, config);
			console.log(response.status);
			console.log(response.data);  
			appStore.routeBuses.reset();
			response.data.forEach((element) => appStore.routeBuses.addRouteBus(element._id,element.title,element.routeNo,element.operator,element.transportAuthority,element.typeOfService,element.stoppingPlaces, element.distance, element.runningTime,element.journey,element.returnJourney));
			
		  } catch(err) {
			console.log(searchUrl);
			console.log(err);
			
		  }  
		  setLoading(false);
	};


	const onSearchClosePress = (): void => {	
		appStore.searchContext.reset();
		searchCallback(false);
		loadRouteBuses("/routebuses/getAll");	
	};

	const onSearchPress = (): void => {
		console.log(JSON.stringify(toJS(appStore.searchContext)));	
		searchBusses("/routebuses/search/buses");
		//loadBusses("/buses/search/routeType/"+appStore.searchContext.type+
		//"/transportService/"+appStore.searchContext.transportServiceName+
		//"/from/"+appStore.searchContext.from+
		//"/to/"+appStore.searchContext.to);
	};


	const onItemPress = (info: ListRenderItemInfo<RouteBus>): void => {
		
		
		const routeBus = appStore.routeBuses.routeBuses[info.index];
		//console.log(bus.title);
		//console.log(" info.item._id"+ info.item._id+" journeyStartLatitude:"+bus.journey.stoppings[0].latitude);
		console.log(JSON.stringify(routeBus));
		navigation && navigation.navigate("RouteBusDetails", { id: routeBus.objectId , reload: true, runningTime: routeBus.runningTime});
	};

	

	const renderItemHeader = (info: ListRenderItemInfo<RouteBus>): React.ReactElement => (
		<View>
			<View style={{paddingTop: 10, flexDirection: "row", justifyContent: "flex-end" }}>	
				<Button appearance='ghost'  size="small"  style={{ borderColor:"#142169", borderWidth: 2, marginHorizontal: 5 }} >{info.item.transportAuthority}</Button>
				<Button appearance='ghost'  size="small"  style={{ borderColor:"#142169", borderWidth: 2, marginHorizontal: 5 }} >{info.item.operator}</Button>
				<Button size="small" onPress={()=>onTransportServicePress(info.item)}>{info.item.typeOfService}</Button>
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
			url = "/routebuses/byTransportService/"+item.transportServiceId;
		}else{
			url = "/routebuses/search/routeType/"+routeType+"/transportService/"+item.transportServiceId;
		}
		console.log("url::"+url);
		loadRouteBuses(url);	
	};

	const onRouteTypePress = (routeType): void => {
		setRouteType(routeType);
		var url;
		if(transportService == ""){
			url = "/routebuses/byRouteType/"+routeType;
		}else{
			url = "/routebuses/search/routeType/"+routeType+"/transportService/"+transportServiceId;
		}
		console.log("url::"+url);
		loadRouteBuses(url);	
	};

	

	const onTransportServiceClosePress = (): void => {
		setTransportService("");
		setTransportServiceId("");
		var url;
		if(routeType == ""){
			url = "/routebuses/getAll";
		}else{
			url = "/routebuses/byRouteType/"+routeType;
		}
		loadRouteBuses(url);	
	};

	const onRouteTypeClosePress = (): void => {
		setRouteType("");
		var url;
		if(transportService == ""){
			url = "/routebuses/getAll";
		}else{
			url = "/routebuses/byTransportService/"+transportServiceId;
		}
		loadRouteBuses(url);	
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

	const getOpenStatus = (index) => {
		if(index==0){
			return true;
		}
		return false;
	};

	
	const getTimetableTypeText = (timetable) => {
		if(timetable.type =="Selected Days"){
			return getSelectedDaysFromNumbers(timetable.runningDays);
		}
		return timetable.type;
	};

	const renderItem = (info: ListRenderItemInfo<RouteBus>, index): React.ReactElement => (
		<Card
			style={styles.item}
			header={() => renderItemHeader(info)}
			//footer={() => renderItemFooter(info)}
			onPress={() => onItemPress(info)}
		>

			
			<View>
				<View>
					<View style={{paddingTop: 10, flexDirection: "row", justifyContent: "flex-start" , flexWrap: 'wrap'}}>	
						<Button size="small" onPress={()=>onTransportServicePress(info.item)} style={{ borderColor:"#142169", borderWidth: 1, marginHorizontal: 5 }}>{info.item.routeNo}</Button>
						<Text category="h5">{info.item.title}</Text>
					</View>	
				</View>
			
			<View style={{ 
      flexDirection: 'row', 
      alignItems: 'center', // Centers icon and text vertically
      padding: 5
    }}>
      {/* Your Icon or Image */}
      <Image 
	    contentFit="contain"
        source={"https://routes.lk:7007/route_buses/"+getRouteBusThemePhotoUrl(info.item.operator, info.item.typeOfService)}
        style={{ width: 100, height: 100, marginRight: 8 }} 
      />

      {/* ⚠️ flexShrink: 1 is mandatory here to prevent cutoff */}
      
	  <Text style={{ flexShrink: 1, fontSize: 16 }}>
					{info.item.stoppingPlaces.map(function(stopping, index){	
						if(index==0 ){
							return <Text style={{ color: "grey" }}>{stopping.place}</Text>	
						}else{
							return <Text style={{ color: "grey" }}>- {stopping.place}</Text>	
						}							
					})}	
					</Text>
    </View>

	</View>
	
	<View>
			<View style={{paddingTop: 10, flexDirection: "row", justifyContent: "flex-end" , flexWrap: 'wrap'}}>	
				<Button appearance='ghost'  size="small"  style={{ borderColor:"#142169", borderWidth: 2, marginHorizontal: 5 }} >Distance: {info.item.distance} km</Button>
				<Button appearance='ghost'  size="small"  style={{ borderColor:"#142169", borderWidth: 2, marginHorizontal: 5 }} >Running Time: {info.item.runningTime}</Button>
		</View>
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
				console.warn("A date has been actualDate: ", format(date, 'yyyy-MM-dd'));
	
				console.warn("A date has been actualDate +2 : ", add(date, { days: 2 }));
	
				//appStore.tour.addSchedule("","",format(date, 'yyyy-MM-dd'), format(date, 'yyyy-MM-dd'),format(date, 'yyyy-MM-dd'),format(date, 'yyyy-MM-dd'),"",[]);
				//appStore.tour.addSc.setTime(format(date, 'hh:mm a'));
	
				//setStartDate(date);
				
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
				loadRouteBuses("/routeBuses/getAll");
			}else{
				setLoading(false);
			}
			console.log("tours:::"+appStore.routeBuses.routeBuses.length);
			
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
					
					<View style={{  padding: 1, margin: 1 ,flexDirection: "column", justifyContent: "flex-start"}}>
						<Text style={{  padding: 1, margin: 1, paddingLeft: 5}}>From</Text>	
						<View>
							<StoppingsSuggestions stoppingType="from"/>
						</View>

						<View style={{  padding: 1, margin: 1,borderColor: "#eee", borderWidth: 0 ,flexDirection: "column", justifyContent: "flex-start"}}>
							<Text style={{  padding: 1, margin: 1, paddingLeft: 5}}>To</Text>	
							<View>
							<StoppingsSuggestions stoppingType="to"/>
						</View>
						</View>
					</View>
					<View style={{  padding: 1, margin: 0,borderColor: "#eee", borderWidth: 0 ,flexDirection: "column", justifyContent: "flex-start"}}>
							<Text style={{  padding: 1, margin: 1, paddingLeft: 5}}>Date</Text>			
							<View style={{ margin: 2}}>
							<Pressable 
								style={{borderWidth: 1, padding: 2, margin: 2, borderColor: "#bbb"}}
								onPress={({ nativeEvent }) => {
										console.log('On Press action:', nativeEvent.event);
										setDatePickerVisibility(true);
										}}>
									<Text style={{padding: 2, paddingHorizontal: 10}}> {format(defaultDate, 'yyyy-MM-dd')}</Text>
							</Pressable>
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
				data={appStore.routeBuses.routeBuses}
				renderItem={renderItem}
			/>
				</ScrollView>

				<DateTimePickerModal
											isVisible= {isDatePickerVisible}
											date={selectedDate}
											mode="date"
											display="inline"
											onConfirm={handleConfirm}
											onCancel={hideDatePicker}/>	
			
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
		height: 220
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
