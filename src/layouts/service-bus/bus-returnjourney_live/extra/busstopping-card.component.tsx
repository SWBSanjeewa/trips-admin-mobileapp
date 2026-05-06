import { List, Card, CardElement, CardProps, Text ,Avatar, Button, Layout} from "@ui-kitten/components";
import React from "react";
import { View, StyleSheet, ListRenderItemInfo} from "react-native";
import { Stopping } from "./data";
import { ScrollView } from 'react-native-virtualized-view';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';


export const BusStoppingInfoCard = ({ stoppings }) => {

	const renderItem = (info: ListRenderItemInfo<Stopping>): React.ReactElement => (
		
		<View key={info.index} style={styles.item}>
			

				<View pointerEvents="none" style={{ flexDirection: "row", justifyContent: "space-even", padding: 0, margin: 0}}>
					<View style={{ paddingHorizontal: 5}}>
						{info.index==0 && (
						<View  style={{  padding: 0, margin: 0}}>
							<MaterialIcons name="circle" size={20} color="green" />
							<Feather name="more-vertical" size={20} color="green" />
						</View>
						)}
						{info.index==stoppings.length-1 && (
						<View style={{  padding: 0, margin: 0}}>
							<MaterialIcons name="circle" size={20} color="red" />
						</View>
						)}

						{!(info.index==stoppings.length-1 || info.index==0) && (
						<View style={{  padding: 0, margin: 0}}>
							<Entypo name="circle" size={20} color="green" />
							<Feather name="more-vertical" size={20} color="green" />
						</View>
						)}
					</View>
					<View style={{ paddingHorizontal: 5}}>	
						<Text >{info.item.place}</Text>
						<Text>{info.item.time}</Text>
					</View>	
				</View>
			
		</View>
	);
	
	return (
		
		<ScrollView>
			
			<View >	
			
				<Layout level="2">
					<List
						contentContainerStyle={styles.listContent}
						data={stoppings}
						renderItem={renderItem}
					/>
				</Layout>	
			
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
