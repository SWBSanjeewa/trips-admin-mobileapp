import { List, Card, CardElement, CardProps, Text ,Avatar, Button, Layout} from "@ui-kitten/components";
import React,{useEffect, useState,useRef} from "react";
import { View, StyleSheet, ListRenderItemInfo} from "react-native";
import { Stopping } from "./data";
import { ScrollView } from 'react-native-virtualized-view';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

const client = axios.create({
	baseURL: 'https://routes.lk:7007'
});

export const BusStoppingLiveInfoCard = ({ stoppings, justPassedStoppingIndex }) => {

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
					{info.index <= justPassedStoppingIndex && (
						<View style={{ paddingHorizontal: 5}}>	
							<Text style={{  color: "grey"}}>{info.item.place}</Text>
							<Text style={{  color: "grey"}}>{info.item.time}</Text>
						</View>	
					)}
					{info.index > justPassedStoppingIndex && (
						<View style={{ paddingHorizontal: 5}}>	
							<Text >{info.item.place}</Text>
							<Text>{info.item.time}</Text>
						</View>	
					)}	
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
