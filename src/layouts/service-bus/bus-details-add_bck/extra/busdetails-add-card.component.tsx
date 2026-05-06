import { Button, Select, SelectItem, CardElement, IndexPath, List ,Card,Input, Text, Layout} from "@ui-kitten/components";
import React,{ useState , useEffect, useRef} from "react";
import { View, SafeAreaView, ImageBackground, StyleSheet,Image, ListRenderItemInfo} from "react-native";
import { ArrowIosBackIcon, TrashIcon } from "../../../../components/icons";

import { Driver } from "./data";
import AppStore from "../../../../store/AppStore";
import { toJS } from "mobx";
import { observer} from "mobx-react";
import { useStore } from "mobx-store-provider";
import RBSheet from 'react-native-raw-bottom-sheet';

import { useRoute } from "@react-navigation/native";
import { ScrollView } from 'react-native-virtualized-view';


const BusDetailsAddCard = ({ navigation }): CardElement => {

	const appStore = useStore(AppStore);

	const refRBSheetDriverInfo = useRef();

	
	const [driverName, setDriverName] = useState('');
	const [driverMobileNumber, setDriverMobileNumber] = useState('');

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [noOfSeats, setNoOfSeats] = useState('');
	const [noOfSeatsAvailable, setNoOfSeatsAvailable] = useState('');
	const data = [
		'Van',
		'Mini Bus',
		'Bus',
		'Luxury Bus',
	];

	const colors = [
		'red',
		'green',
		'purple',
		'yellow',
	];

	const [agencyColorSelectedIndex, setAgencyColorSelectedIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const agencyColorModel = data[agencyColorSelectedIndex.row];
	

	const [selectedIndex, setSelectedIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const model = data[selectedIndex.row];


	const route = useRoute();
	

	const onDriverEditPress = (info): void => {
		console.log("onDriverEditPress pressed!");
	};
	
	const onAddDriverPress = (): void => {
		console.log("onAddDriverPress pressed!");
		navigation && navigation.navigate("BusDriversAddScreen");
		//refRBSheetDriverInfo.current.open()
	};

	const onAddBusDriverButtomPress = (): void => {
		console.log("onAddBusDriverButtomPress pressed!");
		appStore.bus.addDriver(driverName, driverMobileNumber);
	};

	

	const onNextPress = (): void => {
		console.log("next pressed!");
		console.log(JSON.stringify(toJS(appStore)));
		navigation.jumpTo('Photos', { name: 'Bus Add' });
	};

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
		console.log("Bud details add 1");
		if(route.params != null ){
			console.log("Bus details add..."+route.params.id);
			appStore.bus.setId(route.params.id);
			appStore.bus.setObjectId(route.params.id);
			console.log("#### "+appStore.bus.vehicleType);
			var indexNo = getIndexNumber(appStore.bus.vehicleType)
			console.log("#### indexNo: "+indexNo);

			setSelectedIndex(new IndexPath(indexNo));
			console.log(JSON.stringify(toJS(appStore)));
		}
	
			setDriverName(appStore.wipDriver.name);
			setDriverMobileNumber(appStore.wipDriver.mobileNumber);
			
		
	
	}, []);
	
	const renderOption = (title): React.ReactElement => (
		<SelectItem title={title} />
	);

	const agencyColorRenderOption = (color): React.ReactElement => (
		<SelectItem title={color} />
	);

	const renderItem = (info: ListRenderItemInfo<Driver>): React.ReactElement => (
		<Card key={"driver_"+info.index} style={styles.item} onPress={()=>onDriverEditPress(info)}>
			<View style={{ flexDirection: "row",  justifyContent: 'flex-start', margin: 2}}>
					
					<View style={{ padding: 5}}>
						<Text>{info.item.name}</Text>
						<Text>{info.item.mobileNumber}</Text>
					</View>
				</View>
		</Card>
	);

	return (
		<ScrollView style={styles.container}>
			<Button style={{ width: 150}} onPress={()=>onAddDriverPress()}>Add Driver</Button>

			<View style={styles.textInput}>
				<Select
					placeholder='Default'
					value={model}
					selectedIndex={selectedIndex}
					onSelect={(index: IndexPath) => onVehicleTypeSelect(index)}>
					{data.map(renderOption)}
				</Select>
			</View>
			
			<View>
			
				<Input style={styles.textInput} placeholder="Title..." onChangeText={appStore.bus.setTitle} value={appStore.bus.title}/>
				
				<Input style={styles.textInput} placeholder="Description..." onChangeText={appStore.bus.setDescription} value={appStore.bus.description}/>
				
				<Input style={styles.textInput} placeholder="No of seats..." onChangeText={appStore.bus.setNoOfSeats} value={appStore.bus.noOfSeats}/>
				
			</View>
		
				<List
							contentContainerStyle={styles.listContent}
							data={appStore.bus.drivers}
							renderItem={renderItem}
						/>
			

			<Button style={styles.nextButton} onPress={()=>onNextPress()}>
			Photos
		  </Button>

		  <RBSheet draggable dragOnContent key="nameEdit" ref={refRBSheetDriverInfo} height={300}>
					<View>
						<Input	
							style={{paddingHorizontal: 10, paddingVertical: 10}}
							placeholder="Name"
							value={driverName}
							selectionColor="#197519"
							cursorColor="#197519"
							onChangeText={(text) => setDriverName(text)}/>

						<Input	
							style={{paddingHorizontal: 10, paddingVertical: 10}}
							placeholder="MobileNumber"
							value={driverMobileNumber}
							selectionColor="#197519"
							cursorColor="#197519"
							onChangeText={(text) => setDriverMobileNumber(text)}/>
						
						<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
						<Button style={{ flex: 1, borderRadius:50, margin: 10}} size="giant" onPress={onAddBusDriverButtomPress}>Add Driver</Button>
						</View>
					</View>
				</RBSheet>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
	},
	nextButton: {
		marginVertical: 8,
		borderRadius:50, 
		margin: 10
	},
	textInput: {
		marginVertical: 8,
	},
	logo: {
		width: 400,
		height: 300,
	},		
});

export default observer(BusDetailsAddCard);
