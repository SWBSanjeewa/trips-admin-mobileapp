import { TopNavigationAction,Input, Button, Card, Avatar, Text ,Divider, IconElement} from "@ui-kitten/components";
import React,{useState,useEffect,useRef,forwardRef,useImperativeHandle} from "react";
import { View, ScrollView, TouchableOpacity, Text as RNText, StyleSheet, ActivityIndicator, Alert,ListRenderItemInfo} from "react-native";
import { useRoute } from "@react-navigation/native";
import AppStore from "../../../../store/AppStore";
import { useStore } from "mobx-store-provider";
import { Passenger,Owner } from "./data";

import { Image } from 'expo-image';

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import { useSafeAreaInsets } from "react-native-safe-area-context";
import RBSheet from 'react-native-raw-bottom-sheet';

import { DayPicker } from '@routeslk/react-native-picker-weekday';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { ArrowIosBackIcon } from "../../../../components/icons";

import { Galeria } from '@nandorojo/galeria'


import { SafeAreaLayout } from "../../../../components/safe-area-layout.component";

const client = axios.create({
	baseURL: 'https://routes.lk:7007'
});

import { toJS } from "mobx";

import {
	MaterialIcons as MDIcon,
} from '@expo/vector-icons';

import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import {routeTypes, getRouteColor, vehcileTypes, getVehicleColor}  from "../../../../app/routes-common";

import EvilIcons from '@expo/vector-icons/EvilIcons';

import { useFocusEffect } from '@react-navigation/native';

// forwardRef(function MyInput(props, ref) {
// const MyInput = forwardRef(function MyInput(props, ref) {
   // const FancyButton = React.forwardRef((props, ref) => (
//const BusDetailsCard =  forwardRef(function(navigation,ref){
	//React.forwardRef<View, IButton>((props, ref) => {
//const BusDetailsCard =  forwardRef((navigation,ref) => {
//	const BusDetailsAddCard = ({ navigation }): React.ReactElement => {
//	https://github.com/gorhom/react-native-bottom-sheet/issues/742
//const BusDetailsCard =  React.forwardRef<BottomSheet>({navigation, bottomSheetRef} => {
//const BusDetailsCard =  React.forwardRef<BottomSheet>(({navigation},bottomSheetRef): React.ReactElement => {
// Type 'ForwardedRef<unknown>' is not assignable to type 'Ref<BottomSheetMethods>'.

//const BusDetailsCard = forwardRef(({ navigation }, bottomSheetRef) => {
//	React.forwardRef(({ name }, ref) => {
export const TourDetailsCard = React.forwardRef(({navigation},refStandard) => {

	const [journeyWeekdays, setJourneyWeekdays] = React.useState([2,3,4,5,6])

	const [returnJourneyWeekdays, setReturnJourneyWeekdays] = React.useState([2,3,4,5,6])
	
	const appStore = useStore(AppStore);


	const insetsConfig = useSafeAreaInsets();

	const refStandardConfirmation = useRef();

	const [loading, setLoading] = useState(true);

	const [journeyEndLocation, setJourneyEndLocation] = useState('');
	const [journeyEndTime, setJourneyEndTime] = useState('');

	const [returnJourneyEndLocation, setReturnJourneyEndLocation] = useState('');
	const [returnJourneyEndTime, setReturnJourneyEndTime] = useState('');
	

	const route = useRoute();

	const [journeyLiveChecked, setJourneyLiveChecked] = React.useState(false);

	const [returnJourneyLiveChecked, setReturnJourneyLiveChecked] = React.useState(false);

	const [imageIndex, setImageIndex] = useState(0);

	

	const onJourneyLivePressed = async () => {	
		navigation && navigation.navigate("BusLive", { id: appStore.bus.id ,latitude: appStore.bus.journey.stoppings[0].latitude,  longitude: appStore.bus.journey.stoppings[0].longitude, live: true});
	};

	const onReturnJourneyLivePressed = async () => {	
		navigation && navigation.navigate("BusLive", { id: appStore.bus.id ,latitude: appStore.bus.returnJourney.stoppings[0].latitude,  longitude: appStore.bus.returnJourney.stoppings[0].longitude, live: true});
	};

	const onImagePressed = (): void => {
		if(appStore.bus.photos.length > imageIndex+1 ){
			setImageIndex(imageIndex+1);
		}else{
			setImageIndex(0);
		}
	};

	
	

	const MenuIcon = (props): IconElement => (
		<MaterialIcons name="more-vert" size={24} color="black" />
	);

	
	const loadTour = async() => {
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };
		  try {
			console.log("params.id:"+route.params.id);
			console.log(JSON.stringify(route));
			const response: AxiosResponse = await client.get('/tours/'+route.params.id , config);
			console.log(response.status);
			console.log("##### appStore.user.mobileNumber::"+appStore.user.mobileNumber);
			console.log("Bus from id:"+response.data); 
			console.log(JSON.stringify(response.data)); 

			appStore.tour.populate(response.data);

			console.log("Populate finished!!");
			console.log(JSON.stringify(toJS(appStore.tour)));
			//console.log("#### Passengers count :"+response.data.passengers.length);
			if(response.data.photos != null){
				response.data.photos.forEach(element => {
					appStore.bus.addStopping( element.place,Number(element.latitude),Number(element.longitude),element.time)
				});
		    }

			if(response.data.stoppings != null){
				response.data.stoppings.forEach(element => {
					appStore.bus.addStopping( element.place,Number(element.latitude),Number(element.longitude),element.time)
				});
		    }
			if(response.data.journey != null){
				appStore.bus.setJourneyRunningDays(response.data.journey.runningDays);
				response.data.journey.stoppings.forEach(element => {
					console.log("Adding place:"+element.place); 
					appStore.bus.addJourneyStopping( element.place,
					Number(element.latitude),
					Number(element.longitude),
					element.time,
					)
					});
		    }
			if(response.data.returnJourney != null){
				appStore.bus.setReturnJourneyRunningDays(response.data.returnJourney.runningDays);
				response.data.returnJourney.stoppings.forEach(element => {
					appStore.bus.addReturnJourneyStopping( element.place,
					Number(element.latitude),
					Number(element.longitude),
					element.time,
					)
					});
		    }
			if(response.data.passengers != null){
				response.data.passengers.forEach(element => {
					appStore.bus.addPassenger( element.name,
					element.mobileNumber,
					element.journeyStart,
					Number(element.journeyStartLatitude),
					Number(element.journeyStartLongitude),
					element.journeyEnd,
					Number(element.journeyEndLatitude),
					Number(element.journeyEndLongitude),
					element.returnJourneyStart,
					Number(element.returnJourneyStartLatitude),
					Number(element.returnJourneyStartLongitude),
					element.returnJourneyEnd,
					Number(element.returnJourneyEndLatitude),
					Number(element.returnJourneyEndLongitude),
					element.journeyWeekdays,
					element.returnJourneyWeekdays,
					element.watchers
					)
					});
		    }

	
		  } catch(err) {
			console.log(err);
		  }  
		
	};

	const renderItem = (info: ListRenderItemInfo<Passenger>): React.ReactElement => (
		<Card key={"driver_"+info.index} style={styles.item}>
			<View style={{ flexDirection: "row",  justifyContent: 'flex-start', margin: 2}}>
					<View style={{ padding: 5}}>
						<Avatar {...{source:"https://routes.lk:7007/users/"+info.item.mobileNumber+"/profile-photo.jpg"}} key={"profile_photo_"+info.item.mobileNumber} style={{ borderWidth: 2, borderColor: "grey"}}  ImageComponent={CachedImage} size="large"/>
					</View>
					<View style={{ padding: 5}}>
						<Text>{info.item.name}</Text>
						<Text>{info.item.mobileNumber}</Text>
					</View>
				</View>
		</Card>
	);

	const renderOwnerItem = (info: ListRenderItemInfo<Owner>): React.ReactElement => (
		<Card key={"driver_"+info.index} style={styles.item}>
			<View style={{ flexDirection: "row",  justifyContent: 'flex-start', margin: 2}}>
					<View style={{ padding: 5}}>
						<Avatar {...{source:"https://routes.lk:7007/users/"+info.item.mobileNumber+"/profile-photo.jpg"}} key={"profile_photo_"+info.item.mobileNumber} style={{ borderWidth: 2, borderColor: "grey"}}  ImageComponent={CachedImage} size="large"/>
					</View>
					<View style={{ padding: 5}}>
						<Text>{info.item.name}</Text>
						<Text>{info.item.mobileNumber}</Text>
					</View>
				</View>
		</Card>
	);

	
	const onEditPress = () => {
		refStandard.current.close();
		navigation.navigate("BusEdit");
	};

	const onDeletePress = () => {
		refStandardConfirmation.current.open();
		
	};

	const deleteBusCancelled = () => {
		refStandardConfirmation.current.close();
	};


	const deleteBusPress = async() => {
		
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };
		  try {
			console.log("Calling delete rest..."+route.params.id); 
			const response: AxiosResponse = await client.delete(`/buses/`+route.params.id );
			console.log(response.status);
			console.log(response.data.json); 
			console.log("Submitting..."); 
			appStore.bus.reset();
			navigation && navigation.navigate("BusHome", {reload: true});
		  } catch(err) {
			console.log(err);
		  }  
		
	};

	

	useEffect(() => {
		console.log("### effects");
		const fetch = async ()=>{
			console.log("### calling loadbuses");
			await loadTour();
			setLoading(false);
		}
		fetch();	
	}, []);

	
	

	if (loading) {
		return <ActivityIndicator />;
	}

	return (
		<SafeAreaLayout style={{ flex: 1}} insets="bottom">
		<ScrollView style={{ flex: 1}}>
		<Card
					style={styles.item}
					//header={() => renderItemHeader(info)}
					//footer={() => renderItemFooter(info)}
					// onPress={() => onItemPress(info)}
				>
					<View>
						<View style={{  flexDirection: "row", justifyContent: "flex-end" }}>
							<Button appearance='ghost'  size="small"  style={{ borderColor:"#142169", borderWidth: 2}}>{appStore.tour.noOfDays} Days</Button>
						</View>
						<Galeria urls={appStore.tour.photos}>
							<Galeria.Image>
								<Image source={appStore.tour.photos[0]} contentFit="cover" style={styles.itemHeader}  />
							</Galeria.Image>	
						</Galeria>	
					</View>
					<Text category="h5">{appStore.tour.title}</Text>
					<View style={{flexDirection: "row"}}>
						<Text>
						{appStore.tour.stoppingsPlaces.map(function(stopping, index){	
							if(index==0 ){
								return <Text style={{ color: "grey"}}>{stopping.place}</Text>	
							}else{
								return <Text style={{ color: "grey"}}>- {stopping.place}</Text>	
							}							
						})}	
						</Text>
					</View>
					<View style={{paddingTop: 10, flexDirection: "row", justifyContent: "space-between"}}>
						{appStore.tour.vehicleType && (
						<Button appearance='ghost'  size="small"  style={{ borderColor:"#142169", borderWidth: 2}} >{appStore.tour.vehicleType}</Button>
						)}	
						<Button size="small">{appStore.tour.schedules[0]?.tourStartDate}</Button>
					</View>
					
				</Card>
		
		
		
		<Card style={styles.item} onPress={() => navigation.navigate("TourSchedules", {id: ""})}>
			<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
				<Text>Schedules</Text>
				<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("TourSchedules",{id: ""})}/>
			</View>
		</Card>

		<RBSheet draggable dragOnContent key="busActions" ref={refStandard} height={250}>
			<View style={{ paddingHorizontal: 10}}>
				<View style={{ flexDirection: "row",  justifyContent: 'center' , padding: 5, margin: 5}}>
					<RNText style={{ fontWeight: "500", fontSize: 18}}>Actions</RNText>
				</View>
				<TouchableOpacity onPress={onEditPress} style={{ flexDirection: "row",  justifyContent: 'space-between' , margin: 5, padding: 10, borderColor: "grey", borderWidth: 1, borderRadius: 5 }}>
					<MDIcon name="edit" style={styles.editItemContentIcon}/>
					<Text>Edit</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={onEditPress}/>
				</TouchableOpacity>

				<TouchableOpacity onPress={onDeletePress} style={{ flexDirection: "row",  justifyContent: 'space-between' , margin: 5, padding: 10, borderColor: "grey", borderWidth: 1, borderRadius: 5 }}>
					<MDIcon name="delete" style={styles.deleteItemContentIcon}/>
					<Text>Delete</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={onEditPress}/>
				</TouchableOpacity>
				
			</View>

			<RBSheet draggable dragOnContent key="busDeleteConfirmation" ref={refStandardConfirmation} height={300}>
				<View style={{ paddingHorizontal: 10}}>
					<View style={{ flexDirection: "row",  justifyContent: 'center' , padding: 5, margin: 5}}>
						<RNText style={{ fontWeight: "500", fontSize: 18}}>Confirmation</RNText>
					</View>
					
					<Text style={{ padding: 5 }}>Are you sure?  You want to delete Bus</Text>
						
					<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
							<Button size="large" style={{ flex: 3 , margin: 5, backgroundColor: "#D69200" , borderRadius:50, margin: 10, borderColor: "#D69200" }} onPress={deleteBusCancelled} >Cancel</Button>
							<Button size="large" style={{ flex: 3 , margin: 5, backgroundColor: "#B12048", borderRadius:50, margin: 10, borderColor: "#B12048"}} onPress={deleteBusPress}>Delete</Button>
					</View>
				</View>
			</RBSheet>
		</RBSheet>
		
		</ScrollView>
		</SafeAreaLayout>
		
	);
});

const styles = StyleSheet.create({
	
	listContent: {
		paddingHorizontal: 32,
		paddingVertical: 8,
	},
	containerContent: {
		flexDirection: "column",
		justifyContent: 'flex-start'
	},
	itemPhotos: {
		marginVertical: 0,
		margin: 5
	},
	item: {
		marginVertical: 8,
		margin: 5
	},
	itemHeader: {
		height: 220,
	},
	itemContent: {
		marginVertical: 2,
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
	itemContentIcon: {
		fontSize: 20,
		color: '#666',
	},
	editItemContentIcon: {
		fontSize: 20,
		color: '#D69200',
	},
	deleteItemContentIcon: {
		fontSize: 20,
		color: '#B12048',
	},
	listContainer: {
		flex: 1,
		padding: 25,
	},
	  listTitle: {
		fontSize: 16,
		marginBottom: 20,
		color: 'black',
	  },
	  listButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 10,
	  },
	  listIcon: {
		fontSize: 26,
		color: '#666',
		width: 60,
	  },
	  listDeleteIcon: {
		fontSize: 26,
		color: 'red',
		width: 60,
	  },
	  listLabel: {
		fontSize: 16,
	  },
});