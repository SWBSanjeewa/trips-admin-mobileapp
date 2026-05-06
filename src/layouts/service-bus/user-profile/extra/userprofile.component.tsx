import { Avatar, BottomNavigationTab, Divider, Layout, Button, Text, Card, Input } from "@ui-kitten/components";
import React,{useRef,useState,useCallback,useEffect} from "react";
import { ImageBackground, ListRenderItemInfo, StyleSheet, View , Alert,Text as RNText, TouchableOpacity} from "react-native";


import { SafeAreaProvider } from "react-native-safe-area-context";

import AppStore from "../../../../store/AppStore";

import {launchImageLibrary, launchCamera} from 'react-native-image-picker';

import RNFS, { readDirAssets } from 'react-native-fs';

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';


import { Buffer } from "buffer";



import { observer} from "mobx-react";
import { useStore } from "mobx-store-provider";
import RBSheet from 'react-native-raw-bottom-sheet';
import {
	MaterialIcons as MDIcon,
	FontAwesome as FAIcon,
} from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';

import * as Keychain from 'react-native-keychain';

import { CacheManager } from '@georstat/react-native-image-cache';
import ImageLoad from "../../image-load/index";
import AntDesign from '@expo/vector-icons/AntDesign';



const UserProfileComponent = ({ navigation }): React.ReactElement => {

	const appStore = useStore(AppStore);

	const BASE_URL = 'https://routes.lk:7007';
	const client = axios.create({
		baseURL: BASE_URL,
		timeout: 500000,
	});

	const refRBSheetNameEdit = useRef();

	const refPhotoUploadMethod = useRef();

	


	const refStandard = useRef();

	const [imageUrl, setImageUrl] = useState<string>(BASE_URL+'/profile-photo.png');

	//const [selectedMode, setMode] = useState<ResizeMode>('contain');
    const [onlyScaleDown, setOnlyScaleDown] = useState(false);
    const [resizedImage, setResizedImage] = useState<null | Response>();

	const [pickedImage, setPickedImage] = React.useState<any>(null);

	const [spinner, setSpinner] = React.useState<any>(false);
	
	const [imageUpdated, setImageUpdated] = React.useState<any>(false);

	const [deleted, setDeleted] = React.useState<any>(false);

	

	const [loading, setLoading] = useState(true);

	const [showCachedImage, setShowCachedImage] = useState(true);

	//const [imageUpdated, setShowCachedImage] = useState(true);
	

	const [name, setName] = useState("");

	const [mobileNumber, setMobileNumber] = useState("");

	const [imageData, setImageData] = useState("");

	const [imageUpdatedTime, setImageUpdatedTime] = useState(new Date());
	


	const onLogoutPress = async() => {
		appStore.searchContext.reset();
		await Keychain.resetGenericPassword();
		navigation && navigation.navigate("SignIn");	
	};

	const onClearCache = async() => {
		console.log("Clear cache");
		await CacheManager.clearCache();
	};

	const pickPhotoFromLibrary = async () => {
		console.log("### mobileNumber:"+appStore.user.mobileNumber);
		launchImageLibrary({ mediaType: "photo" }, onPickImage);
	}

	const takePhoto = useCallback(() => {
		launchCamera({ mediaType: "photo", cameraType: "front" }, onPickImage);
		
	}, []);
	

	

	const onProfilePhotoDeletePress  = async () => {
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		};
		
		  
		try {
			console.log("Deleting /users/profilePhoto/"+mobileNumber );
			const response: AxiosResponse = await client.delete('/users/'+mobileNumber+'/profilePhoto' , config);
			console.log(response.data);
			
			if(response.data!=null && response.data.success == "true"){
				setImageUpdatedTime(new Date());
			    setDeleted(true);	
				//setPofileImageChanged(true);  
			}
		} catch(err) {
			console.log(err);
		}
		//setImageUpdatedTime(new Date());
		refStandard.current.close();
	};

	const onEditNameButtomPress = async () => {
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		};
		
		console.log("Name:::"+name);
		  
		try {
		
		const response: AxiosResponse = await client.put('/users/'+appStore.user.mobileNumber+'/name/'+name , config);
		console.log(response.data);
		
		if(response.data!=null && response.data.success == "true"){
			appStore.user.setName(name);
		}
		
		
		} catch(err) {
			console.log(err);
		}
			
		refRBSheetNameEdit.current.close();
		
	};

	

	
	useEffect(() => {
		setName(appStore.user.name);
		setMobileNumber(appStore.user.mobileNumber);
	}, []);


	

	const onUploadPress = useCallback(() => {
		refPhotoUploadMethod.current.open();
	}, [pickPhotoFromLibrary, takePhoto]);

	const onUploadPress1 = useCallback(() => {
		refStandard.current.close();
		Alert.alert(
			"Upload Photo",
			"From where would you like to take your photo?",
			[
			{ text: "Camera", onPress: () => takePhoto() },
			{ text: "Library", onPress: () => pickPhotoFromLibrary() },
			]
		);
	}, [pickPhotoFromLibrary, takePhoto]);

	const onPickImage = async (response) => {
	
		setPickedImage(response.assets["0"]);
		console.log(response.assets["0"].uri+" width:"+response.assets["0"].width);
		
		const result = await resize(response.assets["0"].uri);
		console.log(result.uri+":"+result.width);

		await uploadFileOnPressHandler(result);

	};

	const uploadFileOnPressHandler= async (result) => {
		
		await RNFS.readFile(result.uri, 'base64').then(data => {
		  photoUpload(result.name,data);  
		  setImageData(data);
		  setImageUrl(null);
		});
	};


	

	const photoUpload = async(name,data) => {
		console.log("Uploading photo ...");
		setSpinner(true);
		//console.log(JSON.stringify(toJS(newBusStore)));
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };
		  try {
			
			const response: AxiosResponse = await client.post(`/photos/upload/users`, {id: appStore.user.mobileNumber,name: "profile-photo.jpg", image: data} , config);
			console.log(response.status);
			console.log(">>"+response.data.id);
			console.log(BASE_URL+"/users/"+appStore.user.mobileNumber+"/profile-photo.jpg?date="+imageUpdatedTime.toISOString());
			//setImageUrl(BASE_URL+"/users/"+appStore.user.mobileNumber+"/profile-photo.jpg");
			//await CacheManager.removeCacheEntry(BASE_URL+"/users/"+appStore.user.mobileNumber+"/profile-photo.jpg");
		  } catch(err) {
			console.log(err);
			setSpinner(false);
		  } 
		  setSpinner(false); 
		  setShowCachedImage(true);
		 // await CacheManager.removeCacheEntry(BASE_URL+"/users/"+appStore.user.mobileNumber+"/profile-photo.jpg");
		  setDeleted(false);
		  setImageUpdatedTime(new Date());
		 // setPofileImageChanged(true);  	  
	};

	return (
		<SafeAreaProvider>
			<View style={styles.parentContainer} > 
				<View>
					<TouchableOpacity style={{ width: 45, height: 45 }} onPress={() => refStandard.current.open()}>
						<ImageLoad
						    deleted={deleted}
							style={{ width: 45, height: 45 }}
							loadingStyle={{ size: 'large', color: 'blue' }}
							source={"https://routes.lk:7007/users/"+appStore.user.mobileNumber+"/profile-photo.jpg?time="+imageUpdatedTime.toISOString() }
							name={appStore.user.name}/>
						<AntDesign style={styles.profilePhotoEditContentIcon} color="#D69200" name="edit"  onPress={() => refStandard.current.open()}/>
						
					</TouchableOpacity>
					<Spinner
						visible={spinner}
						textContent={'Uploading...'}
						textStyle={styles.spinnerTextStyle}
						/>
				<RBSheet ref={refStandard} draggable dragOnContent height={250}>
					<View style={styles.listContainer}>
						
						<View>
							<TouchableOpacity
								key="photo-camera"
								style={styles.listButton}
								onPress={() => takePhoto()}>
								<MDIcon name="photo-camera" style={styles.listIcon} />
								<Text style={styles.listLabel}>Take photo</Text>
							</TouchableOpacity>
							<TouchableOpacity
								key="upload"
								style={styles.listButton}
								onPress={() => pickPhotoFromLibrary()}>
								<AntDesign name="upload" style={styles.listIcon} size={24} color="black" />
								<Text style={styles.listLabel}>Upload photo</Text>
							</TouchableOpacity>
							<TouchableOpacity
								key="delete"
								style={styles.listButton}
								onPress={() => onProfilePhotoDeletePress()}>
								<MDIcon name="delete" style={styles.listDeleteIcon} />
								<Text style={styles.listLabel}>Delete photo</Text>
							</TouchableOpacity>
							
						</View>
					</View>
				</RBSheet>
				<RBSheet draggable dragOnContent key="nameEdit" ref={refRBSheetNameEdit} height={200}>
					<View>
					<Input
						style={{paddingHorizontal: 10}}
						placeholder="Name"
						value={name}
						selectionColor="#197519"
						cursorColor="#197519"
						onChangeText={(text) => setName(text)} 
					/>
						
						<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
						<Button style={{ flex: 1, borderRadius:50, margin: 10}} size="large" onPress={onEditNameButtomPress}>Update</Button>
						</View>
					</View>
				</RBSheet>
				</View>  
				
			</View>
			<Card style={{ borderWidth: 0}}>	
				<Text style={styles.itemHeader}>Your Information</Text>
			</Card>
			<Card style={{ margin: 10}}>
				<Text style={styles.itemHeader}>Name</Text>
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>{name}</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => refRBSheetNameEdit.current.open()}/>
				</View>
			</Card>
			<Card style={{ margin: 10}}>
				<Text style={styles.itemHeader}>Mobile Number</Text>
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text style={{ color: '#999'}}>{mobileNumber}</Text>
				</View>
			</Card>

			<Card style={{ margin: 10}} onPress={() => navigation.navigate("TransportServiceList")}>
				
				<View style={{ flexDirection: "row",  justifyContent: 'space-between'}}>
					<Text>Transport Services</Text>
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => navigation.navigate("TransportServiceList")}/>
				</View>
			</Card>
			
			<Button  onPress={()=>onClearCache()} style={{ borderRadius:50, margin: 10, borderColor:"#142169", borderWidth: 2 }}>
				Clear Cache
			</Button>

			<Button appearance='ghost' onPress={()=>onLogoutPress()} style={{ borderRadius:50, margin: 10, borderColor:"#142169", borderWidth: 2 }}>
				Logout
			</Button>
			
		</SafeAreaProvider>
		
		
		
	);
	
};

const styles = StyleSheet.create({
	profilePhotoEditContentIcon: {
		fontSize: 16,
		color: '#D69200',
		position: 'absolute',
		top: 27,
    	left: 35
	},
	parentContainer: {
		flexWrap: "wrap",
		alignSelf: "center",
	},
	itemHeader: {
		fontWeight: "500",
		fontSize: 18
	},
	listContainer: {
		flex: 1,
		padding: 25,
	},
	  listTitle: {
		fontSize: 16,
		marginBottom: 20,
		color: 'black',
	  },
	  listButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 10,
	  },
	  listIcon: {
		fontSize: 26,
		color: '#142169',
		width: 60,
	  },
	  listDeleteIcon: {
		fontSize: 26,
		color: '#B12048',
		width: 60,
	  },
	  listLabel: {
		fontSize: 16,
	  },
	  item: {
		marginVertical: 8,
	  },
	  itemContentIcon: {
		fontSize: 22,
		color: '#999',
	  },

	  
	
});

export default observer(UserProfileComponent);
