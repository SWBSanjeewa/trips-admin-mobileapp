import { TopNavigation, TopNavigationAction, Button, Card,Input,Text ,Divider} from "@ui-kitten/components";
import React,{useState,useEffect} from "react";
import { ArrowIosBackIcon } from "../../../components/icons";
import { useRoute } from "@react-navigation/native"
import { StyleSheet, View , SafeAreaView,Pressable} from "react-native";
import AppStore from "../../../store/AppStore";
import { observer} from "mobx-react";
import { useStore } from "mobx-store-provider";
import { DayPicker } from '@routeslk/react-native-picker-weekday'
import { ScrollView } from "react-native-gesture-handler";
import { showMessage, hideMessage } from "react-native-flash-message";
import { StackActions } from '@react-navigation/native';



const BusPassengersAdd = ({ navigation }): React.ReactElement => {

	const route = useRoute();

	const [index, setIndex] = useState(0);

	const [name, setName] = useState('');
	const [mobileNumber, setMobileNumber] = useState('');

	const [journeyStartLocation, setJourneyStartLocation] = useState('');
	const [journeyStartLatitude, setJourneyStartLatitude] = useState(0);
	const [journeyStartLongitude, setJourneyStartLongitude] = useState(0);

	const [journeyEndLocation, setJourneyEndLocation] = useState('');
	const [journeyEndLatitude, setJourneyEndLatitude] = useState(0);
	const [journeyEndLongitude, setJourneyEndLongitude] = useState(0);

	const [returnJourneyStartLocation, setReturnJourneyStartLocation] = useState('');
	const [returnJourneyStartLatitude, setReturnJourneyStartLatitude] = useState(0);
	const [returnJourneyStartLongitude, setReturnJourneyStartLongitude] = useState(0);

	const [returnJourneyEndLocation, setReturnJourneyEndLocation] = useState('');
	const [returnJourneyEndLatitude, setReturnJourneyEndLatitude] = useState(0);
	const [returnJourneyEndLongitude, setReturnJourneyEndLongitude] = useState(0);

	const [journeyWeekdays, setJourneyWeekdays] = React.useState([2,3,4,5,6])
	const [returnJourneyWeekdays, setReturnJourneyWeekdays] = React.useState([2,3,4,5,6])

	
	const appStore = useStore(AppStore);
	const wipPassenger = appStore.wipPassenger;
	

	useEffect(() => {
		if(route.params){
			setIndex(route.params.index);

			
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
		
			setName(wipPassenger.name);
			setMobileNumber(wipPassenger.mobileNumber);

			setIndex(route.params.index);

				
		
		}
		
	});

	const resetValues = (): void => {
		setIndex(index+1);

	}

	const onPassengerAddPress = (): void => {
		console.log("###>"+journeyWeekdays.toString());
		if(index){
			appStore.bus.addPassengerAtIndex(name, mobileNumber, wipPassenger.journeyStart,wipPassenger.journeyStartLatitude, wipPassenger.journeyStartLongitude,wipPassenger.journeyEnd,wipPassenger.journeyEndLatitude, wipPassenger.journeyEndLongitude,wipPassenger.returnJourneyStart,wipPassenger.returnJourneyStartLatitude, wipPassenger.returnJourneyStartLongitude,wipPassenger.returnJourneyEnd,wipPassenger.returnJourneyEndLatitude, wipPassenger.returnJourneyEndLongitude,journeyWeekdays.toString(),returnJourneyWeekdays.toString(),index);
			showMessage({message: "Passenger create at index"+index,type: "success"});
			resetValues();	
			navigation.dispatch(StackActions.pop(2));
		}else{

			appStore.bus.addPassenger(name, mobileNumber, wipPassenger.journeyStart,wipPassenger.journeyStartLatitude, wipPassenger.journeyStartLongitude,wipPassenger.journeyEnd,wipPassenger.journeyEndLatitude, wipPassenger.journeyEndLongitude,wipPassenger.returnJourneyStart,wipPassenger.returnJourneyStartLatitude, wipPassenger.returnJourneyStartLongitude,wipPassenger.returnJourneyEnd,wipPassenger.returnJourneyEndLatitude, wipPassenger.returnJourneyEndLongitude,journeyWeekdays.toString(),returnJourneyWeekdays.toString());
			showMessage({message: "Passenger created",type: "success"});
			resetValues();	
			navigation.dispatch(StackActions.pop(1));
		}
		
	};

	

	const onMobileNumberChange = (value): void => {
		setMobileNumber(value.toString());
	};

	const onNameChange = (value): void => {
		setName(value.toString());
	};

	const setRouteStartsLocationPress = (): void => {
		wipPassenger.updateRegularInfo(name,mobileNumber,journeyWeekdays.toString(),returnJourneyWeekdays.toString());
		navigation && navigation.navigate("LocationAdd", {id: "passenger-journeystarts", latitude:journeyStartLatitude , longitude:journeyStartLongitude, placeName:journeyStartLocation, returnroute: "BusPassengersAddScreen"});
	};

	const setRouteEndLocationPress = (): void => {
		wipPassenger.updateRegularInfo(name,mobileNumber,journeyWeekdays.toString(),returnJourneyWeekdays.toString());
		navigation && navigation.navigate("LocationAdd", {id: "passenger-journeyends", latitude:journeyEndLatitude , longitude:journeyEndLongitude, placeName:journeyEndLocation, returnroute: "BusPassengersAddScreen"});
	};

	const setReturnRouteStartsLocationPress = (): void => {
		wipPassenger.updateRegularInfo(name,mobileNumber,journeyWeekdays.toString(),returnJourneyWeekdays.toString());
		navigation && navigation.navigate("LocationAdd", {id: "passenger-returnjourneystarts", latitude:returnJourneyStartLatitude , longitude:returnJourneyStartLongitude, placeName:returnJourneyStartLocation, returnroute: "BusPassengersAddScreen"});
	};

	const setReturnRouteEndLocationPress = (): void => {
		wipPassenger.updateRegularInfo(name,mobileNumber,journeyWeekdays.toString(),returnJourneyWeekdays.toString());
		navigation && navigation.navigate("LocationAdd", {id: "passenger-returnjourneyends", latitude:returnJourneyEndLatitude , longitude:returnJourneyEndLongitude, placeName:returnJourneyEndLocation,  returnroute: "BusPassengersAddScreen"});
	};


	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
	);


	return (
		
		<ScrollView>
			<TopNavigation accessoryLeft={renderBackAction} title="Passenger Add"/>
			<Card style={styles.item} >
				<View>
					<Input placeholder="Mobile number..." value={mobileNumber} onChangeText={onMobileNumberChange}/>
					<Input placeholder="Name..." value={name} onChangeText={onNameChange}/>
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
						activeColor='#B12048'
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
						activeColor='#B12048'
						textColor='white'
						inactiveColor='grey'
						/>
				</View>
			</Card>
			
			<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
				<Button style={{ flex: 3 , borderRadius:50, margin: 10}} onPress={()=>onPassengerAddPress()} >Add</Button>
			</View>
		</ScrollView>
		
		
	);
};

const styles = StyleSheet.create({

	parentContainer: {
		flex: 1,
		flexDirection: "row",
		
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
	
});

export default observer(BusPassengersAdd);
