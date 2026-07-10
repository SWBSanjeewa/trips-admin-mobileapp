import { Select, TopNavigationAction, IndexPath,SelectItem } from "@ui-kitten/components";
import { Button, Card, CheckBox, List, Divider,Input } from "@ui-kitten/components";
import React,{useState,useEffect,useRef} from "react";
import { useRoute } from "@react-navigation/native"
import { StyleSheet, View , ListRenderItemInfo,Image, TouchableOpacity,Pressable, Text} from "react-native";
import { Stopping } from "./extra/data";
import AppStore from "../../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";
import { toJS } from "mobx";

import { ScrollView } from 'react-native-virtualized-view';
import { DayPicker } from '@routeslk/react-native-picker-weekday'

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import {routeBusTimetableTypes, transportAuthorityTypes}  from "../../../app/routes-common";
import AntDesign from '@expo/vector-icons/AntDesign';
import { PlusOutlineIcon } from "../../../components/icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from 'date-fns';

import RBSheet from 'react-native-raw-bottom-sheet';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';






//const RouteBusJourneyDetails = ({ navigation }): React.ReactElement => {
export default observer(React.forwardRef(({ navigation,addCallback, add },ref) => {

	const route = useRoute();

	const [data, setData] = useState([]);

	const [edit, setEdit] = useState(false);

	const [displaySelectedDays, setDisplaySelectedDays] = useState(false);

	const [runningDays, setRunningDays] = React.useState([2,3,4,5,6])
	
	const appStore = useStore(AppStore);

	const [initialized, setInitialized] = React.useState(false);

	const [selectedId, setSelectedId] = useState(null);

	const [selectedDaysSelected, setSelectedDaysSelected] = React.useState(false);

	const [selectedDaysSelectedEdit, setSelectedDaysSelectedEdit] = React.useState(false);

	const [selectedTurn, setSelectedTurn] = React.useState<number>(-1);

	const [timetableIndex, setTimetableIndex] = React.useState<number>(-1);

	const refRBSheetActions = useRef();

	const refRBSheetDeleteConfirm = useRef();

	const refRBSheetEdit = useRef();
	
	
	const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  	const displayValue = routeBusTimetableTypes[selectedIndex.row];

	const [selectedIndexEdit, setSelectedIndexEdit] = useState(new IndexPath(0));
  	const displayValueEdit = routeBusTimetableTypes[selectedIndexEdit.row];

	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

	const [isEditModeDatePickerVisible, setEditModeDatePickerVisibility] = useState(false);
	



	const client = axios.create({
		baseURL: 'https://routes.lk:7007'
	});

	const onAddClosePress = (): void => {	
		
		addCallback(false);
		
	};

	//const onAddManuallyPress = async () => {
	const onTimetableDetailsPress = async (timetable,index) => {
		console.log(">>"+index);
		setTimetableIndex(index);
		//if(timetableIndex==index){
		//	setTimetableIndex(-1);
		//}
		refRBSheetActions.current.open();
		//navigation && navigation.navigate("RouteBusTimetableDetails", { "timetableType": timetable.type, "runningDays": timetable.runnningDays, index: index});
	};

	const onAddTurn = (startTime: string) => () =>  {
       console.log("Add after:"+startTime);
	  // appStore.routeBusTimetable.addTurn("",startTime,"",[],[]);
	   setDatePickerVisibility(true);
	  // JSON.stringify(toJS(appStore.routeBusTimetable));
	  // setSelectedStopping(stopping);
       // setUploadPhotos(prevState => !prevState);
    };

	const onEditModeAddTurn = (tIndex: number) => () =>  {
       console.log("Add after:"+timetableIndex);
	  // appStore.routeBusTimetable.addTurn("",startTime,"",[],[]);
	   setEditModeDatePickerVisibility(true);
	   setTimetableIndex(tIndex);
	   if(selectedTurn == -1 || timetableIndex != tIndex)
	   	 setSelectedTurn(appStore.routeBus.journey.timetables[tIndex].turns.length);
	   
	   // JSON.stringify(toJS(appStore.routeBusTimetable));
	  // setSelectedStopping(stopping);
       // setUploadPhotos(prevState => !prevState);
    };

	const onTimetableAddTurn = (startTime: string) => () =>  {
       console.log("Add after:"+startTime);
	  // appStore.routeBusTimetable.addTurn("",startTime,"",[],[]);
	   setDatePickerVisibility(true);
	  // JSON.stringify(toJS(appStore.routeBusTimetable));
	  // setSelectedStopping(stopping);
       // setUploadPhotos(prevState => !prevState);
    };

	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};

	const hideEditModeDatePicker = () => {
		setEditModeDatePickerVisibility(false);
	};

	const onDeleteTurn = (startTime: string) => () =>  {
		console.log("Delete:"+startTime);
		//appStore.routeBus.deleteStoppingPlaceByPlace(stopping);
	};

	const onTimetableAddPress = async() => {
		console.log("onTimetableAddPress");
		setTimetableIndex(-1);
		setSelectedTurn(-1);
		if(appStore.routeBusTimetable.type == ""){
			appStore.routeBusTimetable.setTimetableType(routeBusTimetableTypes[0]);
		}
		if(appStore.routeBusTimetable.type == "Selected Days"){
			if(appStore.routeBusTimetable.runningDays == ""){
			appStore.routeBusTimetable.setRunningDays(runningDays.toString());
			}
		}
		console.log(JSON.stringify(toJS(appStore.routeBusTimetable)));	
		console.log(JSON.stringify(toJS(appStore.routeBusTimetable.type+","+appStore.routeBusTimetable.runningDays.toString())));	
	    appStore.routeBus.journey.addTimetable(appStore.routeBusTimetable.type, appStore.routeBusTimetable.runningDays.toString(), appStore.routeBusTimetable.turns);
		addCallback();
		console.log("Routebus:"+appStore.routeBus);
		console.log(JSON.stringify(toJS(appStore.routeBus)));	
		setRunningDays([2,3,4,5,6]);
		setSelectedIndex(new IndexPath(0));
		setSelectedDaysSelected(false);

	}

	const onDeletePress = (): void => {
		//appStore.transportService.deleteOwner(mobileNumber);
		//resetValues();
		refRBSheetDeleteConfirm.current.open()
	};

	const onDeleteConfirmCancelPress = (): void => {
		refRBSheetDeleteConfirm.current.close()
	};

	const onDeleteConfirmPress = (): void => {
		refRBSheetDeleteConfirm.current.close()
	};

	const onEditCancelPress = (): void => {
		refRBSheetEdit.current.close();
	};

	const onEditConfirmPress = (): void => {
		refRBSheetEdit.current.close();
	};

	const getIndexNumber = (timetableType): number => {	
		var myindex = 0;
		routeBusTimetableTypes.map(function(element, index){
			if(element == timetableType){
				myindex=index;
			}
		});
		return myindex;
	};
	
	const onEditPress = async() => {
		//addCallback();
		console.log(">"+appStore.routeBusTimetable.type);
		console.log("Timetable Index:"+getIndexNumber(appStore.routeBus.journey.timetables.at(timetableIndex)?.type));
		setSelectedIndex(new IndexPath(getIndexNumber(appStore.routeBus.journey.timetables.at(timetableIndex)?.type)));
		if(appStore.routeBus.journey.timetables.at(timetableIndex)?.type == "Selected Days"){
			setSelectedDaysSelected(true);
		}else{
			setSelectedDaysSelected(false);
		}
		var timetableRunningDays = appStore.routeBus.journey.timetables.at(timetableIndex)?.runningDays.split(',').map(function(item) {
			return parseInt(item, 10);
		});
		
		setRunningDays(timetableRunningDays);
		setEdit(true);
		//refRBSheetEdit.current.open();
	};



	const onTimetableAddPressbck = async() => {
		
		if(appStore.routeBusTimetable.type == ""){
			appStore.routeBusTimetable.setTimetableType(routeBusTimetableTypes[0]);
		}
		if(appStore.routeBusTimetable.type == "Selected Days"){
			if(appStore.routeBusTimetable.runningDays == ""){
			appStore.routeBusTimetable.setRunningDays(runningDays.toString());
			}
		}
		
		const config: AxiosRequestConfig = {
			headers: {
				'Accept': 'application/json',
				'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		};
		try {
			const response: AxiosResponse = await client.post(`/routebuses/create`, appStore.routeBus , config);
			console.log(response.status);
			console.log(response.data.json); 
			appStore.routeBus.reset();
			navigation && navigation.navigate("BusHome", {reload: true});
			
		} catch(err) {
			console.log(err);
		}  
	
	};

	
	const setSelectedDaysRunningDays = (value) => {
		setRunningDays(value);
		appStore.routeBusTimetable.setRunningDays(value.toString());
	}


	const handleConfirm = (date) => {
			
			hideDatePicker(); 
			console.warn("A date has been actualDate: ", date);
			console.warn("A date has been actualDate: ", format(date, 'p'));
			appStore.routeBusTimetable.addTurn("",format(date, 'HH:mm'),"",[],[]);	
	};

	const handleEditModeConfirm = (date) => {	
			hideEditModeDatePicker();  
			setSelectedTurn(selectedTurn+1); 
			console.warn("A date has been actualDate: ", date);
			console.warn("A date has been actualDate: ", format(date, 'p'));
			appStore.routeBus.journey.addTurnAfterIndex(timetableIndex,selectedTurn,"",format(date, 'HH:mm'),"",[],[]);
			//appStore.routeBusTimetable.addTurn("",format(date, 'HH:mm'),"",[],[]);	
	};

	const onRouteTimetableTypeSelectEditbck = (index): void => {
		setSelectedIndexEdit(index);
		if(routeBusTimetableTypes[index-1] == "Selected Days"){
			console.log(routeBusTimetableTypes[index-1]);
			setSelectedDaysSelectedEdit(true);
		}else{
			setSelectedDaysSelectedEdit(false);
		}
	};


	const onRouteTimetableTypeSelectEdit = async (index) => {
		console.log("#####");
		setSelectedIndexEdit(index);
		refRBSheetActions.current.open();
		refRBSheetEdit.current.open();

	}

	const onEditClosePress = (): void => {	
		setSelectedIndex(new IndexPath(0));
		setSelectedDaysSelected(false);
		setRunningDays([2,3,4,5,6]);
		setEdit(false);
	};

	
	const onRouteTimetableTypeSelect = (index): void => {
		setSelectedIndex(index);
		if(routeBusTimetableTypes[index-1] == "Selected Days"){
			console.log(routeBusTimetableTypes[index-1]);
			setSelectedDaysSelected(true);
		}else{
			setSelectedDaysSelected(false);
		}
		appStore.routeBusTimetable.setTimetableType(routeBusTimetableTypes[index-1]);
	};

	const renderOptionTimetableTypes = (timetableType): React.ReactElement => (
		<SelectItem key={timetableType} title={evaProps => <View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
			<Text style={{ paddingHorizontal: 5}}>{timetableType}</Text>
		</View>} />
	);

	useEffect(() => {
			
	});


	return (
	
		<ScrollView>
			{add && (
			<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
			    <View style={{  padding: 1, margin: 5 ,flexDirection: "row", justifyContent: "flex-end"}}>	
					<AntDesign style={{top: 4}} name="close" size={18} color="#444" onPress={onAddClosePress} />
				</View>
				<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
					<Text style={{ padding: 5, paddingLeft: 10}}>Timetable Type</Text>
					<View style={{ margin: 10}}>
						
						<Select
							selectedIndex={selectedIndex}
							onSelect={(index) => onRouteTimetableTypeSelect(index)}
							value={displayValue}>
							{routeBusTimetableTypes.map((title, index) => (
							<SelectItem key={index} title={title} />
							))}
						</Select>
					</View>
					{selectedDaysSelected && (
					<DayPicker
						weekdays={runningDays}
						setWeekdays={setSelectedDaysRunningDays}
						activeColor='#142169'
						textColor='white'
						inactiveColor='grey'
						
						/>
					)}
					<Text style={{ padding: 5, paddingLeft: 10}}>Turns</Text>
					<View style={styles.inputContainer}>
						<View style={{flexDirection: "row", flexWrap: "wrap"}}>
						{appStore.routeBusTimetable.turns.map(function(turn, index){
							if(index == selectedTurn){
								return <TouchableOpacity style={{flexDirection: "row" ,borderWidth: 1, padding: 2, margin: 2, borderColor: "#222"}} onPress={onAddTurn(turn.startTime)}>
											<Text style={{padding: 2}}>{turn.startTime}</Text>
											<AntDesign style={{top: 4}} name="close" size={18} color="red" onPress={onDeleteTurn(turn.startTime)} />
									</TouchableOpacity>
							}else{
								return <TouchableOpacity style={{flexDirection: "row" ,borderWidth: 1, padding: 2, margin: 2, borderColor: "#bbb"}} onPress={onAddTurn(turn.startTime)}>
											<Text style={{padding: 2}}>{turn.startTime}</Text>
											<AntDesign style={{top: 4}} name="close" size={18} color="red" onPress={onDeleteTurn(turn.startTime)} />
									</TouchableOpacity>
							}
							
						})}	
							<AntDesign style={{top: 0}} name="plus" size={30} color="black" onPress={onAddTurn("")} />
						</View>	
					</View>
				</View>
				
				<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
					<Button style={{ flex: 1 , margin: 2, borderRadius:50, margin: 10 }} onPress={()=>onTimetableAddPress()} >Add Timetable</Button>
				</View>
			</View>
			
			)}

			{edit && (
			<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
			    <View style={{  padding: 1, margin: 5 ,flexDirection: "row", justifyContent: "flex-end"}}>	
					<AntDesign style={{top: 4}} name="close" size={18} color="#444" onPress={onEditClosePress} />
				</View>
				<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
					<Text style={{ padding: 5, paddingLeft: 10}}>Timetable Type</Text>
					<View style={{ margin: 10}}>
						
						<Select
							selectedIndex={selectedIndex}
							onSelect={(index) => onRouteTimetableTypeSelect(index)}
							value={displayValue}>
							{routeBusTimetableTypes.map((title, index) => (
							<SelectItem key={index} title={title} />
							))}
						</Select>
					</View>
					{selectedDaysSelected && (
					<DayPicker
						weekdays={runningDays}
						setWeekdays={setSelectedDaysRunningDays}
						activeColor='#142169'
						textColor='white'
						inactiveColor='grey'
						
						/>
					)}
					
				</View>
				
				<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
					<Button style={{ flex: 1 , margin: 2, borderRadius:50, margin: 10 }} onPress={()=>onTimetableAddPress()} >Edit Timetable</Button>
				</View>
			</View>
			
			)}


			<View>	
				{appStore.routeBus.journey.timetables.map((timetable,timetable_index) => (
					
					<Card key={timetable_index} 
					style={[
					timetableIndex == timetable_index? styles.item : styles.itemSelected
					]}
					//style={styles.itemSelected} 
					onPress={()=>onTimetableDetailsPress(timetable,timetable_index)}>
						<Text>{timetable.type}</Text>
						{timetable.runningDays && (
							
							<DayPicker
								weekdays={
									timetable.runningDays.split(',').map(function(item) {
										return parseInt(item, 10);
								})}
								setWeekdays={setSelectedDaysRunningDays}
								activeColor='#142169'
								textColor='white'
								inactiveColor='grey'
								itemStyles={{width: 35, height:35, color: "red", paddingHorizontal: 0, marginHorizontal: 5 ,marginVertical : 5}}
								dayTextStyle={{ fontSize: 10 }}
								wrapperStyles={{ marginVertical: 10, justifyContent: 'space-left' }}
							/>
						)}
						<Text style={{ padding: 5, paddingLeft: 10}}>Turns</Text>
					<View style={styles.inputContainer}>
						<View style={{flexDirection: "row", flexWrap: "wrap"}}>
							
						{timetable.turns.map(function(turn, index){
							
							if(index == selectedTurn && timetable_index == timetableIndex){
								return <Pressable 
								         style={{borderWidth: 1, padding: 2, margin: 2, borderColor: "#000"}}
										onPress={({ nativeEvent }) => {
												console.log('On Press action:', nativeEvent.event);
												}}
										onLongPress={({ nativeEvent }) => {
											   // setSelectedTurn(turn);
											   console.log("selectedTurn:"+selectedTurn);
												console.log("index:"+index);
												if(selectedTurn == index){
													setSelectedTurn(-1);
												}
												console.log('On Long Press action:', nativeEvent.event);
												}}
										delayLongPress={300} //  <TouchableOpacity style={{flexDirection: "row" ,borderWidth: 1, padding: 2, margin: 2, borderColor: "#bbb"}} onPress={onAddTurn(turn.startTime)}>
										>
								   
											<Text style={{padding: 2,paddingHorizontal: 10}}>{turn.startTime}</Text>
									
									</Pressable>
							}else{
								return <Pressable 
								        style={{borderWidth: 1, padding: 2, margin: 2, borderColor: "#bbb"}}
										onPress={({ nativeEvent }) => {
												console.log('On Press action:', nativeEvent.event);
												navigation && navigation.navigate("RouteBusTurnDetails");
												}}
										onLongPress={({ nativeEvent }) => {
												setSelectedTurn(index);
												setTimetableIndex(timetable_index);
												console.log("##"+turn.startTime);
												console.log('On Long Press action:', nativeEvent.event);
												}}
										delayLongPress={300} //  <TouchableOpacity style={{flexDirection: "row" ,borderWidth: 1, padding: 2, margin: 2, borderColor: "#bbb"}} onPress={onAddTurn(turn.startTime)}>
										>
											<Text style={{padding: 2, paddingHorizontal: 10}}>{turn.startTime}</Text>
									</Pressable>
							}
							
						})}	
						
						
							<AntDesign style={{top: 0}} name="plus" size={30} color="black" onPress={onEditModeAddTurn(timetable_index)} />
						
						
					</View>
					</View>
					
					</Card>
				))}

				 

			
			</View>

			<DateTimePickerModal
							isVisible={isDatePickerVisible}
							mode="time"
							timeZoneName={'Asia/Colombo'} 
							onConfirm={handleConfirm}
							onCancel={hideDatePicker}/>	

			<DateTimePickerModal
							isVisible={isEditModeDatePickerVisible}
							mode="time"
							timeZoneName={'Asia/Colombo'} 
							onConfirm={handleEditModeConfirm}
							onCancel={hideEditModeDatePicker}/>	


					
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
					<RBSheet draggable dragOnContent key="busOwnerEdit" ref={refRBSheetEdit} height={300}>
						
							<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
				<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
					<Text style={{ padding: 5, paddingLeft: 10}}>Timetable Type</Text>
					<View style={{ margin: 10}}>
						
						<Select
							selectedIndex={selectedIndexEdit}
							onSelect={(index) => onRouteTimetableTypeSelectEdit(index)}
							value={displayValueEdit}>
							{routeBusTimetableTypes.map((title, index) => (
							<SelectItem key={index}_2 title={title} />
							))}
						</Select>
					</View>
					
					</View>
							<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
								<Button size="giant" style={{ flex: 3 , margin: 5, backgroundColor: "#D69200" , borderRadius:50, margin: 10, borderColor: "#D69200" }} onPress={()=>onEditCancelPress()} >Cancel</Button>
								<Button size="giant" style={{ flex: 3 , margin: 5, backgroundColor: "#B12048", borderRadius:50, margin: 10, borderColor: "#B12048"}} onPress={()=>onEditConfirmPress()}>Update</Button>
							</View>
						</View>
					</RBSheet>

			</RBSheet>
		
		  
			
		</ScrollView>
		
		
		
	);
}));

const styles = StyleSheet.create({

	
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

	item: {
		marginVertical: 8,
		marginHorizontal: 10,
		borderWidth: 1,
		borderColor: "#000"
	},
	
	itemContent: {
		marginVertical: 8,
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
	
});

