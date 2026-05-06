import { Button, Card, Layout, List, Select, SelectItem, Text,Avatar, TopNavigation, TopNavigationAction, Input } from "@ui-kitten/components";
import React,{useState,useEffect,useRef} from "react";
import { useRoute } from "@react-navigation/native"
import { StyleSheet, View ,Text as RNText} from "react-native";
import { Passenger,Owner } from "./extra/data";
import AppStore from "../../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";
import { CachedImage } from '@georstat/react-native-image-cache';
import { toJS } from "mobx";
import { SafeAreaLayout } from "../../../components/safe-area-layout.component";
import RBSheet from 'react-native-raw-bottom-sheet';
import { ArrowIosBackIcon } from "../../../components/icons";
import {
	MaterialIcons as MDIcon,
	Ionicons as Ionicons,
} from '@expo/vector-icons';
import { PlusOutlineIcon } from "../../../components/icons";
import AntDesign from '@expo/vector-icons/AntDesign';

import { RoutesValidationService } from "../../../services/routes-validation.service";
import ImageLoad from "../image-load/index";
import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

const BusDriversAdd = ({ navigation }): React.ReactElement => {

	const route = useRoute();

	const appStore = useStore(AppStore);
	
	const [loading, setLoading] = useState(true);
	
	const client = axios.create({
		baseURL: 'https://routes.lk:7007'
	});

	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
	);

	const loadTransportService = async() => {
		console.log("loadTransportService");
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };
		  try {
			console.log("appStore.user.accessToken::"+appStore.user.accessToken);
			
			const response: AxiosResponse = await client.get(`/transportServices/`+appStore.bus.transportServiceId , config);
			console.log(response.status);
			console.log(JSON.stringify(response.data)); 
			appStore.transportService.populate(response.data);
			//setTransportService(response.data);
			//setBusses(response.data); 
			//var owner = isBusOwner(); 
			//console.log("Is owner::"+owner);
		  } catch(err) {
			console.log(err);
		  }  
		
	};

	useEffect(() => {
		const fetch = async ()=>{
			await loadTransportService();
			setLoading(false);
		}

		fetch();	

	}, []);


	const onActionsPress = (info): void => {
		var driverFound = false;
		appStore.bus.drivers.forEach(function (item){
			console.log("item:"+item.mobileNumber);
			if (item.mobileNumber == info.mobileNumber) {
				driverFound = true;
				appStore.bus.deleteDriver(info.mobileNumber);
			}
		});
		if(!driverFound){
			appStore.bus.addDriver(info.name, info.mobileNumber);
		}
		
	};

	

	const renderItem = (info): React.ReactElement => (
		//{appStore.bus.drivers.map(function(infobus, indexbus){
		<Card key={info.mobileNumber} style={styles.item} onPress={()=>onActionsPress(info)}>
			<View style={{ flexDirection: "row",  justifyContent: 'flex-start', margin: 2}}>
					<View style={{ padding: 5}}>
					<ImageLoad
							style={{ width: 45, height: 45 }}
							loadingStyle={{ size: 'large', color: 'blue' }}
							source={"https://routes.lk:7007/users/"+info.mobileNumber+"/profile-photo.jpg" }
							name={info.name}/>
					</View>
					<View style={{ padding: 5}}>
						<Text>{info.name}</Text>
						<Text>{info.mobileNumber}</Text>
					</View>
				</View>
		</Card>
	);


	

	const renderItemSelected = (info): React.ReactElement => (
		//{appStore.bus.drivers.map(function(infobus, indexbus){
		<Card key={"selected_"+info.mobileNumber} style={styles.itemSelected} onPress={()=>onActionsPress(info)}>
			<View style={{ flexDirection: "row",  justifyContent: 'flex-start', margin: 2}}>
					<View style={{ padding: 5}}>
					<ImageLoad
							style={{ width: 45, height: 45 }}
							loadingStyle={{ size: 'large', color: 'blue' }}
							source={"https://routes.lk:7007/users/"+info.mobileNumber+"/profile-photo.jpg" }
							name={info.name}/>
					</View>
					<View style={{ padding: 5}}>
						<Text>{info.name}</Text>
						<Text>{info.mobileNumber}</Text>
					</View>
				</View>
		</Card>
	);

	return (
		
		<SafeAreaLayout style={styles.container} insets="top">
			<TopNavigation title={props => (
				<RNText {...props} style={{fontWeight: "500", fontSize: 18}}>
				Bus Drivers Add
				</RNText>)} accessoryLeft={renderBackAction} />
			
				<View style={{ paddingHorizontal: 10 }}>
				{appStore.transportService.drivers.map(function(info, index){
					console.log(info.mobileNumber);
					var driverFound = false;
					appStore.bus.drivers.forEach(function (item){
						console.log("item:"+item.mobileNumber);
						if (item.mobileNumber == info.mobileNumber) {
							console.log("Driver found:");
							driverFound = true;
						}
					});
					if(!driverFound){
						return renderItem(info);
					}else{
						return renderItemSelected(info);
					}
					
				})}	
				</View>
		</SafeAreaLayout>	
		
	);
};

const styles = StyleSheet.create({

	container: {
		flex: 1,
	},
	listContent: {
		paddingHorizontal: 32,
		paddingVertical: 8,
	},
	button: {
		marginVertical: 8,
	},
	addButton: {
		marginVertical: 8,
		alignSelf: "flex-end"
	},

	item: {
		marginVertical: 8,
		padding: 0,
	},

	itemSelected: {
		marginVertical: 8,
		padding: 0,
		borderWidth: 1,
		borderColor: "blue"

	},
	
	itemContent: {
		marginVertical: 8,
	},
	itemContentIcon: {
		fontSize: 20,
		color: '#666',
	}
	
});

export default observer(BusDriversAdd);
