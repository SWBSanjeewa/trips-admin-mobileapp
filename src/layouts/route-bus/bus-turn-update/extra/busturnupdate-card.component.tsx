import { Select, IndexPath, SelectItem, Button, Card, Avatar, Text ,Divider, IconElement,Input} from "@ui-kitten/components";
import React,{useState,useEffect,useRef,forwardRef,useImperativeHandle} from "react";
import { View, ScrollView, TouchableOpacity, Text as RNText, StyleSheet, ActivityIndicator, Pressable,ListRenderItemInfo} from "react-native";
import { useRoute } from "@react-navigation/native";
import AppStore from "../../../../store/AppStore";
import { useStore } from "mobx-store-provider";
import { RouteBus } from "./data";
import { observer, inject} from "mobx-react";
import { format } from 'date-fns';

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
import DateTimePickerModal from "react-native-modal-datetime-picker";


import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


const BusTurnUpdateCard = React.forwardRef(({navigation},refStandard) => {
	
	const appStore = useStore(AppStore);

	const route = useRoute();

	const [isOnboardStartTimeDatePickerVisible, setOnboardStartTimeDatePickerVisible] = useState(false);

	const [defaultDate, setDefaultDate] = React.useState<Date>(new Date());

	const refRBSheetRegistrationNoEdit = useRef();
	const [registrationNo, setRegistrationNo] = useState("");

	const refRBSheetLicenseNoEdit = useRef();
	const [licenseNo, setLicenseNo] = useState("");

	const refRBSheetRunningNoEdit = useRef();
	const [runningNo, setRunningNo] = useState("");


	const onSetOnboardStartTimeUpdatePress = (): void => {
		setOnboardStartTimeDatePickerVisible(true);
	};

	

	useEffect(() => {
		if(route.params.journeyType == "RouteBusJourney"){
			setRunningNo(appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].runningNo);
			setRegistrationNo(appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].registrationNo);
			setLicenseNo(appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].licenseNo);
		}else if(route.params.journeyType == "RouteBusReturnJourney"){
			setRunningNo(appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex].runningNo);
			setRegistrationNo(appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex].registrationNo);
			setLicenseNo(appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex].licenseNo);
		}
		
	}, []);


	const onEditRunningNoButtomPress = async () => {
		
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };

		  
		if(route.params.journeyType == "RouteBusJourney"){
			try {
				const response: AxiosResponse = await client.put(`/routebuses/`+appStore.routeBus.objectId+`/journey/timetables/`+route.params.timetableIndex+`/turns/`+route.params.turnIndex+`/runningNo/`+runningNo , config);
				console.log(response.status);
			} catch(err) {
				console.log(err);
			}  
			appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].setRunningNo(runningNo);
		}else if(route.params.journeyType == "RouteBusReturnJourney"){
			try {
				const response: AxiosResponse = await client.put(`/routebuses/`+appStore.routeBus.objectId+`/returnJourney/timetables/`+route.params.timetableIndex+`/turns/`+route.params.turnIndex+`/runningNo/`+runningNo , config);
				console.log(response.status);
			} catch(err) {
				console.log(err);
			}  
			appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex].setRunningNo(runningNo);
		}
		refRBSheetRunningNoEdit.current.close();
		
	};

	// router.put('/:id/journey/timetables/:timetableIndex/turns/:turnIndex/registrationNo'
	const onEditRegistrationNoButtomPress = async () => {
		
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };

		  
		if(route.params.journeyType == "RouteBusJourney"){
			try {
				const response: AxiosResponse = await client.put(`/routebuses/`+appStore.routeBus.objectId+`/journey/timetables/`+route.params.timetableIndex+`/turns/`+route.params.turnIndex+`/registrationNo/`+registrationNo , config);
				console.log(response.status);
			} catch(err) {
				console.log(err);
			}  
			appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].setRegistrationNo(registrationNo);
		}else if(route.params.journeyType == "RouteBusReturnJourney"){
			try {
				const response: AxiosResponse = await client.put(`/routebuses/`+appStore.routeBus.objectId+`/returnJourney/timetables/`+route.params.timetableIndex+`/turns/`+route.params.turnIndex+`/registrationNo/`+registrationNo , config);
				console.log(response.status);
			} catch(err) {
				console.log(err);
			}  
			appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex].setRegistrationNo(registrationNo);
		}
		refRBSheetRegistrationNoEdit.current.close();
		
	};

	const onEditLicenseNoButtomPress = async () => {
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };

		  
		if(route.params.journeyType == "RouteBusJourney"){
			console.log("RouteBusJourney ## "+ `/routebuses/`+appStore.routeBus.objectId+`/journey/timetables/`+route.params.timetableIndex+`/turns/`+route.params.turnIndex+`/licenseNo/`+licenseNo);
			try {
				const response: AxiosResponse = await client.put(`/routebuses/`+appStore.routeBus.objectId+`/journey/timetables/`+route.params.timetableIndex+`/turns/`+route.params.turnIndex+`/licenseNo/`+licenseNo , config);
				console.log(response.status);
			} catch(err) {
				console.log(err);
			}  
			appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].setLicenseNo(licenseNo);
		}else if(route.params.journeyType == "RouteBusReturnJourney"){
			try {
				const response: AxiosResponse = await client.put(`/routebuses/`+appStore.routeBus.objectId+`/returnJourney/timetables/`+route.params.timetableIndex+`/turns/`+route.params.turnIndex+`/licenseNo/`+licenseNo , config);
				console.log(response.status);
			} catch(err) {
				console.log(err);
			}  
			appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex].setLicenseNo(licenseNo);
		}
		refRBSheetLicenseNoEdit.current.close();
		
	};


	const onNavigateToAllowedBuses = (): void => {
		navigation.navigate("RouteBusAllowedBusesList", {timetableIndex: route.params.timetableIndex, turnIndex: route.params.turnIndex, "journeyType": route.params?.journeyType})
	};

	const onNavigateToStoppingTimes = (): void => {
		if(route.params.journeyType == "RouteBusJourney"){
			navigation.navigate("RouteBusJourneyTurnCustomDurationsList",{timetableIndex: route.params.timetableIndex, turnIndex: route.params.turnIndex, "journeyType": route.params?.journeyType})
		}else if(route.params.journeyType == "RouteBusReturnJourney"){
			navigation.navigate("RouteBusReturnJourneyTurnCustomDurationsList",{timetableIndex: route.params.timetableIndex, turnIndex: route.params.turnIndex, "journeyType": route.params?.journeyType})
		}
	};

	const handleOnboardStartTimeEditModeConfirm = async(date) => {	
		setOnboardStartTimeDatePickerVisible(false);
		 console.log("RouteBusJourney ## "+ `/routebuses/`+appStore.routeBus.objectId+`/XXX/timetables/`+route.params.timetableIndex+`/turns/`+route.params.turnIndex+`/onBoardStartTime/`+format(date, 'HH:mm'));
		console.warn("A date has been actualDate: ", date);

		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };

		  console.log("RouteBusJourney ## "+ `/routebuses/`+appStore.routeBus.objectId+`/XXX/timetables/`+route.params.timetableIndex+`/turns/`+route.params.turnIndex+`/onboardStartTime/`+format(date, 'HH:mm'));
		if(route.params.journeyType == "RouteBusJourney"){
			console.log("RouteBusJourney ## "+ `/routebuses/`+appStore.routeBus.objectId+`/journey/timetables/`+route.params.timetableIndex+`/turns/`+route.params.turnIndex+`/onboardStartTime/`+format(date, 'HH:mm'));
			try {
				const response: AxiosResponse = await client.put(`/routebuses/`+appStore.routeBus.objectId+`/journey/timetables/`+route.params.timetableIndex+`/turns/`+route.params.turnIndex+`/onboardStartTime/`+format(date, 'HH:mm') , config);
				appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].updateOnboardStartTime(format(date, 'HH:mm'));
				console.log(response.status);
			} catch(err) {
				console.log(err);
			}  
			
		}else if(route.params.journeyType == "RouteBusReturnJourney"){
			try {
				const response: AxiosResponse = await client.put(`/routebuses/`+appStore.routeBus.objectId+`/returnJourney/timetables/`+route.params.timetableIndex+`/turns/`+route.params.turnIndex+`/onboardStartTime/`+format(date, 'HH:mm') , config);
				appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex].updateOnboardStartTime(format(date, 'HH:mm'));
				console.log(response.status);
			} catch(err) {
				console.log(err);
			}  
			
		}
		
		
	};

	const hideOnboardStartTimeEditModeDatePicker = () => {
		setOnboardStartTimeDatePickerVisible(false);
	}


	

	
	return (
		
		<ScrollView style={{ flex: 1}} keyboardShouldPersistTaps='handled'>
		

		<View>

			<Card style={{ margin: 10, borderRadius:10}}>
				<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
					<Text style={{ padding: 5, paddingLeft: 10}}>Start Time</Text>
					<View style={{backgroundColor: "#F1F1F1"}}>
						<View pointerEvents="none">
							{route.params?.journeyType == "RouteBusJourney" && (
							<Input placeholder="Onboard start time..." value={appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].startTime}/>
							)}
							{route.params?.journeyType == "RouteBusReturnJourney" && (
							<Input placeholder="Onboard start time..." value={appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex].startTime}/>
							)}
						</View>
					</View>
				</View>
			</Card>
			
			<Card style={{ margin: 10, borderRadius:10}}>
				<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
					<Text style={{ padding: 5, paddingLeft: 10}}>Onboard Start</Text>
					<View style={{backgroundColor: "#F1F1F1"}}>
						<Pressable onPress={() => onSetOnboardStartTimeUpdatePress()}>
						<View pointerEvents="none">
							{route.params?.journeyType == "RouteBusJourney" && (
							<Input placeholder="Onboard start time..." value={appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].onboardStartTime}/>
							)}
							{route.params?.journeyType == "RouteBusReturnJourney" && (
							<Input placeholder="Onboard start time..." value={appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex].onboardStartTime}/>
							)}
						</View>
					</Pressable>
					</View>
				</View>
			</Card>

				
				<Card style={{ margin: 10}}>
					<Text style={styles.itemHeaderTitle}>Running No.</Text>
					<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
						{route.params?.journeyType == "RouteBusJourney" && (
							<Text>{appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].runningNo}</Text>
						)}
						{route.params?.journeyType == "RouteBusReturnJourney" && (
							<Text>{appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex].runningNo}</Text>
						)}
						<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => refRBSheetRunningNoEdit.current.open()}/>
					</View>
				</Card>

				<Card style={{ margin: 10}}>
					<Text style={styles.itemHeaderTitle}>Assigned Bus</Text>
					<Card style={{ margin: 10}}>
						<Text style={styles.itemHeaderTitle}>Reg No.</Text>
						<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
							{route.params?.journeyType == "RouteBusJourney" && (
								<Text>{appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].registrationNo}</Text>
							)}
							{route.params?.journeyType == "RouteBusReturnJourney" && (
								<Text>{appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex].registrationNo}</Text>
							)}
							<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => refRBSheetRegistrationNoEdit.current.open()}/>
						</View>
					</Card>
					<Card style={{ margin: 10}}>
						<Text style={styles.itemHeaderTitle}>License No.</Text>
						<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
							{route.params?.journeyType == "RouteBusJourney" && (
								<Text>{appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].licenseNo}</Text>
							)}
							{route.params?.journeyType == "RouteBusReturnJourney" && (
								<Text>{appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex].licenseNo}</Text>
							)}
							<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => refRBSheetLicenseNoEdit.current.open()}/>
						</View>
					</Card>
				</Card>
		</View>

		<Card style={{ margin: 10, borderRadius:10}} onPress={onNavigateToAllowedBuses}>
			<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
				<Text>Either Buses</Text>
				<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={onNavigateToAllowedBuses}/>
			</View>
		</Card>

		<Card style={{ margin: 10, borderRadius:10}} onPress={onNavigateToStoppingTimes}>
			<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
				<Text>Stopping Times</Text>
				<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={onNavigateToStoppingTimes}/>
			</View>
		</Card>		
		
		
		

		<RBSheet draggable dragOnContent key="runningNoEdit" ref={refRBSheetRunningNoEdit} height={200}>
			<View>
			<Input
				style={{paddingHorizontal: 10}}
				placeholder="Running No."
				value={runningNo}
				selectionColor="#197519"
				cursorColor="#197519"
				onChangeText={(text) => setRunningNo(text)} 
			/>
				
				<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
				<Button style={{ flex: 1, borderRadius:50, margin: 10}} size="large" onPress={onEditRunningNoButtomPress}>Update</Button>
				</View>
			</View>
		</RBSheet>

		<RBSheet draggable dragOnContent key="registrationNoEdit" ref={refRBSheetRegistrationNoEdit} height={200}>
			<View>
			<Input
				style={{paddingHorizontal: 10}}
				placeholder="Registration No."
				value={registrationNo}
				selectionColor="#197519"
				cursorColor="#197519"
				onChangeText={(text) => setRegistrationNo(text)} 
			/>
				
				<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
				<Button style={{ flex: 1, borderRadius:50, margin: 10}} size="large" onPress={onEditRegistrationNoButtomPress}>Update</Button>
				</View>
			</View>
		</RBSheet>

		<RBSheet draggable dragOnContent key="licenseNoEdit" ref={refRBSheetLicenseNoEdit} height={200}>
			<View>
			<Input
				style={{paddingHorizontal: 10}}
				placeholder="License No."
				value={licenseNo}
				selectionColor="#197519"
				cursorColor="#197519"
				onChangeText={(text) => setLicenseNo(text)} 
			/>
				
				<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
				<Button style={{ flex: 1, borderRadius:50, margin: 10}} size="large" onPress={onEditLicenseNoButtomPress}>Update</Button>
				</View>
			</View>
		</RBSheet>
		

		<DateTimePickerModal
			isVisible={isOnboardStartTimeDatePickerVisible}
			mode="time"
			date={defaultDate} 
			timeZoneName={'Asia/Colombo'} 
			onConfirm={handleOnboardStartTimeEditModeConfirm}
			onCancel={hideOnboardStartTimeEditModeDatePicker}/>	
		
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

export default observer(BusTurnUpdateCard);