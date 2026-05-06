import { Button, Card, Layout, List, Divider,Input, Text } from "@ui-kitten/components";
import React,{useState,useEffect,useReducer} from "react";
import { useRoute } from "@react-navigation/native"
import { StyleSheet, View , ListRenderItemInfo,Image, TouchableOpacity,Pressable} from "react-native";
import { Stopping } from "./extra/data";
import AppStore from "../../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";
import { toJS } from "mobx";
import { DayPicker } from '@routeslk/react-native-picker-weekday'
import { ScrollView } from 'react-native-virtualized-view';
import { showMessage, hideMessage } from "react-native-flash-message";



const BusReturnJourneyList = ({ navigation }): React.ReactElement => {


	const route = useRoute();

	const [data, setData] = useState([]);


	const [updated, setUpdated] = useState(false);
	
	const [runningDays, setRunningDays] = React.useState([2,3,4,5,6])
	
	const appStore = useStore(AppStore);

	

	const onStoppingEditPress = (info): void => {
		navigation && navigation.navigate("BusStoppingEditScreen", {id: "stopping-edit", "journeyType": "Return","returnRoute": "Return", oldLatitude: info.item.latitude, oldLongitude: info.item.longitude, place: info.item.place, latitude: info.item.latitude, longitude: info.item.longitude, time: info.item.time, index: info.index});
	};

	const onNextPress = (): void => {
		appStore.bus.setReturnJourneyRunningDays(runningDays.toString());
		navigation.jumpTo('Passengers', { name: 'Bus Add' });
	};

	const onStoppingAddPress = (): void => {
		appStore.bus.setReturnJourneyRunningDays(runningDays.toString());
		navigation && navigation.navigate("BusStoppingAddScreen",{ "journeyType": "Return"});
	};

	const renderItem = (info: ListRenderItemInfo<Stopping>): React.ReactElement => (
		
		<Card key={info.index} style={styles.item} onPress={()=>onStoppingEditPress(info)}>
			<View>
				<View pointerEvents="none">
				<Input placeholder="Location..." value={info.item.place}/>
					<Input placeholder="Time..." value={info.item.time}/>
				</View>
			</View>
		</Card>
	);

	return (
		
		<ScrollView>
			<DayPicker
						weekdays={runningDays}
						setWeekdays={setRunningDays}
						activeColor='#142169'
						textColor='white'
						inactiveColor='grey'
						/>
			<View >	
			
				<Layout level="2">
					<List
						contentContainerStyle={styles.listContent}
						data={appStore.bus.returnJourney.stoppings}
						renderItem={renderItem}
					/>
				</Layout>	
			
			</View>

			<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
				<Button style={{ flex: 1 , borderRadius:50, margin: 10}} onPress={()=>onStoppingAddPress()} >Add Stopping</Button>
				<Button style={{ flex: 1, borderRadius:50, margin: 10}} onPress={()=>onNextPress()}>Passengers</Button>
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
	},
	
	itemContent: {
		marginVertical: 8,
	},
	
});


export default observer(BusReturnJourneyList);
