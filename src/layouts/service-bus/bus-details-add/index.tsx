import { Button, Card, Layout, List, Select, SelectItem, IndexPath,Avatar, Text, Input } from "@ui-kitten/components";
import React,{useState,useEffect,useRef} from "react";
import { useRoute } from "@react-navigation/native"
import { StyleSheet, View ,Image, ListRenderItemInfo,ScrollView} from "react-native";
import { Passenger,Owner } from "./extra/data";
import AppStore from "../../../store/AppStore";
import BusPhotosAddCard from "../bus-photos-add/extra/busphotos-add-card.component";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";
import { CachedImage } from '@georstat/react-native-image-cache';
import { toJS } from "mobx";
import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import RBSheet from 'react-native-raw-bottom-sheet';
import { SafeAreaProvider } from "react-native-safe-area-context";



const BusDetailsAddCard = ({ navigation }): React.ReactElement => {

	const route = useRoute();

	const refRBSheetDriverInfo = useRef();

	const refRBSheetDriverEdit = useRef();

	const refRBSheetOwnerAdd = useRef();

	const refRBSheetOwnerEdit = useRef();

	
	const [driverName, setDriverName] = useState('');
	const [driverMobileNumber, setDriverMobileNumber] = useState('');


	const [ownerName, setOwnerName] = useState('');
	const [ownerMobileNumber, setOwnerMobileNumber] = useState('');

	const appStore = useStore(AppStore);
	
	const client = axios.create({
		baseURL: 'https://routes.lk:7007'
	});

	const data = [
		'Van',
		'Mini Bus',
		'Bus',
		'Luxury Bus',
	];
	

	const [selectedIndex, setSelectedIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const model = data[selectedIndex.row];
	
	const resetValues = (): void => {
		setDriverName("");
		setDriverMobileNumber("");
		setOwnerName("");
		setOwnerMobileNumber("");
	};

	const onAddDriverPress = (): void => {
		refRBSheetDriverInfo.current.open()
	};

	const onAddOwnerPress = (): void => {
		refRBSheetOwnerAdd.current.open()
	};

	const onAddBusDriverButtomPress = (): void => {
		appStore.bus.addDriver(driverName, driverMobileNumber);
		resetValues();
		refRBSheetDriverInfo.current.close()
	};

	const onAddBusOwnerButtonPress = (): void => {
		appStore.bus.addOwner(ownerName, ownerMobileNumber);
		resetValues();
		refRBSheetOwnerAdd.current.close()
	};

	const onDeleteBusDriverPress = (): void => {
		appStore.bus.deleteDriver(driverMobileNumber);
		resetValues();
		refRBSheetDriverEdit.current.close()
	};

	const onEditBusDriverPress = (): void => {
		appStore.bus.updateDriver(driverName, driverMobileNumber);
		resetValues();
		refRBSheetDriverEdit.current.close()
	};

	const onDriverActionsPress = (info): void => {
		console.log("## onPassengerEditPress"+info.item.name);
		setDriverName(info.item.name);
		setDriverMobileNumber(info.item.mobileNumber);
		refRBSheetDriverEdit.current.open()
	};

	const onOwnerActionsPress = (info): void => {
		setOwnerName(info.item.name);
		setOwnerMobileNumber(info.item.mobileNumber);
		refRBSheetOwnerEdit.current.open()
	};

	const onDeleteBusOwnerPress = (): void => {
		appStore.bus.deleteOwner(ownerMobileNumber);
		resetValues();
		refRBSheetOwnerEdit.current.close()
	};

	const onEditBusOwnerPress = (): void => {
		appStore.bus.updateOwner(ownerName, ownerMobileNumber);
		resetValues();
		refRBSheetOwnerEdit.current.close()
	};

	

	const onNextPress = async() => {
		console.log(JSON.stringify(toJS(appStore.bus)));
		navigation.jumpTo('Journey', { name: 'Bus Add' });
	}

	const renderOption = (title): React.ReactElement => (
		<SelectItem title={title} />
	);

	const onVehicleTypeSelect = (index): void => {
		console.log("Slected index:"+index);
		setSelectedIndex(index);
		console.log(data[index-1]);
		appStore.bus.setVehicleType(data[index-1]);
	};

	const getIndexNumber = (vehicleType): number => {
		console.log("vehicleType:"+vehicleType);
		
		var myindex = 0;
		data.map(function(element, index){
			if(element == vehicleType){
				console.log("index:::"+index);
				myindex=index;
			}
		});
		return myindex;
	};

	useEffect(() => {
		
		if(route.params != null ){
			var indexNo = getIndexNumber(appStore.bus.vehicleType)
			setSelectedIndex(new IndexPath(indexNo));
		}

	}, []);
	


	const isBusOwner = (): boolean => {
		
		console.log("isBusOwner"+appStore.user.mobileNumber);
		if(appStore.user.role == "admin"){
			console.log("role is admin");
			return true;
		}
		
		var isOwner = false;
		appStore.bus.owners.map(function(owner, index){
			console.log("owner:"+owner.mobileNumber);
			console.log("appStore.user.mobileNumber:"+appStore.user.mobileNumber);
			if(owner.mobileNumber == appStore.user.mobileNumber){
				console.log("owner:");
				isOwner = true;
			}
		});

		if(isOwner)
			return true;

		console.log("not admin and owner:");
		return false;
	};
	
	

	const renderItem = (info: ListRenderItemInfo<Passenger>): React.ReactElement => (
		<Card key={"driver_"+info.index} style={styles.item} onPress={()=>onDriverActionsPress(info)}>
			<View style={{ flexDirection: "row",  justifyContent: 'flex-start', margin: 2}}>
					<View style={{ padding: 5}}>
						<Avatar {...{source:"https://routes.lk:7007/users/"+info.item.mobileNumber+"/profile-photo.jpg"}} key={"profile_photo_"+info.item.mobileNumber} style={{ borderWidth: 2, borderColor: "grey"}}  ImageComponent={CachedImage} size="large"/>
					</View>
					<View style={{ padding: 5}}>
						<Text>{info.item.name}</Text>
						<Text>{info.item.mobileNumber}</Text>
					</View>
				</View>
		</Card>
	);

	const renderOwnerItem = (info: ListRenderItemInfo<Owner>): React.ReactElement => (
		<Card key={"driver_"+info.index} style={styles.item} onPress={()=>onOwnerActionsPress(info)}>
			<View style={{ flexDirection: "row",  justifyContent: 'flex-start', margin: 2}}>
					<View style={{ padding: 5}}>
						<Avatar {...{source:"https://routes.lk:7007/users/"+info.item.mobileNumber+"/profile-photo.jpg"}} key={"profile_photo_"+info.item.mobileNumber} style={{ borderWidth: 2, borderColor: "grey"}}  ImageComponent={CachedImage} size="large"/>
					</View>
					<View style={{ padding: 5}}>
						<Text>{info.item.name}</Text>
						<Text>{info.item.mobileNumber}</Text>
					</View>
				</View>
		</Card>
	);

	return (
		
		<ScrollView>
			<Input style={styles.textInput} placeholder="Agency..." onChangeText={appStore.bus.setAgency} value={appStore.bus.agency}/>
			<View style={styles.textInput}>
					<Select
						placeholder='Default'
						value={model}
						selectedIndex={selectedIndex}
						onSelect={(index: IndexPath) => onVehicleTypeSelect(index)}
					>
						{data.map(renderOption)}
					</Select>
				</View>
			<View>
				<Input style={styles.textInput} placeholder="Title..." onChangeText={appStore.bus.setTitle} value={appStore.bus.title}/>	
				<Input style={styles.textInput} placeholder="Description..." onChangeText={appStore.bus.setDescription} value={appStore.bus.description}/>
				<Input style={styles.textInput} placeholder="No of seats..." onChangeText={appStore.bus.setNoOfSeats} value={appStore.bus.noOfSeats}/>	
			</View>

			<BusPhotosAddCard navigation={navigation}/>
			
			{(isBusOwner()==true) && (
			<Card style={styles.item} >
				<View style={{flexDirection: "row", justifyContent: "space-between"}}>
					<Text style={{ margin: 5,  margin: 10 }} >Drivers</Text>
					<Button size="small" style={{ margin: 5, margin: 10, borderRadius:20, backgroundColor: "green", borderColor: "green"}} onPress={()=>onAddDriverPress()} >Add</Button>
				</View>
				<View >	
					<Layout level="2">
						<List
							contentContainerStyle={styles.listContent}
							data={appStore.bus.drivers}
							renderItem={renderItem}
						/>
					</Layout>	
				</View>
			</Card>
			)}
			{(isBusOwner()==true) && (
			<Card style={styles.item} >
				<View style={{flexDirection: "row", justifyContent: "space-between"}}>
					<Text style={{ margin: 5,  margin: 10 }} >Owners</Text>
					<Button size="small" style={{ margin: 5, borderRadius:20, margin: 10, backgroundColor: "green", borderColor: "green"}} onPress={()=>onAddOwnerPress()} >Add</Button>
				</View>
				<View >	
					<Layout level="2">
						<List
							contentContainerStyle={styles.listContent}
							data={appStore.bus.owners}
							renderItem={renderOwnerItem}
						/>
					</Layout>	
				</View>
			</Card>
			)}

			<View style={{flexDirection: "row", justifyContent: "space-between"}}>
				<Button size="giant" style={{ flex: 3 , margin: 5, borderRadius:50, margin: 10}} onPress={()=>onNextPress()}>Journey</Button>
			</View>

			<RBSheet draggable dragOnContent key="busdriverAdd" ref={refRBSheetDriverInfo} height={300}>
					<View>
						<Input	
							style={{paddingHorizontal: 10, paddingVertical: 10}}
							placeholder="Name"
							selectionColor="#142169"
							cursorColor="#142169"
							onChangeText={setDriverName} 
							value={driverName}/>

						<Input	
							style={{paddingHorizontal: 10, paddingVertical: 10}}
							placeholder="MobileNumber"
							selectionColor="#142169"
							cursorColor="#142169"
							onChangeText={setDriverMobileNumber} 
							value={driverMobileNumber}/>
						
						<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
						<Button style={{ flex: 1, borderRadius:50, margin: 10, backgroundColor: "green", borderColor: "green"}} size="giant" onPress={onAddBusDriverButtomPress}>Add Driver</Button>
						</View>
					</View>
			</RBSheet>

			<RBSheet draggable dragOnContent key="busdriverEdit" ref={refRBSheetDriverEdit} height={300}>
					<View>
						<Input	
							style={{paddingHorizontal: 10, paddingVertical: 10}}
							placeholder="Name"
							selectionColor="#142169"
							cursorColor="#142169"
							onChangeText={setDriverName} 
							value={driverName}/>

						
						<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
							<Button size="giant" style={{ flex: 3 , margin: 5, backgroundColor: "#D69200" , borderRadius:50, margin: 10, borderColor: "#D69200" }} onPress={()=>onEditBusDriverPress()} >Update</Button>
							<Button size="giant" style={{ flex: 3 , margin: 5, backgroundColor: "#B12048", borderRadius:50, margin: 10, borderColor: "#B12048"}} onPress={()=>onDeleteBusDriverPress()}>Delete</Button>
						</View>
					</View>
			</RBSheet>


			<RBSheet draggable dragOnContent key="busOwnerAdd" ref={refRBSheetOwnerAdd} height={300}>
					<View>
						<Input	
							style={{paddingHorizontal: 10, paddingVertical: 10}}
							placeholder="Name"
							selectionColor="#142169"
							cursorColor="#142169"
							onChangeText={setOwnerName} 
							value={ownerName}/>

						<Input	
							style={{paddingHorizontal: 10, paddingVertical: 10}}
							placeholder="MobileNumber"
							selectionColor="#142169"
							cursorColor="#142169"
							onChangeText={setOwnerMobileNumber} 
							value={ownerMobileNumber}/>
						
						<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
						<Button style={{ flex: 1, borderRadius:50, margin: 10, backgroundColor: "green", borderColor: "green"}} size="giant" onPress={onAddBusOwnerButtonPress} >Add Owner</Button>
						</View>
					</View>
			</RBSheet>

			<RBSheet draggable dragOnContent key="busOwnerEdit" ref={refRBSheetOwnerEdit} height={300}>
					<View>
						<Input	
							style={{paddingHorizontal: 10, paddingVertical: 10}}
							placeholder="Name"
							selectionColor="#142169"
							cursorColor="#142169"
							onChangeText={setOwnerName} 
							value={ownerName}/>
						<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
							<Button size="giant" style={{ flex: 3 , margin: 5, backgroundColor: "#D69200" , borderRadius:50, margin: 10, borderColor: "#D69200" }} onPress={()=>onEditBusOwnerPress()} >Update</Button>
							<Button size="giant" style={{ flex: 3 , margin: 5, backgroundColor: "#B12048", borderRadius:50, margin: 10, borderColor: "#B12048"}} onPress={()=>onDeleteBusOwnerPress()}>Delete</Button>
						</View>
					</View>
			</RBSheet>
			
		</ScrollView>
		
		
		
	);
};

const styles = StyleSheet.create({

	
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
	
	itemContent: {
		marginVertical: 8,
	},
	
});

export default observer(BusDetailsAddCard);
