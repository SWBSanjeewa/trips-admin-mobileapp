import { Button, Card, Layout, List, Divider,Input, Text } from "@ui-kitten/components";
import React,{useState,useEffect,useReducer} from "react";
import { useRoute } from "@react-navigation/native"
import { StyleSheet, View , ScrollView,Image, TouchableOpacity,Pressable} from "react-native";
import { data } from "../../../scenes/libraries/data";
import AppStore from "../../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";

//export default inject("store")(observer(BusAddScreen));
const BusReturnJourneyAdd = ({ navigation }): React.ReactElement => {

	const route = useRoute();

	const [data, setData] = useState([]);
	const [startLocation, setStartLocation] = useState(0);
	const [endLocation, setEndLocation] = useState(0);

	
	const appStore = useStore(AppStore);
	

	useEffect(() => {
		
		//console.log(context.data)
  		
		if(route.params){
			//console.log(route.params.id+","+route.params.latttude+","+route.params.longitude+","+route.params.description)
			if(route.params.id == "start"){
				
				appStore.bus.setStartLocation(route.params.latitude,route.params.longitude);
				//setStartLocation(getStartLatitude()+","+getStartLongitude());
			}

			if(route.params.id == "end"){
				//setEndLocation(route.params.latitude+","+route.params.longitude);
				appStore.bus.setEndLocation(route.params.latitude,route.params.longitude);
			}
			if(route.params.id == "intermediate"){
				console.log(route.params.index+","+route.params.latitude+","+route.params.longitude)
			}
		}
	});

	//console.log("route.params:"+route.params.latitude)

	const onStoppingAddPress = (index): void => {
		setData(data => [...data, {id: index ,'place': 'Place...', 'location': 'Location...'+index}]);
		console.log('data:',data)  
	};

	const onStoppingDeletePress = (): void => {
		setData(data => [...data, {'place': 'Place...', 'location': 'Location...'}]);
		console.log('data:',data)  
	};

	const onSetStartLocationPress = (): void => {
		navigation && navigation.navigate("LocationAdd", {id: "start", returnroute: "Return"});
	};

	const onSetEndLocationPress = (): void => {
		navigation && navigation.navigate("LocationAdd", {id: "end", returnroute: "Return"});
	};

	const onSetIntermediateLocationPress = (index): void => {
		navigation && navigation.navigate("LocationAdd", {"id": "intermediate", "index": index});
	};

	const onNextPress = (): void => {
		//appStore.changeUser("Buddhika");
		navigation.jumpTo('Passengers', { name: 'Bus Add' });
	};

	//({item}: {item: ItemData}) => {
	const renderItem = ({item}): React.ReactElement => (
		<Card
			style={styles.item}	
		>
			<View>
				<Input placeholder="Place..."/>
				<Divider />
				<Pressable onPress={() => onSetIntermediateLocationPress(item.id)}>
						<View pointerEvents="none">
							<Input placeholder={item.location} value={startLocation}/>
						</View>
					</Pressable>
				<TouchableOpacity onPress={()=>onStoppingAddPress(item.id+1)}>
						<Image source={require("./assets/add.png")}  style={{position: "absolute", bottom: 0, right: -25, alignSelf: "flex-end"}}/>
				</TouchableOpacity>
				<TouchableOpacity onPress={()=>onStoppingDeletePress()}>
						<Image source={require("./assets/delete.png")}  style={{position: "absolute", bottom: 35, right: -25, alignSelf: "flex-end"}}/>
				</TouchableOpacity>
			</View>
		</Card>
	);

	return (
		
		<ScrollView>
			<Card style={styles.item}	>
				<View>
					<Input placeholder="Start ..." />
					<Divider />
					
					<Pressable onPress={() => onSetStartLocationPress()}>
						<View pointerEvents="none">
							<Input placeholder="Start Location..." />
						</View>
					</Pressable>
					<TouchableOpacity onPress={()=>onStoppingAddPress(0)}>
						<Image source={require("./assets/add.png")}  style={{position: "absolute", bottom: 0, right: -25, alignSelf: "flex-end"}}/>
					</TouchableOpacity>
				</View>
			</Card>
			<View >			
				<Layout level="2">
					<List
						contentContainerStyle={styles.listContent}
						data={data}
						renderItem={renderItem}
					/>
				</Layout>
				
			</View>
			<Card style={styles.item}	>
				<View>
					<Input placeholder="End ..." />
					<Divider />
					<Pressable onPress={() => onSetEndLocationPress()}>
						<View pointerEvents="none">
							<Input placeholder="End Location..."/>
						</View>
					</Pressable>	
				</View>
			</Card>
			<Button style={styles.nextButton} onPress={()=>onNextPress()}>
			 Next
			</Button>
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
	},
	
	itemContent: {
		marginVertical: 8,
	},
	
});

//export default observer(BusJourneyAdd);
export default observer(BusReturnJourneyAdd);
