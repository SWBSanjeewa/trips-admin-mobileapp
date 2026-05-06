import { List, Card, CardElement, CardProps, Text ,Divider, Avatar } from "@ui-kitten/components";
import React,{useRef,useEffect, useCallback, useMemo,useState} from "react";
import { Image,View, TouchableOpacity, StyleSheet,ActivityIndicator, Dimensions , Platform, SafeAreaView, ImageProps, PermissionsAndroid,Alert,Linking} from "react-native";
import { useRoute } from "@react-navigation/native"

import RBSheet from 'react-native-raw-bottom-sheet';

import RNMapView, { PROVIDER_GOOGLE , Polyline, Marker, LatLng, Region, Overlay} from 'react-native-maps';

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import AppStore from "../../../../store/AppStore";
import { useStore } from "mobx-store-provider";

import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import VIForegroundService from '@voximplant/react-native-foreground-service';

import { format, fromUnixTime } from "date-fns";

import Carousel from 'react-native-snap-carousel';
import { BusCarouselCard } from "./buscarousel-card.component";

import { CachedImage } from '@georstat/react-native-image-cache';

export const SLIDER_WIDTH = Dimensions.get('window').width
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

const { width, height } = Dimensions.get("window");

import { useInterval } from 'usehooks-ts'

import { getDay } from 'date-fns'

import { useSafeAreaInsets } from "react-native-safe-area-context";

import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { PassengerInfoCard } from './passengerinfo-card.component';

import { BusStoppingInfoCard } from './busstopping-card.component';

import { BusStoppingLiveInfoCard } from './busstopping-live-card.component';


export const BusJourneyCard = ({ navigation }): CardElement => {


	const carouselRef = useRef<Carousel<any>>(null);

	const [stoppingSelected, setStoppingSelected] = React.useState(0)

	const bottomSheetRef = useRef();

	const refRBSheetJourney = useRef([]);

	const refRBSheetPassengerStart = useRef([]);

	const refRBSheetPassengerEnd = useRef([]);

	const refStandard = useRef();
	
	const insetsConfig = useSafeAreaInsets();

	const watchId = useRef<number | null>(null);
	
	const [currentLocation, setCurrentLocation] = useState({ latitude: 6.029649,longitude: 80.241846, time: 1735894996859.689});

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

	const [count, setCount] = useState<number>(0)

	const [updatestoppings,setUpdatestoppings] = useState([]);

	const [justPassedStoppingIndex,setJustPassedStoppingIndex] = useState(-1);

	const [location, setLocation] = useState<GeoPosition | null>(null);

	const config: AxiosRequestConfig = {
		headers: {
		  'Accept': 'application/json',
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

	const updateLiveLocation = async () => {
	 //const updateLiveLocation= async(position) => {
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			} as RawAxiosRequestHeaders,
		  };
		  try {
			
			  const busId = appStore.bus.id;
			  const journeyType = "Journey";
			  const date = format(new Date(), "yyyy-MM-dd");
			 
			  console.log(busId+"_"+journeyType+"_"+date);
			  //const liveTimeDate = fromUnixTime(position.timestamp);
			  //const liveTimeTime = format(liveTimeDate, "HH:mm:ss");

			  const time = format(new Date(), "HH:mm:ss");
			 
			  const requestData = {"busId": busId, "journeyType": journeyType, "date": date, "latitude": position.coords.latitude,"longitude": position.coords.longitude, "time": time}
			  const response: AxiosResponse = await client.post(`/routes/update/`, requestData  , config);
			  //Alert.alert("Live submit status:::"+ response.status);
			  console.log("Live submit status::"+response);
			 
			  console.log("Submitting..."); 
			
		  } catch(err) {
			console.log(err);
		  }  
	}

	const initialLoadBusses = async() => {
		const busId = route.params.id
		const journeyType = "Journey";
		const date = format(new Date(), "yyyy-MM-dd");

		try{
			console.log("url##  /routes/stopping/"+busId+"/"+journeyType+"/"+date);
			const response: AxiosResponse = await client.get('/routes/stopping/'+busId+"/"+journeyType+"/"+date , config);
			console.log("Data:"+response.data);
			
			appStore.bus.journey.stoppings.forEach(function (element,index) {
				console.log("####"+element.place);
				var found = false
				if(response.data){
					
					response.data.stoppings.forEach(element2 => {
						if(element.place ==element2.place){
							console.log("$$ pushing:"+element.place);
							updatestoppings.push({place: element.place, time: element2.time});
							found=true;
						}
					});
				}
				if(!found){
					console.log("$$$$ pushing:"+element.place);
					updatestoppings.push({place: element.place, time: element.time});
				}
				if(response.data.stopping){
					const justPassedStoppingPlace=response.data.stoppings[response.data.stoppings.length-1].place;
					if(element.place ==justPassedStoppingPlace){
						setJustPassedStoppingIndex(index);
						console.log("#### just passed index "+index);
					}
				}

			});		
		} catch(err) {
			console.log(err);
		}  
	}

	const loadBusses = async() => {
		const busId = route.params.id
		const journeyType = "Journey";
		const date = format(new Date(), "yyyy-MM-dd");

		try{
			console.log("url##  /routes/stopping/"+busId+"/"+journeyType+"/"+date);
			const response: AxiosResponse = await client.get('/routes/stopping/'+busId+"/"+journeyType+"/"+date , config);
			console.log("Data:"+response.data);
			updatestoppings.forEach(element => {
				if(response.data){
					
					response.data.stoppings.forEach(element2 => {
						if(element.place ==element2.place){
							element.time=element2.time;
						}
					});
				}	
			});		
			if(response.data.stoppings.length > 0){
				const justPassedStoppingPlace=response.data.stoppings[response.data.stoppings.length-1].place;
				appStore.bus.journey.stoppings.forEach(function(element,index ) {
					if(element.place ==justPassedStoppingPlace){
						setJustPassedStoppingIndex(index);
					}
				})
			}
		} catch(err) {
			console.log(err);
		}  
	}
	
	 
	 
	useEffect(() => {
		
		console.log("params.id::::::::::"+route.params.id);

		initialLoadBusses()
		.then(fetchedData => {
			//setLoading(false);
	    });

		console.log("$### getDay::"+getDay(new Date()));
		//console.log("liveLocationEnabled::"+route.params.liveLocationEnabled);
		console.log("#### insetsConfig.top ##"+insetsConfig.top);

		//setBusId(appStore.bus.id);
		
		if(cameraChanged == false  ){
			
			setCamera({
				altitude: 15000,
				center: {
				  latitude: Number(route.params.latitude),
				  longitude: Number(route.params.longitude),
				},
				heading: 0,
				pitch: 0,
				zoom: 16,
			  });

			setCameraChagned(true);	
		}
	  }, []);


	const onAvatarPress = (mobileNumber): void => {
		console.log("On avatar press"+mobileNumber);
		//refRBSheet.current[key].open()
		refRBSheetPassengerStart.current["passengerStart_rb"+mobileNumber].open();
	};


	const getLocationUpdates = async () => {
		const hasPermission = await hasLocationPermission();
	
		if (!hasPermission) {
		  return;
		}
	
		if (Platform.OS === 'android') {
		  await startForegroundService();
		}
	
		setObserving(true);
	
		watchId.current = Geolocation.watchPosition(
		  position => {
			setLocation(position);
			setCurrentLocation(position.coords.latitude, position.coords.longitude);
			console.log(position);
		  },
		  error => {
			setLocation(null);
			console.log(error);
		  },
		  {
			accuracy: {
			  android: 'high',
			  ios: 'best',
			},
			enableHighAccuracy: true,
			distanceFilter: 0,
			interval: 5000,
			fastestInterval: 2000,
			forceRequestLocation: true,
			forceLocationManager: true
		  },
		);
	  };
	
	  const startForegroundService = async () => {
		if (Platform.Version >= 26) {
		  await VIForegroundService.getInstance().createNotificationChannel({
			id: 'locationChannel',
			name: 'Location Tracking Channel',
			description: 'Tracks location of user',
			enableVibration: false,
		  });
		}
	
		return VIForegroundService.getInstance().startService({
		  channelId: 'locationChannel',
		  id: 420,
		  title: "Routes",
		  text: 'Tracking location updates',
		  //icon: 'ic_launcher',
		});
	  };



	const setPassingStoppings = async (position) => {
	    console.log("###############");
		var stoppingLocal;
		{appStore.bus.journey.stoppings.map(function(stopping, index){
			if(stoppingLocal!=null){
				return;
			}
			
			if(appStore.bus.journey.runningDays.indexOf(dayOfTheWeek) >= 0){
				
				var deltaLatitude = Math.abs(stopping.latitude - position.coords.latitude);
				var deltaLongitude = Math.abs(stopping.longitude - position.coords.longitude);
				console.log("deltaLatitude:"+deltaLatitude+" deltaLongitude:"+deltaLongitude);
				console.log("stopping.place..."+stopping.place );
				if(deltaLatitude<0.001&&deltaLongitude<0.001){
					if(stopping.place != justPassedStopping){
						setJustPassedStopping(stopping.place);
						stoppingLocal=stopping;
						return;
					}
				}
			}
			
		}
		
		)}
		if(stoppingLocal!=null)
			await submitStopping(stoppingLocal);
	
	}

	const submitStopping = async (stopping) => {
		try {
			
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
		appStore.bus.setReturnJourneyLive(!liveLocationEnabled);
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
		bottomSheetRef.current?.expand();
		//refRBSheetJourney.current["journeyStopping_rb"+index].open()
	};

	const onLiveMarkerPress = (index): void => {
		loadBusses()
		.then(fetchedData => {
			//setLoading(false);
	    });
		refStandard.current.open();
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
							<Avatar {...{source:"https://routes.lk:7007/users/"+item.mobileNumber+"/profile-photo.jpg"}} key={"avatar_view_getin"+item.mobileNumber} style={{ borderWidth: 2, borderColor: "green"}}  ImageComponent={CachedImage} size="medium" />
						</TouchableOpacity>
						<RBSheet ref={ref => (refRBSheet.current["avatar_view_getin"+item.mobileNumber] = ref)}>
							<View style={styles.bottomSheetContainer}>
								<PassengerInfoCard name={item.name} mobileNumber={item.mobileNumber} journeyStart={item.journeyStart} journeyEnd={item.journeyEnd}/>
							</View>
						</RBSheet>
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
						<Avatar {...{source:"https://routes.lk:7007/users/"+item.mobileNumber+"/profile-photo.jpg"}} key={"avatar_view_getin"+item.mobileNumber} style={{ borderWidth: 2, borderColor: "green"}}  ImageComponent={CachedImage} size="medium"/>
					</View>
				)}
			
			</View>		
		)
	}
	
	return (

		<SafeAreaView style={{ flex: 1,marginTop: 0-insetsConfig.top}}>
	
			{ (nearestGetInPassengers.length>0 || nearestGetOffPassengers.length>0 ) && (
			<View>
				<View style={{ flexDirection: "row",  justifyContent: 'flex-start', margin: 2}}>
					<GetInPassengers data={nearestGetInPassengers}/>
					<GetOffPassengers data={nearestGetOffPassengers}/>
				</View>
				<Text>Pick {nearestGetInPassengers.length} and Drop  {nearestGetOffPassengers.length}  passengers</Text>
				
			</View>
			)}	
			
			<RNMapView
				provider={PROVIDER_GOOGLE} // remove if not using Google Maps
				style={styles.map}
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
					<Marker  identifier="returnLive" coordinate={{latitude: currentLocation.latitude, longitude: currentLocation.longitude}} anchor={{x:0.5,y:0.5}} image={require('../../../../assets/images/routeslk/live_location.png')} onPress={(key) => onLiveMarkerPress(key)}  />
				)}

				
					
				{appStore.bus.returnJourney.stoppings.map(function(stopping, index){	
					return <Marker identifier={index.toString()} key={"returnJourneyStopping_"+index} coordinate={{latitude: stopping.latitude, longitude: stopping.longitude}} anchor={{x:0.5,y:0.5}} image={require('../../../../assets/images/routeslk/bus_stop.png')} onPress={(key) => onMarkerPress(index.toString())}/>;	
				})}	

				

				{appStore.bus.passengers.map(function(passenger, index){
					if(passenger.returnJourneyWeekdays.indexOf(dayOfTheWeek) >= 0){
						return <Marker identifier={index.toString()} key={"returnJourneyPassengerStart_"+passenger.mobileNumber} coordinate={{latitude: passenger.returnJourneyStartLatitude, longitude: passenger.returnJourneyStartLongitude}} anchor={{x:0.5,y:0.5}} image={require('../../../../assets/images/routeslk/male_user.png')}  onPress={(e) => onProfileMarkerStartPress(passenger.mobileNumber)}/>;
					}
					
				})}

				{appStore.bus.passengers.map(function(passenger, index){
					if(passenger.returnJourneyWeekdays.indexOf(dayOfTheWeek) >= 0){
						return <Marker identifier={index.toString()} key={"returnJourneyPassengerEnd_"+passenger.mobileNumber} coordinate={{latitude: passenger.returnJourneyEndLatitude, longitude: passenger.returnJourneyEndLongitude}} anchor={{x:0.5,y:0.5}} image={require('../../../../assets/images/routeslk/male_user.png')}  onPress={(e) => onProfileMarkerEndPress(passenger.mobileNumber)}/>;
					}
					
				})}	

				
	
			</RNMapView>

			{!liveLocationEnabled && 
			<View style={{ position: 'absolute',  bottom: 170, right: 30 }}>
				<TouchableOpacity onPress={() => toggleLiveLocation()} >
					<Image source={require("./../../../../assets/images/routeslk/go_live_stopped.png")} />
				</TouchableOpacity>
			</View>
			}
			{liveLocationEnabled && 
			<View style={{ position: 'absolute',  bottom: 170, right: 30 }} > 
				<TouchableOpacity onPress={() => toggleLiveLocation()} >
					<Image source={require("./../../../../assets/images/routeslk/go_live_started.png")}/>
				</TouchableOpacity>
			</View>
			}


			{currentLocation && (
					 <RBSheet draggable dragOnContent key="live" ref={refStandard}>
						 <View style={styles.bottomSheetContainer}>
						 <BusStoppingLiveInfoCard stoppings={updatestoppings} justPassedStoppingIndex={justPassedStoppingIndex} />
							 </View>
					</RBSheet>
			)}

			{appStore.bus.passengers.map(function(passenger, index){
					if(passenger.returnJourneyWeekdays.indexOf(dayOfTheWeek) >= 0){
						return <RBSheet draggable dragOnContent key={"passengerStart_rb"+passenger.mobileNumber} ref={ref => (refRBSheetPassengerStart.current["passengerStart_rb"+passenger.mobileNumber] = ref)}><View style={styles.bottomSheetContainer}><PassengerInfoCard name={passenger.name} mobileNumber={passenger.mobileNumber} journeyStart={passenger.journeyStart} journeyEnd={passenger.journeyEnd}/></View></RBSheet>;	
					}		
			})}

			{appStore.bus.passengers.map(function(passenger, index){
					if(passenger.returnJourneyWeekdays.indexOf(dayOfTheWeek) >= 0){
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
	  },
});
