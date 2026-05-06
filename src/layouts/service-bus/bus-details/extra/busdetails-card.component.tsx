import { TopNavigationAction,Input, Button, Card, Avatar, Text ,Divider, IconElement} from "@ui-kitten/components";
import React,{useState,useEffect,useRef,forwardRef,useImperativeHandle} from "react";
import { View, ScrollView, TouchableOpacity, Image, Text as RNText, StyleSheet, ActivityIndicator, Alert,ListRenderItemInfo} from "react-native";
import { useRoute } from "@react-navigation/native";
import AppStore from "../../../../store/AppStore";
import { useStore } from "mobx-store-provider";
import { Passenger,Owner } from "./data";

import { CachedImage } from '@georstat/react-native-image-cache';

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import { useSafeAreaInsets } from "react-native-safe-area-context";
import RBSheet from 'react-native-raw-bottom-sheet';

import { DayPicker } from '@routeslk/react-native-picker-weekday';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { ArrowIosBackIcon } from "../../../../components/icons";


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
export const BusDetailsCard = React.forwardRef(({navigation},refStandard) => {

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

	
	const loadBusses = async() => {
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };
		  try {
			console.log("params.id:"+route.params.id);
			console.log(JSON.stringify(route));
			const response: AxiosResponse = await client.get('/buses/'+route.params.id , config);
			console.log(response.status);
			console.log("##### appStore.user.mobileNumber::"+appStore.user.mobileNumber);
			console.log("Bus from id:"+response.data); 
			console.log(JSON.stringify(response.data)); 

			appStore.bus.populate(response.data);

			console.log("Populate finished!!");
			console.log(JSON.stringify(toJS(appStore.bus)));
			//console.log("#### Passengers count :"+response.data.passengers.length);
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

			
			



			if(appStore.bus.journey.stoppings.length>1){
				setJourneyEndLocation(appStore.bus.journey.stoppings[appStore.bus.journey.stoppings.length-1].place);
				setJourneyEndTime(appStore.bus.journey.stoppings[appStore.bus.journey.stoppings.length-1].time);
			}

			if(appStore.bus.returnJourney.stoppings.length>1){
				setReturnJourneyEndLocation(appStore.bus.returnJourney.stoppings[appStore.bus.returnJourney.stoppings.length-1].place);
				setReturnJourneyEndTime(appStore.bus.returnJourney.stoppings[appStore.bus.returnJourney.stoppings.length-1].time);
			}
			
			//setBusnew(response.data);  
			//console.log(JSON.stringify(toJS(newBusStore)));
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
			await loadBusses();
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
		<Card style={styles.itemPhotos}>
			<View style={{padding: 5,flexDirection: "row", justifyContent: "flex-end"}}>
				<Button size="small" style={{ backgroundColor: getRouteColor(appStore.bus.routeType) ,borderColor: getRouteColor(appStore.bus.routeType)}} >{appStore.bus?.routeType}</Button>
			</View>
			<TouchableOpacity onPress={onImagePressed}>
				<CachedImage			
					resizeMode="cover"
					source={appStore.bus.photos[imageIndex]}
					style={styles.itemHeader}/>
			</TouchableOpacity>
			<View style={{padding: 5,flexDirection: "row", justifyContent: "space-between"}}>
				<Button appearance='ghost'  size="small"  style={{ borderColor:"#142169", borderWidth: 2}} >{appStore.bus.registrationNumber}</Button>
				<Button size="small" style={{ backgroundColor: appStore.bus.transportServiceThemeColor,borderColor: appStore.bus.transportServiceThemeColor}} >{appStore.bus.transportServiceName}</Button>		
			</View>
			</Card>
		<Card style={styles.item}>
			<Text category="h5">{appStore.bus.title}</Text>			
			<View style={{flexDirection: "row"}}>
				<Text>
			{appStore.bus.stoppings.map(function(stopping, index){	
				if(index==0 ){
					return <Text style={{ color: "grey"}}>{stopping.place}</Text>	
				}else{
					return <Text style={{ color: "grey"}}>- {stopping.place}</Text>	
				}							
			})}	
				</Text>
			</View>
		</Card>

		<Card style={styles.item}>
			<View style={{flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
				<Text style={{ flex: 1 , margin: 5}} category="h6">Journey</Text>
				<View>
					{!appStore.bus.journey.live && 
					<TouchableOpacity  onPress={onJourneyLivePressed}>
						<Image source={require("./../../../../assets/images/routeslk/go_live_stopped.png")} />
					</TouchableOpacity>
					}
					{appStore.bus.journey.live && 
					<Image source={require("./../../../../assets/images/routeslk/go_live_started.png")}/>
					}
				</View>
			</View>
			
			
			<View style={{flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
				<View style={{flex: 1, flexDirection: "row", justifyContent: "flex-start"}}>
					<EvilIcons style={{ marginTop: 5}} name="location" size={30} color="green" />
					<Text style={{  marginTop: 5,color: 'green'}} >START</Text>
				</View>
				<Text style={{ flex: 1 , margin: 5}} >{appStore.bus.journey.stoppings[0]?.place}</Text>
				<Text style={{ flex: 1 , margin: 5}} >{appStore.bus.journey.stoppings[0]?.time}</Text>
			</View>
			<View style={{flex: 1 ,flexDirection: "row", justifyContent: "space-between"}}>
				<View style={{flex: 1, flexDirection: "row", justifyContent: "flex-start"}}>
					<EvilIcons style={{  marginTop: 5}} name="location" size={30} color="red" />
					<Text style={{  marginTop: 5,color: 'red'}} >END</Text>
				</View>
				<Text style={{ flex: 1 , margin: 5}}>{journeyEndLocation}</Text>
				<Text style={{ flex: 1 , margin: 5}}>{journeyEndTime}</Text>
			</View>
			<View style={{ borderWidth: 1 , borderColor: "#eee" }}>
				<Text style={{ flex: 1 , margin: 5 }}>Running Days</Text>
				<DayPicker
							weekdays={
								appStore.bus.journey.runningDays.split(',').map(function(item) {
									return parseInt(item, 10);
							})}
							setWeekdays={setJourneyWeekdays}
							activeColor='#142169'
							textColor='white'
							inactiveColor='grey'
							wrapperStyles={{ marginTop: 0}}/>
			</View>
			<Card style={{ marginTop: 10, borderRadius:10}} onPress={() => navigation.navigate("BusJourneyStoppings", {id: appStore.bus.id, latitude: appStore.bus.journey.stoppings[0].latitude,  longitude: appStore.bus.journey.stoppings[0].longitude})}>
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Stoppings</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("BusJourneyStoppings",{id: appStore.bus.id, latitude: appStore.bus.journey.stoppings[0].latitude,  longitude: appStore.bus.journey.stoppings[0].longitude})}/>
				</View>
			</Card>
			
		</Card>

		<Card style={styles.item}>
			<View style={{flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
				<Text style={{ flex: 1 , margin: 5}} category="h6">Return Journey</Text>
				
			<View>
				{!appStore.bus.returnJourney.live && 
				<TouchableOpacity  onPress={onReturnJourneyLivePressed}>
					<Image source={require("./../../../../assets/images/routeslk/go_live_stopped.png")} />
				</TouchableOpacity>
				}
				{appStore.bus.returnJourney.live && 
				<Image source={require("./../../../../assets/images/routeslk/go_live_started.png")}/>
				}
			</View>
			
			
			</View>
			<Divider />
			<View style={{flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
				<View style={{flex: 1, flexDirection: "row", justifyContent: "flex-start"}}>
					<EvilIcons style={{ marginTop: 5}} name="location" size={30} color="green" />
					<Text style={{  marginTop: 5,color: 'green'}} >START</Text>
				</View>
				<Text style={{ flex: 1 , margin: 5}} >{appStore.bus.returnJourney.stoppings[0]?.place}</Text>
				<Text style={{ flex: 1 , margin: 5}} >{appStore.bus.returnJourney.stoppings[0]?.time}</Text>
			</View>
			<View style={{flex: 1 ,flexDirection: "row", justifyContent: "space-between"}}>
				<View style={{flex: 1, flexDirection: "row", justifyContent: "flex-start"}}>
					<EvilIcons style={{  marginTop: 5}} name="location" size={30} color="red" />
					<Text style={{  marginTop: 5,color: 'red'}} >END</Text>
				</View>
				<Text style={{ flex: 1 , margin: 5}}>{returnJourneyEndLocation}</Text>
				<Text style={{ flex: 1 , margin: 5}}>{returnJourneyEndTime}</Text>
			</View>
			<View style={{ borderWidth: 1 , borderColor: "#eee" }}>
				<Text style={{ flex: 1 , margin: 5 }}>Running Days</Text>
				<DayPicker
							weekdays={
								appStore.bus.returnJourney.runningDays.split(',').map(function(item) {
									return parseInt(item, 10);
							})}
							setWeekdays={setReturnJourneyWeekdays}
							activeColor='#142169'
							textColor='white'
							inactiveColor='grey'
							wrapperStyles={{ marginTop: 0}}
							/>
			</View>
			<Card style={{ marginTop: 10, borderRadius:10}} onPress={() => navigation.navigate("BusReturnJourneyStoppings", {id: appStore.bus.id, latitude: appStore.bus.journey.stoppings[0].latitude,  longitude: appStore.bus.journey.stoppings[0].longitude})}>
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Stoppings</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("BusReturnJourneyStoppings",{id: appStore.bus.id, latitude: appStore.bus.journey.stoppings[0].latitude,  longitude: appStore.bus.journey.stoppings[0].longitude})}/>
				</View>
			</Card>
		
		</Card>

		<Card style={styles.item} onPress={() => navigation.navigate("BusPassengers", {id: appStore.bus.id, readOnly: true,latitude: appStore.bus.journey.stoppings[0].latitude,  longitude: appStore.bus.journey.stoppings[0].longitude})}>
			<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
				<Text>Passengers</Text>
				<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("BusPassengers",{id: appStore.bus.id, readOnly: true, latitude: appStore.bus.journey.stoppings[0].latitude,  longitude: appStore.bus.journey.stoppings[0].longitude})}/>
			</View>
		</Card>

		<Card style={styles.item} onPress={() => navigation.navigate("BusDriversList", {id: appStore.bus.id, readOnly: true, latitude: appStore.bus.journey.stoppings[0].latitude,  longitude: appStore.bus.journey.stoppings[0].longitude})}>
			<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
				<Text>Drivers</Text>
				<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("BusDriversList",{id: appStore.bus.id, readOnly: true, latitude: appStore.bus.journey.stoppings[0].latitude,  longitude: appStore.bus.journey.stoppings[0].longitude})}/>
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