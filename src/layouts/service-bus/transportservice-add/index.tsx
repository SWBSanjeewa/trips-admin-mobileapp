import { Button, Card, Text } from "@ui-kitten/components";
import React,{useState,useEffect} from "react";
import { StyleSheet, View, Modal, TextInput,ScrollView} from "react-native";
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


const TransportServiceAdd = ({ navigation }): React.ReactElement => {

	const appStore = useStore(AppStore);

	const [nameFocus, setNameFocus] = React.useState<boolean>(false);
	const [nameErrorMessage, setNameErrorMessage] = React.useState<string>("");
	const nameCustomStyle = nameFocus ? styles.inputContainerFocus : styles.inputContainer;

	const [addressFocus, setAddressFocus] = React.useState<boolean>(false);
	const addressCustomStyle = addressFocus ? styles.inputContainerFocus : styles.inputContainer;

	const [officeNumberFocus, setOfficeNumberFocus] = React.useState<boolean>(false);
	const officeNumberCustomStyle = officeNumberFocus ? styles.inputContainerFocus : styles.inputContainer;

	const [ownerErrorMessage, setOwnerErrorMessage] = React.useState<string>("");

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
			setOwnerErrorMessage("At least 1 owner should be there");
			inputValid =false;	
		}

		return inputValid;
	}

	const onSelectColor = ({ hex }) => {
		console.log(hex);
		appStore.transportService.setThemeColor(hex);
	};

	
	const onCreatePress1 = async() => {
		isValidValues()
		console.log(JSON.stringify(toJS(appStore.transportService)));	
	}

	const onCreatePress = async() => {
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };
		  try {
			  if(isValidValues()){
				console.log("##### "+JSON.stringify(toJS(appStore.transportService)));	
				const response: AxiosResponse = await client.post(`/transportServices/create`, appStore.transportService , config);
				console.log(response.status);
				console.log(response.data.json); 
				appStore.transportService.reset();
				navigation && navigation.navigate("TransportServiceList");
			  }
		  } catch(err) {
			console.log(err);
		  }  
	}
	
	return (
		
		<ScrollView>
			
			<View>
				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>Name</Text>
					</View>
					<View style={nameCustomStyle}>
						<TextInput style={styles.captionText} placeholder="Janaka Express" onChangeText={appStore.transportService.setName} value={appStore.transportService.name} onFocus={() => setNameFocus(true)} onBlur={() => setNameFocus(false)} />
						<Ionicons name="color-palette-sharp" size={18} color={appStore.transportService.themeColor} onPress={() => setShowModal(true)}/>
					</View>	
					{nameErrorMessage!="" && (
						<Text style={styles.errorLabel}>{nameErrorMessage}</Text>	
					)}
				</View>
				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>Address</Text>
					</View>
					<View style={addressCustomStyle}>
						<TextInput placeholder="Homagama" onChangeText={appStore.transportService.setAddress} value={appStore.transportService.address} />
					</View>
				</View>
				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>Office Number</Text>
					</View>
					<View style={officeNumberCustomStyle}>
						<TextInput placeholder="0112XXXXXX" onChangeText={appStore.transportService.setOfficeNumber} value={appStore.transportService.officeNumber} />
					</View>
				</View>
				
			</View>
			
			<Modal visible={showModal} animationType='slide'>
				<ColorPicker style={{ width: '90%' , paddingTop: 200, paddingLeft: 50 }} value='red' onComplete={onSelectColor}>
					<Preview />
					<Panel1 />
					<HueSlider />
					<OpacitySlider />
					<Swatches />
					<Button style={{ paddingHorizontal: 50}} onPress={() => setShowModal(false)}>Set as theme color</Button>
				</ColorPicker>
			</Modal>

			<Card style={{ margin: 10, borderRadius:10}} onPress={() => navigation.navigate("TransportServiceVehicles")}>	
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Vehicles</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("TransportserviceVehicles")}/>
				</View>
				{vehiclesErrorMessage!="" && (
					<Text style={styles.errorLabel}>{vehiclesErrorMessage}</Text>	
				)}
			</Card>
			
			<Card style={{ margin: 10, borderRadius:10}} onPress={() => navigation.navigate("TransportserviceOwners")}>	
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Owners</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("TransportserviceOwners")}/>
				</View>
				{ownerErrorMessage!="" && (
					<Text style={styles.errorLabel}>{ownerErrorMessage}</Text>	
				)}
			</Card>

			<Card style={{ margin: 10, borderRadius:10}} onPress={() => navigation.navigate("TransportServiceDrivers")}>
				
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Drivers</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("TransportServiceDrivers")}/>
				</View>
			</Card>
			

			<View style={{flexDirection: "row", justifyContent: "space-between"}}>
				<Button size="giant" style={{ flex: 3 , margin: 5, borderRadius:50, margin: 10}} onPress={()=>onCreatePress()}>Create</Button>
			</View>
			
		</ScrollView>
		
		
		
	);
};

const styles = StyleSheet.create({
	errorLabel: {
		color: "#8B0000", 
		fontSize:12,
		padding: 10
	},
	captionText: {
		fontFamily: 'opensans-regular',
		color: '#333',
		flex: 1 
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
		borderColor: "#ddd",
        borderWidth: 1, // Create border
        borderRadius: 8, // Not needed. Just make it look nicer.
        padding: 8, // Also used to make it look nicer
        zIndex: 0, // Ensure border has z-index of 0
    },
	inputContainerFocus: {
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
	}
	
});

export default observer(TransportServiceAdd);
