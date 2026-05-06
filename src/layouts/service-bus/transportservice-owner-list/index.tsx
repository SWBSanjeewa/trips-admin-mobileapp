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
import AntDesign from '@expo/vector-icons/AntDesign';

import { RoutesValidationService } from "../../../services/routes-validation.service";

import ImageLoad from "../image-load/index";
import { selectContactPhone } from 'react-native-select-contact';

const TransportserviceOwnerList = ({ navigation }): React.ReactElement => {

	const route = useRoute();

	const refRBSheetAdd = useRef();

	const refRBSheetAddManually = useRef();

	const refRBSheetEdit = useRef();

	const [name, setName] = useState('');
	const [mobileNumber, setMobileNumber] = useState('');

	const appStore = useStore(AppStore);

	const [nameErrorMessage, setNameErrorMessage] = React.useState<string>("");

	const [mobileNumberErrorMessage, setMobileNumberErrorMessage] = React.useState<string>("");
	
	
	const resetValues = (): void => {
		setName("");
		setMobileNumber("");
	};

	const isValidValues = (): any => {
		
		var inputValid =true;

		if(!name){
			setNameErrorMessage("Name is mandatory");	
			inputValid =false;
		}

		if(!mobileNumber){
			setMobileNumberErrorMessage("Mobile number is mandatory");
			inputValid =false;	
		}

		return inputValid;
	}



	function getPhoneNumber() {
		if (Platform.OS === 'android') {
			console.log("On android");
			PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
			  title: 'Contacts',
			  message: 'Routes Pulse app would like to access your contacts.',
			  buttonPositive: 'Accept',
			}).then(value => {
			console.log("Granted!!!");
			  if (value === 'granted') {
				getPhoneNumberInternal();
			}
			});
		} else {
			
			getPhoneNumberInternal();
		}
	}

	function getPhoneNumberInternal() {
		console.log("Get phone number");
		return selectContactPhone()
			.then(selection => {
				if (!selection) {
					return null;
				}
				
				let { contact, selectedPhone } = selection;
				console.log(`Selected ${selectedPhone.type} phone number ${selectedPhone.number} from ${contact.name}`);
				var phNo = selectedPhone.number.replace(/[^+\d]+/g, "").replace(/^0+/, '');
				if(!phNo.startsWith("+")){
					phNo = appStore.transportService.countryCode+""+phNo;
				}
				appStore.transportService.addOwner(contact.name,phNo);
				return selectedPhone.number;
			});  
	}

	const onAddContactListShowPress = () => {
		//refRBSheetAdd.current.close();
		//navigation.navigate("ContactList", { "action": "add-owner"});
		getPhoneNumber();
	};

	const onAddManuallyPress = async () => {
		// refRBSheetOwnerAdd.current.close();
		refRBSheetAddManually.current.open();
	};


	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
	);

	const onAddPress = (): void => {
		refRBSheetAdd.current.open();
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

	

	const onAddButtonPress = (): void => {
		if(isValidValues()){
			appStore.transportService.addOwner(name, mobileNumber);
			resetValues();
			refRBSheetAddManually.current.close();
		}
	};

	const onNameChange = (value): void => {
		/*
		Cannot rerender RB UI
		if(RoutesValidationService.isValidMobileNumber(mobileNumber) && RoutesValidationService.isValidName(name)){
			console.log("Valid Username and MobileNumber");
			setDisableAdd(false);
		}
		*/
		setName(value);
	};

	const onMobileNumberChange = (value): void => {
		setMobileNumber(value);
	};


	const onActionsPress = (info): void => {
		setName(info.name);
		setMobileNumber(info.mobileNumber);
		refRBSheetEdit.current.open()
	};

	const onDeletePress = (): void => {
		appStore.transportService.deleteOwner(mobileNumber);
		resetValues();
		refRBSheetEdit.current.close()
	};

	const onEditPress = (): void => {
		if(isValidValues()){
			appStore.transportService.updateOwner(name, mobileNumber);
			resetValues();
			refRBSheetEdit.current.close();
		}
	};

	const loadingCompo = () => {
		return <Text>Test</Text>;
	};

	const renderItem = (info): React.ReactElement => (
		<Card key={info.mobileNumber} style={styles.item} onPress={()=>onActionsPress(info)}>
			<View style={{ flexDirection: "row",  justifyContent: 'flex-start', margin: 2}}>
				<View style={{ padding: 5, width: 45, height: 45}}>
					<ImageLoad
						style={{ width: 45, height: 45 }}
						loadingStyle={{ size: 'large', color: 'blue' }}
						source={"https://routes.lk:7007/users/"+info.mobileNumber+"/profile-photo.jpg" }
						name={info.name}/>
					</View>
					<View style={{ padding: 5}}>
						<Text>{info.name}</Text>
						<Text>{info.mobileNumber}</Text>
					</View>
				</View>
		</Card>
	);

	


	return (
		
		<SafeAreaLayout style={styles.container} insets="top">
			<TopNavigation title={props => (
				<RNText {...props} style={{fontWeight: "500", fontSize: 18}}>
				Owners
				</RNText>)} accessoryLeft={renderBackAction} accessoryRight={renderAddAction} />
			
				{appStore.transportService.owners.length == 0 && 
					<Text style={{paddingLeft: 18}}>No owners created yet</Text>
				}
				<View style={{ paddingHorizontal: 10 }}>
				{appStore.transportService.owners.map(function(info, index){
				return renderItem(info);		
				})}	
				</View>
				
				<RBSheet draggable dragOnContent key="busOwnerAdd" ref={refRBSheetAdd} height={300}>
					<View style={{ paddingHorizontal: 10}}>
						<View style={{ flexDirection: "row",  justifyContent: 'center' , padding: 5, margin: 5}}>
							<RNText style={{ fontWeight: "500", fontSize: 18}}>Add Owner</RNText>
						</View>
						<TouchableOpacity onPress={onAddContactListShowPress} style={{ flexDirection: "row",  justifyContent: 'space-between' , margin: 5, padding: 10, borderColor: "grey", borderWidth: 1, borderRadius: 5 }}>
							<Text>Phone Book</Text>
							<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={onAddContactListShowPress}/>
						</TouchableOpacity>

						<TouchableOpacity onPress={onAddManuallyPress} style={{ flexDirection: "row",  justifyContent: 'space-between' , margin: 5, padding: 10, borderColor: "grey", borderWidth: 1, borderRadius: 5 }}>
							<Text>Add Manually</Text>
							<AntDesign name="plus" style={styles.itemContentIcon} onPress={onAddManuallyPress}/>
						</TouchableOpacity>
						
					</View>

					<RBSheet draggable dragOnContent key="busOwnerAddManually" ref={refRBSheetAddManually} height={300}>
					<View>	
						<View style={{ flexDirection: "row",  justifyContent: 'center' , padding: 5, margin: 5}}>
							<Text style={{ fontWeight: "500", fontSize: 18}}>Add Manually</Text>
						</View>
						
						<Input	
							style={{paddingHorizontal: 10, paddingVertical: 10}}
							placeholder="Name"
							selectionColor="#142169"
							cursorColor="#142169"
							onChangeText={(value)=>onNameChange(value)}
							value={name}/>

						<Input	
							style={{paddingHorizontal: 10, paddingVertical: 10}}
							placeholder="MobileNumber"
							selectionColor="#142169"
							cursorColor="#142169"
							onChangeText={(value)=>onMobileNumberChange(value)}
							value={mobileNumber}/>
						
						<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
						<Button style={{ flex: 1, borderRadius:50, margin: 10, backgroundColor: "green", borderColor: "green"}} size="giant" onPress={onAddButtonPress} >Add</Button>
						</View>
					</View>
			</RBSheet>

			</RBSheet>
			
			
			<RBSheet draggable dragOnContent key="busOwnerEdit" ref={refRBSheetEdit} height={300}>
					<View>
						<Input	
							style={{paddingHorizontal: 10, paddingVertical: 10}}
							placeholder="Name"
							selectionColor="#142169"
							cursorColor="#142169"
							onChangeText={setName} 
							value={name}/>
						<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
							<Button size="giant" style={{ flex: 3 , margin: 5, backgroundColor: "#D69200" , borderRadius:50, margin: 10, borderColor: "#D69200" }} onPress={()=>onEditPress()} >Update</Button>
							<Button size="giant" style={{ flex: 3 , margin: 5, backgroundColor: "#B12048", borderRadius:50, margin: 10, borderColor: "#B12048"}} onPress={()=>onDeletePress()}>Delete</Button>
						</View>
					</View>
			</RBSheet>
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

export default observer(TransportserviceOwnerList);
