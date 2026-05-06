import { List, Card, CardElement, CardProps, Text ,Avatar, Layout} from "@ui-kitten/components";
import React from "react";
import { View, StyleSheet, ListRenderItemInfo, Pressable} from "react-native";
import { Stopping } from "./data";
import { ScrollView } from 'react-native-virtualized-view';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import { TouchableOpacity } from '@gorhom/bottom-sheet';



export const BusStoppingInfoCard = ({ stoppings ,bottomSheetRef ,mapRef}) => {

	const onStoppingPressed = (index): void => {
		console.log("onStoppingPressed!!");
		bottomSheetRef.current?.close();
		mapRef.current.animateCamera({
			altitude: 15000,
			center: {
			  latitude: Number(stoppings[index].latitude),
			  longitude: Number(stoppings[index].longitude),
			},
			heading: 0,
			pitch: 0,
			zoom: 16,
		  });

	};

	const renderItem = (info: ListRenderItemInfo<Stopping>): React.ReactElement => (
		
		<View>
				<TouchableOpacity pointerEvents="none" style={{ flexDirection: "row", justifyContent: "space-even", padding: 0, margin: 2, backgroundColor: "#eee", borderWidth: 1, borderColor: '#bbb'}} onPress={ () => onStoppingPressed(info.index)}>
					<View style={{ paddingHorizontal: 5}}>
						{info.index==0 && (
						<View  style={{  paddingTop: 15, margin: 0}}>
							<MaterialIcons name="circle" size={20} color="green" />
							<Feather name="more-vertical" size={20} color="green" />
						</View>
						)}
						{info.index==stoppings.length-1 && (
						<View style={{  padding: 0, margin: 0}}>
							<Feather name="more-vertical" size={20} color="green" />
							<MaterialIcons name="circle" size={20} color="red" />
						</View>
						)}

						{!(info.index==stoppings.length-1 || info.index==0) && (
						<View style={{  padding: 0, margin: 0}}>
							<Feather name="more-vertical" size={20} color="green" />
							<Entypo name="circle" size={20} color="green" />
							<Feather name="more-vertical" size={20} color="green" />
						</View>
						)}
					</View>
					<View style={{ padding: 10 }}>	
						<Text >{info.item.place}</Text>
						<Text>{info.item.time}</Text>
					</View>	
				</TouchableOpacity>
			
		</View>
	);
	
	return (
		
		<ScrollView>
			
			<View >		
					<List
						contentContainerStyle={styles.listContent}
						data={stoppings}
						renderItem={renderItem}
						keyExtractor={item => item.place}/>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 0,
		margin: 0
	},

	iconButton: {
		paddingHorizontal: 0,
	},
	item: {
		margin: 0
	},
	
});
