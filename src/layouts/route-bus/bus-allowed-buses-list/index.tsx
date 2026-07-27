import { Button, Card, Text,Input } from "@ui-kitten/components";
import React,{useRef,useState} from "react";
import { StyleSheet, View, TouchableOpacity, TextInput,ScrollView,Pressable} from "react-native";
import AppStore from "../../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";
import { toJS } from "mobx";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRoute } from "@react-navigation/native"

import {
	MaterialIcons as MDIcon
} from '@expo/vector-icons';
import RBSheet from 'react-native-raw-bottom-sheet';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from 'date-fns'


export default observer(React.forwardRef(({ navigation,addCallback, add },ref) => {

	const appStore = useStore(AppStore);
	const route = useRoute();

	const [regNo, setRegNo] = React.useState<string>("");
	const [date, setDate] = React.useState<string>("");
	const [regNoFocus, setRegNoFocus] = React.useState<boolean>(false);
	const regNoCustomStyle = regNoFocus ? styles.inputContainerFocus : styles.inputContainer;
	const [regNoErrorMessage, setRegNoErrorMessage] = React.useState<string>("");
	
	
	const [licenseNo, setLicenseNo] = React.useState<string>("");
	const [licenseNoFocus, setLicenseNoFocus] = React.useState<boolean>(false);
	const licenseNoCustomStyle = licenseNoFocus ? styles.inputContainerFocus : styles.inputContainer;
	const [licenseNoErrorMessage, setLicenseNoErrorMessage] = React.useState<string>("");

	const [allowedBusIndex, setAllowedBusIndex] = React.useState<number>(-1);
	
	const refRBSheetActions = useRef();
	
	const refRBSheetDeleteConfirm = useRef();

	const refRBSheetEdit = useRef();

	const [startDate, setStartDate] = useState();

	const [isDatePickerVisible, setDatePickerVisible] = useState(false);

	const hideDatePicker = () => {
		setDatePickerVisible(false);
	};


	const isValidValues = (): any => {
		
		var inputValid =true;

		if(regNo==""){
			setRegNoErrorMessage("Name is mandatory");	
			inputValid =false;
		}

		return inputValid;
	}

	
	const onCreatePress = async() => {
		
		if(appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].allowedBuses.length < 2){
			isValidValues()
			appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].addAllowedBus(regNo,licenseNo,date);
			console.log(JSON.stringify(toJS(appStore.routeBus)));	
			setRegNo("");
			setLicenseNo("");
			setDate("");
			addCallback(false);
		}else{
			console.log("Maximum 2 allowed");
			addCallback(false);
		}

	}

	const onAddClosePress = (): void => {		
		addCallback(false);
		setRegNo("");
		setLicenseNo("");
	};

	const onCreatePressBck = async() => {
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };
		  try {
			  if(isValidValues()){
				console.log("##### "+JSON.stringify(toJS(appStore.transportService)));	
				const response: AxiosResponse = await client.post(`/transportServices/create`, appStore.transportService , config);
				console.log(response.status);
				console.log(response.data.json); 
				appStore.transportService.reset();
				navigation && navigation.navigate("TransportServiceList");
			  }
		  } catch(err) {
			console.log(err);
		  }  
	}

	
	const onAllowedBusPress = async (regNo,licenseNo,date,index) => {
		setAllowedBusIndex(index);
		setRegNo(regNo);
		setLicenseNo(licenseNo);
		setDate(date);
		refRBSheetActions.current.open();
	};

	const onEditPress = async() => {
		refRBSheetEdit.current.open();
	};

	const onDeletePress = (): void => {
		refRBSheetDeleteConfirm.current.open()
	};

	const onUpdatePress = (): void => {
		//appStore.routeBus.updateAllowedBusByIndex(regNo, licenseNo, allowedBusIndex);
		appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].updateAllowedBusByIndex(regNo, licenseNo, date, allowedBusIndex);
		setRegNo("");
		setLicenseNo("");
		setDate("");
		refRBSheetEdit.current.close();
		refRBSheetActions.current.close();
	};

	const onDeleteConfirmCancelPress = (): void => {
		refRBSheetDeleteConfirm.current.close()
	};

	const onDeleteConfirmPress = (): void => {
		appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex].deleteAllowedBusByIndex(allowedBusIndex);
		setRegNo("");
		setLicenseNo("");
		refRBSheetDeleteConfirm.current.close();
		refRBSheetActions.current.close();
	};

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

		//console.warn("A date has been actualDate +2 : ", add(date, { days: 2 }));

		//appStore.tour.addSchedule("","",format(date, 'yyyy-MM-dd'), format(date, 'yyyy-MM-dd'),format(date, 'yyyy-MM-dd'),format(date, 'yyyy-MM-dd'),"",[]);
		//appStore.tour.addSc.setTime(format(date, 'hh:mm a'));
		console.warn("A date has been actualDate: XXX", format(date, 'yyyy-MM-dd'));
		setDate(format(date, 'yyyy-MM-dd'));
		
	};

	const onSetRunningDatePress = (): void => {
		setDatePickerVisible(true);
	};

	
	
	return (
		
		<ScrollView>

			{add && (
			<View>
				 <View style={{  padding: 1, margin: 5 ,flexDirection: "row", justifyContent: "flex-end"}}>	
					<AntDesign style={{top: 4}} name="close" size={18} color="#444" onPress={onAddClosePress} />
				</View>
			
			<View>

				<Card style={{ margin: 10, borderRadius:10}}>
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Running Date</Text>
						<View style={{backgroundColor: "#F1F1F1"}}>
							<Pressable onPress={() => onSetRunningDatePress()}>
							<View pointerEvents="none">
								<Input placeholder="Date..." value={date}/>
							</View>
						</Pressable>
						</View>
					</View>
				</Card>
				
				
				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>RegNo</Text>
					</View>
					<View style={regNoCustomStyle}>
						<TextInput key="regno" placeholder="NB-2222" onChangeText={setRegNo} value={regNo} />
					</View>
				</View>
				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>License No</Text>
					</View>
					<View style={licenseNoCustomStyle}>
						<TextInput placeholder="12323" onChangeText={setLicenseNo} value={licenseNo} />
					</View>
				</View>
				
			</View>
		

			<View style={{flexDirection: "row", justifyContent: "space-between"}}>
				<Button size="giant" style={{ flex: 3 , margin: 5, borderRadius:50, margin: 10}} onPress={()=>onCreatePress()}>Create</Button>
			</View>

			</View>

			)}


			<View>	
				
				{appStore.routeBus.journey.timetables[route.params.timetableIndex].turns[route.params.turnIndex]?.allowedBuses?.map((allowedBus,index) => (
					
					<Card key={index} 
					style={[
				     allowedBusIndex != index? styles.item : styles.itemSelected
					]}
					onPress={()=>onAllowedBusPress(allowedBus.regNo,allowedBus.licenseNo,allowedBus.date,index)}>
						
						<Card style={{ margin: 10}}>
							<Text style={styles.itemHeader}>Reg No</Text>
							<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
								<Text>{allowedBus.regNo}</Text>
								
							</View>
						</Card>

						{allowedBus.licenseNo!= "" && (
						
						<Card style={{ margin: 10}}>
							<Text style={styles.itemHeader}>License No</Text>
							<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
								<Text>{allowedBus.licenseNo}</Text>
								
							</View>
						</Card>
						)}

						{allowedBus.date!= "" && (
						
						<Card style={{ margin: 10}}>
							<Text style={styles.itemHeader}>Date</Text>
							<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
								<Text>{allowedBus.date}</Text>
								
							</View>
						</Card>
						)}
						
					
					</Card>
				))}

				 

			
			</View>

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
			<RBSheet draggable dragOnContent key="" ref={refRBSheetEdit} height={500}>
				<View>
				
				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>RegNo</Text>
					</View>
					<View style={regNoCustomStyle}>
						<TextInput placeholder="NB-2222" onChangeText={setRegNo} value={regNo} />
					</View>
				</View>
				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>License No</Text>
					</View>
					<View style={licenseNoCustomStyle}>
						<TextInput placeholder="12323" onChangeText={setLicenseNo} value={licenseNo} />
					</View>
				</View>
				
			</View>
			</RBSheet>
			<RBSheet draggable dragOnContent key="busAllowedBusEdit" ref={refRBSheetEdit} height={450}>
					<View>
						<Card style={{ margin: 10, borderRadius:10}}>
						<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
							<Text style={{ padding: 5, paddingLeft: 10}}>Running Date</Text>
							<View style={{backgroundColor: "#F1F1F1"}}>
								<Pressable onPress={() => onSetRunningDatePress()}>
								<View pointerEvents="none">
									<Input placeholder="Date..." value={date}/>
								</View>
							</Pressable>
							</View>
						</View>
					</Card>

						<View style={{padding: 10}}>
							<Text style={{padding: 15}}>Reg No</Text>
						
							<Input
								style={{paddingHorizontal: 10}}
								placeholder="Name"
								value={regNo}
								selectionColor="#197519"
								cursorColor="#197519"
								onChangeText={(text) => setRegNo(text)} 
							/>
						</View>

						<View style={{padding: 10}}>
							<Text style={{padding: 15}}>License No</Text>
						
							<Input
								style={{paddingHorizontal: 10}}
								placeholder="License Number"
								value={licenseNo}
								selectionColor="#197519"
								cursorColor="#197519"
								onChangeText={(text) => setLicenseNo(text)} 
							/>
						</View>
						
						<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
						<Button style={{ flex: 1, borderRadius:50, margin: 10}} size="large" onPress={()=>onUpdatePress()}>Update</Button>
						</View>
					</View>
				</RBSheet>

				<DateTimePickerModal
							isVisible= {isDatePickerVisible}
							date={startDate}
							mode="date"
							onConfirm={handleConfirm}
							onCancel={hideDatePicker}/>	
			
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
