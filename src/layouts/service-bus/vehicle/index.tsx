import { Button, Card, Text ,Input} from "@ui-kitten/components";
import React,{useState,useEffect,useRef} from "react";
import { StyleSheet, View, Modal, TextInput,ScrollView,ActivityIndicator} from "react-native";
import AppStore from "../../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";
import { toJS } from "mobx";
import {
	MaterialIcons as MDIcon,
	Ionicons as Ionicons,
} from '@expo/vector-icons';

import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import { useRoute } from "@react-navigation/native";

import RBSheet from 'react-native-raw-bottom-sheet';
import { Galeria } from '@nandorojo/galeria'
import { Image } from 'expo-image';


const TransportService = ({ navigation }): React.ReactElement => {

	const appStore = useStore(AppStore);

	const route = useRoute();

	const [loading, setLoading] = useState(true);

	const refRBSheetDeleteConfirm = useRef();

	const refRBSheetNameEdit = useRef();

	const refRBSheetAddressEdit = useRef();

	const refRBSheetOfficeNumberEdit = useRef();

	const [nameErrorMessage, setNameErrorMessage] = React.useState<string>("");

	const [ownersErrorMessage, setOwnersErrorMessage] = React.useState<string>("");

	const [busesErrorMessage, setBusesErrorMessage] = React.useState<string>("");

	const [vehiclesErrorMessage, setVehiclesErrorMessage] = React.useState<string>("");


	const client = axios.create({
		baseURL: 'https://routes.lk:7007'
	});

	const [showModal, setShowModal] = useState(false);

	const isValidValues = (): any => {
		
		var inputValid =true;

		if(!appStore.transportService.name){
			setNameErrorMessage("Name is mandatory");	
			inputValid =false;
		}
		if(appStore.transportService && appStore.transportService.owners && appStore.transportService.owners.length < 1){
			setOwnersErrorMessage("At least 1 owner should be there");
			inputValid =false;	
		}

		return inputValid;
	}

	const onSelectColor = ({ hex }) => {
		console.log(hex);
		appStore.transportService.setThemeColor(hex);
	};


	
	const onUpdatePress = async() => {
		console.log(JSON.stringify(toJS(appStore.transportService)));	

		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };
		  try {
			  if(isValidValues()){
				const response: AxiosResponse = await client.post(`/transportServices/update/`, appStore.transportService , config);
				console.log(response.status);
				console.log(response.data.json); 
				appStore.transportService.reset();
				navigation && navigation.navigate("TransportServiceList");
			  }
		  } catch(err) {
			console.log(err);
		  }  
	}

	const onDeletePress = async() => {
		console.log(JSON.stringify(toJS(appStore.transportService)));	

		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };
		  try {
			  const response: AxiosResponse = await client.delete(`/transportServices/`+appStore.transportService.id , config);
			  console.log(response.status);
			  console.log(response.data.json); 
			  appStore.transportService.reset();
			  navigation && navigation.navigate("TransportServiceList");
		  } catch(err) {
			console.log(err);
		  }  
	}

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
			const userId = appStore.user.mobileNumber;
			const response: AxiosResponse = await client.get(`/transportServices/`+route.params.id , config);
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

	

	const onTransportServiceDeleteCancel = () => {
		refRBSheetDeleteConfirm.current.close();
	};

	const onEditNamePress = () => {
		setNameErrorMessage("");
		refRBSheetNameEdit.current.close();
	};

	const onEditAddressPress = () => {
		refRBSheetAddressEdit.current.close();
	};

	const onEditOfficeNumberPress = () => {
		refRBSheetOfficeNumberEdit.current.close();
	};

	

	const onOwnersPress = () => {
		setOwnersErrorMessage("");
		navigation.navigate("TransportserviceOwners")
	};

	const onBusesPress = () => {
		setBusesErrorMessage("");
		navigation.navigate("BusList")
	};

	const onVehiclesPress = () => {
		setVehiclesErrorMessage("");
		navigation.navigate("TransportServiceVehicles");
	};

	useEffect(() => {
	
		const fetch = async ()=>{
			await loadTransportService();
			setLoading(false);
		}

		fetch();	


	}, []);

	if (loading) {
		return <ActivityIndicator />;
	}
	
	return (
		
		<ScrollView>
			
			<View>
				<Card key={appStore.vehicle.id} style={styles.item}>	
			<View style={{paddingTop: 10, flexDirection: "row", justifyContent: "space-between"}}>
							{appStore.vehicle.regNumber && (
				<Button appearance='ghost'  size="small"  style={{ borderColor:"#142169", borderWidth: 2}} >{appStore.vehicle.regNumber}</Button>
				)}	
				<Button  size="small"  style={{ borderColor:"#142169", borderWidth: 2}} >{appStore.vehicle.noOfSeats} Seats</Button>
			</View>
			
			<Galeria urls={appStore.vehicle.photos}>
					<Galeria.Image>
						<Image contentFit="cover" source={appStore.vehicle.photos[0]} style={styles.itemHeader} />
					</Galeria.Image>	
			</Galeria>

			<View style={{paddingTop: 10, flexDirection: "row", justifyContent: "space-between"}}>
				<Text category="h5">{appStore.vehicle.title}</Text>
			</View>
			
		</Card>

				
				
			</View>
			
			<Card style={{ margin: 10, borderRadius:10}} onPress={onBusesPress}>	
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Tours</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={onBusesPress}/>
				</View>
				{busesErrorMessage!="" && (
					<Text style={styles.errorLabel}>{busesErrorMessage}</Text>	
				)}
			</Card>
			

			<View style={{flexDirection: "row", justifyContent: "space-between"}}>
				<Button size="giant" style={{ flex: 3 , borderRadius:50, margin: 10, borderColor: "#D69200", backgroundColor: "#D69200"}} onPress={()=>onUpdatePress()}>Update</Button>
			</View>

			<View style={{flexDirection: "row", justifyContent: "space-between"}}>
			<Button appearance='ghost' onPress={()=> refRBSheetDeleteConfirm.current.open()} style={{ flex: 3 , borderRadius:50, margin: 10, borderColor:"#B12048", borderWidth: 2 }}>
				Delete
			</Button>
			</View>

			

			<RBSheet draggable dragOnContent key="deleteConfirm" ref={refRBSheetDeleteConfirm} height={200}>
				<View>
					<Text style={{ margin: 10}} >Are you sure, you want to delete vehicle ?</Text>
					
					<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
						<Button style={{ flex: 1, borderRadius:50, margin: 10,borderColor:"#142169" }} appearance='ghost' size="large" onPress={onTransportServiceDeleteCancel}>Cancel</Button>
						<Button style={{ flex: 1, borderRadius:50, margin: 10, borderColor:"#B12048", backgroundColor:"#B12048"}} size="large" onPress={onDeletePress}>Confirm</Button>
					</View>
				</View>
			</RBSheet>
			
		</ScrollView>
		
		
		
	);
};

const styles = StyleSheet.create({
	errorLabel: {
		color: "#8B0000", 
		fontSize:12,
		padding: 10
	},
	label: {
		color:"#142169"
	},
	labelContainer: {
        backgroundColor: "white", // Same color as background
        alignSelf: "flex-start", // Have View be same width as Text inside
        paddingHorizontal: 3, // Amount of spacing between border and first/last letter
        marginStart: 10, // How far right do you want the label to start
        zIndex: 1, // Label must overlap border
        elevation: 1, // Needed for android
        shadowColor: "white", // Same as background color because elevation: 1 creates a shadow that we don't want
        position: "absolute", // Needed to be able to precisely overlap label with border
        top: -12, // Vertical position of label. Eyeball it to see where label intersects border.
    },
    inputContainer: {
		flex: 1,
		flexDirection: "row", 
		justifyContent: "space-between",
		borderColor: "#142169",
        borderWidth: 1, // Create border
        borderRadius: 8, // Not needed. Just make it look nicer.
        padding: 8, // Also used to make it look nicer
        zIndex: 0, // Ensure border has z-index of 0
    },
	item: {
		marginVertical: 8,
		padding: 0,
	},
	itemContentIcon: {
		fontSize: 20,
		color: '#666',
	},
	itemHeader: {
		height: 220,
	},
	
	
});

export default observer(TransportService);
