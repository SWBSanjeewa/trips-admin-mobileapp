import { Button, Card, Text,CheckBox,Select,SelectItem,IndexPath ,Layout, TabView, Tab} from "@ui-kitten/components";
import React,{useRef,useState,useEffect} from "react";
import { StyleSheet, View, TouchableOpacity, TextInput,ActivityIndicator,Dimensions, ScrollView} from "react-native";
import AppStore from "../../../store/AppStore";
import { useFocusEffect } from '@react-navigation/native';
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";
import { toJS } from "mobx";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRoute } from "@react-navigation/native"

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import RBSheet from 'react-native-raw-bottom-sheet';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { vehcileTypes, getVehicleColor}  from "../../../app/routes-common";
import { Galeria } from '@nandorojo/galeria';
import { Image } from 'expo-image';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import VehiclePhotosAddCard from "../vehicle-photos-add/extra/vehiclephotos-add-card.component";
import { VehicleLayoutSuggestions}  from "./extra/vehicle-layout-auto-suggestions";
import vehicle from "../vehicle";

export default observer(React.forwardRef(({ navigation,addCallback, add },ref) => {

	const appStore = useStore(AppStore);
	const BASE_URL = 'https://routes.lk:7007';
	const route = useRoute();

	const [initialised, setInitialised] = React.useState<boolean>(false);

	const [vehicles, setVehicles] = useState([]); 
	const [loading, setLoading] = useState(true);

	const [edit, setEdit] = useState(false);

	const { width, height } = Dimensions.get("window");

	const [vehicleIndex, setVehicleIndex] = React.useState<string>("");

	const [title, setTitle] = React.useState<string>("");
	const [titleFocus, setTitleFocus] = React.useState<boolean>(false);
	const titleCustomStyle = titleFocus ? styles.inputContainerFocus : styles.inputContainer;
	const [titleErrorMessage, setTitleErrorMessage] = React.useState<string>("");

	const [regNoFocus, setRegNoFocus] = React.useState<boolean>(false);
	const regNoCustomStyle = regNoFocus ? styles.inputContainerFocus : styles.inputContainer;

	const [registrationNumberErrorMessage, setRegistrationNumberErrorMessage] = React.useState<string>("");
	
	const [photosErrorMessage, setPhotosErrorMessage] = React.useState<string>("");

	const refRBSheetActions = useRef();
	
	const refRBSheetDeleteConfirm = useRef();

	const [selectedIndex, setSelectedIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const vehcileType = vehcileTypes[selectedIndex.row];
	
	
	const client = axios.create({
		baseURL: BASE_URL
	});

	const isValidValues = (): any => {
		
		var inputValid =true;

		if(title==""){
			setTitleErrorMessage("Title is mandatory");	
			inputValid =false;
		}

		return inputValid;
	}

	
	const onCreatePress = async() => {
		
		isValidValues()
	
		const config: AxiosRequestConfig = {
			headers: {
				'Accept': 'application/json',
				'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		};

		try {
			console.log("##### "+JSON.stringify(toJS(appStore.vehcleSeatLayout)));	
			console.log("/vehcleSeatLayouts/create");
			const response: AxiosResponse = await client.post(`/vehicleSeatLayouts/create`,appStore.vehcleSeatLayout , config);
			if(response.status == 200){
				setLoading(true);
				loadVehicleSeatLayouts();
			}
			addCallback(false);
			
			
		} catch(err) {
			console.log(err);
		}
	}

	const loadVehicles = async() => {
			console.log("#### loadVehicles ####");
			const config: AxiosRequestConfig = {
				headers: {
					'Accept': 'application/json',
					'token': appStore.user.accessToken
				} as RawAxiosRequestHeaders,
				};
				try {	
				console.log(`/transportServices/`+ appStore.transportService.id+`/vehicles`);
				const response: AxiosResponse = await client.get(`/transportServices/`+ appStore.transportService.id+`/vehicles`, config);
				setLoading(false);
				//console.log(response.status);
				//console.log("vehicles:::::"+response.data.vehicles);  
				setVehicles(response.data.vehicles);  
				response.data.vehicles.forEach(vehicle => {
					appStore.vehicles.addVehicle(vehicle)
				});
				
				
				//console.log(JSON.stringify(response.data));
				} catch(err) {
				console.log(err);
				setLoading(false);
				}  
			
	};

	

	

	
	const onAddClosePress = (): void => {		
		addCallback(false);
	};

	const onEditClosePress = (): void => {		
		setEdit(false);
		appStore.vehicle.reset();
	};

	
	const onEditPress = async() => {
		setEdit(true);
		refRBSheetActions.current.close();
	};

	const onDeletePress = (): void => {
		refRBSheetDeleteConfirm.current.open()
	};

	

	const onUpdatePress = async() => {
		
		isValidValues()
	
		const config: AxiosRequestConfig = {
			headers: {
				'Accept': 'application/json',
				'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		};


		try {
			
			const response: AxiosResponse = await client.put("/transportServices/"+appStore.transportService.id+"/vehicles/"+appStore.vehicle.regNumber+"/update", appStore.vehicle, config);
			if(response.status == 200){
				setLoading(true);
				loadVehicleSeatLayouts();
				setEdit(false);
			}
			
			
		} catch(err) {
			console.log(err);
		}

	}



	const onDeleteConfirmCancelPress = (): void => {
		refRBSheetDeleteConfirm.current.close()
	};

	
	const onDeleteConfirmPress = async() => {
		
		
		const config: AxiosRequestConfig = {
			headers: {
				'Accept': 'application/json',
				'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		};

		try {
			
			const response: AxiosResponse = await client.delete(`/vehicleSeatLayouts/`+selectedVehicleSeatLayoutId , config);
			if(response.status == 200){
				setLoading(true);
				loadVehicleSeatLayouts();
			}
			
			
		} catch(err) {
			console.log(err);
		}
		refRBSheetDeleteConfirm.current.close();
	}

	
	const onVehicleLongPress = (vehicle,index): void => {
		setVehicleIndex(index);
		appStore.vehicle.setTitle(vehicle.title);
		appStore.vehicle.setRegNumber(vehicle.regNumber);
		appStore.vehicle.setId(vehicle.id);
		console.log("photos size:"+vehicle.photos.length);
		vehicle.photos.forEach(photo => {
			appStore.vehicle.addPhoto(BASE_URL+photo);
		});
		refRBSheetActions.current.open();
	}

	const onItemPress = (info): void => {
		console.log(">>>"+info);
		//JSON.stringify(info);
		
		if(route.params?.viewFrom == "tour-schedule"){
			appStore.tour.schedules[route.params?.index].setVehicleId(info.regNumber);
			navigation && navigation.navigate("TourSchedule", { index: route.params?.index });
		}else{
			appStore.vehicle.setTitle(info.title);
			appStore.vehicle.setRegNumber(info.regNumber);
			console.log("photos size:"+info.photos.length);
			info.photos.forEach(photo => {
				appStore.vehicle.addPhoto(BASE_URL+photo);
			});
			navigation && navigation.navigate("Vehicle");
		}
	};

	const onVehicleTypeSelect = (index): void => {
		console.log("Slected index:"+index);
		setSelectedIndex(index);
		appStore.vehicle.setVehicleType(vehcileTypes[index-1].name);
	};

	const renderOption = (vehcileType): React.ReactElement => (
		<SelectItem key={vehcileType.name} title={evaProps => <View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
			<FontAwesome5 name="bus" size={24} color={getVehicleColor(vehcileType.name)}  />
			<Text style={{ paddingHorizontal: 5}}>{vehcileType.name}</Text>
		</View>} />
	);

	const onRegistrationNumberChange = (value): void => {
		if(value.length != 0){
			setRegistrationNumberErrorMessage("");
		}
		appStore.vehicle.setRegNumber(value);
	};

	const onTitleChange = (value): void => {
		if(value.length != 0){
			setTitleErrorMessage("");
		}
		appStore.vehicle.setTitle(value);
	};

	const onPhotosPress = (): void => {
		console.log("photos presses");
		setPhotosErrorMessage("");
	};

	function errorMessageHandler(value) {
		setPhotosErrorMessage(value);
	}

	/*
	useFocusEffect(
		React.useCallback(() => {
			if(!initialised){
			loadVehicles();
			setInitialised(true);
			}
			return () => {
			// Do something when the screen is unfocused
			// Useful for cleanup functions
			};
		}, [])
	);
	*/

	useEffect(() => {	
				if(!initialised){
			loadVehicles();
			setInitialised(true);
			}
		},[]);
	

	

	// }, [appStore.routeBus?.rotationPlans[route.params.rotationPlan_index]?.busAssigns?.length]); 

	if (loading) {
		return <ActivityIndicator/>;
	}
	
	return (
		
		<ScrollView>

		
			{add && (
			<View>
				 <View style={{  padding: 1, margin: 5 ,flexDirection: "row", justifyContent: "flex-end"}}>	
					<AntDesign style={{top: 4}} name="close" size={18} color="#444" onPress={onAddClosePress} />
				</View>
			
				<View>

					<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
						<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
							<Text style={{ padding: 5, paddingLeft: 10}}>Vehicle Model</Text>
							<View style={{ margin: 10}}>
								<Select
									placeholder='Default'
									value={vehcileType.name}
									selectedIndex={selectedIndex}
									onSelect={(index: IndexPath) => onVehicleTypeSelect(index)}>
									{vehcileTypes.map(renderOption)}
								</Select>
							</View>
						</View>
					</View>
								
					<View>
		
						<View style={{ margin: 10}}>
							<View style={styles.labelContainer}>
								<Text style={styles.label}>Title</Text>
							</View>
							<View style={titleCustomStyle}>
								<TextInput style={styles.captionText} placeholder="2010 Baby Rosa" onChangeText={onTitleChange}  value={appStore.vehicle.title} onFocus={() => setTitleFocus(true)} onBlur={() => setTitleFocus(false)} />
							</View>	
							{titleErrorMessage!="" && (
								<Text style={styles.errorLabel}>{titleErrorMessage}</Text>	
							)}
						</View>
								
						<View style={{ margin: 10}}>
							<View style={styles.labelContainer}>
								<Text style={styles.label}>Reg. No</Text>
							</View>
							<View style={regNoCustomStyle}>
								<TextInput style={styles.captionText} placeholder="wpNF-9999" onChangeText={onRegistrationNumberChange} value={appStore.vehicle.regNumber} onFocus={() => setRegNoFocus(true)} onBlur={() => setRegNoFocus(false)} />
							</View>	
							{registrationNumberErrorMessage!="" && (
								<Text style={styles.errorLabel}>{registrationNumberErrorMessage}</Text>	
							)}
						</View>
					
						
					</View>
					
			
				</View>
		

				<View style={{flexDirection: "row", justifyContent: "space-between"}}>
					<Button size="giant" style={{ flex: 3 , margin: 5, borderRadius:50, margin: 10}} onPress={()=>onCreatePress()}>Create</Button>
				</View>
			</View>

			)}


			{edit && (
			<View>
				 <View style={{  padding: 1, margin: 5 ,flexDirection: "row", justifyContent: "flex-end"}}>	
					<AntDesign style={{top: 4}} name="close" size={18} color="#444" onPress={onEditClosePress} />
				</View>
			
				<View>

					<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
						<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
							<Text style={{ padding: 5, paddingLeft: 10}}>Vehicle Model</Text>
							<View style={{ margin: 10}}>
								<Select
									placeholder='Default'
									value={vehcileType.name}
									selectedIndex={selectedIndex}
									onSelect={(index: IndexPath) => onVehicleTypeSelect(index)}>
									{vehcileTypes.map(renderOption)}
								</Select>
							</View>
						</View>
					</View>
								
					<View>
		
						<View style={{ margin: 10}}>
							<View style={styles.labelContainer}>
								<Text style={styles.label}>Title</Text>
							</View>
							<View style={titleCustomStyle}>
								<TextInput style={styles.captionText} placeholder="2010 Baby Rosa"  value={appStore.vehicle.title} editable={false}/>
							</View>	
							{titleErrorMessage!="" && (
								<Text style={styles.errorLabel}>{titleErrorMessage}</Text>	
							)}
						</View>
								
						<View style={{ margin: 10}}>
							<View style={styles.labelContainer}>
								<Text style={styles.label}>Reg. No</Text>
							</View>
							<View style={regNoCustomStyle}>
								<TextInput style={styles.captionText} placeholder="wpNF-9999"  value={appStore.vehicle.regNumber} editable={false}/>
							</View>	
							{registrationNumberErrorMessage!="" && (
								<Text style={styles.errorLabel}>{registrationNumberErrorMessage}</Text>	
							)}
						</View>	
						<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
							<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
								<Text style={{ padding: 5, paddingLeft: 10}}>Seat Layout</Text>
								<View style={{ margin: 10}}>
								<VehicleLayoutSuggestions vehicleIndex={vehicleIndex}/>
							</View>
							</View>
						</View>
					</View>
					<Card style={{ margin: 10, borderRadius:10}} onPress={onPhotosPress}>	
						<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
							<Text>Photos</Text>
							<VehiclePhotosAddCard navigation={navigation} errorMessageHandler={errorMessageHandler} update={false} vehicleIndex={vehicleIndex} loadVehicles={loadVehicles} />
						</View>
						{photosErrorMessage!="" && (
								<Text style={styles.errorLabel}>{photosErrorMessage}</Text>	
						)}
					</Card>
			
				</View>
		

				<View style={{flexDirection: "row", justifyContent: "space-between"}}>
					<Button size="giant" style={{ flex: 3 , margin: 5, borderRadius:50, margin: 10}} onPress={()=>onUpdatePress()}>Edit</Button>
				</View>
			</View>

			)}

			{!add && !edit && (
			<View> 	
						{vehicles?.map((vehicle,index) => (
							
							
							<Card key={vehicle.id} style={styles.item} onPress={() => onItemPress(vehicle)} onLongPress={()=>onVehicleLongPress(vehicle,index)}>
								
								<View style={{paddingTop: 10, flexDirection: "row", justifyContent: "space-between"}}>
												{vehicle.regNumber && (
									<Button appearance='ghost'  size="small"  style={{ borderColor:"#142169", borderWidth: 2}} >{vehicle.regNumber}</Button>
									)}	
									<Button  size="small"  style={{ borderColor:"#142169", borderWidth: 2}} >{vehicle.noOfSeats} Seats</Button>
								</View>
								<Galeria urls={vehicle.photos}>
									
									<Image source={{ uri: `${BASE_URL}${vehicle.photos[0]}` }}  contentFit="cover" style={styles.image}  />
									
								</Galeria>
								<View style={{paddingTop: 10, flexDirection: "row", justifyContent: "space-between"}}>
									<Text category="h5">{vehicle.title}</Text>
								</View>
								
							</Card>
						
							
						
						))}

			</View>
			)}

			<RBSheet ref={refRBSheetActions} draggable dragOnContent height={200}>
					<View style={styles.listContainer}>
						<View>
								<TouchableOpacity
								key="photo-camera"
								style={styles.listButton}
								onPress={() => onEditPress()}>
									<AntDesign name="edit" size={24} color="black" style={styles.listIconEdit}/>
								
								<Text style={styles.listLabel}>Update</Text>
							</TouchableOpacity>
							<TouchableOpacity
								key="upload"
								style={styles.listButton}
								onPress={() => onDeletePress()}>
								<MaterialIcons name="delete" size={24} color="red" style={styles.listIconDelete} />
								<Text style={styles.listLabel}>Delete</Text>
							</TouchableOpacity>
							</View>
						</View>
					<RBSheet draggable dragOnContent key="busTimetableDeleteConfirmActions" ref={refRBSheetDeleteConfirm} height={200}>
						<View>
							<Text style={{ fontSize: 15, padding: 15}} >Are you sure, you want to delete Timetable and content ?</Text>
							<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
								<Button size="giant" style={{ flex: 3 , margin: 5, backgroundColor: "#D69200" , borderRadius:50, margin: 10, borderColor: "#D69200" }} onPress={()=>onDeleteConfirmCancelPress()} >No</Button>
								<Button size="giant" style={{ flex: 3 , margin: 5, backgroundColor: "#B12048", borderRadius:50, margin: 10, borderColor: "#B12048"}} onPress={()=>onDeleteConfirmPress()}>Delete</Button>
							</View>
						</View>
					</RBSheet>
					

			</RBSheet>
			</ScrollView>

		
		
		
		
	);
}));

const styles = StyleSheet.create({
	image: {
		height: 220,
	},
	listContent: {
		paddingHorizontal: 32,
		paddingVertical: 8,
	},
	listContainer: {
		flex: 1,
		padding: 25,
	},
	button: {
		marginVertical: 8,
	},
	listButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 10,
	},
		listLabel: {
		fontSize: 16,
	},
	contentContainerStyle: {
		paddingTop: 12,
		paddingHorizontal: 24,
		zIndex: 100,
		overflow: 'hidden',
	},
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
		marginHorizontal: 10
	},
	itemHeader: {
		fontWeight: "500",
		fontSize: 18
	},
	listIconDelete: {
		fontSize: 26,
		color: '#710e07',
		width: 60,
	},
	listIconEdit: {
		fontSize: 26,
		color: '#6a5703',
		width: 60,
	},

	itemSelected: {
		marginVertical: 8,
		marginHorizontal: 10,
		borderWidth: 1,
		borderColor: "#aaa"
	},
	itemContentIcon: {
		fontSize: 20,
		color: '#666',
	}
	
});
