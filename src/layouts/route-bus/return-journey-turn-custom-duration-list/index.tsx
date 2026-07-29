import { Select, TopNavigationAction, IndexPath,SelectItem } from "@ui-kitten/components";
import { Button, Card, CheckBox, List, Divider,Input } from "@ui-kitten/components";
import React,{useState,useEffect,useRef} from "react";
import { useRoute } from "@react-navigation/native"
import { StyleSheet, View , ListRenderItemInfo,Image, TouchableOpacity,Pressable, Text} from "react-native";
import AppStore from "../../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";
import { toJS } from "mobx";

import { ScrollView } from 'react-native-virtualized-view';
import { DayPicker } from '@routeslk/react-native-picker-weekday'

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';


import DateTimePickerModal from "react-native-modal-datetime-picker";
import { addHours, format } from 'date-fns';

import RBSheet from 'react-native-raw-bottom-sheet';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const { addMinutes } = require("date-fns");






//const RouteBusJourneyDetails = ({ navigation }): React.ReactElement => {
export default observer(React.forwardRef(({ navigation,addCallback, add },ref) => {

	const route = useRoute();

	const appStore = useStore(AppStore);

	const [doRefersh, setDoRefresh] = useState(false);

	const [defaultDate, setDefaultDate] = React.useState<Date>(new Date());

	const refRBSheetActions = useRef();

	const refRBSheetDeleteConfirm = useRef();

	
	const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  
	const [stoppingPlace, setStoppingPlace] = useState("");
	
	const [selectedIndexEdit, setSelectedIndexEdit] = useState(new IndexPath(0));
  	
	const [isEditModeDatePickerVisible, setEditModeDatePickerVisibility] = useState(false);


	const client = axios.create({
		baseURL: 'https://routes.lk:7007'
	});

	

	const hideEditModeDatePicker = () => {
		setEditModeDatePickerVisibility(false);
	};

	const onDeletePress = (): void => {
		refRBSheetDeleteConfirm.current.open()
	};

	const onDeleteConfirmCancelPress = (): void => {
		refRBSheetDeleteConfirm.current.close()
	};

	const onDeleteConfirmPress = (): void => {
		var turn = appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex];
		turn.deleteStoppingTimeByPlace(stoppingPlace);
		refRBSheetDeleteConfirm.current.close()
		refRBSheetActions.current.close()
		setDoRefresh(true);
	};


	
	const handleEditModeConfirm = (date) => {	
			hideEditModeDatePicker();  
			
			var turn = appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex];
			var sPlace = turn.getStoppingTimeByPlace(stoppingPlace);
			
			if(sPlace){
				turn.updateStoppingTime(stoppingPlace,0,format(date, 'HH:mm'));
			}else{
				turn.addStoppingTime(stoppingPlace,0,format(date, 'HH:mm'));
			}
			setDefaultDate(date);
			
			console.log(JSON.stringify(toJS(appStore.routeBus)));	
	};

	
	const getStoppingTime = (place, duration): string => {

		var turn = appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex];
		var stoppingPlace = turn.getStoppingTimeByPlace(place);
		console.log(">>"+place);
		if(stoppingPlace){
			return stoppingPlace.time;
		}

		var oldDate = new Date();
		console.log("Date1"+oldDate);
		const [hours, minutes] = appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex].startTime.split(':');
		console.log("hours>>"+hours);
		console.log("minutes>>"+minutes);
		oldDate.setHours(hours, minutes, 0, 0); 

		const hoursMatch = duration.match(/(\d+)h/);
		const minsMatch = duration.match(/(\d+)mins/);
		console.log("duration>>"+duration);
		
					
		const hr = hoursMatch ? parseInt(hoursMatch[1]) : 0;
		const min = minsMatch ? parseInt(minsMatch[1]) : 0;	
		console.log("hr>>"+hr+" mins>>"+min);
		
		var newDate = addHours(oldDate, hr);
		console.log("Date3"+newDate);
		var newDate2 = addMinutes(newDate, min);
		console.log("New date 2:"+newDate2);


		return format(newDate2, 'HH:mm');
	};

	const onTimeEditPress = (stopping): void => {	
		setStoppingPlace(stopping.place);
		var time = getStoppingTime(stopping.place, stopping.duration);
		const [hours, minutes] = time.split(':');
		defaultDate.setHours(hours, minutes, 0, 0); 
		setEditModeDatePickerVisibility(true);
		
	};

	const getCardStyle = (place) => {	
		var turn = appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex];
		var sPlace = turn.getStoppingTimeByPlace(place);
			
		if(sPlace){
			return styles.customTimeItem;
		}else{
			return styles.item;
		}
		
	};

	const onStoppingTimePress = async (stopping,index) => {
		var turn = appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex];
		var sPlace = turn.getStoppingTimeByPlace(stopping.place);
		setStoppingPlace(stopping.place);
		if(sPlace){
			refRBSheetActions.current.open();
		}
		
	};


	useEffect(() => {
    
    }, [appStore.routeBus.returnJourney.timetables[route.params.timetableIndex].turns[route.params.turnIndex].stoppingTimes.length]); 
	

	
	return (
	
		<ScrollView>
			
			<View>	
				{appStore.routeBus.returnJourney.stoppings.map(function(stopping, index){	
					return  <Card key={index} style={getCardStyle(stopping.place)} onPress={()=>onStoppingTimePress(stopping,index)}>
					
									<View style={{   marginVertical:10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
									<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
										<Text style={{ padding: 5, paddingLeft: 10}}>Location</Text>
										<View style={{backgroundColor: "#F1F1F1"}}>
											<Input textStyle={{ color: '#1f1e1e' }} value={stopping.place} disabled={true}/>
										</View>
										
									</View>
								</View>
					
									
									<View style={{   marginVertical:10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
									<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
										<Text style={{ padding: 5, paddingLeft: 10}}>Time</Text>
										<View style={{backgroundColor: "#F1F1F1",padding:10,paddingLeft: 20}} >
											
											<TouchableOpacity onPress={() => onTimeEditPress(stopping)}>
												<Text>{getStoppingTime(stopping.place, stopping.duration)} </Text>
											</TouchableOpacity>
										</View>
										
										
									</View>
								</View>
									
								</Card>
				})}	

				 

			
			</View>

			

			<DateTimePickerModal
							isVisible={isEditModeDatePickerVisible}
							mode="time"
							date={defaultDate} 
							timeZoneName={'Asia/Colombo'} 
							onConfirm={handleEditModeConfirm}
							onCancel={hideEditModeDatePicker}/>	


					
			<RBSheet ref={refRBSheetActions} draggable dragOnContent height={180}>
				<View style={styles.listContainer}>
					<View>
						<TouchableOpacity
							key="upload"
							style={styles.listButton}
							onPress={() => onDeletePress()}>
							<MaterialIcons name="delete" size={24} color="red" style={styles.listIconDelete} />
							<Text style={styles.listLabel}>Delete</Text>
						</TouchableOpacity>
						</View>
				</View>
				<RBSheet draggable dragOnContent key="busTimetableDeleteConfirmActions" ref={refRBSheetDeleteConfirm} height={180}>
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
		borderColor: "#ece2e2"
	},
	customTimeItem: {
		marginVertical: 8,
		marginHorizontal: 10,
		borderWidth: 1,
		borderColor: "#595353"
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

