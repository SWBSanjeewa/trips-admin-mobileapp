import { BottomNavigation, BottomNavigationTab, Button, Card, List, Text ,Input, IndexPath, SelectItem} from "@ui-kitten/components";
import React,{useState,useEffect,useCallback,useRef, forwardRef} from "react";
import { TextInput, ListRenderItemInfo, StyleSheet, View , ScrollView,SafeAreaView, ActivityIndicator} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Bus } from "./extra/data";
import { Vehicle } from "./extra/vehicle";

import { CachedImage } from '@georstat/react-native-image-cache';
import { Image } from 'expo-image';
import { observer} from "mobx-react";
import { SafeAreaLayout } from "./../../../components/safe-area-layout.component";

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import AppStore from "../../../store/AppStore";
import { useStore } from "mobx-store-provider";
import { HomeOutlineIcon, PersonOutlineIcon } from "../../../components/icons";
import { useFocusEffect } from '@react-navigation/native';
import EvilIcons from '@expo/vector-icons/EvilIcons';

import { VehiclesSuggestions}  from "./extra/vehicles-auto-suggestions"

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

import { Galeria } from '@nandorojo/galeria'



export default React.forwardRef(({ navigation,searchCallback, search },ref) => {
//onst VehicleList = ({ navigation }): React.ReactElement => {
//export default React.forwardRef(({ navigation,searchCallback, search },ref) => {
	
	//const { refFrom, refTo ,refScrollView} = ref;
	//const refAutoCompleteFrom = useRef();

	//const refAutoCompleteTo = useRef();

	const insetsConfig = useSafeAreaInsets();

	//const routeTypeRef = useRef<typeof IAutocompleteDropdownRef>();

	const GOOGLE_GEO_API_KEY="AIzaSyDmFlx79dIq9lzTupQGttpE8m8eQ5ZS5yA"

	const route = useRoute();

	//const [busses, setBusses] = useState([]);

	const [vehicles, setVehicles] = useState([]); 

	const [searchClose, setSearchClose] = React.useState(false);

	const [forceRefresh, setForceRefresh] = React.useState(false);

	const [localSearch, setLocalSearch] = React.useState(true);

	const [loading, setLoading] = useState(true);

	const [routeType, setRouteType] = React.useState("");

	const [transportService, setTransportService] = React.useState("");

	const [transportServiceId, setTransportServiceId] = React.useState("");

	const [expoPushToken, setExpoPushToken] = React.useState("");

	const [transportServiceSuggestionsList, setTransportServiceSuggestionsList] = useState(null)

	//const dropdownController = useRef(null)

  	//const searchRef = useRef(null);

	const [searchFrom, setSearchFrom] = React.useState("");

	const [searchTo, setSearchTo] = React.useState("");

	const [selectedIndexBusType, setSelectedIndexBusType] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const searchRouteType = routeTypes[selectedIndexBusType.row];

	const ItemSeparatorComponent = () => <View style={{ height: 1, width: '100%', backgroundColor: '#d8e1e6' }} />

	const InputComponent = () => <TextInput  value={appStore.searchContext.type} />

	const [selectedIndex, setSelectedIndex] = React.useState(0);
	

	const appStore = useStore(AppStore);

	const [reload, setReload] = React.useState(false);
	
	
	const onItemPress = (info): void => {
		console.log(">>>"+info);
		//JSON.stringify(info);
		
		if(route.params?.viewFrom == "tour-schedule"){
			appStore.tour.schedules[route.params?.index].setVehicleId(info.regNumber);
			navigation && navigation.navigate("TourSchedule", { index: route.params?.index });
		}else{
			appStore.vehicle.setTitle(info.title);
			appStore.vehicle.setNoOfSeats(info.noOfSeats);
			appStore.vehicle.setRegNumber(info.regNumber);
			console.log("photos size:"+info.photos.length);
			info.photos.forEach(photo => {
				appStore.vehicle.addPhoto(photo);
			});
			navigation && navigation.navigate("Vehicle");
		}
	};

	const onItemPressbck = (info): void => {
		console.log(info);
		appStore.vehicle.setTitle(info.title);
		appStore.vehicle.setNoOfSeats(info.noOfSeats);
		appStore.vehicle.setRegNumber(info.regNumber);
		console.log("photos size:"+info.photos.length);
		info.photos.forEach(photo => {
			appStore.vehicle.addPhoto(photo);
		});
		
		navigation && navigation.navigate("Vehicle")
	};

	const handleUpdate = (newValue) => {
    	setVehicles(newValue);
  	};

	const loadVehicles = async() => {
			console.log("Load transport services...");
			const config: AxiosRequestConfig = {
				headers: {
				  'Accept': 'application/json',
				  'token': appStore.user.accessToken
				} as RawAxiosRequestHeaders,
			  };
			  try {	
				console.log(`/transportServices/`+ appStore.transportService.id+`/vehicles`);
				const response: AxiosResponse = await client.get(`/transportServices/`+ appStore.transportService.id+`/vehicles`, config);
				setLoading(false);
				console.log(response.status);
				console.log("vehicles:::::"+response.data.vehicles);  
				setVehicles(response.data.vehicles);  
				console.log(JSON.stringify(response.data));
			  } catch(err) {
				console.log(err);
				setLoading(false);
			  }  
			
	};

	const onSearchClosePress = (): void => {	
			//appStore.searchContext.reset();
			searchCallback(false);
			loadVehicles();
	};

	useEffect(() => {
		
			const fetch = async ()=>{
				await loadVehicles();
				setLoading(false);
			}
	
			fetch();	
	
	
		}, []);
	
	

	/*
	useFocusEffect(
			React.useCallback(() => {
				
				console.log("reload::::"+route.params?.reload);
				
				console.log("busses:::"+appStore.transportService.vehicles.length);
				
			  return () => {
				
			  };
			}, [route.params?.reload])
	);
	*/

	const renderItemHeader = (info: ListRenderItemInfo<Vehicle>): React.ReactElement => (
		<View>
			<View style={{padding: 5,flexDirection: "row", justifyContent: "flex-end"}}>
				<Button size="small" >{info.item.vehicleType}</Button>
			</View>
			<Image
				contentFit="cover"
				style={styles.itemHeader} source={info.item.photos[0]} />
			
		</View>
	);
	

	

	const renderItem = (info): React.ReactElement => (
		<Card key={info.id} style={styles.item} onPress={() => onItemPress(info)}>
			
			<View style={{paddingTop: 10, flexDirection: "row", justifyContent: "space-between"}}>
							{info.regNumber && (
				<Button appearance='ghost'  size="small"  style={{ borderColor:"#142169", borderWidth: 2}} >{info.regNumber}</Button>
				)}	
				<Button  size="small"  style={{ borderColor:"#142169", borderWidth: 2}} >{info.noOfSeats} Seats</Button>
			</View>
			<Galeria urls={info.photos}>
				
				<Image source={info.photos[0]} contentFit="cover" style={styles.itemHeader}  />
				
			</Galeria>
			<View style={{paddingTop: 10, flexDirection: "row", justifyContent: "space-between"}}>
				<Text category="h5">{info.title}</Text>
			</View>
			
		</Card>
	);

	if (loading) {
			return <ActivityIndicator />;
	}


	return (

		
		<SafeAreaLayout style={styles.parentContainer}>
			{search && (
				//!appStore.searchContext.close && (
				<View>  
					<View style={{  padding: 1, margin: 5 ,flexDirection: "row", justifyContent: "flex-end"}}>
						
						<AntDesign style={{top: 4}} name="close" size={18} color="#444" onPress={onSearchClosePress} />
					</View>

					<View style={{  padding: 1, margin: 1,borderColor: "#eee", borderWidth: 0 ,flexDirection: "column", justifyContent: "flex-start"}}>		
							<VehiclesSuggestions updateParent={handleUpdate} />
					</View>
					
					</View>
				
				//)
			)}
			<View style={{ paddingHorizontal: 10 }}>
				{vehicles?.map(function(info, index){
					return renderItem(info);		
				})}	
			</View>
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

