import { Select, IndexPath, SelectItem, Button, Card, Avatar, Text ,Divider, IconElement,Input} from "@ui-kitten/components";
import React,{useState,useEffect,useRef,forwardRef,useImperativeHandle} from "react";
import { View, ScrollView, TouchableOpacity, Text as RNText, StyleSheet, ActivityIndicator, Pressable,ListRenderItemInfo} from "react-native";
import { useRoute } from "@react-navigation/native";
import AppStore from "../../../../store/AppStore";
import { useStore } from "mobx-store-provider";
import { RouteBus } from "./data";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { CachedImage } from '@georstat/react-native-image-cache';

import {routeBusTypes, operatorTypes, transportAuthorityTypes}  from "../../../../app/routes-common";

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


import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

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

	const refAutoComplete = useRef(null);


	const insetsConfig = useSafeAreaInsets();

	const [initialRunningTime, setInitialRunningTime] = useState
			({
				hours: 0,
				minutes: 0
			});
	
		
	const refStandardConfirmation = useRef();

	const [loading, setLoading] = useState(true);

	const [selectedStopping, setSelectedStopping] = React.useState<string>("");

	const [journeyEndLocation, setJourneyEndLocation] = useState('');
	const [journeyEndTime, setJourneyEndTime] = useState('');

	const [returnJourneyEndLocation, setReturnJourneyEndLocation] = useState('');
	const [returnJourneyEndTime, setReturnJourneyEndTime] = useState('');
	

	const route = useRoute();

	const [journeyLiveChecked, setJourneyLiveChecked] = React.useState(false);

	const [returnJourneyLiveChecked, setReturnJourneyLiveChecked] = React.useState(false);

	const [imageIndex, setImageIndex] = useState(0);

	const [reload, setReload] = useState(true);

	

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

	const [isRunningTimePickerVisible, setRunningTimePickerVisible] = useState(false);

	const refRBSheetTitleEdit = useRef();
	const [title, setTitle] = useState("");

	const refRBSheetRouteNoEdit = useRef();
	const [routeNo, setRouteNo] = useState("");

	const refRBSheetDistanceEdit = useRef();
	const [distance, setDistance] = useState("");


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
			const response: AxiosResponse = await client.get('/routebuses/'+route.params.id , config);
			console.log(response.status);
			console.log("##### appStore.user.mobileNumber::"+appStore.user.mobileNumber);
			console.log("Bus from id:"+response.data); 
			console.log(JSON.stringify(response.data)); 

			appStore.routeBus.populate(response.data);

			console.log("Populate finished!!");
			
			//console.log("#### Passengers count :"+response.data.passengers.length);
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

			if(response.data.journey.timetables != null){
				response.data.journey.timetables.forEach((timetable,index) => {
					appStore.routeBus.journey.addTimetable(timetable.type, timetable.runningDays);
					timetable.turns.forEach(turn => {
						appStore.routeBus.journey.timetables[index].addTurn(turn.onboardStartTime,turn.startTime,turn.runningNo,turn.stoppings,turn.registrationNo,turn.licenseNo);
					});
				});
		    }

			if(response.data.returnJourney.stoppings != null){
				response.data.returnJourney.stoppings.forEach(element => {
					//appStore.routeBus.addStoppingPlace( element.place,element.latitude,element.longitude)
					appStore.routeBus.returnJourney.addStopping(element.place, Number(element.latitude),Number(element.longitude),element.duration);
				});
		    }

			if(response.data.returnJourney.timetables != null){
				response.data.returnJourney.timetables.forEach((timetable,index) => {
					appStore.routeBus.returnJourney.addTimetable(timetable.type, timetable.runningDays);
					timetable.turns.forEach(turn => {
						appStore.routeBus.returnJourney.timetables[index].addTurn(turn.onboardStartTime,turn.startTime,turn.runningNo,turn.stoppings,turn.registrationNo,turn.licenseNo);
					});
				});
		    }

			
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
	};

	const onOperatorTypeSelect = (index): void => {
		setSelectedOperatorIndex(index);
		appStore.routeBus.setOperator(operatorTypes[index-1].name);
	};

	

	useEffect(() => {
		setTitle(appStore.routeBus.title);
		setRouteNo(appStore.routeBus.routeNo);
		setDistance(appStore.routeBus.distance);

		const regex = /(\d+)\s*h\s*(\d+)\s*mins/;

		const match = route.params?.runningTime.match(regex);
		let hours=0;
		let minutes =0;

		if (match) {
			hours = match[1];
			minutes = match[2];
		}
		
		setInitialRunningTime({
				hours: Number(hours),
				minutes: Number(minutes)
			})
		
		console.log("### effects");
		console.log("### h:"+appStore.routeBus.runningTime?.match(/(\d+)h/));
		console.log("### initialRunningTime:"+initialRunningTime.hours+" "+initialRunningTime.minutes );
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

	const onRunningTimePress = (): void => {
		console.log("$$$ appStore.routeBus.runningTime:"+appStore.routeBus.runningTime);
		console.log("$$$ appStore.routeBus.runningTime: h"+Number(appStore.routeBus.runningTime?.match(/(\d+)h/)));
		console.log("$$$ appStore.routeBus.runningTime: min"+Number(appStore.routeBus.runningTime?.match(/(\d+)mins/)));
		
		setRunningTimePickerVisible(true);
	};

	const onAddStopping = (stopping: string) => () =>  {
       console.log(stopping);
	   setSelectedStopping(stopping);
       // setUploadPhotos(prevState => !prevState);
    };

	const onDeleteStoppingPlace = (stopping: string) => () =>  {
		appStore.routeBus.deleteStoppingPlaceByPlace(stopping);
	};

	const onEditTitleButtomPress = async () => {
		/*
		const config: AxiosRequestConfig = {
			headers: {
				'Accept': 'application/json',
				'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		};
		
		console.log("Name:::"+name);
			
		try {
		
		const response: AxiosResponse = await client.put('/users/'+appStore.user.mobileNumber+'/name/'+name , config);
		console.log(response.data);
		
		if(response.data!=null && response.data.success == "true"){
			appStore.user.setName(name);
		}
		
		
		} catch(err) {
			console.log(err);
		}
			*/

		//appStore.routeBus.setTitle(title);
			
		refRBSheetTitleEdit.current.close();
		
	};

	const onEditRouteNoButtomPress = async () => {
		/*
		const config: AxiosRequestConfig = {
			headers: {
				'Accept': 'application/json',
				'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		};
		
		console.log("Name:::"+name);
			
		try {
		
		const response: AxiosResponse = await client.put('/users/'+appStore.user.mobileNumber+'/name/'+name , config);
		console.log(response.data);
		
		if(response.data!=null && response.data.success == "true"){
			appStore.user.setName(name);
		}
		
		
		} catch(err) {
			console.log(err);
		}
			*/
		//appStore.routeBus.setRouteNo(routeNo);	
		refRBSheetRouteNoEdit.current.close();
		
	};

	const onEditDistanceButtomPress = async () => {
		/*
		const config: AxiosRequestConfig = {
			headers: {
				'Accept': 'application/json',
				'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		};
		
		console.log("Name:::"+name);
			
		try {
		
		const response: AxiosResponse = await client.put('/users/'+appStore.user.mobileNumber+'/name/'+name , config);
		console.log(response.data);
		
		if(response.data!=null && response.data.success == "true"){
			appStore.user.setName(name);
		}
		
		
		} catch(err) {
			console.log(err);
		}
			*/
		//appStore.routeBus.setDistance(distance);	
		refRBSheetDistanceEdit.current.close();
		
	};


	
	

	if (loading) {
		return <ActivityIndicator />;
	}

	return (
		<SafeAreaLayout style={{ flex: 1}} insets="bottom">
		<ScrollView style={{ flex: 1}}>
		

		<View>

				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Transport Authority Type</Text>
						<View style={{ margin: 10}}>
							<Select
								placeholder='Default'
								value={transportAuthorityType.name}
								selectedIndex={selectedIndexTransportAuthorityType}
								onSelect={(index: IndexPath) => onTransportAuthorityTypeSelect(index)}>
								{transportAuthorityTypes.map(renderOptionBusTypes)}
							</Select>
						</View>
					</View>
				</View>

				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Service Type</Text>
						<View style={{ margin: 10}}>
							<Select
								placeholder='Default'
								value={routeType.name}
								selectedIndex={selectedIndexBusType}
								onSelect={(index: IndexPath) => onBusTypeSelect(index)}>
								{routeBusTypes.map(renderOptionBusTypes)}
							</Select>
						</View>
					</View>
				</View>

				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Operator Type</Text>
						<View style={{ margin: 10}}>
							<Select
								placeholder='Default'
								value={operatorType.name}
								selectedIndex={selectedOperatorIndex}
								onSelect={(index: IndexPath) => onOperatorTypeSelect(index)}>
								{operatorTypes.map(renderOptionBusTypes)}
							</Select>
						</View>
					</View>
				</View>

				<Card style={{ margin: 10}}>
					<Text style={styles.itemHeaderTitle}>Title</Text>
					<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
						<Text>{appStore.routeBus.title}</Text>
						<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => refRBSheetTitleEdit.current.open()}/>
					</View>
				</Card>

				<Card style={{ margin: 10}}>
					<Text style={styles.itemHeaderTitle}>Route No.</Text>
					<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
						<Text>{appStore.routeBus.routeNo}</Text>
						<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => refRBSheetRouteNoEdit.current.open()}/>
					</View>
				</Card>

				<Card style={{ margin: 10}}>
					<Text style={styles.itemHeaderTitle}>Distance (km)</Text>
					<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
						<Text>{appStore.routeBus.distance}</Text>
						<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => refRBSheetDistanceEdit.current.open()}/>
					</View>
				</Card>


				<Card style={{ margin: 10, borderRadius:10}}>
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Running Time</Text>
						<View style={{backgroundColor: "#F1F1F1"}}>
							<Pressable onPress={() => onRunningTimePress()}>
							<View pointerEvents="none">
								<Input placeholder="Running time..." value={appStore.routeBus.runningTime}/>
							</View>
						</Pressable>
						
						</View>
						
						
					</View>
				</Card>

				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>Stopping Locations</Text>
					</View>
					<View style={styles.descriptionInputContainer}>
					<View style={{flexDirection: "row", flexWrap: "wrap"}}>
					{appStore.routeBus.stoppingPlaces.map(function(stopping, index){
						if(stopping == selectedStopping){
							return <TouchableOpacity style={{flexDirection: "row" ,borderWidth: 1, padding: 2, margin: 2, borderColor: "#222"}} onPress={onAddStopping(stopping)}>
										<Text style={{padding: 2}}>{stopping.place}</Text>
										<AntDesign style={{top: 4}} name="close" size={18} color="red" onPress={onDeleteStoppingPlace(stopping.place)} />
								</TouchableOpacity>
						}else{
							return <TouchableOpacity style={{flexDirection: "row" ,borderWidth: 1, padding: 2, margin: 2, borderColor: "#bbb"}} onPress={onAddStopping(stopping)}>
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
					
					
					refAutoComplete.current?.setAddressText("");
					
					if(selectedStopping != ""){
						var index = appStore.routeBus.getIndex(selectedStopping);
						appStore.routeBus.addStoppingPlaceAtIndex(address,details.geometry.location.lat,details.geometry.location.lng,index+1);
						setSelectedStopping("");
					}else{
						appStore.routeBus.addStoppingPlace(address,details.geometry.location.lat,details.geometry.location.lng);
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

		</View>		
		
		<Card style={styles.item} onPress={() => navigation.navigate("RouteBusJourneyDetails", {id: appStore.routeBus.objectId})}>
			<View style={{flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
				<Text style={{ flex: 1 , margin: 5}} category="h6">Journey</Text>
			</View>

		
			<Card style={{ marginTop: 10, borderRadius:10}} onPress={() => navigation.navigate("RouteBusJourneyStoppings", {id: appStore.routeBus.objectId, latitude: appStore.routeBus.journey.stoppings[0].latitude,  longitude: appStore.routeBus.journey.stoppings[0].longitude, journeyType: "RouteBusJourney"})}>
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Stoppings</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("RouteBusJourneyStoppings",{id: appStore.routeBus.objectId, journeyType: "RouteBusJourney"})}/>
				</View>
			</Card>
			<Card style={{ marginTop: 10, borderRadius:10}} onPress={() => navigation.navigate("RouteBusJourneyTimetables", {id: appStore.routeBus.objectId, journeyType: "RouteBusJourney"})}>
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Timetables</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("RouteBusJourneyTimetables", {id: appStore.routeBus.objectId, journeyType: "RouteBusJourney"})}/>
				</View>
			</Card>

			
			
		</Card>

		<Card style={styles.item}>
			<View style={{flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
				<Text style={{ flex: 1 , margin: 5}} category="h6">Return Journey</Text>
			</View>
			<Divider />
			
			
			<Card style={{ marginTop: 10, borderRadius:10}} onPress={() => navigation.navigate("RouteBusJourneyStoppings", {id: appStore.routeBus.objectId, latitude: appStore.routeBus.returnJourney.stoppings[0].latitude,  longitude: appStore.routeBus.returnJourney.stoppings[0].longitude, journeyType: "RouteBusReturnJourney"})}>
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Stoppings</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("RouteBusJourneyStoppings",{id: appStore.routeBus.objectId, journeyType: "RouteBusReturnJourney"})}/>
				</View>
			</Card>

			<Card style={{ marginTop: 10, borderRadius:10}} onPress={() => navigation.navigate("RouteBusJourneyTimetables", {id: appStore.routeBus.objectId, journeyType: "RouteBusReturnJourney"})}>
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Timetables</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("RouteBusJourneyTimetables", {id: appStore.routeBus.objectId, journeyType: "RouteBusReturnJourney"})}/>
				</View>
			</Card>
		
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

		<RBSheet draggable dragOnContent key="routeNoEdit" ref={refRBSheetRouteNoEdit} height={200}>
			<View>
			<Input
				style={{paddingHorizontal: 10}}
				placeholder="Route No."
				value={routeNo}
				selectionColor="#197519"
				cursorColor="#197519"
				onChangeText={(text) => setRouteNo(text)} 
			/>
				
				<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
				<Button style={{ flex: 1, borderRadius:50, margin: 10}} size="large" onPress={onEditRouteNoButtomPress}>Update</Button>
				</View>
			</View>
		</RBSheet>

		<RBSheet draggable dragOnContent key="distanceEdit" ref={refRBSheetDistanceEdit} height={200}>
			<View>
			<Input
				style={{paddingHorizontal: 10}}
				placeholder="Distance"
				value={distance}
				selectionColor="#197519"
				cursorColor="#197519"
				onChangeText={(text) => setDistance(text)} 
			/>
				
				<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
				<Button style={{ flex: 1, borderRadius:50, margin: 10}} size="large" onPress={onEditDistanceButtomPress}>Update</Button>
				</View>
			</View>
		</RBSheet>

		<TimerPickerModal
						    visible={isRunningTimePickerVisible}
              				setIsVisible={setRunningTimePickerVisible}
							hideDays={true}
							hideSeconds
							LinearGradient={LinearGradient}
							minuteLabel="mins"
							initialValue={initialRunningTime}
							padWithNItems={1}
							hourLabel="h"
							onConfirm={(pickedDuration) => {
								console.log("pickedDuration::"+pickedDuration.minutes);
								setRunningTimePickerVisible(false);
								if(pickedDuration.hours > 0){
									setInitialRunningTime({ hours: pickedDuration.hours, minutes:pickedDuration.minutes});
									//setDuration(pickedDuration.hours.toString()+"h "+pickedDuration.minutes.toString()+"mins");
									
									appStore.routeBus.setRunningTime(pickedDuration.hours.toString()+"h "+pickedDuration.minutes.toString()+"mins");
									
								}else{
									setInitialRunningTime({ hours: 0, minutes:pickedDuration.minutes});
									//setDuration(pickedDuration.minutes.toString()+" mins");
									//initialDuration.minutes=pickedDuration.minutes;
									appStore.routeBus.setRunningTime(pickedDuration.minutes.toString()+" mins");
								}
							}}
							
							
							styles={{

								button:{
								  fontSize: 10,
								  fontWeight: "bold"
								},
								
								pickerLabel: {
									fontSize: 16,
									fontWeight: "600",
									color: "#888888",
								},
								
								pickerItem: {
									fontSize: 24,
									color: "#cccccc",
								},
								
								selectedPickerItem: {
									fontSize: 28,
									fontWeight: "bold",
									color: "#000000",
								}
							}}
						/>
		
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