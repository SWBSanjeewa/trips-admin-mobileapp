import { Button, Card, Layout, List, Select, SelectItem, Text,Avatar, TopNavigation, TopNavigationAction, Input } from "@ui-kitten/components";
import React,{useState,useEffect,useRef} from "react";
import { useRoute } from "@react-navigation/native"
import { StyleSheet, View , Text as RNText, TouchableOpacity, Platform, PermissionsAndroid} from "react-native";
import { Passenger,Owner } from "./extra/data";
import AppStore from "../../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";
import { CachedImage } from '@georstat/react-native-image-cache';
import { toJS } from "mobx";
import { SafeAreaLayout } from "../../../components/safe-area-layout.component";
import RBSheet from 'react-native-raw-bottom-sheet';
import { ArrowIosBackIcon } from "../../../components/icons";
import {
	MaterialIcons as MDIcon,
	Ionicons as Ionicons,
} from '@expo/vector-icons';
import { PlusOutlineIcon } from "../../../components/icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useFocusEffect } from '@react-navigation/native';

import ImageLoad from "../../service-bus/image-load/index";
import { Datepicker, RangeDatepicker } from '@ui-kitten/components';

import { selectContactPhone } from 'react-native-select-contact';
import { format ,add} from 'date-fns'

const TourSchedulesList = ({ navigation }): React.ReactElement => {

	const route = useRoute();

	const refRBSheetAdd = useRef();

	const refRBSheetAddManually = useRef();

	const refRBSheetEdit = useRef();

	const [startDate, setStartDate] = useState();

	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

	const appStore = useStore(AppStore);

	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};

	useEffect(() => {
		console.log("useEffect");	
		console.log("schedules:::"+appStore.tour.schedules.length);
		console.log(JSON.stringify(toJS(appStore.tour)));	
	});

	useFocusEffect(
		    
			React.useCallback(() => {
				console.log("useFocusEffect");
				
				//console.log("reload::::"+route.params?.reload);
				
				console.log("schedules:::"+appStore.tour.schedules.length);
				
			  return () => {
				
			  };
			}, [true])
	);


	const handleConfirm = (date) => {
			//console.warn("A date has been picked: ", date);
			//setTime(date);
		//	var newdate  = new TZDate("2024-09-12T00:00:00Z", "Asia/Singapore");
	
			hideDatePicker();  
			//const timeZoneOffsetInMinutes = date.getTimezoneOffset();
			//console.log(">>"+timeZoneOffsetInMinutes);
			//const utcTime = date.getTime() - (timeZoneOffsetInMinutes * 60000);
			//const actualDate = new Date(utcTime); //setting the actual date on dateTimePicker renders the correct date on calendar.
			console.warn("A date has been actualDate: ", date);
			console.warn("A date has been actualDate: ", format(date, 'yyyy-MM-dd'));

			console.warn("A date has been actualDate +2 : ", add(date, { days: 2 }));

			appStore.tour.addSchedule("","",format(date, 'yyyy-MM-dd'), format(date, 'yyyy-MM-dd'),format(date, 'yyyy-MM-dd'),format(date, 'yyyy-MM-dd'),"",[]);
			//appStore.tour.addSc.setTime(format(date, 'hh:mm a'));

			//setStartDate(date);
			
		};
	
	
	const resetValues = (): void => {
		//setName("");
		//setMobileNumber("");
	};

	const isValidValues = (): any => {
		
		var inputValid =true;

		

		return inputValid;
	}



	
	const onDatesSelected = (startDate) => {
		setStartDate(startDate);
		console.log("## "+startDate);
		appStore.tour.addSchedule("","",startDate, startDate,startDate,startDate,"",[]);
		//refRBSheetAdd.current.close();
		//setRange(null);
		//navigation.navigate("ContactList", { "action": "add-owner"});
		//getPhoneNumber();
	};

	const onAddManuallyPress = async () => {
		// refRBSheetOwnerAdd.current.close();
		refRBSheetAddManually.current.open();
	};


	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
	);

	const onAddPress = (): void => {
		setDatePickerVisibility(true);
	};

	const renderAddAction = (): React.ReactElement => (
		<TopNavigationAction icon={PlusOutlineIcon} onPress={onAddPress} />
	);

	/*
	const renderAddAction = (): React.ReactElement => (
		<TopNavigationAction icon={props => (
			<Button style={{ borderRadius:20, backgroundColor: "green"}} size="small" onPress={onAddOwnerPress}> + Add </Button>
		)}  />
	);
	*/

	
	const onActionsPress = (schedule,index): void => {	
		navigation && navigation.navigate("TourSchedule", {index: index});
	};

	const onScheduleFocus = (schedule): void => {	
		console.log()
		//navigation && navigation.navigate("TourSchedule", {id: schedule.id});
	};

	const onAddButtonPress = (): void => {
		if(isValidValues()){
			appStore.transportService.addOwner(name, mobileNumber);
			resetValues();
			refRBSheetAddManually.current.close();
		}
	};

	
	const loadingCompo = () => {
		return <Text>Test</Text>;
	};

	const renderItem = (schedule,index): React.ReactElement => (
		<Card  key={index} style={styles.item} onPress={()=>onActionsPress(schedule,index)} onFocus={()=>onScheduleFocus(schedule)}>
			<View style={{ flexDirection: "row",  justifyContent: 'flex-start', margin: 2}}>
				<View style={{ padding: 5, height: 45}}>
					<View style={{ padding: 2}}>
						{Number(appStore.tour.noOfDays) > 1 && 
							<Text>{schedule.tourStartDate} - {format(add(new Date(schedule.tourStartDate), { days: Number(appStore.tour.noOfDays)-1}),'yyyy-MM-dd')}</Text>
						}
						{Number(appStore.tour.noOfDays) == 1 && 
							<Text>{schedule.tourStartDate}</Text>
						}	
					</View>
				</View>
			</View>
		</Card>
	);

	


	return (
		
		<SafeAreaLayout style={styles.container} insets="top">
			<TopNavigation title={props => (
				<RNText {...props} style={{fontWeight: "500", fontSize: 18}}>
				Schedules
				</RNText>)} accessoryLeft={renderBackAction} accessoryRight={renderAddAction} />
			
				{appStore.tour.schedules.length == 0 && 
					<Text style={{paddingLeft: 18}}>No schedules yet</Text>
				}
				
				<View style={{ paddingHorizontal: 10 }}>
				{appStore.tour.schedules.map(function(schedule, index){
					
					return renderItem(schedule,index);		
				})}	
				</View>
				
				<DateTimePickerModal
							isVisible= {isDatePickerVisible}
							date={startDate}
							mode="date"
							onConfirm={handleConfirm}
							onCancel={hideDatePicker}/>	
		</SafeAreaLayout>	
		
	);
};

const styles = StyleSheet.create({

	container: {
		flex: 1,
	},
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
	itemContentIcon: {
		fontSize: 20,
		color: '#666',
	}
	
});

export default observer(TourSchedulesList);
