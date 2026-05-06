import { TopNavigation, TopNavigationAction, List, Card, CardElement, CardProps, Text ,Divider, Button , Input} from "@ui-kitten/components";
import React,{useEffect, useRef} from "react";
import { ArrowIosBackIcon, CheckmarkOutlineIcon } from "../../../components/icons";
import { useRoute } from "@react-navigation/native"
import { Image,View, ImageBackground, StyleSheet,ListRenderItemInfo, Dimensions , Text as RNText, SafeAreaView} from "react-native";

import MapView, { PROVIDER_GOOGLE , Polyline, Marker, LatLng, Region} from 'react-native-maps';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import AppStore from "../../../store/AppStore";

import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';



export const SLIDER_WIDTH = Dimensions.get('window').width
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

const { width, height } = Dimensions.get("window");



export default ({ navigation }): React.ReactElement => {

	const refAutoComplete = useRef();

	const GOOGLE_GEO_API_KEY="AIzaSyDmFlx79dIq9lzTupQGttpE8m8eQ5ZS5yA"

	
	const route = useRoute();

	const appStore = useStore(AppStore);

	const client = axios.create({
		baseURL: 'https://maps.googleapis.com'
	});

	//const { updateStartLocation, getStartLatitude, getStartLongitude } = React.useContext(NewBusStoreContext);

	const [region, setRegion] = React.useState({ latitude: 7.183527,longitude: 80.132246,latitudeDelta: 0.005,longitudeDelta: 0.005 });
	const [place, setPlace] = React.useState({ placeId: 7.183527,description: 80.132246})
	const [regionChanged, setRegionChagned] = React.useState(false)
	const [placeName, setPlaceName] = React.useState(null)
	const [location, setLocation] = React.useState({ latitude: 7.183527,longitude: 80.132246})
	const [time, setTime] = React.useState(null)
	//const [oldLatitude, setOldLatitude] = React.useState(null)
	//const [oldLongitude, setOldLongitude] = React.useState(null)


	useEffect(() => {
		console.log("route.params.latitude:"+route.params.latitude);
		console.log("route.params.longitude:"+route.params.longitude);
		console.log("route.params.returnroute:"+route.params.returnroute);
		console.log("route.params.parentReturnRoute:"+route.params.parentReturnRoute);
		
		//console.log("region.latitude:"+region.latitude);
		if(regionChanged == false && route.params.latitude !=0 && route.params.latitude != region.latitude){
		
			//console.log("Setting location:::"+route.params.latitude);
			setPlaceName(route.params.placeName);
			//setTime(route.params.time);
			setRegion({ latitude: route.params.latitude,longitude: route.params.longitude,latitudeDelta: 0.005,longitudeDelta: 0.005 });
		}
		//setOldLatitude(route.params.oldLatitude);
		//setOldLongitude(route.params.oldLongitude);
	});

	const getPlaceForLocation = async(lat,lng) => {
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			} as RawAxiosRequestHeaders,
		  };
		  try {
			
			
			  console.log("Geocoding..."+`/maps/api/geocode/json?latlng=`+lat+`,`+lng+`&key=`+GOOGLE_GEO_API_KEY);
			  const response: AxiosResponse = await client.get(`/maps/api/geocode/json?latlng=`+lat+`,`+lng+`&key=`+GOOGLE_GEO_API_KEY , config);
			  console.log(response.status);
			  console.log(response.data.results[0].formatted_address); 
			
		  } catch(err) {
			console.log(err);
		  }  
		
	};

	const onGetLocationBackPress = (): void => {
		navigation && navigation.goBack();
	}

	const onGetLocationPress = (): void => {
		console.log("##:"+JSON.stringify(route.params));
		console.log(region.description)
		const wipPassenger = appStore.wipPassenger;
		if(route.params.id == "intermediate"){
			navigation.navigate(route.params.returnroute, { id: route.params.id,index: route.params.index ,latttude: region.latitude, longitude: region.longitude , description: place.description});
		}else if(route.params.id == "start"){
			//updateStartLocation(region.latitude, region.longitude);
			appStore.bus.setStartLocation(region.latitude, region.longitude);
			navigation.navigate(route.params.returnroute);
			//navigation.navigate('Journey', { id: route.params.id,latitude: region.latitude, longitude: region.longitude , description: place.description});
		}else if(route.params.id == "end"){
			//updateStartLocation(region.latitude, region.longitude);
			appStore.bus.setEndLocation(region.latitude, region.longitude);
			navigation.navigate(route.params.returnroute);
			//navigation.navigate('Journey', { id: route.params.id,latitude: region.latitude, longitude: region.longitude , description: place.description});
		}else if(route.params.id == "passenger-journeystarts"){
			wipPassenger.updateJourneyStart(placeName,region.latitude,region.longitude);
			navigation.navigate(route.params.returnroute, { id: route.params.id, name:route.params.name, mobileNumber: route.params.mobileNumber, latitude: region.latitude, longitude: region.longitude, placeName: placeName});	
		}else if(route.params.id == "passenger-journeyends"){
			wipPassenger.updateJourneyEnd(placeName,region.latitude,region.longitude);
			navigation.navigate(route.params.returnroute, { id: route.params.id, name:route.params.name, mobileNumber: route.params.mobileNumber, latitude: region.latitude, longitude: region.longitude, placeName: placeName});
		}else if(route.params.id == "passenger-returnjourneystarts"){
			wipPassenger.updateReturnJourneyStart(placeName,region.latitude,region.longitude);
			navigation.navigate(route.params.returnroute, { id: route.params.id, name:route.params.name, mobileNumber: route.params.mobileNumber, latitude: region.latitude, longitude: region.longitude, placeName: placeName});
		}else if(route.params.id == "passenger-returnjourneyends"){
			wipPassenger.updateReturnJourneyEnd(placeName,region.latitude,region.longitude);
			navigation.navigate(route.params.returnroute, { id: route.params.id, name:route.params.name, mobileNumber: route.params.mobileNumber, latitude: region.latitude, longitude: region.longitude, placeName: placeName});
		}
		else if(route.params.id == "stopping"){
			navigation.navigate(route.params.returnroute, { id: route.params.id, latitude: region.latitude, longitude: region.longitude, index: route.params.index, place: placeName,returnRoute: route.params.parentReturnRoute,journeyType: route.params.journeyType});
		}else if(route.params.id == "stopping-edit"){	
			console.log("&&"+region.latitude+":"+region.longitude);
			navigation.navigate(route.params.returnroute, { id: route.params.id, latitude: region.latitude, longitude: region.longitude, place: placeName, oldLatitude: route.params.oldLatitude, oldLongitude: route.params.oldLongitude, time: route.params.time, parentReturnRoute: route.params.parentReturnRoute, journeyType: route.params.journeyType});
		}
		
	};

	const onRegionChange = (newregion): void => {
		newregion.latitude = parseFloat(newregion.latitude.toFixed(6));
		newregion.longitude = parseFloat(newregion.longitude.toFixed(6));
		setLocation({ latitude: newregion.latitude,longitude: newregion.longitude})
		setRegion(newregion);
		setRegionChagned(true);
		console.log("Region changed"+region.latitude+":"+region.longitude);
	};

	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
	);
	
	return (
		
		<SafeAreaView style={styles.container} keyboardShouldPersistTaps="always">
			{ route.params.readOnly  && (
				<TopNavigation title={props => (
					
					<RNText {...props} style={{fontWeight: "500", fontSize: 18}}>
					Location
					</RNText>)} accessoryLeft={renderBackAction}  />
			)}
			{ !route.params.readOnly  && (
			<View>
			<View style={styles.locationButton}>
				<Button onPress={()=>onGetLocationBackPress()} appearance='ghost' accessoryLeft={ArrowIosBackIcon}/>	
				<Input placeholder="Name" value={placeName} onChangeText={setPlaceName} selectionColor="#142169" cursorColor="#142169" style={{ flex: 7 }} clearButtonMode="while-editing"/>
				<Button onPress={()=>onGetLocationPress()} appearance='ghost' accessoryLeft={CheckmarkOutlineIcon} />	
			</View>
			
			<GooglePlacesAutocomplete
			    keyboardShouldPersistTaps="always"
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
					
					refAutoComplete.current?.setAddressText(address);
					//setSearch({searchKeyword: data.description});
					setPlaceName(address);
					console.log("address:"+address);
					setRegion({
						latitude: details.geometry.location.lat,
						longitude: details.geometry.location.lng,
						latitudeDelta: 0.005,
						longitudeDelta: 0.005
					});
					console.log("lat:lng"+details.geometry.location.lat+","+details.geometry.location.lng);

					setPlace({
						placeId: data.place_id,
						description: address
					})
					console.log("data:"+data);
					console.log("data.placeId:"+data.place_id);
					
				}}

				fetchDetails={true}

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
			)}
	
			<MapView
				provider={PROVIDER_GOOGLE} // remove if not using Google Maps
				style={styles.map}
				region={region}
				onRegionChangeComplete={region=>onRegionChange(region)}>
				<Marker coordinate= {{latitude: location.latitude, longitude: location.longitude}} description="Delivery person 1">
				</Marker>
				

			</MapView>
			
			
			
		</SafeAreaView>
		
		
	);
};


const styles = StyleSheet.create({
	container: {
		position: 'absolute',
    	zIndex: 9999,
    	width: '100%'
	},

	markerFixed: {
		left: '50%',
		marginLeft: 0,
		marginTop: 0,
		position: 'absolute',
		top: '58%'
	},

	locationButton: {
		flexDirection: "row",
		justifyContent: 'space-between',
		marginHorizontal: 2,
		//position: 'absolute',
		flexWrap: 'wrap',
		flex: 1,
		marginTop: 0
	},
	  
	marker: {
		height: 10,
		width: 10
	},
	
	map: {
		flex: 1,
		width: width-20,
		left: 10,
		height: height-100,
		bottm: 10,
		justifyContent: 'flex-end',
		alignItems: 'center',	  
	},
	item: {
		marginVertical: 8,
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
