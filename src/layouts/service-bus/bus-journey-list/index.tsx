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

	const [copyFromDisabled, setCopyFromDisabled] = React.useState(appStore.bus.journey.stoppings.length >0 );
	

	const onStoppingEditPress = (stopping,index): void => {
		navigation && navigation.navigate("BusStoppingEditScreen", {id: "stopping-edit", "journeyType": "Journey","returnRoute": "Journey", oldLatitude: stopping.latitude, oldLongitude: stopping.longitude, place: stopping.place, latitude: stopping.latitude, longitude: stopping.longitude, time: stopping.time, index: index});
	};


	const onStoppingAddPress = (): void => {
		appStore.bus.setJourneyRunningDays(runningDays.toString());
		navigation && navigation.navigate("BusStoppingAddScreen",{ "journeyType": "Journey"});
	};


	const onBackPress = (): void => {
		appStore.bus.setJourneyRunningDays(runningDays.toString());
		navigation && navigation.goBack();
	};

	const onCopyFromChecked = (): void => {
		setCopyFromChecked(!copyFromChecked);
		appStore.bus.stoppings.forEach(stopping => {
			console.log(">>"+stopping);
            appStore.bus.addJourneyStopping(stopping.place,stopping.latitude,stopping.longitude,"00.00 AM");
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
			<DayPicker
						weekdays={runningDays}
						setWeekdays={setRunningDays}
						activeColor='#142169'
						textColor='white'
						inactiveColor='grey'
						/>
			<View style={{ flexDirection: "row", justifyContent: "flex-end"}}>
				<CheckBox style={{ margin: 2}}  checked={copyFromChecked} onChange={onCopyFromChecked} disabled={copyFromDisabled}>Copy stoppings from description</CheckBox>
			</View>
			<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
				<Button style={{ flex: 1 , margin: 2, borderRadius:50, margin: 10 }} onPress={()=>onStoppingAddPress()} >Add Stopping</Button>
			</View>
			
			<View>	

				{appStore.bus.journey.stoppings.map(function(stopping, index){	
					return <Card key={index} style={styles.item} onPress={()=>onStoppingEditPress(stopping,index)}>
						<View>
							<View pointerEvents="none">
								<Input placeholder="Location..." value={stopping.place}/>
								<Input placeholder="Time..." value={stopping.time}/>
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
