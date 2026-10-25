import { Select, IndexPath, SelectItem, Button, Card, Avatar, Text ,Divider, IconElement,Input} from "@ui-kitten/components";
import React,{useState,useEffect,useRef,forwardRef,useImperativeHandle} from "react";
import { View, ScrollView, TouchableOpacity, Text as RNText, StyleSheet, ActivityIndicator, Pressable,ListRenderItemInfo} from "react-native";
import { useRoute } from "@react-navigation/native";
import AppStore from "../../../../store/AppStore";
import { useStore } from "mobx-store-provider";
import { RouteBus } from "./data";
import { observer, inject} from "mobx-react";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { CachedImage } from '@georstat/react-native-image-cache';

import {routeBusTypes, operatorTypes, transportAuthorityTypes,getTransportAuthorityTypesIndexNumber, getOperatorTypesIndexNumber,getServiceTypesIndexNumber}  from "../../../../app/routes-common";

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import { useSafeAreaInsets } from "react-native-safe-area-context";
import RBSheet from 'react-native-raw-bottom-sheet';

import { DayPicker } from '@routeslk/react-native-picker-weekday';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';


import AntDesign from '@expo/vector-icons/AntDesign';


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
import { LinearGradient } from "expo-linear-gradient";
import { TimerPickerModal } from "react-native-timer-picker";

import TourPhotosAddCard from "../../round-tour/../tour-photos-add/extra/tourphotos-add-card.component";


import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { VehicleLayoutSuggestions}  from "./vehicle-layout-auto-suggestions";

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
const TourEditCard = React.forwardRef(({navigation},refStandard) => {

	const [journeyWeekdays, setJourneyWeekdays] = React.useState([2,3,4,5,6])

	const [returnJourneyWeekdays, setReturnJourneyWeekdays] = React.useState([2,3,4,5,6])
	
	const appStore = useStore(AppStore);

	const route = useRoute();

	const refAutoComplete = useRef(null);


	const insetsConfig = useSafeAreaInsets();
		
	const refStandardConfirmation = useRef();

	const [loading, setLoading] = useState(true);

	const [selectedStopping, setSelectedStopping] = React.useState<string>("");

	const [vehicleIndex, setVehicleIndex] = React.useState<string>("");

	const [journeyEndLocation, setJourneyEndLocation] = useState('');
	const [journeyEndTime, setJourneyEndTime] = useState('');

	const [returnJourneyEndLocation, setReturnJourneyEndLocation] = useState('');
	const [returnJourneyEndTime, setReturnJourneyEndTime] = useState('');
	

	

	const [journeyLiveChecked, setJourneyLiveChecked] = React.useState(false);

	const [returnJourneyLiveChecked, setReturnJourneyLiveChecked] = React.useState(false);

	const [imageIndex, setImageIndex] = useState(0);

	const [reload, setReload] = useState(true);

	const [journeyStoppingsErrorMessage, setJourneyStoppingsErrorMessage] = React.useState<string>("");

	

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

	const [selectedIndexTransportAuthorityType, setSelectedIndexTransportAuthorityType] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const transportAuthorityType = transportAuthorityTypes[selectedIndexTransportAuthorityType.row];

	const [selectedOperatorIndex, setSelectedOperatorIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const operatorType = operatorTypes[selectedOperatorIndex.row];

	const [selectedIndexBusType, setSelectedIndexBusType] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const routeType = routeBusTypes[selectedIndexBusType.row];

	const refRBSheetTitleEdit = useRef();
	const [title, setTitle] = useState("");

	const [selectedIndex, setSelectedIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const days = Array.from({ length: 10 }, (_, i) => ({
		key: (i + 1).toString(),
		value: `${i + 1}`
	}));

	const [selectedDaysIndex, setSelectedDaysIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const selectedDays = days[selectedDaysIndex.row];

	const [photosErrorMessage, setPhotosErrorMessage] = React.useState<string>("");


	const MenuIcon = (props): IconElement => (
		<MaterialIcons name="more-vert" size={24} color="black" />
	);


	const onTransportAuthorityUpdate = async() => {
		console.log(JSON.stringify(toJS(appStore.routeBus)));	

		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };
		  try {
			const response: AxiosResponse = await client.put(`/routebuses/`+appStore.routeBus.objectId+`/transportAuthority/`+appStore.routeBus.transportAuthority , config);
			console.log(response.status);
		  } catch(err) {
			console.log(err);
		  }  
	}

	// "operator":"Private","transportAuthority":"NTC","typeOfService":"Normal",
	const onTypeOfServiceUpdate = async() => {
		console.log(JSON.stringify(toJS(appStore.routeBus.typeOfService)));	

		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };
		  try {
			console.log("&&&"+`/routebuses/`+appStore.routeBus.objectId+`/typeOfService/`+appStore.routeBus.typeOfService);
			const response: AxiosResponse = await client.put(`/routebuses/`+appStore.routeBus.objectId+`/typeOfService/`+appStore.routeBus.typeOfService, appStore.routeBus.typeOfService , config);
			console.log(response.status);
		  } catch(err) {
			console.log(err);
		  }  
	}

	const onOperatorUpdate = async() => {
		console.log(JSON.stringify(toJS(appStore.routeBus.operator)));	

		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };
		  try {
			const response: AxiosResponse = await client.put(`/routebuses/`+appStore.routeBus.objectId+`/operator/`+appStore.routeBus.operator, appStore.routeBus.operator , config);
			console.log(response.status);
		  } catch(err) {
			console.log(err);
		  }  
	}

	const onTitleUpdate = async() => {
		console.log(JSON.stringify(toJS(appStore.routeBus.title)));	

		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };
		  try {
			const response: AxiosResponse = await client.put(`/routebuses/`+appStore.routeBus.objectId+`/title/`+appStore.routeBus.operator, appStore.routeBus.title , config);
			console.log(response.status);
		  } catch(err) {
			console.log(err);
		  }  
	}

	
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
			const response: AxiosResponse = await client.get('/routebuses/'+route.params.id , config);
			console.log(response.status);
			console.log("##### appStore.user.mobileNumber::"+appStore.user.mobileNumber);
			console.log("Bus from id:"+response.data); 
			console.log(JSON.stringify(response.data)); 

			appStore.routeBus.populate(response.data);

			console.log("Populate finished!! XXX");
			
			console.log("#### Passengers count :"+response.data.passengers.length);
			if(response.data.stoppingPlaces != null){
				response.data.stoppingPlaces.forEach(element => {
					appStore.routeBus.addStoppingPlace( element.place,Number(element.latitude),Number(element.longitude))
				});
		    }

			if(response.data.journey.stoppings != null){
				response.data.journey.stoppings.forEach(element => {
					//appStore.routeBus.addStoppingPlace( element.place,element.latitude,element.longitude)
					appStore.routeBus.journey.addStopping(element.place, Number(element.latitude),Number(element.longitude),element.duration);
				});
		    }

			console.log("journey.schedules?.length::"+response.data.journey.schedules?.length);

			if(response.data.journey.schedules != null){
				response.data.journey.schedules.forEach((schedule,schedule_index) => {
					appStore.routeBus.journey.addSchedule(schedule.fromDate, schedule.toDate);
					schedule.timetables.forEach((timetable,timetable_index) => {
						appStore.routeBus.journey.schedules[schedule_index].addTimetable(timetable.type, timetable.runningDays);
						timetable.turns.forEach(turn => {
							appStore.routeBus.journey.schedules[schedule_index].timetables[timetable_index].addTurn(turn.onboardStartTime,turn.startTime,turn.runningNo,turn.stoppings,turn.registrationNo,turn.licenseNo);
							console.log("Turn"+schedule.fromDate+" "+schedule.toDate);
						});
					});
				});
		    }

			/*
			if(response.data.journey.timetables != null){
				response.data.journey.timetables.forEach((timetable,index) => {
					appStore.routeBus.journey.addTimetable(timetable.type, timetable.runningDays);
					timetable.turns.forEach(turn => {
						appStore.routeBus.journey.timetables[index].addTurn(turn.onboardStartTime,turn.startTime,turn.runningNo,turn.stoppings,turn.registrationNo,turn.licenseNo);
					});
				});
		    }
			*/

			if(response.data.returnJourney.stoppings != null){
				response.data.returnJourney.stoppings.forEach(element => {
					//appStore.routeBus.addStoppingPlace( element.place,element.latitude,element.longitude)
					appStore.routeBus.returnJourney.addStopping(element.place, Number(element.latitude),Number(element.longitude),element.duration);
				});
		    }

			/*
			if(response.data.returnJourney.timetables != null){
				response.data.returnJourney.timetables.forEach((timetable,index) => {
					appStore.routeBus.returnJourney.addTimetable(timetable.type, timetable.runningDays);
					timetable.turns.forEach(turn => {
						appStore.routeBus.returnJourney.timetables[index].addTurn(turn.onboardStartTime,turn.startTime,turn.runningNo,turn.stoppings,turn.registrationNo,turn.licenseNo);
					});
				});
		    }
			*/
			
			console.log(JSON.stringify(toJS(appStore.routeBus)));

			
			
			//setBusnew(response.data);  
			console.log(">>> >>>");
			console.log(JSON.stringify(toJS(appStore.routeBus)));
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
		navigation.navigate("RouteBusEdit");
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

	const onBusTypeSelect = (index): void => {
		setSelectedIndexBusType(index);
		appStore.routeBus.setTypeOfService(routeBusTypes[index-1].name);
		onTypeOfServiceUpdate();

	};

	

	

	useEffect(() => {
		setTitle(appStore.tour.title);

		console.log("useefefct:"+appStore.routeBus.transportAuthority);
		console.log(">>"+getTransportAuthorityTypesIndexNumber(appStore.routeBus.transportAuthority));
		
		setSelectedIndexTransportAuthorityType(new IndexPath(getTransportAuthorityTypesIndexNumber(appStore.routeBus.transportAuthority)));
		setSelectedOperatorIndex(new IndexPath(getOperatorTypesIndexNumber(appStore.routeBus.operator)));
		setSelectedIndexBusType(new IndexPath(getServiceTypesIndexNumber(appStore.routeBus.typeOfService)));
		

		if(route.params?.reload){
			const fetch = async ()=>{
				console.log("### calling loadbuses");
				await loadBusses();
				setLoading(false);
			}
			fetch();
		}else{
			setLoading(false);
		}	
	}, []);

	

	const onTransportAuthorityTypeSelect = (index): void => {
		setSelectedIndexTransportAuthorityType(index);
		appStore.routeBus.setTransportAuthority(transportAuthorityTypes[index-1].name);
		onTransportAuthorityUpdate();
	};

	const renderItemHeader = (): React.ReactElement => (
		<View>
			<View style={{paddingTop: 10, flexDirection: "row", justifyContent: "flex-end" }}>	
				<Button appearance='ghost'  size="small"  style={{ borderColor:"#142169", borderWidth: 2, marginHorizontal: 5 }} >{appStore.routeBus.operator}</Button>
				<Button size="small" onPress={()=>onTransportServicePress(info.item)}>{appStore.routeBus.typeOfService}</Button>
			</View>	
		</View>
	);

	const renderOptionBusTypes = (routeType): React.ReactElement => (
		<SelectItem key={routeType.name} title={evaProps => <View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
			<FontAwesome5 name="bus" size={24} color={getRouteColor(routeType.name)} />
			<Text style={{ paddingHorizontal: 5}}>{routeType.name}</Text>
		</View>} />
	);

	const onAddStopping = (stopping: string) => () =>  {
       console.log(stopping);
	   setSelectedStopping(stopping);
       // setUploadPhotos(prevState => !prevState);
    };

	const onDeleteStoppingPlace =  (stopping: string) => async() =>  {
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };

		  try {
			const response: AxiosResponse = await client.put(`/routebuses/`+appStore.routeBus.objectId+`/stoppingPlaces/delete/`+stopping , config);
			if(response.status == 200){
				appStore.routeBus.deleteStoppingPlaceByPlace(stopping);
			}
			console.log(response.status);
		  } catch(err) {
			console.log(err);
		  }  
		
	};

	const onEditTitleButtomPress = async () => {
		
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };

		  try {
			const response: AxiosResponse = await client.put(`/routebuses/`+appStore.routeBus.objectId+`/title/`+title , config);
			console.log(response.status);
		  } catch(err) {
			console.log(err);
		  }  

		appStore.routeBus.setTitle(title);
			
		refRBSheetTitleEdit.current.close();
		
	};

	const onNavigateToJourney = (): void => {
		//setJourneyStoppingsErrorMessage("");
		navigation.navigate("TourStoppingsScreen")
	};


	const onSchedulesPress = (): void => {
		navigation.navigate("TourSchedules")
	};


	
	const onNoOfDaysSelect = (index): void => {
		console.log("Slected index:"+index);
		setSelectedDaysIndex(index);
		
		appStore.tour.setNoOfDays(days[index-1].value);
	};

	const renderOptionDays = (day): React.ReactElement => (
		<SelectItem key={day.key} title={evaProps => <View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
			<Text style={{ paddingHorizontal: 5}}>{day.value}</Text>
		</View>} />
	);

	const onPhotosPress = (): void => {
		console.log("photos presses");
		setPhotosErrorMessage("");
	};

	function errorMessageHandler(value) {
		setPhotosErrorMessage(value);
	}


	
	

	if (loading) {
		return <ActivityIndicator />;
	}

	return (
		
		<ScrollView style={{ flex: 1}} keyboardShouldPersistTaps='handled'>
		

		<View>
			    <Card style={{ margin: 10}}>
					<Text style={styles.itemHeaderTitle}>Title</Text>
					<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
						<Text>{appStore.tour.title}</Text>
						<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => refRBSheetTitleEdit.current.open()}/>
					</View>
				</Card>

				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>No Of Days</Text>
						<View style={{ margin: 10}}>
						<Select
							placeholder='Default'
							value={appStore.tour.noOfDays}
							selectedIndex={selectedIndex}
							onSelect={(index: IndexPath) => onNoOfDaysSelect(index)}>
							{days.map(renderOptionDays)}
						</Select>
					</View>
					</View>
				</View>

				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Seat Layout</Text>
						<View style={{ margin: 10}}>
						<VehicleLayoutSuggestions vehicleIndex={vehicleIndex}/>
					</View>
					</View>
				</View>

				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>Stopping Locations</Text>
					</View>
					<View style={styles.descriptionInputContainer}>
					<View style={{flexDirection: "row", flexWrap: "wrap"}}>
					{appStore.routeBus.stoppingPlaces.map(function(stopping, index){
						if(stopping == selectedStopping){
							return <TouchableOpacity key={index} style={{flexDirection: "row" ,borderWidth: 1, padding: 2, margin: 2, borderColor: "#222"}} onPress={onAddStopping(stopping)}>
										<Text style={{padding: 2}}>{stopping.place}</Text>
										<AntDesign style={{top: 4}} name="close" size={18} color="red" onPress={onDeleteStoppingPlace(stopping.place)} />
								</TouchableOpacity>
						}else{
							return <TouchableOpacity key={index} style={{flexDirection: "row" ,borderWidth: 1, padding: 2, margin: 2, borderColor: "#bbb"}} onPress={onAddStopping(stopping)}>
										<Text style={{padding: 2}}>{stopping.place}</Text>
										<AntDesign style={{top: 4}} name="close" size={18} color="red" onPress={onDeleteStoppingPlace(stopping.place)} />
								</TouchableOpacity>
						}
						
					})}	
					</View>	
						<GooglePlacesAutocomplete
				keyboardShouldPersistTaps={ "handled" }
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
				minLength={2}
				fetchDetails={true}
				onPress={async (data, details = null) => {
					// 'details' is provided when fetchDetails = true
					console.log(data);
					console.log("*****");
					console.log(data.description)
					console.log(Number(details.geometry.location.lat)+":"+Number(details.geometry.location.lng))
					
					var address=data.description;
					
					if(data.description.indexOf(",")>0){
					   var index=data.description.indexOf(",");
				       address = data.description.slice(0,index);
					}
					
					
					refAutoComplete.current?.setAddressText("");
					
					if(selectedStopping != ""){
						var index = appStore.routeBus.getIndex(selectedStopping);
						const data = {
											place: address,
											latitude: details.geometry.location.lat,
											longitude: details.geometry.location.lng,
											index: index+1
											};
						console.log("data>> "+JSON.stringify(data));
						//const jsonObject = JSON.parse(jsonString);
						const config: AxiosRequestConfig = {
							headers: {
								'Accept': 'application/json',
								'token': appStore.user.accessToken
							} as RawAxiosRequestHeaders,
						};

						try {
							const response: AxiosResponse = await client.put(`/routebuses/`+appStore.routeBus.objectId+`/stoppingPlaces/add` , data, config);
							console.log(response.status);
							if(response.status == 200){
								appStore.routeBus.addStoppingPlaceAtIndex(address,Number(details.geometry.location.lat),Number(details.geometry.location.lng),index+1);
								setSelectedStopping("");
							}
						} catch(err) {
							console.log(err);
						}  
						
						
					}else{
						
							
						const data = {
											place: address,
											latitude: details.geometry.location.lat,
											longitude: details.geometry.location.lng
											};
						console.log("data>> "+JSON.stringify(data));
						//const jsonObject = JSON.parse(jsonString);
						const config: AxiosRequestConfig = {
							headers: {
								'Accept': 'application/json',
								'token': appStore.user.accessToken
							} as RawAxiosRequestHeaders,
						};

						try {
							const response: AxiosResponse = await client.put(`/routebuses/`+appStore.routeBus.objectId+`/stoppingPlaces/add` , data, config);
							console.log(response.status);
						} catch(err) {
							console.log(err);
						}  
						appStore.routeBus.addStoppingPlace(address,Number(details.geometry.location.lat),Number(details.geometry.location.lng));
					}
					
				}}

				onFail={(error) => console.error(error)}

				predefinedPlaces={[]}
				debounce={200}
				timeout={20000}
			
			
				query={{
					key: 'AIzaSyDmFlx79dIq9lzTupQGttpE8m8eQ5ZS5yA',
					language: 'en',
					components: 'country:lk',
					componentRestrictions:'country:lk',
					libraries: 'places'
				}}
			/>
					</View>	
					
				</View>

				<Card style={{ margin: 10, borderRadius:10}} onPress={onPhotosPress}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text>Photos</Text>
						<TourPhotosAddCard navigation={navigation} errorMessageHandler={errorMessageHandler} update={false}/>
					</View>
					{photosErrorMessage!="" && (
							<Text style={styles.errorLabel}>{photosErrorMessage}</Text>	
					)}
				</Card>

				<Card style={{ margin: 10, borderRadius:10}} onPress={onNavigateToJourney}>	
								<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
									<Text>Stopping Locations</Text>
									<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={onNavigateToJourney}/>
								</View>
								{journeyStoppingsErrorMessage!="" && (
										<Text style={styles.errorLabel}>{journeyStoppingsErrorMessage}</Text>	
								)}
							</Card>
				
							<Card style={{ margin: 10, borderRadius:10}} onPress={onSchedulesPress}>	
								<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
									<Text>Schedules</Text>
									<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={onSchedulesPress}/>
								</View>
								{journeyStoppingsErrorMessage!="" && (
										<Text style={styles.errorLabel}>{journeyStoppingsErrorMessage}</Text>	
								)}
							</Card>

		</View>		
		
		
		

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

		<RBSheet draggable dragOnContent key="titleEdit" ref={refRBSheetTitleEdit} height={200}>
			<View>
			<Input
				style={{paddingHorizontal: 10}}
				placeholder="Title"
				value={title}
				selectionColor="#197519"
				cursorColor="#197519"
				onChangeText={(text) => setTitle(text)} 
			/>
				
				<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
				<Button style={{ flex: 1, borderRadius:50, margin: 10}} size="large" onPress={onEditTitleButtomPress}>Update</Button>
				</View>
			</View>
		</RBSheet>

		
		
		</ScrollView>
	
		
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
	itemHeaderTitle: {
		fontWeight: "500",
		fontSize: 18
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
	  inputContainer: {
		flex: 1,
		flexDirection: "row", 
		justifyContent: "space-between",
		borderColor: "#ddd",
        borderWidth: 1, // Create border
        borderRadius: 8, // Not needed. Just make it look nicer.
        padding: 8, // Also used to make it look nicer
        zIndex: 0, // Ensure border has z-index of 0
    },
	label: {
		color:"#142169"
	},
	labelContainer: {
        backgroundColor: "white", // Same color as background
        alignSelf: "flex-start", // Have View be same width as Text inside
        paddingHorizontal: 3, // Amount of spacing between border and first/last letter
        marginStart: 10, // How far right do you want the label to start
        zIndex: 1, // Label must overlap border
        elevation: 1, // Needed for android
        shadowColor: "white", // Same as background color because elevation: 1 creates a shadow that we don't want
        position: "absolute", // Needed to be able to precisely overlap label with border
        top: -12, // Vertical position of label. Eyeball it to see where label intersects border.
    },
	descriptionInputContainer: {
		flex: 1,
		flexDirection: "column", 
		justifyContent: "space-between",
		borderColor: "#ddd",
        borderWidth: 1, // Create border
        borderRadius: 8, // Not needed. Just make it look nicer.
        padding: 8, // Also used to make it look nicer
        zIndex: 0, // Ensure border has z-index of 0
    }
});

export default observer(TourEditCard);