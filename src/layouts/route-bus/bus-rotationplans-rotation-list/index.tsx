import { Select, TopNavigationAction, IndexPath,SelectItem, Layout, TabView, Tab } from "@ui-kitten/components";
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

	const [runningNos, setRunningNos] = React.useState([])
	
	const appStore = useStore(AppStore);

	const [initialized, setInitialized] = React.useState(false);

	const [selectedId, setSelectedId] = useState(null);

	const [selectedDaysSelected, setSelectedDaysSelected] = React.useState(false);

	const [selectedDatesSelected, setSelectedDatesSelected] = React.useState(false);

	//const [selectedDaysSelectedEdit, setSelectedDaysSelectedEdit] = React.useState(false);

	const [selectedTurn, setSelectedTurn] = React.useState<number>(-1);

	const [selectedDate, setSelectedDate] = React.useState<number>(-1);

	const [defaultDate, setDefaultDate] = React.useState<Date>(new Date());

	const [assignBusIndex, setAssignBusIndex] = React.useState<number>(-1);

	const [tabSelectedIndex, setTabSelectedIndex] = useState(0);

	const [selectedIndex1, setSelectedIndex1] = useState(0);

	const refRBSheetActions = useRef();

	const refRBSheetDeleteConfirm = useRef();

	
	const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  	const displayValue = routeBusTimetableTypes[selectedIndex.row];

	const [selectedIndexEdit, setSelectedIndexEdit] = useState(new IndexPath(0));

	const [selectedIndexRegNo, setSelectedIndexRegNo] = useState(new IndexPath(0));

	const [selectedIndexReturnJourneyRegNo, setSelectedIndexReturnJourneyRegNo] = useState(new IndexPath(0));

	
	
  //	const displayValueEdit = routeBusTimetableTypes[selectedIndexEdit.row];
   
	const [displayValueEdit, setDisplayValueEdit] = useState("");

	const [regNo, setRegNo] = useState("");

	const [returnJourneyRegNo, setReturnJourneyRegNo] = useState("");

	

	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

	const [isEditModeDatePickerVisible, setEditModeDatePickerVisibility] = useState(false);

	
	const client = axios.create({
		baseURL: 'https://routes.lk:7007'
	});

	const onAddClosePress = (): void => {	
		
		addCallback(false);
		
	};

	
	
	
	const onAssignBusPress = async (assignBus,index) => {
		setAssignBusIndex(index);
		refRBSheetActions.current.open();
	};

	

	useEffect(() => {

		var allRunningNos = appStore.routeBus.getAllRunningNos();
		setDisplayValueEdit(allRunningNos[0]);
		const stoppings = appStore.routeBus.journey.stoppings;
		if (stoppings && stoppings.length > 0) {
			const targetPlace = stoppings[0].place;

			for (const rotationBus of appStore.routeBus.rotationBuses) {
				if (rotationBus.startEnd === targetPlace) {
				setRegNo(rotationBus.regNo);
				break; // Successfully stops the loop early
				}
			}
		}

		const returJourneyStoppings = appStore.routeBus.returnJourney.stoppings;
		if (returJourneyStoppings && returJourneyStoppings.length > 0) {
			const targetPlace = returJourneyStoppings[0].place;

			for (const rotationBus of appStore.routeBus.rotationBuses) {
				if (rotationBus.startEnd === targetPlace) {
				setReturnJourneyRegNo(rotationBus.regNo);
				break; // Successfully stops the loop early
				}
			}
		}
		
	}, [appStore.routeBus?.rotationPlans[route.params.rotationPlan_index]?.busAssigns?.length]); 

	
	
	

	
	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};

	const hideEditModeDatePicker = () => {
		setEditModeDatePickerVisibility(false);
	};

	
	

	const onAssignBusAddPressBck = async() => {
		if(tabSelectedIndex){
			appStore.routeBus.rotationPlans[route.params.rotationPlan_index].addBusAssgin(returnJourneyRegNo, displayValueEdit);
			setSelectedIndexReturnJourneyRegNo(0);
		}else{
			appStore.routeBus.rotationPlans[route.params.rotationPlan_index].addBusAssgin(regNo, displayValueEdit);
			setSelectedIndexReturnJourneyRegNo(0);
			
		}
		addCallback(false);
	}


	const onAssignBusAddPress = async() => {
		
		const config: AxiosRequestConfig = {
			headers: {
				'Accept': 'application/json',
				'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		};

		const data = {
			regNo: "",
			runningNo: displayValueEdit
		};

		if(tabSelectedIndex==1){
			data.regNo = returnJourneyRegNo;
		}else{
			data.regNo = regNo;
		}

		try {
			console.log(`/routebuses/`+appStore.routeBus.objectId+`/rotationPlans/`+route.params.rotationPlan_index+`/busAssigns/add`);
			const response: AxiosResponse = await client.put(`/routebuses/`+appStore.routeBus.objectId+`/rotationPlans/`+route.params.rotationPlan_index+`/busAssigns/add`,data , config);
			if(response.status == 200){
				if(tabSelectedIndex==1){
					appStore.routeBus.rotationPlans[route.params.rotationPlan_index].addBusAssgin(returnJourneyRegNo, displayValueEdit);
					setSelectedIndexReturnJourneyRegNo(0);
				}else{
					appStore.routeBus.rotationPlans[route.params.rotationPlan_index].addBusAssgin(regNo, displayValueEdit);
					setSelectedIndexReturnJourneyRegNo(0);
					
				}
				addCallback(false);
			}
			
			
		} catch(err) {
			console.log(err);
		}
	}

	
	const onAssignBusEditPressbck = (): void => {	
		console.log("assignBusIndex::"+assignBusIndex);
		appStore.routeBus.rotationPlans[route.params.rotationPlan_index].busAssigns[assignBusIndex].setRunningNo(displayValueEdit);
		setAssignBusIndex(-1);
		setEdit(false);
	}

	const onAssignBusEditPress = async() => {
		
		const config: AxiosRequestConfig = {
			headers: {
				'Accept': 'application/json',
				'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		};

		const data = {
			regNo: "",
			runningNo: displayValueEdit
		};

		if(tabSelectedIndex==1){
			data.regNo = returnJourneyRegNo;
		}else{
			data.regNo = regNo;
		}

		try {
			console.log(`/routebuses/`+appStore.routeBus.objectId+`/rotationPlans/`+route.params.rotationPlan_index+`/busAssigns/`+assignBusIndex+`/edit`);
			const response: AxiosResponse = await client.put(`/routebuses/`+appStore.routeBus.objectId+`/rotationPlans/`+route.params.rotationPlan_index+`/busAssigns/`+assignBusIndex+`/edit`,data , config);
			if(response.status == 200){
				if(tabSelectedIndex==1){
					appStore.routeBus.rotationPlans[route.params.rotationPlan_index].busAssigns[assignBusIndex].setRegNo(returnJourneyRegNo);
				}else{
					appStore.routeBus.rotationPlans[route.params.rotationPlan_index].busAssigns[assignBusIndex].setRegNo(regNo);	
				}
				appStore.routeBus.rotationPlans[route.params.rotationPlan_index].busAssigns[assignBusIndex].setRunningNo(displayValueEdit);
				setAssignBusIndex(-1);
				setEdit(false);
			}
			
			
		} catch(err) {
			console.log(err);
		}
	}

	

	const onDeletePress = (): void => {
		refRBSheetDeleteConfirm.current.open()
	};

	const onDeleteConfirmCancelPress = (): void => {
		refRBSheetDeleteConfirm.current.close()
	};

	const onDeleteConfirmPressBck = (): void => {
		appStore.routeBus.rotationPlans[route.params.rotationPlan_index].deleteAssignBusByIndex(assignBusIndex);
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
			
			const response: AxiosResponse = await client.put(`/routebuses/`+appStore.routeBus.objectId+`/rotationPlans/`+route.params.rotationPlan_index+`/busAssigns/`+assignBusIndex+`/delete` , config);
			if(response.status == 200){
				appStore.routeBus.rotationPlans[route.params.rotationPlan_index].deleteAssignBusByIndex(assignBusIndex);
				refRBSheetDeleteConfirm.current.close()
			}
			
			
		} catch(err) {
			console.log(err);
		}
	}

	

	
	const onEditPress = async() => {
		
		console.log("****"+appStore.routeBus.getAllRunningNos());
		setDisplayValueEdit(appStore.routeBus.getAllRunningNos()[0]);
		setEdit(true);
		
	};

	const handleEditModeConfirm = (date) => {	
			hideEditModeDatePicker();  
			setSelectedTurn(selectedTurn+1); 
			console.warn("A date has been actualDate: ", date);
			console.warn("A date has been actualDate: ", format(date, 'p'));
			if(route.params?.journeyType=="RouteBusJourney"){
				appStore.routeBus.journey.schedules[route.params?.scheduleIndex].addTurnAfterIndex(timetableIndex,selectedTurn,"",format(date, 'HH:mm'),"",[],"","");
			}else if(route.params?.journeyType=="RouteBusReturnJourney"){
				appStore.routeBus.returnJourney.schedules[route.params?.scheduleIndex].addTurnAfterIndex(timetableIndex,selectedTurn,"",format(date, 'HH:mm'),"",[],"","");
			}
			
			//appStore.routeBusTimetable.addTurn("",format(date, 'HH:mm'),"",[],[]);	
	};

	


	const onRouteEditTimetableTypeSelect = async (index) => {
		console.log("##### index"+index);
		setSelectedIndexEdit(index);
		//console.log("##### runningNo"+appStore.routeBus.getAllRunningNos()[selectedIndexEdit]);
		setDisplayValueEdit(appStore.routeBus.getAllRunningNos()[index-1]);
	}

	const onRegNoSelect = async (index) => {
		setSelectedIndexRegNo(index);
		setRegNo(appStore.routeBus.rotationBuses?.filter(rotationBus => rotationBus?.startEnd === appStore.routeBus.journey.stoppings[0]?.place)[index-1].regNo);
	}

	const onReturnJourneyRegNoSelect = async (index) => {
		setSelectedIndexReturnJourneyRegNo(index);
		setReturnJourneyRegNo(appStore.routeBus.rotationBuses?.filter(rotationBus => rotationBus?.startEnd === appStore.routeBus.returnJourney.stoppings[0]?.place)[index-1].regNo);
	}

	

	const onEditClosePress = (): void => {	
		setSelectedIndex(new IndexPath(0));
		setSelectedDaysSelected(false);
		setSelectedDatesSelected(false);
		setRunningDays([2,3,4,5,6]);
		setEdit(false);
	};


	const handleDateConfirm = (date) => {	
		hideDatePicker();  
		console.warn("From date has been actualDate: ", format(date, 'yyyy-MM-dd'));
		//setSelectedTurn(selectedTurn+1); 
		console.warn("A date has been actualDate: ", date);
		console.warn("timetableIndex: ", timetableIndex);
		if(route.params?.journeyType=="RouteBusJourney"){
			appStore.routeBus.journey.schedules[route.params?.scheduleIndex].timetables[timetableIndex].addDate(selectedDate, format(date, 'yyyy-MM-dd'));
		}else if(route.params?.journeyType=="RouteBusReturnJourney"){
			appStore.routeBus.returnJourney.schedules[route.params?.scheduleIndex].timetables[timetableIndex].addDate(selectedDate,format(date, 'yyyy-MM-dd'));
		}
		setSelectedDate(selectedDate+1); 
		
		/*
		if(route.params?.journeyType=="RouteBusJourney"){
			appStore.routeBus.journey.schedules[route.params?.scheduleIndex].addTurnAfterIndex(timetableIndex,selectedTurn,"",format(date, 'HH:mm'),"",[],"","");
		}else if(route.params?.journeyType=="RouteBusReturnJourney"){
			appStore.routeBus.returnJourney.schedules[route.params?.scheduleIndex].addTurnAfterIndex(timetableIndex,selectedTurn,"",format(date, 'HH:mm'),"",[],"","");
		}
		*/
	};

	const onDeleteDate = (tIndex: number,index: number) => () =>  {
		if(route.params?.journeyType=="RouteBusJourney"){
			appStore.routeBus.journey.schedules[route.params?.scheduleIndex]?.timetables[tIndex]?.deleteDateByIndex(index);
		}else if(route.params?.journeyType=="RouteBusReturnJourney"){
			appStore.routeBus.returnJourney.schedules[route.params?.scheduleIndex]?.timetables[tIndex]?.deleteDateByIndex(index);
		}
		setSelectedDate(-1);
	}

	const onBusAssignPress = async (regNo,licenseNo,index) => {
		setAssignBusIndex(index);
		//setRegNo(regNo);
		//setLicenseNo(licenseNo);
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
					<View style={{ margin: 10}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Reg No</Text>
						{tabSelectedIndex == 0 && (
						<Select
							selectedIndex={selectedIndexRegNo}
							onSelect={(index) => onRegNoSelect(index)}
							value={regNo}>
							{appStore.routeBus.rotationBuses
								.filter(rotationBus => rotationBus?.startEnd === appStore.routeBus.journey.stoppings[0]?.place)
								.map((rotationBus, index) => (
									<SelectItem key={rotationBus?.id || index} title={rotationBus?.regNo} />
								))
								}
						</Select>
						)}
						{tabSelectedIndex != 0 && (
						<Select
							selectedIndex={selectedIndexReturnJourneyRegNo}
							onSelect={(index) => onReturnJourneyRegNoSelect(index)}
							value={returnJourneyRegNo}>
							{appStore.routeBus.rotationBuses
								.filter(rotationBus => rotationBus?.startEnd === appStore.routeBus.returnJourney.stoppings[0]?.place)
								.map((rotationBus, index) => (
									<SelectItem key={rotationBus?.id || index} title={rotationBus?.regNo} />
								))
								}
						</Select>
						)}
					</View>

					<View style={{ margin: 10}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Runnning No</Text>
						<Select
							selectedIndex={selectedIndexEdit}
							onSelect={(index) => onRouteEditTimetableTypeSelect(index)}
							value={displayValueEdit}>
							{appStore.routeBus.getAllRunningNos().map((runningNo, index) => (
							<SelectItem key={index} title={runningNo} />
							))}
						</Select>
					</View>
				</View>

				
				
				<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
					<Button style={{ flex: 1 , margin: 2, borderRadius:50, margin: 10 }} onPress={()=>onAssignBusAddPress()} >Add AssignBus</Button>
				</View>
			</View>
			
			)}

			{edit && (
			<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
			    <View style={{  padding: 1, margin: 5 ,flexDirection: "row", justifyContent: "flex-end"}}>	
					<AntDesign style={{top: 4}} name="close" size={18} color="#444" onPress={onEditClosePress} />
				</View>
				<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
					<View style={{ margin: 10}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Reg No</Text>
						{tabSelectedIndex == 0 && (
						<Select
							selectedIndex={selectedIndexRegNo}
							onSelect={(index) => onRegNoSelect(index)}
							value={regNo}>
							{appStore.routeBus.rotationBuses
								.filter(rotationBus => rotationBus?.startEnd === appStore.routeBus.journey.stoppings[0]?.place)
								.map((rotationBus, index) => (
									<SelectItem key={rotationBus?.id || index} title={rotationBus?.regNo} />
								))
								}
						</Select>
						)}
						{tabSelectedIndex != 0 && (
						<Select
							selectedIndex={selectedIndexReturnJourneyRegNo}
							onSelect={(index) => onReturnJourneyRegNoSelect(index)}
							value={returnJourneyRegNo}>
							{appStore.routeBus.rotationBuses
								.filter(rotationBus => rotationBus?.startEnd === appStore.routeBus.returnJourney.stoppings[0]?.place)
								.map((rotationBus, index) => (
									<SelectItem key={rotationBus?.id || index} title={rotationBus?.regNo} />
								))
								}
						</Select>
						)}
					</View>

					<View style={{ margin: 10}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Runnning No</Text>
						<Select
							selectedIndex={selectedIndexEdit}
							onSelect={(index) => onRouteEditTimetableTypeSelect(index)}
							value={displayValueEdit}>
							{appStore.routeBus.getAllRunningNos().map((runningNo, index) => (
							<SelectItem key={index} title={runningNo} />
							))}
						</Select>
					</View>
				</View>
				
				<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
					<Button style={{ flex: 1 , margin: 2, borderRadius:50, margin: 10 }} onPress={()=>onAssignBusEditPress()} >Edit AssignBus</Button>
				</View>
			</View>
			
			)}

			<View>
			<TabView
				selectedIndex={tabSelectedIndex}
				onSelect={index => setTabSelectedIndex(index)}>
				<Tab title={appStore.routeBus.journey.stoppings[0].place} style={{ padding: 10}}>
					<Layout style={{ flex: 1, justifyContent: 'left', alignItems: 'left', padding: 5 }}>
						{appStore.routeBus.rotationPlans[route.params.rotationPlan_index].busAssigns.slice().sort((a, b) => {
							return a.runningNo - b.runningNo;
						})?.map((busAssign,index) => (
							<>
							{appStore.routeBus.rotationBuses.find(product => product.regNo === busAssign.regNo)?.startEnd == appStore.routeBus.journey.stoppings[0].place && (
							<Card key={index} 
							style={[
							assignBusIndex != index? styles.item : styles.itemSelected
							]}
							onPress={()=>onBusAssignPress(busAssign.regNo,busAssign.runningNo,index)}>
								
								<Card>
									<Text style={styles.itemHeader}>Running No</Text>
									<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
										<Text>{busAssign.runningNo}</Text>
										
									</View>
								</Card>
								<Card>
									<Text style={styles.itemHeader}>Reg No</Text>
									<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
										<Text>{busAssign.regNo}</Text>	
									</View>
								</Card>

								
							</Card>
							)}
							</>
						
						))}
					</Layout>
				</Tab>
				
				<Tab title={appStore.routeBus.returnJourney.stoppings[0].place} style={{ padding: 10}}>
					<Layout style={{ flex: 1, justifyContent: 'left', alignItems: 'left', padding: 5 }}>
						{appStore.routeBus.rotationPlans[route.params.rotationPlan_index].busAssigns.slice().sort((a, b) => {
							return a.runningNo - b.runningNo;
						})?.map((busAssign,index) => (
							<>
							{appStore.routeBus.rotationBuses.find(product => product.regNo === busAssign.regNo)?.startEnd == appStore.routeBus.returnJourney.stoppings[0].place && (
							<Card key={index} 
							style={[
							assignBusIndex != index? styles.item : styles.itemSelected
							]}
							onPress={()=>onBusAssignPress(busAssign.regNo,busAssign.runningNo,index)}>
								
								<Card>
									<Text style={styles.itemHeader}>Running No</Text>
									<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
										<Text>{busAssign.runningNo}</Text>
										
									</View>
								</Card>
								<Card>
									<Text style={styles.itemHeader}>Reg No</Text>
									<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
										<Text>{busAssign.regNo}</Text>	
									</View>
								</Card>

								
							</Card>
							)}
							</>
						
						))}
					</Layout>
				</Tab>
				
			</TabView>
			</View>

			
			
			

			<DateTimePickerModal
				isVisible= {isDatePickerVisible}
				date={defaultDate}
				mode="date"
				display="inline"
				onConfirm={handleDateConfirm}
				onCancel={hideDatePicker}/>	

			<DateTimePickerModal
							isVisible={isEditModeDatePickerVisible}
							mode="time"
							date={defaultDate} 
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

