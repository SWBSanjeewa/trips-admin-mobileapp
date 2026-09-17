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

	const [fromDate, setFromDate] = useState("");

	const [toDate, setToDate] = useState("");

	const [edit, setEdit] = useState(false);

	const [displaySelectedDays, setDisplaySelectedDays] = useState(false);

	const [runningDays, setRunningDays] = React.useState([2,3,4,5,6])
	
	const appStore = useStore(AppStore);

	const [initialized, setInitialized] = React.useState(false);

	const [selectedId, setSelectedId] = useState(null);

	const [selectedDaysSelected, setSelectedDaysSelected] = React.useState(false);

	//const [selectedDaysSelectedEdit, setSelectedDaysSelectedEdit] = React.useState(false);

	const [selectedTurn, setSelectedTurn] = React.useState<number>(-1);

	const [defaultDate, setDefaultDate] = React.useState<Date>(new Date());

	const [timetableIndex, setTimetableIndex] = React.useState<number>(-1);

	const [scheduleIndex, setScheduleIndex] = React.useState<number>(-1);

	const refRBSheetActions = useRef();

	const refRBSheetDeleteConfirm = useRef();

	
	const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  	const displayValue = routeBusTimetableTypes[selectedIndex.row];

	const [selectedIndexEdit, setSelectedIndexEdit] = useState(new IndexPath(0));

  	const displayValueEdit = routeBusTimetableTypes[selectedIndexEdit.row];

	const [isFromDatePickerVisible, setFromDatePickerVisible] = useState(false);

	const [isToDatePickerVisible, setToDatePickerVisible] = useState(false);

	const [isEditModeDatePickerVisible, setEditModeDatePickerVisibility] = useState(false);
	



	const client = axios.create({
		baseURL: 'https://routes.lk:7007'
	});

	const onAddClosePress = (): void => {	
		
		addCallback(false);
		
	};

	
	const onTimetableDetailsPress = async (timetable,index) => {
		setTimetableIndex(index);
		refRBSheetActions.current.open();
	};

	const onDeleteTurn = (tIndex: number,index: number) => () =>  {
		if(route.params?.journeyType=="RouteBusJourney"){
			appStore.routeBus.journey.deleteTurnByIndex(tIndex,index);
		}else if(route.params?.journeyType=="RouteBusReturnJourney"){
			appStore.routeBus.returnJourney.deleteTurnByIndex(tIndex,index);
		}
		setSelectedTurn(-1);
	}

	
	
	const onEditModeAddTurn = (tIndex: number) => () =>  {
       console.log("tIndex:"+tIndex+" selectedTurn:"+selectedTurn);

	   if(route.params?.journeyType=="RouteBusJourney"){
		if(tIndex > -1){
				
				if(selectedTurn > -1){
					const [hours, minutes] = appStore.routeBus.journey.timetables[timetableIndex].turns[selectedTurn].startTime.split(':');
					console.log("hours>>"+hours);
					defaultDate.setHours(hours, minutes, 0, 0); 
				}else{
					var turnsSize=appStore.routeBus.journey.timetables[timetableIndex]?.turns.length;
					if(turnsSize>0){
						const [hours, minutes] = appStore.routeBus.journey.timetables[timetableIndex]?.turns[turnsSize-1].startTime.split(':');
						console.log("hours>>"+hours);
						defaultDate.setHours(hours, minutes, 0, 0); 
					}

				}
			}

		setEditModeDatePickerVisibility(true);
		setTimetableIndex(tIndex);
		if(selectedTurn == -1 || timetableIndex != tIndex)
			setSelectedTurn(appStore.routeBus.journey.timetables[tIndex].turns.length-1);
	
	   }else if(route.params?.journeyType=="RouteBusReturnJourney"){
			if(tIndex > -1){
				
				if(selectedTurn > -1){
					const [hours, minutes] = appStore.routeBus.returnJourney.timetables[timetableIndex].turns[selectedTurn].startTime.split(':');
					console.log("hours>>"+hours);
					defaultDate.setHours(hours, minutes, 0, 0); 
				}else{
					var turnsSize=appStore.routeBus.returnJourney.timetables[timetableIndex]?.turns.length;
					if(turnsSize>0){
						const [hours, minutes] = appStore.routeBus.returnJourney.timetables[timetableIndex]?.turns[turnsSize-1].startTime.split(':');
						console.log("hours>>"+hours);
						defaultDate.setHours(hours, minutes, 0, 0); 
					}

				}
			}

		setEditModeDatePickerVisibility(true);
		setTimetableIndex(tIndex);
		if(selectedTurn == -1 || timetableIndex != tIndex)
			setSelectedTurn(appStore.routeBus.returnJourney.timetables[tIndex].turns.length-1);
	   }
	   
    };

	
	const hideFromDatePicker = () => {
		setFromDatePickerVisible(false);
	};

	const hideToDatePicker = () => {
		setToDatePickerVisible(false);
	};

	const hideEditModeDatePicker = () => {
		setEditModeDatePickerVisibility(false);
	};

	

	const onScheduleAddPress1 = async() => {
		console.log("onTimetableAddPress");
		setTimetableIndex(-1);
		setSelectedTurn(-1);
		console.log("appStore.routeBusTimetable.type:"+appStore.routeBusTimetable.type);
		if(appStore.routeBusTimetable.type == ""){
			appStore.routeBusTimetable.setTimetableType(routeBusTimetableTypes[0]);
		}
		if(appStore.routeBusTimetable.type == "Selected Days"){
			if(appStore.routeBusTimetable.runningDays == ""){
			appStore.routeBusTimetable.setRunningDays(runningDays?.toString());
			}
		}
		console.log(">>"+JSON.stringify(toJS(appStore.routeBusTimetable)));	
		console.log(">>>>"+JSON.stringify(toJS(appStore.routeBusTimetable.type+","+appStore.routeBusTimetable.runningDays.toString())));	
	   
		addCallback(false);
		console.log("Routebus:"+appStore.routeBus);
		console.log("::"+JSON.stringify(toJS(appStore.routeBus)));	
		setRunningDays([2,3,4,5,6]);
		setSelectedIndex(new IndexPath(0));
		setSelectedDaysSelected(false);
		console.log("Adding:"+appStore.routeBusTimetable.type+" - "+appStore.routeBusTimetable.runningDays?.toString())
		appStore.routeBus.addTimetable(appStore.routeBusTimetable.type, appStore.routeBusTimetable.runningDays.toString());

	}

	const onScheduleAddPress = async() => {
		console.log(appStore.routeBusTimetable.type+"::"+appStore.routeBusTimetable.runningDays.toString());
		if(route.params?.journeyType=="RouteBusJourney"){
		    appStore.routeBus.addJourneySchedule(fromDate, toDate);
		}else if(route.params?.journeyType=="RouteBusReturnJourney"){
			appStore.routeBus.addReturnJourneySchedule(fromDate, toDate);
		}
		console.log("*****");
		setDefaultDate(new Date());
		addCallback(false);
	}

	const onScheduleEditPress = async() => {
		console.log("Journey Type::"+route.params?.journeyType);
		console.log(fromDate+"::"+toDate);
		if(route.params?.journeyType=="RouteBusJourney"){
			appStore.routeBus.journey.schedules[scheduleIndex].setFromDate(fromDate);
		    appStore.routeBus.journey.schedules[scheduleIndex].setToDate(toDate);
		}else if(route.params?.journeyType=="RouteBusReturnJourney"){
			appStore.routeBus.returnJourney.schedules[scheduleIndex].setFromDate(fromDate);
		    appStore.routeBus.returnJourney.schedules[scheduleIndex].setToDate(toDate);
		}
		console.log("*****");
		setDefaultDate(new Date());
		setEdit(false);
	}

	
	const onTimetableEditPress = (): void => {	
		let timetable;
		if(route.params?.journeyType=="RouteBusJourney"){
		    timetable = appStore.routeBus.journey.timetables[timetableIndex];
		}else if(route.params?.journeyType=="RouteBusReturnJourney"){
			timetable = appStore.routeBus.returnJourney.timetables[timetableIndex];
		}
		 
	
		timetable?.setTimetableType(routeBusTimetableTypes[selectedIndexEdit-1]);
		if(timetable?.type == "Selected Days"){
			timetable.setRunningDays(runningDays.toString());
		}
		setTimetableIndex(-1);
		setSelectedTurn(-1);
		setEdit(false);
	}

	

	const onDeletePress = (): void => {
		refRBSheetDeleteConfirm.current.open()
	};

	const onDeleteConfirmCancelPress = (): void => {
		refRBSheetDeleteConfirm.current.close()
	};

	const onDeleteConfirmPress = (): void => {
		if(route.params?.journeyType=="RouteBusJourney"){
			appStore.routeBus.journey.deleteScheduleByIndex(scheduleIndex);
		}else if(route.params?.journeyType=="RouteBusReturnJourney"){
			appStore.routeBus.returnJourney.deleteScheduleByIndex(scheduleIndex);
		}
		refRBSheetDeleteConfirm.current.close()
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
		
		var timetableRunningDays;

		//console.log(">"+appStore.routeBusTimetable.type);
		//console.log("Timetable Index:"+getIndexNumber(appStore.routeBus.journey.timetables.at(timetableIndex)?.type));
		if(route.params?.journeyType=="RouteBusJourney"){
			setFromDate(appStore.routeBus.journey.schedules.at(scheduleIndex)?.fromDate);
			setToDate(appStore.routeBus.journey.schedules.at(scheduleIndex)?.toDate);
		}else if(route.params?.journeyType=="RouteBusReturnJourney"){
			setFromDate(appStore.routeBus.returnJourney.schedules.at(scheduleIndex)?.fromDate);
			setToDate(appStore.routeBus.returnJourney.schedules.at(scheduleIndex)?.toDate);
		}
		
		setEdit(true);
		
	};
	
	

	const handleFromDateConfirm = (date) => {	
			hideFromDatePicker();  
			console.warn("From date has been actualDate: ", format(date, 'yyyy-MM-dd'));
			setFromDate(format(date, 'yyyy-MM-dd'));
	};

	const handleToDateConfirm = (date) => {	
			hideToDatePicker();  
			console.warn("To date has been actualDate: ", format(date, 'yyyy-MM-dd'));
			setToDate(format(date, 'yyyy-MM-dd'));
	};

	const handleEditModeConfirm = (date) => {	
			hideEditModeDatePicker();  
			setSelectedTurn(selectedTurn+1); 
			console.warn("A date has been actualDate: ", date);
			console.warn("A date has been actualDate: ", format(date, 'p'));
			if(route.params?.journeyType=="RouteBusJourney"){
				appStore.routeBus.journey.addTurnAfterIndex(timetableIndex,selectedTurn,"",format(date, 'HH:mm'),"",[],"","");
			}else if(route.params?.journeyType=="RouteBusReturnJourney"){
				appStore.routeBus.returnJourney.addTurnAfterIndex(timetableIndex,selectedTurn,"",format(date, 'HH:mm'),"",[],"","");
			}
			
			//appStore.routeBusTimetable.addTurn("",format(date, 'HH:mm'),"",[],[]);	
	};

	


	const onRouteEditTimetableTypeSelect = async (index) => {
		console.log("#####");
		setSelectedIndexEdit(index);
		
		

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
			console.log("&&&&"+routeBusTimetableTypes[index-1]);
			setSelectedDaysSelected(true);
		}else{
			setSelectedDaysSelected(false);
		}
		console.log("routeBusTimetableTypes[index-1]:"+routeBusTimetableTypes[index-1]);
		appStore.routeBusTimetable.setTimetableType(routeBusTimetableTypes[index-1]);
	};


	const onScheduleLongPress = async (schedule,index) => {
		setScheduleIndex(index);
		refRBSheetActions.current.open();
	};

	const onSchedulePress = async (schedule,index) => {
		setScheduleIndex(index);
		refRBSheetActions.current.open();
	};

	
	return (
	
		<ScrollView>
			{add && (
			<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
			    <View style={{  padding: 1, margin: 5 ,flexDirection: "row", justifyContent: "flex-end"}}>	
					<AntDesign style={{top: 4}} name="close" size={18} color="#444" onPress={onAddClosePress} />
				</View>
				<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
					<Text style={{padding: 2,paddingHorizontal: 10, fontSize: 18}}>Valid Period</Text>
					<View style={{flex: 1,flexDirection: "row", justifyContent: "flex-start", paddingLeft: 10}}>
					<Pressable 
							style={{borderWidth: 1, padding: 2, margin: 2, borderColor: "#000"}}
							onPress={({ nativeEvent }) => {
								console.log('On Press action:', nativeEvent.event);
								setFromDatePickerVisible(true);
								}}>
							<View style={{flexDirection: "row", flexWrap: "wrap"}}>
							{fromDate && (
							<Text style={{padding: 2,paddingHorizontal: 5}}>{fromDate}</Text>
							)}
							{!fromDate && (
							<Text style={{padding: 2,paddingHorizontal: 5}}>From</Text>
							)}
							<AntDesign style={{top: 4}} name="calendar" size={18} color="blue" />
							</View>
					</Pressable>
					<Text style={{padding: 2,paddingHorizontal: 10}}>-</Text>
					<Pressable 
							style={{borderWidth: 1, padding: 2, margin: 2, borderColor: "#000"}}
							onPress={({ nativeEvent }) => {
								console.log('On Press action:', nativeEvent.event);
								setToDatePickerVisible(true);
								}}>
							<View style={{flexDirection: "row", flexWrap: "wrap"}}>
							{toDate && (
							<Text style={{padding: 2,paddingHorizontal: 5}}>{toDate}</Text>
							)}
							{!toDate && (
							<Text style={{padding: 2,paddingHorizontal: 5}}>To</Text>
							)}
							<AntDesign style={{top: 4}} name="calendar" size={18} color="red" />
							</View>
					</Pressable>
					</View>
					
				</View>
				
				<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
					<Button style={{ flex: 1 , margin: 2, borderRadius:50, margin: 10 }} onPress={()=>onScheduleAddPress()} >Add Schedule</Button>
				</View>
			</View>
			
			)}

			{edit && (
			<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
			    <View style={{  padding: 1, margin: 5 ,flexDirection: "row", justifyContent: "flex-end"}}>	
					<AntDesign style={{top: 4}} name="close" size={18} color="#444" onPress={onEditClosePress} />
				</View>
				<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
					<Text style={{padding: 2,paddingHorizontal: 10, fontSize: 18}}>Valid Period</Text>
					<View style={{flex: 1,flexDirection: "row", justifyContent: "flex-start", paddingLeft: 10}}>
					<Pressable 
							style={{borderWidth: 1, padding: 2, margin: 2, borderColor: "#000"}}
							onPress={({ nativeEvent }) => {
								console.log('On Press action:', nativeEvent.event);
								setFromDatePickerVisible(true);
								}}>
							<View style={{flexDirection: "row", flexWrap: "wrap"}}>
							{fromDate && (
							<Text style={{padding: 2,paddingHorizontal: 5}}>{fromDate}</Text>
							)}
							{!fromDate && (
							<Text style={{padding: 2,paddingHorizontal: 5}}>From</Text>
							)}
							<AntDesign style={{top: 4}} name="calendar" size={18} color="blue" />
							</View>
					</Pressable>
					<Text style={{padding: 2,paddingHorizontal: 10}}>-</Text>
					<Pressable 
							style={{borderWidth: 1, padding: 2, margin: 2, borderColor: "#000"}}
							onPress={({ nativeEvent }) => {
								console.log('On Press action:', nativeEvent.event);
								setToDatePickerVisible(true);
								}}>
							<View style={{flexDirection: "row", flexWrap: "wrap"}}>
							{toDate && (
							<Text style={{padding: 2,paddingHorizontal: 5}}>{toDate}</Text>
							)}
							{!toDate && (
							<Text style={{padding: 2,paddingHorizontal: 5}}>To</Text>
							)}
							<AntDesign style={{top: 4}} name="calendar" size={18} color="red" />
							</View>
					</Pressable>
					</View>
					
				</View>
				
				<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
					<Button style={{ flex: 1 , margin: 2, borderRadius:50, margin: 10 }} onPress={()=>onScheduleEditPress()} >Edit Schedule</Button>
				</View>
			</View>
			)}

			{route.params?.journeyType == "RouteBusJourney" && (
			<View>	
				{appStore.routeBus.journey.schedules?.map((schedule,index) => (
					
					<Card key={index} 
					onPress={() => navigation.navigate("RouteBusJourneyTimetablesList", {id: appStore.routeBus.id,journeyType: route.params?.journeyType, scheduleIndex: index})}
					onLongPress={({ nativeEvent }) => {
						console.log('On Long Press action:', nativeEvent.event);
						onScheduleLongPress(schedule,index)
					}}
					delayLongPress={300}
					style={[
					scheduleIndex == index? styles.item : styles.itemSelected
					]}>
						<View style={{flexDirection: "row", flexWrap: "wrap"}}>
							<Text style={{padding: 2,paddingHorizontal: 5}}>{schedule.fromDate}</Text>
							<AntDesign style={{top: 4}} name="calendar" size={18} color="blue" />
							<Text style={{padding: 2,paddingHorizontal: 5}}> - </Text>
							<Text style={{padding: 2,paddingHorizontal: 5}}>{schedule.toDate}</Text>
							<AntDesign style={{top: 4}} name="calendar" size={18} color="red" />
						</View>
						
					
					</Card>

					
					
					
					
				))}
				
			</View>
			)}

			{route.params?.journeyType == "RouteBusReturnJourney" && (
			<View>	
				{appStore.routeBus.returnJourney.schedules?.map((schedule,index) => (
					
					<Card key={index} 
					style={[
					scheduleIndex == index? styles.item : styles.itemSelected
					]}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Timetable Type</Text>
						<View>
							<Text>{schedule.fromDate} - {schedule.toDate}</Text>
						</View>
					</Card>
				))}
			</View>
			)}

	

			<DateTimePickerModal
							isVisible={isEditModeDatePickerVisible}
							mode="time"
							date={defaultDate} 
							timeZoneName={'Asia/Colombo'} 
							onConfirm={handleEditModeConfirm}
							onCancel={hideEditModeDatePicker}/>	

			<DateTimePickerModal
					isVisible= {isFromDatePickerVisible}
					date={defaultDate}
					mode="date"
					display="inline"
					onConfirm={handleFromDateConfirm}
					onCancel={hideFromDatePicker}/>	

			<DateTimePickerModal
					isVisible= {isToDatePickerVisible}
					date={defaultDate}
					mode="date"
					display="inline"
					onConfirm={handleToDateConfirm}
					onCancel={hideToDatePicker}/>	

			

					
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

