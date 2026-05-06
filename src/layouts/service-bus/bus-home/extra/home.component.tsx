import { BottomNavigation, BottomNavigationTab, Card, Layout, List, Text } from "@ui-kitten/components";
import React,{useState,useEffect,useContext} from "react";
import { ImageBackground, ListRenderItemInfo, StyleSheet, View , ScrollView,Image, TouchableOpacity} from "react-native";

import { HomeOutlineIcon, PersonOutlineIcon } from "../../../../components/icons";

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import { SafeAreaProvider } from "react-native-safe-area-context";

import { BrandBottomNavigation } from "../../../../components/brand-bottom-navigation.component";

import AppStore from "../../../../store/AppStore";
import { toJS } from "mobx";
import { observer} from "mobx-react";
import { useStore } from "mobx-store-provider";
import { ITEM_WIDTH } from "../../location-add";




const HomeComponent = ({ navigation }): React.ReactElement => {

	const appStore = useStore(AppStore);

	const BASE_URL = 'https://routes.lk:7007';
	const client = axios.create({
		baseURL: BASE_URL,
		timeout: 500000,
	});

	const [loading, setLoading] = useState(true);

	const [selectedIndex, setSelectedIndex] = React.useState(0);

	const onStaffBusPress = (): void => {
		appStore.bus.setRouteType("staff-service");
		navigation.navigate("BusList", {reload: true});
	};

	const onSchoolBusPress = (): void => {
		appStore.bus.setRouteType("school-service");
		navigation.navigate("BusList", {reload: true});
	};

	const onRouteBusPress = (): void => {
		appStore.bus.setRouteType("route");
		navigation.navigate("RouteBusList", {reload: true});
	};

	const onTourBusPress = (): void => {
		appStore.bus.setRouteType("tour");
		navigation.navigate("TourList", {reload: true});
	};

	const onSelect = (index: number): void => {
		if(index == 1)
			navigation.navigate("UserProfile");
	};

	const loadProfile = async() => {
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			} as RawAxiosRequestHeaders,
		  };
		  try {
			//console.log("params.id:"+route.params.id);
			//console.log(JSON.stringify(route));
			const response: AxiosResponse = await client.get('/users/'+appStore.user.mobileNumber , config);
			
			if(response.data.success == "true"){
				appStore.user.setName(response.data[0].name);
				appStore.user.setMobileNumber(response.data[0].mobileNumber);
			}
			
			console.log(JSON.stringify(response.data)); 
		} catch(err) {
			console.log(err);
		}
	}

	useEffect(() => {
		
		const fetch = async ()=>{
			await loadProfile();
		}

		fetch();	

	}, []);


	return (
		<SafeAreaProvider>
			
			<View style={styles.parentContainer} > 
			
			<Card style={styles.item} onPress={()=>onStaffBusPress()}>
				<TouchableOpacity style={styles.image}  onPress={()=>onStaffBusPress()}>
					<Image source={require("./../../../../assets/images/routeslk/staff-bus.png")}/>
				</TouchableOpacity>
				<Text category="h5">Staff Bus</Text>
			</Card>
			<Card style={styles.item} onPress={()=>onStaffBusPress()}>
				<TouchableOpacity style={styles.image}  onPress={()=>onSchoolBusPress()}>
					<Image source={require("./../../../../assets/images/routeslk/school-bus.png")}/>
				</TouchableOpacity>
				<Text category="h5">School Bus</Text>
			</Card>
			<Card style={styles.item} onPress={()=>onTourBusPress()}>
				<TouchableOpacity style={styles.image}  onPress={()=>onTourBusPress()}>
					<Image source={require("./../../../../assets/images/routeslk/staff-bus.png")}/>
				</TouchableOpacity>
				<Text category="h5">Round Tours</Text>
			</Card>
			<Card style={styles.item} onPress={()=>onRouteBusPress()}>
				<TouchableOpacity style={styles.image}  onPress={()=>onRouteBusPress()}>
					<Image source={require("./../../../../assets/images/routeslk/staff-bus.png")}/>
				</TouchableOpacity>
				<Text category="h5">Route Bus</Text>
			</Card>
			</View>
			<View style={{ marginBottom: 0 }}>
				<BottomNavigation
					appearance="noIndicator"
					selectedIndex={selectedIndex}
					onSelect={onSelect}>
					<BottomNavigationTab title='Home'
						icon={HomeOutlineIcon}/>
					<BottomNavigationTab title='Profile'
						icon={PersonOutlineIcon}/>
					</BottomNavigation>
			</View>
			
		</SafeAreaProvider>
		
		
		
	);
	
};

const styles = StyleSheet.create({

	parentContainer: {
		flexWrap: "wrap",
		alignSelf: "center",
		flex: 1	
	},
	
	
	item: {
		alignSelf: "center",
		marginVertical: 15,
	    marginHorizontal: 5
	},
	image: {
		alignSelf: "center"	
	}
});

export default observer(HomeComponent);
