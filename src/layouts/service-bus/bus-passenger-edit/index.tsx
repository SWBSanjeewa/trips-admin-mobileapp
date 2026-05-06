import { TopNavigation, TopNavigationAction, Button, Card,Input,Text ,Divider, Avatar} from "@ui-kitten/components";
import React,{useState,useEffect,useRef} from "react";
import { ArrowIosBackIcon } from "../../../components/icons";
import { useRoute } from "@react-navigation/native"
import { StyleSheet, View , ScrollView,Pressable, Text as RNText} from "react-native";
import AppStore from "../../../store/AppStore";
import { observer} from "mobx-react";
import { useStore } from "mobx-store-provider";
import { DayPicker } from '@routeslk/react-native-picker-weekday'


import {
	MaterialIcons as MDIcon,
	FontAwesome as FAIcon,
} from '@expo/vector-icons';
import RBSheet from 'react-native-raw-bottom-sheet';

const BusPassengersEdit = ({ navigation }): React.ReactElement => {

	const route = useRoute();
	const [name, setName] = useState('');
	const [mobileNumber, setMobileNumber] = useState('');

	const [journeyStartLocation, setJourneyStartLocation] = useState(null);
	const [journeyStartLatitude, setJourneyStartLatitude] = useState(0);
	const [journeyStartLongitude, setJourneyStartLongitude] = useState(0);

	const [journeyEndLocation, setJourneyEndLocation] = useState(null);
	const [journeyEndLatitude, setJourneyEndLatitude] = useState(0);
	const [journeyEndLongitude, setJourneyEndLongitude] = useState(0);

	const [returnJourneyStartLocation, setReturnJourneyStartLocation] = useState(null);
	const [returnJourneyStartLatitude, setReturnJourneyStartLatitude] = useState(0);
	const [returnJourneyStartLongitude, setReturnJourneyStartLongitude] = useState(0);

	const [returnJourneyEndLocation, setReturnJourneyEndLocation] = useState(null);
	const [returnJourneyEndLatitude, setReturnJourneyEndLatitude] = useState(0);
	const [returnJourneyEndLongitude, setReturnJourneyEndLongitude] = useState(0);

	const [journeyWeekdays, setJourneyWeekdays] = React.useState([2,3,4,5,6])
	const [returnJourneyWeekdays, setReturnJourneyWeekdays] = React.useState([2,3,4,5,6])

	const [index, setIndex] = React.useState(0)

	const [initialized, setInitialized] = React.useState(false)
	

	const appStore = useStore(AppStore);
	const wipPassenger = appStore.wipPassenger;

	const refRBSheetNameEdit = useRef();

	

	useEffect(() => {
		//setName(wipPassenger.name);
		
		if(route.params){
			setJourneyStartLocation(wipPassenger.journeyStart);
			setJourneyStartLatitude(wipPassenger.journeyStartLatitude);
			setJourneyStartLongitude(wipPassenger.journeyStartLongitude);

			setJourneyEndLocation(wipPassenger.journeyEnd);
			setJourneyEndLatitude(wipPassenger.journeyEndLatitude);
			setJourneyEndLongitude(wipPassenger.journeyEndLongitude);

			setReturnJourneyStartLocation(wipPassenger.returnJourneyStart);
			setReturnJourneyStartLatitude(wipPassenger.returnJourneyStartLatitude);
			setReturnJourneyStartLongitude(wipPassenger.returnJourneyStartLongitude);

			setReturnJourneyEndLocation(wipPassenger.returnJourneyEnd);
			setReturnJourneyEndLatitude(wipPassenger.returnJourneyEndLatitude);
			setReturnJourneyEndLongitude(wipPassenger.returnJourneyEndLongitude);

			
			setMobileNumber(wipPassenger.mobileNumber);

			setIndex(route.params.index);

		
			if(initialized == false){
				console.log("wipPassenger.journeyWeekdays "+wipPassenger.journeyWeekdays);
			  var journeyWorkdaysNumbers = wipPassenger.journeyWeekdays.split(',').map(function(item) {
				return parseInt(item, 10);
			  });
			  console.log("Initial "+journeyWorkdaysNumbers);
			  setJourneyWeekdays(journeyWorkdaysNumbers);

			  var returnJourneyWorkdaysNumbers = wipPassenger.returnJourneyWeekdays.split(',').map(function(item) {
				return parseInt(item, 10);
			  });
			  setReturnJourneyWeekdays(returnJourneyWorkdaysNumbers);

			  setInitialized(true);
			}
		}
		
	});

	

	const onPassengerUpdatePress = (): void => {
		console.log("journeyWeekdays:"+journeyWeekdays);
		console.log("returnJourneyWeekdays:"+returnJourneyWeekdays);
		appStore.bus.updatePassenger(wipPassenger.name, wipPassenger.mobileNumber, wipPassenger.journeyStart,wipPassenger.journeyStartLatitude, wipPassenger.journeyStartLongitude,wipPassenger.journeyEnd,wipPassenger.journeyEndLatitude, wipPassenger.journeyEndLongitude,wipPassenger.returnJourneyStart,wipPassenger.returnJourneyStartLatitude, wipPassenger.returnJourneyStartLongitude,wipPassenger.returnJourneyEnd,wipPassenger.returnJourneyEndLatitude, wipPassenger.returnJourneyEndLongitude,journeyWeekdays.toString(),returnJourneyWeekdays.toString());
		appStore.wipPassenger.reset();
		navigation && navigation.goBack();
	};

	const onPassengerDeletePress = (): void => {
		appStore.bus.deletePassenger(mobileNumber);
		//showMessage({message: "Deleted passenger :"+mobileNumber,type: "success"});
		navigation && navigation.goBack();
		//appStore.bus.addPassenger(name, mobileNumber, journeyStartLocation,journeyStartLatitude, journeyStartLongitude,journeyEndLocation,journeyEndLatitude, journeyEndLongitude,returnJourneyStartLocation,returnJourneyStartLatitude, returnJourneyStartLongitude,returnJourneyEndLocation,returnJourneyEndLatitude, returnJourneyEndLongitude,journeyWeekdays,returnJourneyWeekdays);
	};

	const onPassengerAddNextPress = (): void => {
		appStore.bus.findPassenger(mobileNumber)
		var nextIndex = route.params.index+1;
		console.log("Next index:"+nextIndex);
		navigation && navigation.navigate("BusPassengersAddScreen", {index: nextIndex });
	};

	const onMobileNumberChange = (value): void => {
		setMobileNumber(value.toString());
	};

	const onNameChange = (value): void => {
		setName(value.toString());
	};

	const setRouteStartsLocationPress = (): void => {
		console.log(">> setRouteStartsLocationPress");
		navigation && navigation.navigate("LocationAdd", {id: "passenger-journeystarts", latitude:journeyStartLatitude , longitude:journeyStartLongitude, placeName:journeyStartLocation, returnroute: "BusPassengerEditScreen", mobileNumber: mobileNumber, name: name});
	};

	const setRouteEndLocationPress = (): void => {
		navigation && navigation.navigate("LocationAdd", {id: "passenger-journeyends", latitude:journeyEndLatitude , longitude:journeyEndLongitude, placeName:journeyEndLocation, returnroute: "BusPassengerEditScreen", mobileNumber: mobileNumber,name: name});
	};

	const setReturnRouteStartsLocationPress = (): void => {
		navigation && navigation.navigate("LocationAdd", {id: "passenger-returnjourneystarts", latitude:returnJourneyStartLatitude , longitude:returnJourneyStartLongitude, placeName:returnJourneyStartLocation, returnroute: "BusPassengerEditScreen", mobileNumber: mobileNumber,name: name});
	};

	const setReturnRouteEndLocationPress = (): void => {
		navigation && navigation.navigate("LocationAdd", {id: "passenger-returnjourneyends", latitude:returnJourneyEndLatitude , longitude:returnJourneyEndLongitude, placeName:returnJourneyEndLocation,  returnroute: "BusPassengerEditScreen", mobileNumber: mobileNumber,name: name});
	};


	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
	);

	const onEditNamePress = () => {
		refRBSheetNameEdit.current.close();
	}


	return (
		
		<ScrollView>
			
			
			<TopNavigation title={props => (
					
					<RNText {...props} style={{fontWeight: "500", fontSize: 18, fontFamily: 'opensans-regular',}}>
					Passenger Edit
					</RNText>)} accessoryLeft={renderBackAction}  />

			<Card key="passenger-info" style={styles.item}>
				<Text style={styles.itemHeader}>Name</Text>
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>{appStore.wipPassenger.name}</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => refRBSheetNameEdit.current.open()}/>
				</View>
			</Card>
			<Card style={styles.item}>
				<Text category="h5">Journey</Text>
				<Divider />
				<View>
					<Pressable onPress={() => setRouteStartsLocationPress()}>
						<View pointerEvents="none">
							<Input placeholder="Route starts..." value={journeyStartLocation}/>
						</View>
					</Pressable>
					<Pressable onPress={() => setRouteEndLocationPress()}>
						<View pointerEvents="none">
							<Input placeholder="Route ends..." value={journeyEndLocation}/>
						</View>
					</Pressable>
					<DayPicker
						weekdays={journeyWeekdays}
						setWeekdays={setJourneyWeekdays}
						activeColor='#142169'
						textColor='white'
						inactiveColor='grey'
						/>
				</View>
			</Card>
			<Card style={styles.item}>
				<Text category="h5">Return Journey</Text>
				<Divider />
				<View>
					<Pressable onPress={() => setReturnRouteStartsLocationPress()}>
						<View pointerEvents="none">
							<Input placeholder="Route starts..." value={returnJourneyStartLocation}/>
						</View>
					</Pressable>
					<Pressable onPress={() => setReturnRouteEndLocationPress()}>
						<View pointerEvents="none">
							<Input placeholder="Route ends..." value={returnJourneyEndLocation}/>
						</View>
					</Pressable>
					<DayPicker
						weekdays={returnJourneyWeekdays}
						setWeekdays={setReturnJourneyWeekdays}
						activeColor='#142169'
						textColor='white'
						inactiveColor='grey'
						/>
				</View>
			</Card>
			<Card style={{ margin: 10, borderRadius:10}} onPress={() => navigation.navigate("BusPassengersWatchers",{readOnly: false, passengerMobileNumber: appStore.wipPassenger.mobileNumber})}>
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Watchers</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("BusPassengersWatchers",{readOnly: false, passengerMobileNumber: appStore.wipPassenger.mobileNumber})}/>
				</View>
			</Card>
			<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
				<Button style={{ flex: 3 , margin: 5, backgroundColor: "#D69200" , borderRadius:50, margin: 10, borderColor: "#D69200" }} onPress={()=>onPassengerUpdatePress()} >Update</Button>
				<Button style={{ flex: 3 , margin: 5, backgroundColor: "#B12048", borderRadius:50, margin: 10, borderColor: "#B12048"}} onPress={()=>onPassengerDeletePress()}>Delete</Button>
			</View>
			<RBSheet draggable dragOnContent key="nameEdit" ref={refRBSheetNameEdit} height={300}>
					<View>
					<Input
						style={{paddingHorizontal: 10}}
						placeholder="Name"
						value={appStore.wipPassenger.name}
						selectionColor="#197519"
						cursorColor="#197519"
						onChangeText={(text) => appStore.wipPassenger.updateName(text)} 
					/>
						
						<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
						<Button style={{ flex: 1, borderRadius:50, margin: 10}} size="giant" onPress={onEditNamePress}>Update</Button>
						</View>
					</View>
				</RBSheet>
		</ScrollView>
		
		
	);
};

const styles = StyleSheet.create({

	parentContainer: {
		flex: 1,
		flexDirection: "row",
		
	},
	itemHeader: {
		fontWeight: "500",
		fontSize: 18
	},
	listContent: {
		paddingHorizontal: 32,
		paddingVertical: 8,
	},
	nextButton: {
		marginVertical: 8,
	},

	item: {
		marginVertical: 8,
		margin: 10
	},
	
	itemContent: {
		marginVertical: 8,
	},
	itemContentIcon: {
		fontSize: 26,
		color: '#666',
	  },
});

export default observer(BusPassengersEdit);
