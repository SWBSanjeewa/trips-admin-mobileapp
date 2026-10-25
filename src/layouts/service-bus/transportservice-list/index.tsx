import { Avatar, Button, Card, Text, List } from "@ui-kitten/components";
import React,{useState,useRef} from "react";
import { useFocusEffect } from '@react-navigation/native';
import { ListRenderItemInfo, StyleSheet, View , TouchableOpacity,Image, ActivityIndicator} from "react-native";

import AppStore from "../../../store/AppStore";
import { useStore } from "mobx-store-provider";

import { TransportService } from "./extra/data";

import { AutocompleteDropdown ,IAutocompleteDropdownRef} from 'react-native-autocomplete-dropdown';

import AntDesign from '@expo/vector-icons/AntDesign';

import { CachedImage } from '@georstat/react-native-image-cache';

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import { TranportServiceSuggestions}  from "./extra/transportservices-auto-suggestions"

import { useRoute } from "@react-navigation/native";

import RBSheet from 'react-native-raw-bottom-sheet';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';



const client = axios.create({
	baseURL: 'https://routes.lk:7007'
});



//export default ({ navigation }): React.ReactElement => {
export default React.forwardRef(({ navigation,searchCallback, search },ref) => {


	const appStore = useStore(AppStore);

	const [transportServices, setTransportServices] = useState([]);

	const route = useRoute();

	const [loading, setLoading] = useState(true);

	const routeTypeRef = useRef<typeof IAutocompleteDropdownRef>();

	const refRBSheetActions = useRef();
		
	const refRBSheetDeleteConfirm = useRef();

	const [selectedTransportId, setSelectedTransportId] = React.useState<string>("");

	const ItemSeparatorComponent = () => <View style={{ height: 1, width: '100%', backgroundColor: '#d8e1e6' }} />

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
		setSelectedTransportId(info.item._id);
		refRBSheetActions.current.open();
	};

	const onItemPressBcjk = (info: ListRenderItemInfo<TransportService>): void => {
		//console.log("id:::"+transportServices[info.index].name);
		console.log("id:::"+info.item._id);
		console.log(JSON.stringify(info.item._id)); 

		if(route.params?.viewFrom == "tour-schedule"){
			appStore.tour.schedules[route.params?.index].setTransportServiceId(info.item._id);
			appStore.tour.schedules[route.params?.index].setTransportServiceName(info.item.name);
			navigation && navigation.navigate("TourSchedule", { index: route.params?.index });
		}else{
			navigation && navigation.navigate("TransportService", { id: info.item._id });
		}
	};

	const onItemLongPress = (info: ListRenderItemInfo<TransportService>): void => {
		

		if(route.params?.viewFrom == "tour-schedule"){
			appStore.tour.schedules[route.params?.index].setTransportServiceId(info.item._id);
			appStore.tour.schedules[route.params?.index].setTransportServiceName(info.item.name);
			navigation && navigation.navigate("TourSchedule", { index: route.params?.index });
		}else{
			navigation && navigation.navigate("TransportService", { id: info.item._id });
		}
	};

	const onRouteTypeSelect = (value): void => {
		console.log("Selected route Id:"+value?.id);
		//appStore.searchContext.setRouteTypeIndex(value?.id);
		//appStore.searchContext.setType(value?.title);
	};

	const renderItemHeader = (info: ListRenderItemInfo<TransportService>): React.ReactElement => (
		
		<CachedImage
				resizeMode="cover"
				style={styles.itemHeader} source={info.item.photos[0]} />
	);

	const onSearchClosePress = (): void => {	
			//appStore.searchContext.reset();
			searchCallback(false);
			loadTransportServices();
	};
	


	

	const renderItem = (info: ListRenderItemInfo<TransportService>): React.ReactElement => {
		if(info.item._id == appStore.user.defaultTransportServiceId){
			return (
				<Card
					style={[styles.item ,{ backgroundColor: info.item.themeColor}]}
					//emHeader(info)}
					//footer={() => renderItemFooter(info)}
					onPress={() => onItemPress(info)}>
						<View style={{flexDirection: "row", justifyContent: "space-between"}}>
							<Text category="h4" style={{ color: "white", fontFamily: "great-vibes-regular", fontWeight: 800, fontSize: 28 }}>{info.item.name}</Text>	
							<MaterialIcons name="favorite" size={24} color="black" style={styles.listIconFavourite} />	
						</View>
				</Card>
			)
		}
		if(info.item._id != appStore.user.defaultTransportServiceId){
			return (
				<Card
					style={[styles.item ,{ backgroundColor: info.item.themeColor}]}
					//emHeader(info)}
					//footer={() => renderItemFooter(info)}
					onPress={() => onItemPress(info)}>
							<Text category="h4" style={{ color: "white", fontFamily: "great-vibes-regular", fontWeight: 800, fontSize: 28 }}>{info.item.name}</Text>
				</Card>
			)
		}
	};

	

	useFocusEffect(
		React.useCallback(() => {
			loadTransportServices()
		  return () => {
			// Do something when the screen is unfocused
			// Useful for cleanup functions
		  };
		}, [])
	);

	const handleUpdate = (newValue) => {
    	setTransportServices(newValue);
  	};

	const onDeleteConfirmCancelPress = (): void => {
		refRBSheetDeleteConfirm.current.close()
	};

	const onDeletePress = (): void => {
		refRBSheetDeleteConfirm.current.open()
	};

	const onEditPress = async() => {
		refRBSheetActions.current.close();
		console.log("onEditPress::");
		navigation && navigation.navigate("TransportService", { id: selectedTransportId });
	};

	
	const onDefaultTransportServiceSetPress = async() => {
		const config: AxiosRequestConfig = {
			headers: {
				'Accept': 'application/json',
				'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		};
	
		try {
			console.log("/users/:userId/defaultTransportServiceId/"+selectedTransportId);
			const response: AxiosResponse = await client.put(`/users/`+appStore.user.mobileNumber+`/defaultTransportServiceId/`+selectedTransportId , config);
			if(response.status == 200){
				setLoading(true);
				loadTransportServices();
			}
			
			
		} catch(err) {
			console.log(err);
		}
		refRBSheetActions.current.close();
	}


	const onDeleteConfirmPress = async() => {
		const config: AxiosRequestConfig = {
			headers: {
				'Accept': 'application/json',
				'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
			};
			try {
				const response: AxiosResponse = await client.delete(`/transportServices/`+selectedTransportId , config);
				console.log(response.status);
				console.log(response.data.json); 
				appStore.transportService.reset();
				navigation && navigation.navigate("TransportServiceList");
			} catch(err) {
			console.log(err);
			}  
		refRBSheetDeleteConfirm.current.close();
		refRBSheetActions.current.close();
	}

	

	if (loading) {
		return <ActivityIndicator/>;
	}

	return (
		<View>
			{search && (
				//!appStore.searchContext.close && (
				<View>  
					<View style={{  padding: 1, margin: 5 ,flexDirection: "row", justifyContent: "flex-end"}}>
						
						<AntDesign style={{top: 4}} name="close" size={18} color="#444" onPress={onSearchClosePress} />
					</View>

					<View style={{  padding: 1, margin: 1,borderColor: "#eee", borderWidth: 0 ,flexDirection: "column", justifyContent: "flex-start"}}>		
							<TranportServiceSuggestions updateParent={handleUpdate} />
					</View>
					
					</View>
				
				//)
			)}
			<List
				contentContainerStyle={styles.listContent}
				data={transportServices}
				renderItem={renderItem}/>
			<RBSheet ref={refRBSheetActions} draggable dragOnContent height={200}>
					<View style={styles.listContainer}>
						<View>
							<TouchableOpacity
								key="default"
								style={styles.listButton}
								onPress={() => onDefaultTransportServiceSetPress()}>
									<MaterialIcons name="favorite" size={24} color="black" style={styles.listIconFavourite} />
								<Text style={styles.listLabel}>Set as Default</Text>
							</TouchableOpacity>
							<TouchableOpacity
								key="edit"
								style={styles.listButton}
								onPress={() => onEditPress()}>
									<AntDesign name="edit" size={24} color="black" style={styles.listIconEdit}/>
								
								<Text style={styles.listLabel}>Update</Text>
							</TouchableOpacity>
							<TouchableOpacity
								key="delete"
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
		</View>
		
	);
});


const styles = StyleSheet.create({

	parentContainer: {
		flex: 1	
	},
	listContainer: {
		flex: 1,
		padding: 25,
	},
	listButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 10,
	},
	listLabel: {
		fontSize: 16,
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
	listIconFavourite: {
		fontSize: 26,
		color: '#461104',
		width: 60,
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
