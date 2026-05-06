import { Avatar, Button, Card, Text, List } from "@ui-kitten/components";
import React,{useState,useEffect} from "react";
import { useFocusEffect } from '@react-navigation/native';
import { ListRenderItemInfo, StyleSheet, View , ScrollView,Image, ActivityIndicator} from "react-native";

import AppStore from "../../../store/AppStore";
import { useStore } from "mobx-store-provider";

import { TransportService } from "./extra/data";

import { CachedImage } from '@georstat/react-native-image-cache';

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';


const client = axios.create({
	baseURL: 'https://routes.lk:7007'
});



export default ({ navigation }): React.ReactElement => {

	const appStore = useStore(AppStore);

	const [transportServices, setTransportServices] = useState([]);

	const [loading, setLoading] = useState(true);

	const loadTransportServices = async() => {
		console.log("Load transport services...");
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };
		  try {	
			const response: AxiosResponse = await client.get(`/transportServices/list` , config);
			setLoading(false);
			console.log(response.status);
			console.log(response.data);  
			setTransportServices(response.data);  
		  } catch(err) {
			console.log(err);
			setLoading(false);
		  }  
		
	};

	const onItemPress = (info: ListRenderItemInfo<TransportService>): void => {
		//console.log("id:::"+transportServices[info.index].name);
		console.log("id:::"+info.item._id);
		console.log(JSON.stringify(info.item._id)); 
		navigation && navigation.navigate("TransportService", { id: info.item._id });
	};

	const renderItemHeader = (info: ListRenderItemInfo<TransportService>): React.ReactElement => (
		
		<CachedImage
				resizeMode="cover"
				style={styles.itemHeader} source={info.item.photos[0]} />
	);

	

	const renderItem = (info: ListRenderItemInfo<TransportService>): React.ReactElement => (
		<Card
			style={[styles.item ,{ backgroundColor: info.item.themeColor}]}
			//emHeader(info)}
			//footer={() => renderItemFooter(info)}
			onPress={() => onItemPress(info)}>
			<Text category="h4" style={{ color: "white", fontFamily: "great-vibes-regular", fontWeight: 800, fontSize: 28 }}>{info.item.name}</Text>
		</Card>
	);

	

	useFocusEffect(
		React.useCallback(() => {
			loadTransportServices()
		  return () => {
			// Do something when the screen is unfocused
			// Useful for cleanup functions
		  };
		}, [])
	);
	

	if (loading) {
		return <ActivityIndicator/>;
	}

	return (
		<View>
			<List
				contentContainerStyle={styles.listContent}
				data={transportServices}
				renderItem={renderItem}/>
		</View>
		
	);
};

const styles = StyleSheet.create({

	parentContainer: {
		flex: 1	
	},
	
	listContent: {
		paddingHorizontal: 0,
		paddingVertical: 0
	},
	item: {
		marginVertical: 18,
	    marginHorizontal: 8
	},
	itemHeader: {
		height: 220,
	},
	itemContent: {
		marginVertical: 8,
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
});
