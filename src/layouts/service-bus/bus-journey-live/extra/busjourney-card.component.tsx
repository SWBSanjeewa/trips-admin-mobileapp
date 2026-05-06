import { List, Card, CardElement, CardProps, Text ,Divider, Avatar } from "@ui-kitten/components";
import React,{useRef,useEffect, useCallback, useMemo,useState} from "react";
import { Image,View, TouchableOpacity, StyleSheet,ActivityIndicator, Dimensions , Platform, SafeAreaView, ImageProps, PermissionsAndroid,Alert,Linking} from "react-native";
import { useRoute } from "@react-navigation/native"

import RBSheet from 'react-native-raw-bottom-sheet';

import Carousel from 'react-native-snap-carousel';

import MapView, { PROVIDER_GOOGLE , Polyline, Marker, LatLng, Region, Overlay} from 'react-native-maps';

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import AppStore from "../../../../store/AppStore";
import { useStore } from "mobx-store-provider";

import Geolocation from 'react-native-geolocation-service';
import * as Location from 'expo-location';

import { BusCarouselCard } from "./buscarousel-card.component";

import { format, fromUnixTime } from "date-fns";

import { CachedImage } from '@georstat/react-native-image-cache';

export const SLIDER_WIDTH = Dimensions.get('window').width
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

const { width, height } = Dimensions.get("window");

//import { useInterval } from 'usehooks-ts'

import { getDay } from 'date-fns'

import { useSafeAreaInsets } from "react-native-safe-area-context";

import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { PassengerInfoCard } from './passengerinfo-card.component';

import { BusStoppingInfoCard } from './busstopping-card.component';

import { BusStoppingLiveInfoCard } from './busstopping-live-card.component';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import * as TaskManager from 'expo-task-manager';

import { useKeepAwake } from 'expo-keep-awake';
import { rootStore } from "../../../../store";





export const BusJourneyLiveCard = ({ navigation }): CardElement => {


	const LOCATION_TASK_NAME = 'background-location-task';

	

	const requestPermissions = async () => {
		console.log("requestPermissions");
		const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
		console.log("foregroundStatus"+foregroundStatus);
		if (foregroundStatus === 'granted') {
		  console.log("foregroundStatus"+foregroundStatus);
		  const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
		  console.log("backgroundStatus"+backgroundStatus); 
		  if (backgroundStatus === 'granted') {
			console.log("Granted background");
			await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
			  accuracy: Location.Accuracy.BestForNavigation,
			});
			
		  }
		}
	  };
	

	const requestPermissionsBck = async () => {
		console.log("requestPermissions");
		const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
		console.log("foregroundStatus"+foregroundStatus);
		if (foregroundStatus === 'granted') {
			console.log("Granted background");
			await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
			  accuracy: Location.Accuracy.BestForNavigation,
			});
		}
	  };


	 
	

	const [status, requestPermission] = Location.useForegroundPermissions();

	const carouselRef = useRef<Carousel<any>>(null);

	const [stoppingSelected, setStoppingSelected] = React.useState(0)

	const bottomSheetRef = useRef();

	const bottomSheetLiveRef = useRef();

	const refRBSheetJourney = useRef([]);

	const refRBSheetPassengerStart = useRef([]);

	const refRBSheetPassengerEnd = useRef([]);

	//const refStandard = useRef();
	
	const insetsConfig = useSafeAreaInsets();

	const watchId = useRef<number | null>(null);
	
	const [currentLocation, setCurrentLocation] = useState({ latitude: 0.0,longitude: 0.0, time: 1735894996859.689});

	const client = axios.create({
		baseURL: 'https://routes.lk:7007'
	});
	

	const appStore = useStore(AppStore);

	const route = useRoute();

	const [observing, setObserving] = useState(false);

	const [initialCamera] = React.useState({
		altitude: 15000,
		center: {
		  latitude: Number(7.183527),
		  longitude: Number(80.132246),
		},
		heading: 0,
		pitch: 0,
		zoom: 16,
	});


	const [camera,setCamera] = React.useState({
		altitude: 15000,
		center: {
		  latitude: Number(7.183527),
		  longitude: Number(80.132246),
		},
		heading: 0,
		pitch: 0,
		zoom: 18,
	});

	const [cameraChanged, setCameraChagned] = React.useState(false);

	const [dayOfTheWeek, setDayOfTheWeek] = React.useState(getDay(new Date())+1);

	const [nearestGetInPassengers, setNearestGetInPassengers] = React.useState([]);
	const [nearestGetOffPassengers, setNearestGetOffPassengers] = React.useState([]);
	//const [nearestGetInPassengers, setNearestGetInPassengers] = React.useState([{name: "Buddhika", mobileNumber:"+94772149179"},{name: "Ishan", mobileNumber:"+94772121212"}]);
	//const [nearestGetOffPassengers, setNearestGetOffPassengers] = React.useState([{name: "Buddhika", mobileNumber:"+94772149179"},{name: "Ishan", mobileNumber:"+94772121212"}]);

	const [liveLocationEnabled, setLiveLocationEnabled] = React.useState(false);

	const [enableStoppingBottom, setEnableStoppingBottom] = React.useState(false);

	const [enableLiveBottomSheet, setEnableLiveBottomSheet] = React.useState(false);

	const [count, setCount] = useState<number>(0)

	const [updatestoppings,setUpdatestoppings] = useState([]);

	const [justPassedStoppingIndex,setJustPassedStoppingIndex] = useState(-1);

	const [justPassedStopping,setJustPassedStopping] = useState(null);

	const latestValueJustPassedStopping = useRef(justPassedStopping);

	

	const config: AxiosRequestConfig = {
		headers: {
		  'Accept': 'application/json',
		  'token': appStore.user.accessToken
		} as RawAxiosRequestHeaders,
	  };


	const hasPermissionIOS = async () => {
		const openSetting = () => {
		  Linking.openSettings().catch(() => {
			Alert.alert('Unable to open settings');
		  });
		};
		const status = await Geolocation.requestAuthorization('whenInUse');
	
		if (status === 'granted') {
		  return true;
		}
	
		if (status === 'denied') {
		  Alert.alert('Location permission denied');
		}
	
		if (status === 'disabled') {
		  Alert.alert(
			`Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
			'',
			[
			  { text: 'Go to Settings', onPress: openSetting },
			  { text: "Don't Use Location", onPress: () => {} },
			],
		  );
		}
	
		return false;
	  };

	const hasLocationPermission = async () => {

		if (Platform.OS === 'ios') {
			const hasPermission = await hasPermissionIOS();
			return hasPermission;
		  }
	  
		  if (Platform.OS === 'android' && Platform.Version < 23) {
			return true;
		  }
	  

		const hasPermission = await PermissionsAndroid.check(
			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
		  );
	  
		  if (hasPermission) {
			return true;
		  }
	  
		  const status = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
		  );
	  
		  if (status === PermissionsAndroid.RESULTS.GRANTED) {
			return true;
		  }
	  
		  if (status === PermissionsAndroid.RESULTS.DENIED) {
			console.log('Location permission denied by user.');
		  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
			console.log('Location permission revoked by user.');
		  }
	  
		  return false;
	  
	}

	const updateLiveLocation = async (latitude, longitude) => {
	 //const updateLiveLocation= async(position) => {
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };
		  try {
			
			  const busId = appStore.bus.id;
			  const journeyType = "Journey";
			  const date = format(new Date(), "yyyy-MM-dd");
			 
			  console.log(busId+"_"+journeyType+"_"+date);
			  //const liveTimeDate = fromUnixTime(position.timestamp);
			  //const liveTimeTime = format(liveTimeDate, "HH:mm:ss");

			  const time = format(new Date(), 'hh:mm a');
			 
			  console.log("Submitting..."+latitude+","+longitude); 
			  const requestData = {"busId": busId, "journeyType": journeyType, "date": date, "latitude": latitude,"longitude": longitude, "time": time}
			  const response: AxiosResponse = await client.post(`/routes/update/`, requestData  , config);
			  //Alert.alert("Live submit status:::"+ response.status);
			  console.log("Live submit status::"+response);
			 
			  
			
		  } catch(err) {
			console.log(err);
		  }  
	}

	
	 
	 
	useEffect(() => {

		//useKeepAwake();
		
		TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
			console.log("*****");
			if (error) {
			  // Error occurred - check `error.message` for more details.
			  return;
			}
			if (data) {
			  const { locations } = data;
			  
			  console.log("Rceived locations: "+LOCATION_TASK_NAME);
			  console.log(JSON.stringify(locations));
	
			  setCurrentLocation({ latitude: locations[0].coords.latitude,longitude: locations[0].coords.longitude, time: locations[0].timestamp});
			  setCamera({
				altitude: 15000,
				center: {
					latitude: Number(locations[0].coords.latitude),
					longitude: Number(locations[0].coords.longitude),
				},
				heading: 0,
				pitch: 0,
				zoom: 16,
				});
				
				// do something with the locations captured in the background
				}
		  });

		
		console.log("params.id::::::::xxx::"+route.params.id);

		//if(route.params.liveLocationEnabled){
		
		setLiveLocationEnabled(route.params.live);
		//}

		//setBusId(appStore.bus.id);
		
		
		requestPermissions();
	  }, []);


	const onAvatarPress = (mobileNumber): void => {
		console.log("On avatar press"+mobileNumber);
		//refRBSheet.current[key].open()
		refRBSheetPassengerStart.current["passengerStart_rb"+mobileNumber].open();
	};


	/*
	const liveStoppingSubmit = useInterval( async () => {
		
		console.log("liveStoppingSubmit::");
		var result = await setPassingStoppings();
		var result = await setPassingPassengers();	
		
	}, liveLocationEnabled ? 10000 : null,);
	*/

	/*
	const liveLocationSubmit = useInterval( async () => {
		console.log("liveLocationSubmit::");
		
		console.log("lat::"+currentLocation.latitude+","+currentLocation.longitude);
		await updateLiveLocation(currentLocation.latitude, currentLocation.longitude);
		
	}, liveLocationEnabled ? 10000 : null,);
	*/
	
	
	const setPassingPassengers = async () => {
		const nearestGetInPassengersLocal = [];
				const nearestGetOffPassengersLocal = [];

				{appStore.bus.passengers.map(function(passenger, index){
					console.log("passenger::"+passenger.name+" weekdays::"+passenger.journeyWeekdays);
					if(passenger.journeyWeekdays.indexOf(dayOfTheWeek) >= 0){
						console.log("Get in List");
						var deltaLatitude = Math.abs(passenger.journeyStartLatitude - currentLocation.latitude);
						var deltaLongitude = Math.abs(passenger.journeyStartLongitude - currentLocation.longitude);
						console.log("deltaLatitude:"+deltaLatitude+" deltaLongitude:"+deltaLongitude);
						if(deltaLatitude<0.001&&deltaLongitude<0.001){
							nearestGetInPassengersLocal.push(passenger);
							console.log(passenger.name+""+passenger.mobileNumber);
						}
	
						console.log("Get off List");
						var deltaLatitude = Math.abs(passenger.journeyEndLatitude - currentLocation.latitude);
						var deltaLongitude = Math.abs(passenger.journeyEndLongitude - currentLocation.longitude);
						if(deltaLatitude<0.001&&deltaLongitude<0.001){
							nearestGetOffPassengersLocal.push(passenger);
							console.log(passenger.name+""+passenger.mobileNumber);
						}
	
	
					}
					
				}
				
				)}
				setNearestGetInPassengers(nearestGetInPassengersLocal);
				setNearestGetOffPassengers(nearestGetOffPassengersLocal);

	}


	const setPassingStoppings = async () => {
	    console.log("###############");
		var stoppingLocal;
		{appStore.bus.journey.stoppings.map(function(stopping, index){
			//console.log("BackPress"+stoppingLocal);
			//console.log("stoppingLocal:"+stopping.place+" index:"+index);
			if(stoppingLocal!=null){
				return;
			}
			
			if(appStore.bus.journey.runningDays.indexOf(dayOfTheWeek) >= 0){
				
				var deltaLatitude = Math.abs(stopping.latitude - currentLocation.latitude);
				var deltaLongitude = Math.abs(stopping.longitude - currentLocation.longitude);
				//console.log("deltaLatitude:"+deltaLatitude+" deltaLongitude:"+deltaLongitude);
				//console.log("stopping.place..."+stopping.place );
				if(deltaLatitude<0.001&&deltaLongitude<0.001){
					//console.log("justPassedStopping"+latestValueJustPassedStopping.current );
					if(stopping.place != justPassedStopping){
						setJustPassedStopping(stopping.place);
						setJustPassedStoppingIndex(appStore.bus.journey.stoppings.length-index);
						stoppingLocal=stopping;
						return;
					}
				}
			}
			
		}
		
		)}
		//console.log("stoppingLocal:"+stoppingLocal);
		if(stoppingLocal!=null){
			await submitStopping(stoppingLocal);
		}
	
	}

	const submitStopping = async (stopping) => {
		try {

			console.log("submitStopping:");
			
			const busId = appStore.bus.id;
			const journeyType = "Journey";
			const date = format(new Date(), "yyyy-MM-dd");
		   
			console.log(busId+"_"+journeyType+"_"+date);
			//const liveTimeDate = fromUnixTime(position.timestamp);
			//const liveTimeTime = format(liveTimeDate, "HH:mm:ss");

			const time = format(new Date(), "HH:mm:ss");
		   
			const requestData = {"busId": busId, "journeyType": journeyType, "date": date, "place": stopping.place, "time": time}
			const response: AxiosResponse = await client.post(`/routes/stopping/add`, requestData  , config);
			//Alert.alert("Live submit status:::"+ response.status);
			console.log("Live submit status::"+response);
		   
			console.log("Submitting..."); 
		  
		} catch(err) {
		  console.log(err);
		}
	};

	const toggleLiveLocation = async () => {
		if(liveLocationEnabled){
			Geolocation.clearWatch(watchId.current);
			Geolocation.stopObserving();
		}
		console.log("Called toggleLiveLocation"+liveLocationEnabled);
		setLiveLocationEnabled(!liveLocationEnabled);
		appStore.bus.setJourneyLive(!liveLocationEnabled);
	};

	const onProfileMarkerStartPress = (mobileNumber): void => {
		console.log("Marker pressed!!!!"+mobileNumber);
		refRBSheetPassengerStart.current["passengerStart_rb"+mobileNumber].open();
	};

	const onProfileMarkerEndPress = (mobileNumber): void => {
		refRBSheetPassengerEnd.current["passengerEnd_rb"+mobileNumber].open();
	};
	
	const onMarkerPress = (index): void => {
		console.log("Marker pressed!!!!"+index);
		//bottomSheetRef.current?.expand();
		//setEnableStoppingBottom(true);
		//setL
		//bottomSheetRef.current?.expand();
		//refRBSheetJourney.current["journeyStopping_rb"+index].open()
	};

	

	const onGoBackPress = (): void => {
		if(liveLocationEnabled){
			Geolocation.clearWatch(watchId.current);
			Geolocation.stopObserving();
		}
		console.log("Called toggleLiveLocation"+liveLocationEnabled);
		setLiveLocationEnabled(!liveLocationEnabled);
		appStore.bus.setJourneyLive(!liveLocationEnabled);
		navigation.goBack()
	};

	const onLiveMarkerPress = (index): void => {
		console.log("Marker pressed!!!!"+index);
		//Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
		//setLiveLocationEnabled(false);
		navigation.navigate("BusLiveStoppings", { id: route.params.id});
	};

	
	if (appStore.bus.journey.stoppings == null) {
		return <Text category="h5">No Journey</Text>;
	}

	if(appStore.bus==null){
		return <ActivityIndicator />;
	}

	const GetInPassengers = (props) => {
		return (
			<View style={{ flexDirection: "row",  justifyContent: 'flex-start', margin: 2}}>
			
				{
				
				props.data.map(item => 
					<View style={{ padding: 0}}  key={"avatar_view_getin"+item.mobileNumber}>
						<TouchableOpacity onPress={(e) => onAvatarPress(item.mobileNumber)}>
							<Avatar {...{source:"https://routes.lk:7007/users/"+item.mobileNumber+"/profile-photo.jpg",maxAge: 1}} key={"avatar_view_getin"+item.mobileNumber} style={{ borderWidth: 2, borderColor: "green"}}  ImageComponent={CachedImage} size="medium" />
						</TouchableOpacity>
					</View>
				)}
			
			</View>		
		)
	}

	const GetOffPassengers = (props) => {
		return (
			<View style={{ flexDirection: "row",  justifyContent: 'flex-start', margin: 2}}>
			
				{props.data.map(item => 
					<View style={{ padding: 0}}  key={"avatar_view_getoff"+item.mobileNumber}>
						<Avatar {...{source:"https://routes.lk:7007/users/"+item.mobileNumber+"/profile-photo.jpg",maxAge: 1}} key={"avatar_view_getin"+item.mobileNumber} style={{ borderWidth: 2, borderColor: "green"}}  ImageComponent={CachedImage} size="medium"/>
					</View>
				)}
			
			</View>		
		)
	}

	useKeepAwake();
	
	return (

		<SafeAreaView style={{ flex: 1,marginTop: 0-insetsConfig.top}}>	
			
			<MapView
				provider={PROVIDER_GOOGLE} // remove if not using Google Maps
				style={styles.map}
				minZoomLevel= {18}
				maxZoomLevel= {18}
				initialCamera={{
					altitude: 15000,
					center: {
					  latitude: Number(camera.center.latitude),
					  longitude: Number(camera.center.longitude),
					},
					heading: 0,
					pitch: 0,
					zoom: 15,
				  }}
				camera={camera}>

				{currentLocation && (
					<Marker  coordinate={{latitude: currentLocation.latitude, longitude: currentLocation.longitude}} anchor={{x:0.5,y:0.5}} image={require('../../../../assets/images/routeslk/live_location.png')} onPress={(key) => onLiveMarkerPress(key)}  />
				)}

				
					
				{appStore.bus.journey.stoppings.map(function(stopping, index){	
					return <Marker identifier={index.toString()} key={"journeyStopping_"+index} coordinate={{latitude: stopping.latitude, longitude: stopping.longitude}} anchor={{x:0.5,y:0.5}} image={require('../../../../assets/images/routeslk/bus_stop.png')} onPress={(key) => onMarkerPress(index.toString())}/>;	
				})}	

				

				{appStore.bus.passengers.map(function(passenger, index){
					if(passenger.journeyWeekdays.indexOf(dayOfTheWeek) >= 0){
						return <Marker identifier={index.toString()} key={"journeyPassengerStart_"+passenger.mobileNumber} coordinate={{latitude: passenger.journeyStartLatitude, longitude: passenger.journeyStartLongitude}} anchor={{x:0.5,y:0.5}} image={require('../../../../assets/images/routeslk/male_user.png')}  onPress={(e) => onProfileMarkerStartPress(passenger.mobileNumber)}/>;
					}
					
				})}

				{appStore.bus.passengers.map(function(passenger, index){
					if(passenger.journeyWeekdays.indexOf(dayOfTheWeek) >= 0){
						return <Marker identifier={index.toString()} key={"journeyPassengerEnd_"+passenger.mobileNumber} coordinate={{latitude: passenger.journeyEndLatitude, longitude: passenger.journeyEndLongitude}} anchor={{x:0.5,y:0.5}} image={require('../../../../assets/images/routeslk/male_user.png')}  onPress={(e) => onProfileMarkerEndPress(passenger.mobileNumber)}/>;
					}
					
				})}	

				
	
			</MapView>

			<View style={{ position: 'absolute',  top: insetsConfig.top+10, left: 30 }} > 
				<TouchableOpacity onPress={() => onGoBackPress()} >
					<MaterialIcons name="arrow-back-ios" size={24} color="black" />
				</TouchableOpacity>
			</View>

			{ (nearestGetInPassengers.length>0 || nearestGetOffPassengers.length>0 ) && (
			<View style={{ position: 'absolute',  top: insetsConfig.top+50, left: 20, backgroundColor: "white", right: 20 }}>
				<View style={{ flexDirection: "row",  justifyContent: 'flex-start', margin: 2, flex: 1}}>
					<GetInPassengers data={nearestGetInPassengers}/>
					<GetOffPassengers data={nearestGetOffPassengers}/>
				</View>
				<Text>Pick {nearestGetInPassengers.length} and Drop  {nearestGetOffPassengers.length}  passengers</Text>	
			</View>
			)}	

			{!liveLocationEnabled && 
			<View style={{ position: 'absolute',  bottom: insetsConfig.bottom+30, right: 30 }}>
				<TouchableOpacity onPress={() => toggleLiveLocation()} >
					<Image source={require("./../../../../assets/images/routeslk/go_live_stopped.png")} />
				</TouchableOpacity>
			</View>
			}
			{liveLocationEnabled && 
			<View style={{ position: 'absolute',  bottom: insetsConfig.bottom+30, right: 30  }} > 
				<TouchableOpacity onPress={() => toggleLiveLocation()} >
					<Image source={require("./../../../../assets/images/routeslk/go_live_started.png")}/>
				</TouchableOpacity>
			</View>
			}


			{appStore.bus.passengers.map(function(passenger, index){
					if(passenger.journeyWeekdays.indexOf(dayOfTheWeek) >= 0){
						return <RBSheet draggable dragOnContent key={"passengerStart_rb"+passenger.mobileNumber} ref={ref => (refRBSheetPassengerStart.current["passengerStart_rb"+passenger.mobileNumber] = ref)}><View style={styles.bottomSheetContainer}><PassengerInfoCard name={passenger.name} mobileNumber={passenger.mobileNumber} journeyStart={passenger.journeyStart} journeyEnd={passenger.journeyEnd}/></View></RBSheet>;	
					}		
			})}

			{appStore.bus.passengers.map(function(passenger, index){
					if(passenger.journeyWeekdays.indexOf(dayOfTheWeek) >= 0){
						return <RBSheet draggable dragOnContent key={"passengerEnd_rb"+passenger.mobileNumber} ref={ref => (refRBSheetPassengerEnd.current["passengerEnd_rb"+passenger.mobileNumber] = ref)}><View style={styles.bottomSheetContainer}><Text style={styles.bottomSheetText}>I AM ITEM {passenger.name}</Text></View></RBSheet>;	
					}		
			})}

			
			
		</SafeAreaView>
		
	);
};


const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: -10,
	},
	
	map: {
		flex: 1,
		width: width-20,
		left: 10,
		height: height-100,
		bottm: 0,
		justifyContent: 'flex-end',
		alignItems: 'center',	  
	},
	
	
	iconButton: {
		paddingHorizontal: 0,
	},
	
	
	routeContainer: {
		flexDirection: "row",
		justifyContent: 'flex-start',
		margin: 3,
		alignItems: "center",
		alignContent: 'flex-start',	
	},

	routeStoppingContainer: {
		flexDirection: "row",
		justifyContent: 'flex-start',	
		alignItems: "center",
		alignContent: 'flex-start',	
	},

	routeStoppingListContainer: {
		backgroundColor: 'white',
	},

	busStartIcon: {
		width: 15,
		height: 22,	
		marginLeft: 8,
		marginRight: 8,	
		marginTop: 10,
	},

	busEndIcon: {
		width: 15,
		height: 22,	
		marginLeft: 8,
		marginRight: 8,	
		marginBottom: 5,
		
	},
	contentContainerStyle: {
		paddingTop: 12,
		paddingHorizontal: 24,
		backgroundColor: 'white',
		zIndex: 100
	},
});
