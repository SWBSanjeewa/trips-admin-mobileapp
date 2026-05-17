import { TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { Button, Card, CheckBox, List, Divider,Input } from "@ui-kitten/components";
import React,{useState,useEffect,useReducer} from "react";
import { useRoute } from "@react-navigation/native"
import { StyleSheet, View , ListRenderItemInfo,Image, TouchableOpacity,Pressable, Text} from "react-native";
import { Stopping } from "./extra/data";
import AppStore from "../../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";
import { DayPicker } from '@routeslk/react-native-picker-weekday'
import { ScrollView } from 'react-native-virtualized-view';
import { SafeAreaLayout } from "../../../components/safe-area-layout.component";
import { ArrowIosBackIcon } from "../../../components/icons";



const BusJourneyList = ({ navigation }): React.ReactElement => {

	const route = useRoute();

	const [data, setData] = useState([]);


	const [updated, setUpdated] = useState(false);

	const [runningDays, setRunningDays] = React.useState([2,3,4,5,6])
	
	const appStore = useStore(AppStore);

	const [initialized, setInitialized] = React.useState(false);

	const [copyFromChecked, setCopyFromChecked] = React.useState(false);

	const [copyFromDisabled, setCopyFromDisabled] = React.useState(appStore.tour.stoppings.length >0 );
	

	const onStoppingEditPress = (stopping,index): void => {
		navigation && navigation.navigate("TourStoppingEdit", {id: "stopping-edit", oldLatitude: stopping.latitude, oldLongitude: stopping.longitude, title: stopping.title, place: stopping.place, latitude: stopping.latitude, longitude: stopping.longitude, time: stopping.time, waitingTime: stopping.waitingTime, day: stopping.day, index: index});
	};


	const onStoppingAddPress = (): void => {
		appStore.bus.setJourneyRunningDays(runningDays.toString());
		navigation && navigation.navigate("TourStoppingAddScreen",{ "journeyType": "Journey"});
	};


	const onBackPress = (): void => {
		appStore.bus.setJourneyRunningDays(runningDays.toString());
		navigation && navigation.goBack();
	};

	const onCopyFromChecked = (): void => {
		setCopyFromChecked(!copyFromChecked);
		appStore.tour.stoppingsPlaces.forEach(stopping => {
			console.log(">>"+stopping);
            appStore.tour.addStopping(stopping.title,stopping.place,stopping.latitude,stopping.longitude,"1","00.00 AM","15 Minutes");

			//addStopping(title,place,latitude,longitude,day,time,waitingTime){

			//place: any, latitude: any, longitude: any, title: any, remarks: any, plusDays: any, arrivalTime: any, departureTime: any, stayDuration: any
        });
		setCopyFromDisabled(true);
	};

	
	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={onBackPress} />
	);

	useEffect(() => {
			if(initialized == false){
			  var journeyWorkdaysNumbers = appStore.bus.journey.runningDays.split(',').map(function(item) {
				return parseInt(item, 10);
			  });
			  setRunningDays(journeyWorkdaysNumbers);
			  setInitialized(true);
			}
		
	});


	return (
	
		<ScrollView>
			<View style={{ flexDirection: "row", justifyContent: "flex-end"}}>
				<CheckBox style={{ margin: 2}}  checked={copyFromChecked} onChange={onCopyFromChecked} disabled={copyFromDisabled}>Copy stoppings from description</CheckBox>
			</View>
			<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
				<Button style={{ flex: 1 , margin: 2, borderRadius:50, margin: 10 }} onPress={()=>onStoppingAddPress()} >Add Stopping</Button>
			</View>
			
			<View>	

				{appStore.tour.stoppings.map(function(stopping, index){	
					return <Card key={index} style={styles.item} onPress={()=>onStoppingEditPress(stopping,index)}>
						<View>
							<View pointerEvents="none">
								<Text>Day</Text><Input placeholder="Day..." value={stopping.day}/>
								<Text>Title</Text><Input placeholder="Title..." value={stopping.title}/>
								<Text>Place</Text><Input placeholder="Location..." value={stopping.place}/>
								<Text>Time</Text><Input placeholder="Time..." value={stopping.time}/>
								<Text>Waiting</Text><Input placeholder="Waiting..." value={stopping.waitingTime}/>
							</View>
						</View>
					</Card>;	
				})}	
			
			</View>

			
		</ScrollView>
		
		
		
	);
};

const styles = StyleSheet.create({

	
	listContent: {
		paddingHorizontal: 32,
		paddingVertical: 8,
	},
	button: {
		marginVertical: 8,
	},

	item: {
		marginVertical: 8,
		marginHorizontal: 10
	},
	
	itemContent: {
		marginVertical: 8,
	},
	
});


export default observer(BusJourneyList);
