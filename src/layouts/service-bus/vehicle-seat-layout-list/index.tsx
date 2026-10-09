import { Button, Card, Text,CheckBox,Select,SelectItem,IndexPath ,Layout, TabView, Tab} from "@ui-kitten/components";
import React,{useRef,useState,useEffect} from "react";
import { StyleSheet, View, TouchableOpacity, TextInput,ScrollView,ActivityIndicator} from "react-native";
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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from 'date-fns'
//import SeatsLayout from "../../../components/bus-seat";
import { autorun } from 'mobx';

import SeatsLayout from "../../../components/bus-seat";


export default observer(React.forwardRef(({ navigation,addCallback, add },ref) => {

	const appStore = useStore(AppStore);
	const route = useRoute();

	const [vehicleSeatLayouts, setVehicleSeatLayouts] = useState([]);
	const [loading, setLoading] = useState(true);

	const [edit, setEdit] = useState(false);

	const [noOfRowSelectedIndex, setNoOfRowSelectedIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
    const rows = Array.from({ length: 20 }, (_, i) => ({
		key: (i + 1).toString(),
		value: `${i + 1}`
	}));
	const renderOptionRows = (day): React.ReactElement => (
		<SelectItem key={day.key} title={evaProps => <View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
			<Text style={{ paddingHorizontal: 5}}>{day.value}</Text>
		</View>} />
	);


	const [noOfColumnsLeftSelectedIndex, setNoOfColumnsLeftSelectedIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const [noOfColumnsRightSelectedIndex, setNoOfColumnsRightSelectedIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
    const columns = Array.from({ length: 3 }, (_, i) => ({
		key: (i + 1).toString(),
		value: `${i + 1}`
	}));
	const renderOptionNoOfColumns = (column): React.ReactElement => (
		<SelectItem key={column.key} title={evaProps => <View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
			<Text style={{ paddingHorizontal: 5}}>{column.value}</Text>
		</View>} />
	);


	const [noOfFoldableSeatsSelectedIndex, setNoOfFoldableSeatsSelectedIndex] = React.useState<IndexPath>(new IndexPath(0));

	const foldableSeats = Array.from({ length: 10 }, (_, i) => ({
	key: i.toString(),
	value: i.toString(),
	}));

	const renderOptionFoldableSeats = (seat: {
		key: string;
		value: string;
		}): React.ReactElement => (
		<SelectItem
			key={seat.key}
			title={seat.value}
		/>
	);

	const doorSeats = Array.from({ length: 10 }, (_, i) => ((i+1).toString()));

	const [selectedDoorSeatsIndex, setSelectedDoorSeatsIndex] = useState<IndexPath[]>([]);

	 const doorSeatsDisplayValue = selectedDoorSeatsIndex
    .map((index) => doorSeats[index.row])
    .join(', ');

	const emptySeats = Array.from({ length: 10 }, (_, i) => ((i+1).toString()));

	const [selectedEmptySeatsIndex, setSelectedEmptySeatsIndex] = useState<IndexPath[]>([]);

	 const emptySeatsDisplayValue = selectedEmptySeatsIndex
    .map((index) => emptySeats[index.row])
    .join(', ');




	const [title, setTitle] = React.useState<string>("");
	const [titleFocus, setTitleFocus] = React.useState<boolean>(false);
	const titleCustomStyle = titleFocus ? styles.inputContainerFocus : styles.inputContainer;
	const [titleErrorMessage, setTitleErrorMessage] = React.useState<string>("");

	
	
	const [licenseNo, setLicenseNo] = React.useState<string>("");
	const [licenseNoFocus, setLicenseNoFocus] = React.useState<boolean>(false);
	const licenseNoCustomStyle = licenseNoFocus ? styles.inputContainerFocus : styles.inputContainer;
	const [licenseNoErrorMessage, setLicenseNoErrorMessage] = React.useState<string>("");

	
	const [selectedIndex, setSelectedIndex] = useState(0);

	const [displayValue, setDisplayValue] = useState(null);

	const [selectedVehicleSeatLayoutId, setSelectedVehicleSeatLayoutId] = React.useState(null);

	const [selectedVehicleSeatLayoutIndex, setSlectedVehicleSeatLayoutIndex] = useState(-1);

	
	
	const refRBSheetActions = useRef();
	
	const refRBSheetDeleteConfirm = useRef();

	const refRBSheetEdit = useRef();



	
	
	const client = axios.create({
		baseURL: 'https://routes.lk:7007'
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

	const loadVehicleSeatLayouts = async() => {
		console.log("Load transport services...");
		const config: AxiosRequestConfig = {
			headers: {
				'Accept': 'application/json',
				'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
			};
			try {	
				const response: AxiosResponse = await client.get(`/vehicleSeatLayouts/getAll` , config);
				setVehicleSeatLayouts(response.data);  
			} catch(err) {
				console.log(err);
				
			}  
			setLoading(false);
		
	};

	useFocusEffect(
		React.useCallback(() => {
			loadVehicleSeatLayouts()
			return () => {
			// Do something when the screen is unfocused
			// Useful for cleanup functions
			};
		}, [])
	);

	

	const onAddClosePress = (): void => {		
		addCallback(false);
		//setRegNo("");
		setLicenseNo("");
	};

	const onEditClosePress = (): void => {		
		setEdit(false);
		//setRegNo("");
		setLicenseNo("");
	};

	
	
	const onVehicleSeatLayoutPress = async (vehicleSeatLayout,index) => {
		setSlectedVehicleSeatLayoutIndex(index);
		setSelectedVehicleSeatLayoutId(vehicleSeatLayout.id);
		appStore.vehcleSeatLayout.populate(vehicleSeatLayout);

		var indexPaths=[];
		appStore.vehcleSeatLayout.doorSeatNumbers.forEach(element => {
			indexPaths.push(new IndexPath(element));
		});
		setSelectedDoorSeatsIndex(indexPaths);

		var emptySpaceIndexPaths=[];
		appStore.vehcleSeatLayout.emptySeatNumbers.forEach(element => {
			emptySpaceIndexPaths.push(new IndexPath(element));
		});
		setSelectedEmptySeatsIndex(emptySpaceIndexPaths);

		refRBSheetActions.current.open();
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
			
			const response: AxiosResponse = await client.put(`/vehicleSeatLayouts/`+selectedVehicleSeatLayoutId+`/edit`, appStore.vehcleSeatLayout, config);
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

	const onNoOfRowsSelect = (index): void => {
		console.log("Slected index:"+index);
		setNoOfRowSelectedIndex(index);
		appStore.vehcleSeatLayout.setNoOfRows(Number(rows[index-1].value));
	};

	const onNoOfColumnsLeftSelect = (index): void => {
		setNoOfColumnsLeftSelectedIndex(index);
		appStore.vehcleSeatLayout.setNoOfColumnsLeft(Number(columns[index-1].value));
	};

	const onNoOfColumnsRightSelect = (index): void => {
		setNoOfColumnsRightSelectedIndex(index);
		appStore.vehcleSeatLayout.setNoOfColumnsRight(Number(columns[index-1].value));
	};

	const onNoOfFoldableSeatsSelect = (index: IndexPath) => {
		setNoOfFoldableSeatsSelectedIndex(index);

		const selectedValue = foldableSeats[index.row].value;

		appStore.vehcleSeatLayout.setNoOfFoldableSeats(Number(selectedValue));
	};
/*
	 noOfRows: types.optional(types.number, 20),   // BOOKING, CONFIRMING, TRAVELLING, CANCELLED
	  columnOne: types.optional(types.number, 2),
	  columnTwo: types.optional(types.number, 2),
	  hasFrontRowPassengerSeat: types.optional(types.boolean, false),
	  noOfFoldableSeats: types.optional(types.number, 0),
	  doorSeatNumbers: types.array(types.number),
	  emptySeatNumbers: types.array(types.number)
	*/

	const getSeatAllocations = (): [] => {
		var selectedSeats=[];
		appStore.vehcleSeatLayout.doorSeatNumbers.forEach(seat => {
			console.log("door seat:"+seat);
			selectedSeats.push({seatNumber: seat, seatType: 'door'});
		});
		appStore.vehcleSeatLayout.emptySeatNumbers.forEach(seat => {
			console.log("empty seat:"+seat);
			selectedSeats.push({seatNumber: seat, seatType: 'emptySpace'});
		});

		return selectedSeats;
		
	};

	const onDoorSeatsSelect = (index: IndexPath) => {
		setSelectedDoorSeatsIndex(index as IndexPath[]);
		appStore.vehcleSeatLayout.setDoorSeatNumbers(index);
	};

	const onEmptySpaceSelect = (index: IndexPath) => {
		setSelectedEmptySeatsIndex(index as IndexPath[]);
		appStore.vehcleSeatLayout.setEmptySeatNumbers(index);
	};

	

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
				
				
				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>Title</Text>
					</View>
					<View style={titleCustomStyle}>
						<TextInput key="title" placeholder="Rosa/Fuso Bus with 29 seats" onChangeText={appStore.vehcleSeatLayout.setTitle} value={appStore.vehcleSeatLayout.title} />
					</View>
				</View>


				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>No Of Row</Text>
						<View style={{ margin: 10}}>
						<Select
							placeholder='Default'
							value={appStore.vehcleSeatLayout.noOfRows}
							selectedIndex={noOfRowSelectedIndex}
							onSelect={(index: IndexPath) => onNoOfRowsSelect(index)}>
							{rows.map(renderOptionRows)}
						</Select>
					</View>
					</View>
				</View>


				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>No of Columns Left</Text>
						<View style={{ margin: 10}}>
						<Select
							placeholder='Default'
							value={appStore.vehcleSeatLayout.noOfColumnsLeft}
							selectedIndex={noOfRowSelectedIndex}
							onSelect={(index: IndexPath) => onNoOfColumnsLeftSelect(index)}>
							{columns.map(renderOptionNoOfColumns)}
						</Select>
					</View>
					</View>
				</View>


				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>No of Columns Right</Text>
						<View style={{ margin: 10}}>
						<Select
							placeholder='Default'
							value={appStore.vehcleSeatLayout.noOfColumnsRight}
							selectedIndex={noOfColumnsRightSelectedIndex}
							onSelect={(index: IndexPath) => onNoOfColumnsRightSelect(index)}>
							{columns.map(renderOptionNoOfColumns)}
						</Select>
					</View>
					</View>
				</View>

				<View style={{ margin: 10, borderRadius:10, borderWidth: 0, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<View style={{ margin: 10}}>
						<CheckBox style={{ margin: 2}}  checked={appStore.vehcleSeatLayout.hasFrontRowPassengerSeat} onChange={appStore.vehcleSeatLayout.setHasFrontRowPassengerSeat} >Passenger seat next to driver available</CheckBox>
					</View>
					</View>
				</View>


				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>No of Foldable Seats</Text>
						<View style={{ margin: 10}}>
						<Select
							placeholder="Default"
							value={String(appStore.vehcleSeatLayout.noOfFoldableSeats)}
							selectedIndex={noOfFoldableSeatsSelectedIndex}
							onSelect={(index: IndexPath) => onNoOfFoldableSeatsSelect(index)}
							>
							{foldableSeats.map(renderOptionFoldableSeats)}
							</Select>
					</View>
					</View>
				</View>

				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Door Seats Numbers</Text>
						<View style={{ margin: 10}}>
						<Select
							multiSelect={true}
							placeholder='Select options...'
							value={doorSeatsDisplayValue}
							selectedIndex={selectedDoorSeatsIndex}
							// Typings allow IndexPath | IndexPath[] here
							// onSelect={(index) => setSelectedDoorSeatsIndex(index as IndexPath[])}
							onSelect={(index) => onDoorSeatsSelect(index)}
						>
							{doorSeats.map((title, index) => (
							<SelectItem key={index} title={title} />
							))}
						</Select>
						
					</View>
					</View>
				</View>

				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Empty Seats Numbers</Text>
						<View style={{ margin: 10}}>
						<Select
							multiSelect={true}
							placeholder='Select options...'
							value={emptySeatsDisplayValue}
							selectedIndex={selectedEmptySeatsIndex}
							onSelect={(index) => onEmptySpaceSelect(index)}
							// Typings allow IndexPath | IndexPath[] here
							//onSelect={(index) => setSelectedEmptySeatsIndex(index as IndexPath[])}
						>
							{emptySeats.map((title, index) => (
							<SelectItem key={index} title={title} />
							))}
						</Select>
						
					</View>
					</View>
				</View>
				
					
			</View>
		

			<View style={{flexDirection: "row", justifyContent: "space-between"}}>
				<Button size="giant" style={{ flex: 3 , margin: 5, borderRadius:50, margin: 10}} onPress={()=>onCreatePress()}>Create</Button>
			</View>

			 <SeatsLayout
							key={`${appStore.vehcleSeatLayout.noOfRows}-${appStore.vehcleSeatLayout.noOfColumnsLeft}-${appStore.vehcleSeatLayout.noOfColumnsRight}-${appStore.vehcleSeatLayout.noOfFoldableSeats}-${appStore.vehcleSeatLayout.doorSeatNumbers}-${appStore.vehcleSeatLayout.emptySeatNumbers}-${appStore.vehcleSeatLayout.hasFrontRowPassengerSeat}`}
							row={appStore.vehcleSeatLayout.noOfRows}
							hasFrontRowPassengerSeat={appStore.vehcleSeatLayout.hasFrontRowPassengerSeat}
							noOfFoldableSeats={appStore.vehcleSeatLayout.noOfFoldableSeats}
							layout={{ columnOne: appStore.vehcleSeatLayout.noOfColumnsLeft, columnTwo: appStore.vehcleSeatLayout.noOfColumnsRight}}
							selectedSeats={getSeatAllocations()}
							numberTextStyle={{ fontSize: 12 }}
							
							getBookedSeats={(seats) => {
							  console.log('getBookedSeats :: ', seats);
							}}/>

			</View>

			)}

			

			{edit && (
			<View>
				<View style={{  padding: 1, margin: 5 ,flexDirection: "row", justifyContent: "flex-end"}}>	
					<AntDesign style={{top: 4}} name="close" size={18} color="#444" onPress={onEditClosePress} />
				</View>
			
			<View>
				
				
				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>Title</Text>
					</View>
					<View style={titleCustomStyle}>
						<TextInput key="title" placeholder="Rosa/Fuso Bus with 29 seats" onChangeText={appStore.vehcleSeatLayout.setTitle} value={appStore.vehcleSeatLayout.title} />
					</View>
				</View>


				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>No Of Row</Text>
						<View style={{ margin: 10}}>
						<Select
							placeholder='Default'
							value={appStore.vehcleSeatLayout.noOfRows}
							selectedIndex={noOfRowSelectedIndex}
							onSelect={(index: IndexPath) => onNoOfRowsSelect(index)}>
							{rows.map(renderOptionRows)}
						</Select>
					</View>
					</View>
				</View>


				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>No of Columns Left</Text>
						<View style={{ margin: 10}}>
						<Select
							placeholder='Default'
							value={appStore.vehcleSeatLayout.noOfColumnsLeft}
							selectedIndex={noOfRowSelectedIndex}
							onSelect={(index: IndexPath) => onNoOfColumnsLeftSelect(index)}>
							{columns.map(renderOptionNoOfColumns)}
						</Select>
					</View>
					</View>
				</View>


				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>No of Columns Right</Text>
						<View style={{ margin: 10}}>
						<Select
							placeholder='Default'
							value={appStore.vehcleSeatLayout.noOfColumnsRight}
							selectedIndex={noOfColumnsRightSelectedIndex}
							onSelect={(index: IndexPath) => onNoOfColumnsRightSelect(index)}>
							{columns.map(renderOptionNoOfColumns)}
						</Select>
					</View>
					</View>
				</View>

				<View style={{ margin: 10, borderRadius:10, borderWidth: 0, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<View style={{ margin: 10}}>
						<CheckBox style={{ margin: 2}}  checked={appStore.vehcleSeatLayout.hasFrontRowPassengerSeat} onChange={appStore.vehcleSeatLayout.setHasFrontRowPassengerSeat} >Passenger seat next to driver available</CheckBox>
					</View>
					</View>
				</View>


				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>No of Foldable Seats</Text>
						<View style={{ margin: 10}}>
						<Select
							placeholder="Default"
							value={String(appStore.vehcleSeatLayout.noOfFoldableSeats)}
							selectedIndex={noOfFoldableSeatsSelectedIndex}
							onSelect={(index: IndexPath) => onNoOfFoldableSeatsSelect(index)}
							>
							{foldableSeats.map(renderOptionFoldableSeats)}
							</Select>
					</View>
					</View>
				</View>

				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Door Seats Numbers</Text>
						<View style={{ margin: 10}}>
						<Select
							multiSelect={true}
							placeholder='Select options...'
							value={doorSeatsDisplayValue}
							selectedIndex={selectedDoorSeatsIndex}
							// Typings allow IndexPath | IndexPath[] here
							// onSelect={(index) => setSelectedDoorSeatsIndex(index as IndexPath[])}
							onSelect={(index) => onDoorSeatsSelect(index)}
						>
							{doorSeats.map((title, index) => (
							<SelectItem key={index} title={title} />
							))}
						</Select>
						
					</View>
					</View>
				</View>

				<View style={{ margin: 10, borderRadius:10, borderWidth: 1, borderColor: "#eee"}}>	
					<View style={{ flexDirection: "column",  justifyContent: 'space-between'}}>
						<Text style={{ padding: 5, paddingLeft: 10}}>Empty Seats Numbers</Text>
						<View style={{ margin: 10}}>
						<Select
							multiSelect={true}
							placeholder='Select options...'
							value={emptySeatsDisplayValue}
							selectedIndex={selectedEmptySeatsIndex}
							onSelect={(index) => onEmptySpaceSelect(index)}
							// Typings allow IndexPath | IndexPath[] here
							//onSelect={(index) => setSelectedEmptySeatsIndex(index as IndexPath[])}
						>
							{emptySeats.map((title, index) => (
							<SelectItem key={index} title={title} />
							))}
						</Select>
						
					</View>
					</View>
				</View>
				
					
			</View>
		

			<View style={{flexDirection: "row", justifyContent: "space-between"}}>
					<Button size="giant" style={{ flex: 3 , margin: 5, borderRadius:50, margin: 10}} onPress={()=>onUpdatePress()}>Edit</Button>
				</View>

			 <SeatsLayout
							key={`${appStore.vehcleSeatLayout.noOfRows}-${appStore.vehcleSeatLayout.noOfColumnsLeft}-${appStore.vehcleSeatLayout.noOfColumnsRight}-${appStore.vehcleSeatLayout.noOfFoldableSeats}-${appStore.vehcleSeatLayout.doorSeatNumbers}-${appStore.vehcleSeatLayout.emptySeatNumbers}-${appStore.vehcleSeatLayout.hasFrontRowPassengerSeat}`}
							row={appStore.vehcleSeatLayout.noOfRows}
							hasFrontRowPassengerSeat={appStore.vehcleSeatLayout.hasFrontRowPassengerSeat}
							noOfFoldableSeats={appStore.vehcleSeatLayout.noOfFoldableSeats}
							layout={{ columnOne: appStore.vehcleSeatLayout.noOfColumnsLeft, columnTwo: appStore.vehcleSeatLayout.noOfColumnsRight}}
							selectedSeats={getSeatAllocations()}
							numberTextStyle={{ fontSize: 12 }}
							
							getBookedSeats={(seats) => {
							  console.log('getBookedSeats :: ', seats);
							}}/>

			</View>

			)}

			
			<View>	
						{vehicleSeatLayouts?.map((vehcleSeatLayout,index) => (
							
							<Card key={index} 
							style={[
							selectedVehicleSeatLayoutIndex != index? styles.item : styles.itemSelected
							]}
							onPress={()=>onVehicleSeatLayoutPress(vehcleSeatLayout,index)}>
									<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
										<Text>{vehcleSeatLayout.title}</Text>	
									</View>
								
								
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
