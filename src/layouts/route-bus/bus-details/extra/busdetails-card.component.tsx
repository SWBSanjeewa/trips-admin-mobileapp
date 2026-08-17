import { Select, IndexPath, SelectItem, Button, Card, Avatar, Text ,Divider, IconElement,Input} from "@ui-kitten/components";
import React,{useState,useEffect,useRef,forwardRef,useImperativeHandle} from "react";
import { View, ScrollView, TouchableOpacity, Text as RNText, StyleSheet, ActivityIndicator, Pressable,ListRenderItemInfo} from "react-native";
import { useRoute } from "@react-navigation/native";
import AppStore from "../../../../store/AppStore";
import { useStore } from "mobx-store-provider";
import { observer, inject} from "mobx-react";
import RBSheet from 'react-native-raw-bottom-sheet';

import {routeBusTypes, operatorTypes, transportAuthorityTypes,getRouteBusThemePhotoUrl, getSelectedDaysFromNumbers}  from "../../../../app/routes-common";

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import { useSafeAreaInsets } from "react-native-safe-area-context";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const client = axios.create({
	baseURL: 'https://routes.lk:7007'
});

import { toJS } from "mobx";

import {
	MaterialIcons as MDIcon,
} from '@expo/vector-icons';


import { Image } from 'expo-image';

import { Accordion } from '@animatereactnative/accordion';

import Entypo from '@expo/vector-icons/Entypo';



const BusDetailsCard = React.forwardRef(({navigation},refStandard) => {

	const [journeyWeekdays, setJourneyWeekdays] = React.useState([2,3,4,5,6])

	const [returnJourneyWeekdays, setReturnJourneyWeekdays] = React.useState([2,3,4,5,6])
	
	const appStore = useStore(AppStore);

	const route = useRoute();

	const refAutoComplete = useRef(null);


	const insetsConfig = useSafeAreaInsets();
		
	const refStandardConfirmation = useRef();

	const [loading, setLoading] = useState(true);

	
	const [selectedIndexTransportAuthorityType, setSelectedIndexTransportAuthorityType] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const transportAuthorityType = transportAuthorityTypes[selectedIndexTransportAuthorityType.row];

	const [selectedOperatorIndex, setSelectedOperatorIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const operatorType = operatorTypes[selectedOperatorIndex.row];

	const [selectedIndexBusType, setSelectedIndexBusType] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const routeType = routeBusTypes[selectedIndexBusType.row];



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
			const response: AxiosResponse = await client.delete(`/routebuses/`+route.params.id );
			console.log(response.status);
			console.log(response.data.json); 
			console.log("Submitting..."); 
			appStore.bus.reset();
			navigation && navigation.navigate("RouteBusList", {reload: true});
		  } catch(err) {
			console.log(err);
		  } 
		  refStandardConfirmation.current.close();
		  refStandard.current.close();
		 
		
	};

	const getOpenStatus = (index) => {
		if(index==0){
			return true;
		}
		return false;
	};
	

	useEffect(() => {
	
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

	const getTimetableTypeText = (timetable) => {
		if(timetable.type =="Selected Days"){
			return getSelectedDaysFromNumbers(timetable.runningDays);
		}
		return timetable.type;
	};


	const renderItemHeader = (): React.ReactElement => (
		<View>
			<View style={{paddingTop: 10, flexDirection: "row", justifyContent: "flex-end" }}>	
				<Button appearance='ghost'  size="small"  style={{ borderColor:"#142169", borderWidth: 2, marginHorizontal: 5 }} >{appStore.routeBus.operator}</Button>
				<Button size="small">{appStore.routeBus.typeOfService}</Button>
			</View>	
		</View>
	);

	
	if (loading) {
		return <ActivityIndicator />;
	}

	return (
		
		<ScrollView style={{ flex: 1}} keyboardShouldPersistTaps='handled'>
		
		<Card
			style={styles.item}
			header={() => renderItemHeader()}
			//footer={() => renderItemFooter(info)}
			//onPress={() => onItemPress(info)}
		>

			
			<View>
				<View>
					<View style={{paddingTop: 10, flexDirection: "row", justifyContent: "flex-start" , flexWrap: 'wrap'}}>	
						<Button size="small" onPress={()=>onTransportServicePress(appStore.routeBus)} style={{ borderColor:"#142169", borderWidth: 1, marginHorizontal: 5 }}>{appStore.routeBus.routeNo}</Button>
						<Text category="h5">{appStore.routeBus.title}</Text>
					</View>	
				</View>
			
			<View style={{ 
      flexDirection: 'row', 
      alignItems: 'center', // Centers icon and text vertically
      padding: 5
    }}>
     
      <Image 
	    contentFit="contain"
        source={"https://routes.lk:7007/route_buses/"+getRouteBusThemePhotoUrl(appStore.routeBus.operator, appStore.routeBus.typeOfService)}
        style={{ width: 100, height: 100, marginRight: 8 }} 
      />

     
      
	  <Text style={{ flexShrink: 1, fontSize: 16 }}>
					{appStore.routeBus.stoppingPlaces.map(function(stopping, index){	
						if(index==0 ){
							return <Text style={{ color: "grey" }}>{stopping.place}</Text>	
						}else{
							return <Text style={{ color: "grey" }}>- {stopping.place}</Text>	
						}							
					})}	
					</Text>
    </View>

	</View>
	
	<View>
			<View style={{paddingTop: 10, flexDirection: "row", justifyContent: "flex-end" , flexWrap: 'wrap'}}>	
				<Button appearance='ghost'  size="small"  style={{ borderColor:"#142169", borderWidth: 2, marginHorizontal: 5 }} >Distance: {appStore.routeBus.distance} km</Button>
				<Button appearance='ghost'  size="small"  style={{ borderColor:"#142169", borderWidth: 2, marginHorizontal: 5 }} >Running Time: {appStore.routeBus.runningTime}</Button>
		</View>
	</View>		
			
		</Card>
		
		<Card style={styles.item}>
			<View style={{flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
				<Text style={{ flex: 1 , margin: 5}} category="h6">{appStore.routeBus?.stoppingPlaces[0]?.place} - {appStore.routeBus.stoppingPlaces[appStore.routeBus.stoppingPlaces.length-1]?.place}</Text>
			</View>

			{appStore.routeBus.journey.timetables.length == 1 && (
			<Card style={{ marginTop: 10, borderRadius:10}} disabled={true} >
				<View style={{marginHorizontal: -24,marginVertical: -16}}>
				<Text style={{marginHorizontal: 10,marginVertical: 10}}>Timetables</Text>
				{appStore.routeBus.journey.timetables.map((timetable,timetable_index) => (
					<>
						<Card style={{ marginTop: 10, borderRadius:10}} disabled={true}>

						<Accordion.Accordion isOpen={false}>
							<Accordion.Header>
								<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
									<Text>{getTimetableTypeText(timetable)}</Text>
									<Accordion.HeaderIcon>
									<Entypo name="chevron-down" size={24} color="black" />;
									</Accordion.HeaderIcon>
								</View>	
							</Accordion.Header>
							<Accordion.Expanded>
								<View style={{paddingTop: 10, flexDirection: "row", justifyContent: "flex-start", flexWrap: 'wrap' }}>	
								{timetable.turns.map((turn,turn_index) => (
									<Button appearance='ghost'  size="small"  style={{ borderColor:"#142169", borderWidth: 1, marginHorizontal: 2}} >{turn.startTime}</Button>
								))}
								</View>
							</Accordion.Expanded>
						
						</Accordion.Accordion>
						</Card>
					</>
				))}		
			</View>	
			</Card>
			)}
			{appStore.routeBus.journey.timetables.length != 1 && (
				<Card style={{ margin: 10, borderRadius:10}} onPress={() => navigation.navigate("RouteBusJourneyTimetablesList", {id: appStore.routeBus.id,journeyType: "RouteBusJourney"})}>
					<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
						<Text>Timetables</Text>
						<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("RouteBusJourneyTimetablesList", {id: appStore.routeBus.id, journeyType: "RouteBusJourney"})}/>
					</View>
				</Card>
			)}
		
			<Card style={{ marginTop: 10, borderRadius:10}} onPress={() => navigation.navigate("RouteBusJourneyStoppings", {id: appStore.routeBus.objectId, latitude: appStore.routeBus.journey.stoppings[0].latitude,  longitude: appStore.routeBus.journey.stoppings[0].longitude, journeyType: "RouteBusJourney"})}>
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Stoppings</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("RouteBusJourneyStoppings",{id: appStore.routeBus.objectId, journeyType: "RouteBusJourney"})}/>
				</View>
			</Card>	
		</Card>
			

		<Card style={styles.item}>
			<View style={{flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
				<Text style={{ flex: 1 , margin: 5}} category="h6">{appStore.routeBus?.stoppingPlaces[appStore.routeBus.stoppingPlaces.length-1]?.place} - {appStore.routeBus.stoppingPlaces[0]?.place}</Text>
			</View>

			{appStore.routeBus.returnJourney.timetables.length == 1 && (
			<Card style={{ marginTop: 10, borderRadius:10}} disabled={true} >
				<View style={{marginHorizontal: -24,marginVertical: -16}}>
				<Text style={{marginHorizontal: 10,marginVertical: 10}}>Timetables</Text>
				{appStore.routeBus.returnJourney.timetables.map((timetable,timetable_index) => (
					<>

						<Card style={{ marginTop: 10, borderRadius:10}} disabled={true}>

						<Accordion.Accordion isOpen={false}>
							<Accordion.Header>
								<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
									<Text>{getTimetableTypeText(timetable)}</Text>
									<Accordion.HeaderIcon>
									<Entypo name="chevron-down" size={24} color="black" />;
									</Accordion.HeaderIcon>
								</View>	
							</Accordion.Header>
							<Accordion.Expanded>
								<View style={{paddingTop: 10, flexDirection: "row", justifyContent: "flex-start", flexWrap: 'wrap' }}>	
								{timetable.turns.map((turn,turn_index) => (
									<Button appearance='ghost'  size="small"  style={{ borderColor:"#142169", borderWidth: 1, marginHorizontal: 2}} >{turn.startTime}</Button>
								))}
								</View>
							</Accordion.Expanded>
						
						</Accordion.Accordion>
						</Card>
					</>
				))}	
				</View>	
			</Card>
			)}
			{appStore.routeBus.returnJourney.timetables.length != 1 && (
				<Card style={{ margin: 10, borderRadius:10}} onPress={() => navigation.navigate("RouteBusJourneyTimetablesList", {id: appStore.routeBus.id,journeyType: "RouteBusReturnJourney"})}>
					<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
						<Text>Timetables</Text>
						<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("RouteBusJourneyTimetablesList", {id: appStore.routeBus.id, journeyType: "RouteBusReturnJourney"})}/>
					</View>
				</Card>

			)}
			
			
			<Card style={{ marginTop: 10, borderRadius:10}} onPress={() => navigation.navigate("RouteBusJourneyStoppings", {id: appStore.routeBus.objectId, latitude: appStore.routeBus.returnJourney.stoppings[0].latitude,  longitude: appStore.routeBus.returnJourney.stoppings[0].longitude, journeyType: "RouteBusReturnJourney"})}>
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Stoppings</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("RouteBusJourneyStoppings",{id: appStore.routeBus.objectId, journeyType: "RouteBusReturnJourney"})}/>
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

export default observer(BusDetailsCard);