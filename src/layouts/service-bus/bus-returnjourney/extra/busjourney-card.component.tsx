import { List, Card, CardElement, CardProps, Text ,Divider, Avatar } from "@ui-kitten/components";
import React,{useRef,useEffect, useCallback, useMemo,useState} from "react";
import { Image,View, TouchableOpacity, StyleSheet,ActivityIndicator, Dimensions , Platform, SafeAreaView, ImageProps, PermissionsAndroid,Alert,Linking} from "react-native";
import { useRoute } from "@react-navigation/native"

import RBSheet from 'react-native-raw-bottom-sheet';

import Carousel from 'react-native-snap-carousel';

import RNMapView, { PROVIDER_GOOGLE , Polyline, Marker, LatLng, Region, Overlay} from 'react-native-maps';

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import AppStore from "../../../../store/AppStore";
import { useStore } from "mobx-store-provider";


export const SLIDER_WIDTH = Dimensions.get('window').width
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

const { width, height } = Dimensions.get("window");

import { useInterval } from 'usehooks-ts'

import { getDay } from 'date-fns'

import { useSafeAreaInsets } from "react-native-safe-area-context";

import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { PassengerInfoCard } from './passengerinfo-card.component';

import { BusStoppingInfoCard } from './busstopping-card.component';

import { BusStoppingLiveInfoCard } from './busstopping-live-card.component';


export const BusJourneyCard = ({ navigation }): CardElement => {


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

	const [justPassedStopping,setJustPassedStopping] = useState(null);

	const [enableStoppingBottom, setEnableStoppingBottom] = React.useState(false);
	 
	useEffect(() => {
		
		console.log("params.id::::::::::"+route.params.id);

		

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
		setEnableStoppingBottom(true);
	};

	
	
	if (appStore.bus.journey.stoppings == null) {
		return <Text category="h5">No Journey</Text>;
	}

	if(appStore.bus==null){
		return <ActivityIndicator />;
	}

	
	
	return (

		<SafeAreaView style={{ flex: 1,marginTop: 0-insetsConfig.top}}>
	
			
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
					
				{appStore.bus.returnJourney.stoppings.map(function(stopping, index){	
					return <Marker identifier={index.toString()} key={"journeyStopping_"+index} coordinate={{latitude: stopping.latitude, longitude: stopping.longitude}} anchor={{x:0.5,y:0.5}} image={require('../../../../assets/images/routeslk/bus_stop.png')} onPress={(key) => onMarkerPress(index.toString())}/>;	
				})}	

				

				{appStore.bus.passengers.map(function(passenger, index){
					if(passenger.returnJourneyWeekdays.indexOf(dayOfTheWeek) >= 0){
						return <Marker identifier={index.toString()} key={"journeyPassengerStart_"+passenger.mobileNumber} coordinate={{latitude: passenger.journeyStartLatitude, longitude: passenger.journeyStartLongitude}} anchor={{x:0.5,y:0.5}} image={require('../../../../assets/images/routeslk/male_user.png')}  onPress={(e) => onProfileMarkerStartPress(passenger.mobileNumber)}/>;
					}
					
				})}

				{appStore.bus.passengers.map(function(passenger, index){
					if(passenger.returnJourneyWeekdays.indexOf(dayOfTheWeek) >= 0){
						return <Marker identifier={index.toString()} key={"journeyPassengerEnd_"+passenger.mobileNumber} coordinate={{latitude: passenger.journeyEndLatitude, longitude: passenger.journeyEndLongitude}} anchor={{x:0.5,y:0.5}} image={require('../../../../assets/images/routeslk/male_user.png')}  onPress={(e) => onProfileMarkerEndPress(passenger.mobileNumber)}/>;
					}
					
				})}	

				
	
			</RNMapView>

			{currentLocation && (
					 <RBSheet draggable dragOnContent key="live" height={(height*0.8 > 40*appStore.bus.journey.stoppings.length+60)? 40*appStore.bus.journey.stoppings.length+60 :height*0.8} ref={refStandard}>
						 <View style={styles.bottomSheetContainer}>
						 <BusStoppingLiveInfoCard stoppings={updatestoppings} justPassedStoppingIndex={justPassedStoppingIndex} />
							 </View>
					</RBSheet>
			)}

			{enableStoppingBottom && (
			<BottomSheet
					ref={bottomSheetRef}
					handleIndicatorStyle={{ backgroundColor: "#142169"}}
					enablePanDownToClose={true}>
					<BottomSheetScrollView
					  contentContainerStyle={styles.contentContainerStyle}
					  enableFooterMarginAdjustment={true}>
					 	<BusStoppingInfoCard stoppings={appStore.bus.returnJourney.stoppings}/>
					</BottomSheetScrollView>
				  </BottomSheet>
			)}	

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

	contentContainerStyle: {
		paddingTop: 12,
		paddingHorizontal: 24,
		backgroundColor: 'white',
		zIndex: 100
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
});
