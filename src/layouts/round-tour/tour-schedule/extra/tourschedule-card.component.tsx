import { Button, Card, Text ,Input} from "@ui-kitten/components";
import React,{useState,useEffect,useRef} from "react";
import { StyleSheet, View, Text as RNText, TouchableOpacity,ScrollView,ActivityIndicator} from "react-native";
import AppStore from "../../../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";
import { toJS } from "mobx";
import {
	MaterialIcons as MDIcon,
    Entypo as Entypo,
	Ionicons as Ionicons,
} from '@expo/vector-icons';

import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import { useRoute } from "@react-navigation/native";

import RBSheet from 'react-native-raw-bottom-sheet';
import { Galeria } from '@nandorojo/galeria'
import { Image } from 'expo-image';
import { format ,add} from 'date-fns'

export const TourScheduleCard = React.forwardRef(({navigation},refStandard) => {

	const appStore = useStore(AppStore);

	const route = useRoute();

    const refStandardConfirmation = useRef();

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

	const onBookingsPress = (): void => {
		navigation.navigate("TourBookings")
	};

	const onDeletePressBck = async() => {
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

    const onEditPress = () => {
		refStandard.current.close();
		navigation.navigate("BusEdit");
	};

	const onDeletePress = () => {
		refStandardConfirmation.current.open();
		
	};

    const deleteBusCancelled = () => {
		refStandardConfirmation.current.close();
	};


	const deleteBusPress = async() => {

    }

	

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
		console.log("useEffect");	
		console.log("schedules:::"+route.params?.index);
			
	});

	
	
	return (
		
		<ScrollView>

			<Card style={{ margin: 10, borderRadius:10}}>	
				<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
					{Number(appStore.tour.noOfDays) > 1 && 
						<Text>{appStore.tour.schedules[route.params?.index].tourStartDate} - {format(add(new Date(appStore.tour.schedules[route.params?.index].tourStartDate), { days: Number(appStore.tour.noOfDays)-1}),'yyyy-MM-dd')}</Text>
					}
					{Number(appStore.tour.noOfDays) == 1 && 
						<Text>{appStore.tour.schedules[route.params?.index].tourStartDate}</Text>
					}
					
				</View>								
			</Card>

			<Card style={{ margin: 10, borderRadius:10}} onPress={onBookingsPress}>	
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Transport Service</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={onBookingsPress}/>
				</View>
			</Card>


			<Card style={{ margin: 10, borderRadius:10}} onPress={onBookingsPress}>	
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Bookings</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={onBookingsPress}/>
				</View>
			</Card>

			<Card style={{ margin: 10, borderRadius:10}} onPress={onBookingsPress}>	
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
                     
                    {appStore.tour.schedules[route.params?.index].vehicleId && (
                        <>
                            <Text>Vehicle</Text>
                             <MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={onBookingsPress}/>
                       </>
                    )}
                    {!appStore.tour.schedules[route.params?.index].vehicleId && (
                        <>
                            <Text style={styles.disbaleText}>Vehicle</Text>
                            <Entypo name="plus" style={styles.itemContentIcon} onPress={onBookingsPress} />
                        </>
                    )}
				</View>
			</Card>

            <Card style={{ margin: 10, borderRadius:10}} onPress={onBookingsPress}>	
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					
					{appStore.tour.schedules[route.params?.index].driverMobileNumber && (
                        <>
                            <Text>Driver</Text>
                            <MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={onBookingsPress}/>
                        </>
                    )}
                    {!appStore.tour.schedules[route.params?.index].driverMobileNumber && (
                      
                       <>
                            <Text style={styles.disbaleText}>Driver</Text>
                            <Entypo name="plus" style={styles.itemContentIcon} onPress={onBookingsPress} />
                        </>
                    )}
				</View>
			</Card>

			

			

			<RBSheet draggable dragOnContent key="busActions" ref={refStandard} height={275}>
			<View style={{ paddingHorizontal: 10}}>
				<View style={{ flexDirection: "row",  justifyContent: 'center' , padding: 5, margin: 5}}>
					<RNText style={{ fontWeight: "500", fontSize: 18}}>Actions</RNText>
				</View>
                 <TouchableOpacity onPress={onDeletePress} style={{ flexDirection: "row",  justifyContent: 'space-between' , margin: 5, padding: 10, borderColor: "grey", borderWidth: 1, borderRadius: 5 }}>
					<MDIcon name="delete" style={styles.deleteItemContentIcon}/>
					<Text>New Schedule</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={onEditPress}/>
				</TouchableOpacity>
				<TouchableOpacity onPress={onEditPress} style={{ flexDirection: "row",  justifyContent: 'space-between' , margin: 5, padding: 10, borderColor: "grey", borderWidth: 1, borderRadius: 5 }}>
					<MDIcon name="edit" style={styles.editItemContentIcon}/>
					<Text>Edit Schedule</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={onEditPress}/>
				</TouchableOpacity>

				<TouchableOpacity onPress={onDeletePress} style={{ flexDirection: "row",  justifyContent: 'space-between' , margin: 5, padding: 10, borderColor: "grey", borderWidth: 1, borderRadius: 5 }}>
					<MDIcon name="delete" style={styles.deleteItemContentIcon}/>
					<Text>Cancel Schedule</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={onEditPress}/>
				</TouchableOpacity>

                
			</View>

			<RBSheet draggable dragOnContent key="busDeleteConfirmation" ref={refStandardConfirmation} height={300}>
				<View style={{ paddingHorizontal: 10}}>
					<View style={{ flexDirection: "row",  justifyContent: 'center' , padding: 5, margin: 5}}>
						<RNText style={{ fontWeight: "500", fontSize: 18}}>Confirmation</RNText>
					</View>
					
					<Text style={{ padding: 5 }}>Are you sure?  You want to delete Bus</Text>
						
					<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
							<Button size="large" style={{ flex: 3 , margin: 5, backgroundColor: "#D69200" , borderRadius:50, margin: 10, borderColor: "#D69200" }} onPress={deleteBusCancelled} >Cancel</Button>
							<Button size="large" style={{ flex: 3 , margin: 5, backgroundColor: "#B12048", borderRadius:50, margin: 10, borderColor: "#B12048"}} onPress={deleteBusPress}>Delete</Button>
					</View>
				</View>
			</RBSheet>
		</RBSheet>
			
		</ScrollView>
		
		
		
	);
});

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
    disbaleText: {
		fontSize: 16,
		color: '#b1b0abff',
	},
    editItemContentIcon: {
		fontSize: 20,
		color: '#D69200',
	},
	deleteItemContentIcon: {
		fontSize: 20,
		color: '#B12048',
	}
	
	
});
