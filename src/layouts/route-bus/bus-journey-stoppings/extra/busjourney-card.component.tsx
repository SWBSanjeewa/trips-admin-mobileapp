import { List, Card, CardElement, TopNavigation ,Text, TopNavigationAction } from "@ui-kitten/components";
import React,{useRef,useEffect, useCallback, useMemo,useState} from "react";
import { View, Text as RNText, StyleSheet,ActivityIndicator, Dimensions , Platform, SafeAreaView, ImageProps, PermissionsAndroid,Alert,Linking} from "react-native";
import { useRoute } from "@react-navigation/native"

import RBSheet from 'react-native-raw-bottom-sheet';

import { ArrowIosBackIcon } from "../../../../components/icons";

import RNMapView, { PROVIDER_GOOGLE , Polyline, Marker, LatLng, Region, Overlay} from 'react-native-maps';

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import AppStore from "../../../../store/AppStore";
import { useStore } from "mobx-store-provider";


export const SLIDER_WIDTH = Dimensions.get('window').width
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

const { width, height } = Dimensions.get("window");

import { useInterval } from 'usehooks-ts'

import { getDay } from 'date-fns'

import BottomSheet, { BottomSheetScrollView, BottomSheetVirtualizedList } from '@gorhom/bottom-sheet';

import { PassengerInfoCard } from './passengerinfo-card.component';

import { BusStoppingInfoCard } from './busstopping-card.component';



export const BusJourneyCard = ({ navigation }): CardElement => {


	const bottomSheetRef = useRef();

	const mapRef = useRef();
	
	//const [currentLocation, setCurrentLocation] = useState({ latitude: 6.029649,longitude: 80.241846, time: 1735894996859.689});

	const client = axios.create({
		baseURL: 'https://routes.lk:7007'
	});
	

	const appStore = useStore(AppStore);

	const route = useRoute();

	//const [observing, setObserving] = useState(false);

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

	const [enableStoppingBottom, setEnableStoppingBottom] = React.useState(false);
	 
	useEffect(() => {
		
		console.log("params.id::::::::::"+route.params.objectId);

		

		//setBusId(appStore.bus.id);
		bottomSheetRef.current?.expand();
		setEnableStoppingBottom(true);
		
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

	
	const onMarkerPress = (index): void => {
		console.log("Marker pressed!!!!"+index);
		bottomSheetRef.current?.expand();
		setEnableStoppingBottom(true);
	};

	
	/*
	if (appStore.routeBus.journey.stoppings == null) {
		return <Text category="h5">No Journey</Text>;
	}

	if(appStore.routeBus==null){
		return <ActivityIndicator />;
	}
	*/
	

	
	return (

		<View style={{ flex: 1}}>
			<RNMapView
				ref={mapRef}
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
					
				{route.params?.journeyType == "RouteBusJourney" && (
					<>
						{appStore.routeBus.journey.stoppings.map(function(stopping, index){	
							return <Marker identifier={index.toString()} key={"journeyStopping_"+index} coordinate={{latitude: stopping.latitude, longitude: stopping.longitude}} anchor={{x:0.5,y:0.5}} image={require('../../../../assets/images/routeslk/bus_stop.png')} onPress={(key) => onMarkerPress(index.toString())}/>;	
						})}	
					</>
				)}

				{route.params?.journeyType == "RouteBusReturnJourneyx" && (
					<>
						{appStore.routeBus.returnJourney.stoppings.map(function(stopping, index){	
						return <Marker identifier={index.toString()} key={"returnJourneyourneyStopping_"+index} coordinate={{latitude: stopping.latitude, longitude: stopping.longitude}} anchor={{x:0.5,y:0.5}} image={require('../../../../assets/images/routeslk/bus_stop.png')} onPress={(key) => onMarkerPress(index.toString())}/>;	
						})}	
					</>
				)}
			</RNMapView>

			

			{enableStoppingBottom && route.params?.journeyType == "RouteBusJourney"&& (
			<BottomSheet
					ref={bottomSheetRef}
					enablePanDownToClose={true}
					maxDynamicContentSize={height*0.8}
					handleIndicatorStyle={{ backgroundColor: "#142169"}}>
					<BottomSheetScrollView
					  contentContainerStyle={styles.contentContainerStyle}
					  enableFooterMarginAdjustment={true}>
					 	<BusStoppingInfoCard stoppings={appStore.routeBus.journey.stoppings} bottomSheetRef={bottomSheetRef} mapRef={mapRef}/>
					</BottomSheetScrollView>
				  </BottomSheet>
			)}	
			{enableStoppingBottom && route.params?.journeyType == "RouteBusReturnJourney"&& (
			<BottomSheet
					ref={bottomSheetRef}
					enablePanDownToClose={true}
					maxDynamicContentSize={height*0.8}
					handleIndicatorStyle={{ backgroundColor: "#142169"}}>
					<BottomSheetScrollView
					  contentContainerStyle={styles.contentContainerStyle}
					  enableFooterMarginAdjustment={true}>
					 	<BusStoppingInfoCard stoppings={appStore.routeBus.returnJourney.stoppings} bottomSheetRef={bottomSheetRef} mapRef={mapRef}/>
					</BottomSheetScrollView>
				  </BottomSheet>
			)}	

			
			
		</View>
		
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
		zIndex: 100,
		overflow: 'hidden',
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
