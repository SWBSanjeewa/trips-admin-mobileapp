import { TopNavigation, TopNavigationAction ,OverflowMenu, MenuItem , Icon, IconElement } from "@ui-kitten/components";
import React,{useEffect,useState} from "react";
import { StyleSheet,View, Alert } from "react-native";

import { ArrowIosBackIcon } from "../../components/icons";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
//import ContentView from "../../layouts/auth/bus";


import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { BusDetailsScreen } from "../auth/busdetails.component";
import { BusJourneyScreen } from "../auth/busjourney.component";
import { BusReturnJourneyScreen } from "../auth/busreturnjourney.component";
import { BusPassengersScreen } from "../auth/buspassengers.component";

import { useRoute } from "@react-navigation/native"
import AppStore from "../../store/AppStore";
import { useStore } from "mobx-store-provider";

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import {
	MaterialIcons as MDIcon,
} from '@expo/vector-icons';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import AntDesign from '@expo/vector-icons/AntDesign';


const TopTab = createMaterialTopTabNavigator();

export const BusScreen = ({ navigation }): React.ReactElement => {

	const client = axios.create({
		baseURL: 'https://routes.lk:7007'
	});

	const appStore = useStore(AppStore);

	const [busnew, setBusnew] = useState([]);

	const [menuVisible, setMenuVisible] = React.useState(false);

	const [loading, setLoading] = useState(true);

	const route = useRoute();

	const loadBusses2 = async() => {
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			} as RawAxiosRequestHeaders,
		  };
		  try {
			console.log("params.id:"+route.params.objectId);
			console.log(JSON.stringify(route));
			const response: AxiosResponse = await client.get('/buses/'+route.params.objectId , config);
			console.log(response.status);
			console.log("Bus from id:"+response.data); 
			console.log(JSON.stringify(response.data)); 
			appStore.bus.populate(response.data);
			if(response.data.journey != null){
				response.data.journey.stoppings.forEach(element => {
					appStore.bus.addJourneyStopping( element.place,
					Number(element.latitude),
					Number(element.longitude),
					element.location,
					element.time,
					)
					});
		    }
			if(response.data.returnJourney != null){
				response.data.returnJourney.stoppings.forEach(element => {
					appStore.bus.addReturnJourneyStopping( element.place,
					Number(element.latitude),
					Number(element.longitude),
					element.location,
					element.time,
					)
					});
		    }
			if(response.data.passengers != null){
				response.data.passengers.forEach(element => {
					appStore.bus.addPassenger( element.name,
					element.mobileNumber,
					Number(element.journeyStartsLatitude),
					Number(element.journeyStartsLongitude),
					)
					});
		    }
			setBusnew(response.data);  
			//console.log(JSON.stringify(toJS(newBusStore)));
		  } catch(err) {
			console.log(err);
		  }  
		
	};

	useEffect(() => {
		console.log("Bus::"+JSON.stringify(route));
		//loadBusses();
		//setTimeout(() => setLoading(false), 5000);
	}, []);

	const toggleMenu = (): void => {
		setMenuVisible(!menuVisible);
	};

	const MenuIcon = (props): IconElement => (
		<MaterialIcons name="more-vert" size={24} color="black" />
	  );
	  
	  const EditIcon = (props): IconElement => (
		<AntDesign name="edit" size={20} color="#D69200" />
	  );
	  
	  const DeleteIcon = (props): IconElement => (
		<AntDesign name="delete" size={20} color="red" />
	  );

	  const renderMenuAction = (): React.ReactElement => (
		<TopNavigationAction
		  icon={MenuIcon}
		  onPress={toggleMenu}
		/>
	  );

	  const onGoBack = (index): void => {
		appStore.bus.reset();
		navigation.goBack();
	  };

	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={onGoBack} />
	);

	const onDeletePress = async() => {
		
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			} as RawAxiosRequestHeaders,
		  };
		  try {
			console.log("Calling delete rest..."+route.params.id); 
			const response: AxiosResponse = await client.delete(`/buses/`+route.params.id );
			console.log(response.status);
			console.log(response.data.json); 
			console.log("Submitting..."); 
			appStore.bus.reset();
			navigation && navigation.navigate("BusHome");
		  } catch(err) {
			console.log(err);
		  }  
		
	};

	const onDeleteItem = (): void => {
		
		Alert.alert('Delete Bus confirmation', appStore.bus.title, [
			{
			  text: 'Cancel',
			  onPress: () => console.log('Cancel Pressed'),
			  style: 'cancel',
			},
			{text: 'OK', onPress: () => {
				console.log("Deleting...");
				onDeletePress();
			  }},
		  ]);
	};

	const onItemSelect = (index): void => {
		if(index==1)
		  navigation.navigate("BusEdit",{ "id": route.params.id})
		if(index==2)
		  onDeleteItem();
		setMenuVisible(false);
	  };

	const renderOverflowMenuAction = (): React.ReactElement => (
		<OverflowMenu
		  anchor={renderMenuAction}
		  visible={menuVisible}
		  onBackdropPress={toggleMenu}
		  onSelect={onItemSelect}
		>
		  <MenuItem
			accessoryLeft={EditIcon}
			title='Edit'
			
		  />
		  <MenuItem
			accessoryLeft={DeleteIcon}
			title='Delete'
		  />
		</OverflowMenu>
	  );

	
	return (
		<SafeAreaLayout style={styles.container} insets="top">
			
			<TopNavigation title="Bus" accessoryLeft={renderBackAction} accessoryRight={renderOverflowMenuAction}/>
			
			<TopTab.Navigator

			   style={{  paddingTop: 20}}
			   sceneContainerStyle={{ flex: 1, paddingTop:5, borderColor:"red" }}
			   screenOptions={{
					tabBarLabelStyle: { fontSize: 12 , textTransform: 'none'},
					tabBarActiveTintColor:'#142169',
					tabBarInactiveTintColor: "black",
					tabBarIndicatorStyle: { backgroundColor:"#142169" }
			    }}
				
			 
			  >
				<TopTab.Screen name="Details"  component={BusDetailsScreen} initialParams={{id: route.params.id}} />
				<TopTab.Screen name="Journey" component={BusJourneyScreen} initialParams={{id: route.params.id, latitude: route.params.journeyStartLatitude,  longitude: route.params.journeyStartLongitude}}/>
				<TopTab.Screen name="Return" component={BusReturnJourneyScreen} initialParams={{id: route.params.id, latitude: route.params.returnJourneyStartLatitude,  longitude: route.params.returnJourneyStartLongitude}}/>
				<TopTab.Screen name="Passengers" component={BusPassengersScreen} initialParams={{id: route.params.id}}/>
			</TopTab.Navigator>
			
		</SafeAreaLayout>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});