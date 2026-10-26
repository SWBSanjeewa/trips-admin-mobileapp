import { Button, Icon, CardElement, CardProps, Text ,Divider,Input} from "@ui-kitten/components";
import React,{ useState ,useEffect, useCallback} from "react";
import { Alert,View, ScrollView, StyleSheet,Image, TouchableOpacity} from "react-native";

import { Bus } from "./data";
import AppStore from "../../../../store/AppStore";
import { toJS } from "mobx";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";

import RNFS, { readDirAssets } from 'react-native-fs';

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import Spinner from 'react-native-loading-spinner-overlay';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';



const bus: Bus = Bus.bus1();

const TourPhotosAddCard = ({ navigation , errorMessageHandler, update, vehicleIndex,loadVehicles}): CardElement => {

	const appStore = useStore(AppStore);
	const BASE_URL = 'https://routes.lk:7007';
	const client = axios.create({
		baseURL: BASE_URL,
		timeout: 500000,
	});

	const [photoIndex, setPhotoIndex] = useState(-1);
	const [photoDeleteEnable, setPhotoDeleteEnable] = useState(false);
	const [photoPrevEnable, setPhotoPrevEnable] = useState(false);
	const [photoNextEnable, setPhotoNextEnable] = useState(false);

	const [imageUrl, setImageUrl] = useState<string>(BASE_URL+'/no_image.png');
	const [selectedImage, setSelectedImage] = useState(null);

	
    const [onlyScaleDown, setOnlyScaleDown] = useState(false);
    const [resizedImage, setResizedImage] = useState<null | Response>();

    const [pickedImage, setPickedImage] = React.useState<any>(null);

	const [spinner, setSpinner] = React.useState<any>(false);

	const [errorMessage, setErrorMessage] = React.useState<string>("");

	const [vehicleId, setVehicleId] = React.useState<string>("");


	useEffect(() => {
		
		
		if(appStore.tour.photos?.length > 0){
			console.log("appStore.tour.photos[0]::"+appStore.tour.photos[0]);
			setImageUrl(appStore.tour.photos[0]);
			setPhotoDeleteEnable(true);
		}
		if(appStore.tour.photos?.length > 1){
			setPhotoNextEnable(true);
		}
		setPhotoIndex(0);
		

	},[]);

	
	
	const onPickImageBck = async (response) => {
	
		setPickedImage(response.assets["0"]);
		console.log(response.assets["0"].uri+" width:"+response.assets["0"].width);
		
		const result = await resize(response.assets["0"].uri);
		console.log(result.uri+":"+result.width);

		await uploadFileOnPressHandler(result);

	};

	const resizeImage = async (uri) => {
		console.log("Resizing");
		const manipResult = await ImageManipulator.manipulateAsync(
			uri,
			[{ resize: { width: 600 } }], // Specify width; height is calculated automatically to preserve aspect ratio
			{ compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
		);
		console.log("Resizing done");
		return manipResult;
	};

	const onPickImage = async (response) => {
	
		
		setPickedImage(response.assets["0"]);
		console.log(response.assets["0"].uri+" width:"+response.assets["0"].width);
		
		const result = await resizeImage(response.assets["0"].uri);
		//const result = await resize(response.assets["0"].uri);
		
		console.log(result.uri+":"+result.width);

		await uploadFileOnPressHandler(result);

	};

	const takePhoto= async () => {
    // Camera access always requires the user's permission.
    // Taking a photo also requires a device with a camera. The iOS Simulator
    // does not have one, so use a physical device to test this button.
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the camera is required.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      onPickImage(result);
    }
  };

	
	
	  const pickPhotoFromLibrary = async () => {
		//launchImageLibrary({ mediaType: "photo" }, onPickImage);
		let result = await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ['images'],
		allowsEditing: true,
		quality: 1,
		});

		if (!result.canceled) {
			console.log(result);
			onPickImage(result);
		} else {
			alert('You did not select any image.');
		}
	  }
	
	  const onUploadPress = useCallback(() => {
		  
			errorMessageHandler("");
			Alert.alert(
			"Upload Photo",
			"From where would you like to take your photo?",
			[
				{ text: "Camera", onPress: () => takePhoto() },
				{ text: "Library", onPress: () => pickPhotoFromLibrary() },
			]
			);
		 
		

	  }, [pickPhotoFromLibrary, takePhoto]);

	  /*
	  const onUploadPressBck = useCallback(() => {
		  if(appStore.bus.photos.length < 2){
			errorMessageHandler("");
			Alert.alert(
			"Upload Photo",
			"From where would you like to take your photo?",
			[
				{ text: "Camera", onPress: () => takePhoto() },
				{ text: "Library", onPress: () => pickPhotoFromLibrary() },
			]
			);
		  }else{
			errorMessageHandler("Maximum 3 photos allowed to upload");
		  }
		

	  }, [pickPhotoFromLibrary, takePhoto]);
		*/
	  const resize = async (imageUri)  => {
		console.log("Resizing...");
		if (!imageUri) return;
	
		//setResizedImage(null);
	
		
	  };

	const onNextPress = (): void => {
		console.log("next pressed!");
		console.log(JSON.stringify(toJS(appStore.bus)));
		navigation.jumpTo('Journey', { name: 'Bus Add' });

	};

	const photoUpload = async(name,data) => {
		console.log("Uploading photo ...");
		setSpinner(true);
		//console.log(JSON.stringify(toJS(newBusStore)));
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			} as RawAxiosRequestHeaders,
		  };
		  try {
			
			const response: AxiosResponse = await client.post(`/tours/`+tourId+`/photos/`+(photoIndex+1), { name: name, image: data} , config);
			console.log(response.status);
			if(response.status == 200){
				//appStore.vehicle.addPhoto(BASE_URL+'/transport-services/'+appStore.transportService.id+'/vehicles/'+response.data.id+'/'+name);
				appStore.tour.addPhotoAfterIndex(BASE_URL+'/tours/'+tourId+'/'+name,photoIndex);
				setImageUrl(BASE_URL+'/tours/'+tourId+'/'+name,photoIndex);
				console.log(BASE_URL+'/tours/'+tourId+'/'+name,photoIndex);
			}
			
			console.log("After photo upload");
			console.log(appStore.tour);
		  } catch(err) {
			console.log(err);
			setSpinner(false);
		  } 
		  setSpinner(false); 
		
	};

	const deleteTourPhoto = async() => {
		console.log(imageUrl.substring(imageUrl.lastIndexOf('/')+1));
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };
		try {	
			
        var data={
			tourId: appStore.tour.id,
			photoName: imageUrl.substring(imageUrl.lastIndexOf('/')+1)
		}
		//	/:transportServiceId/vehicles/:vehicleIndex/photos/:photoIndex'

			console.log(('/tours/'+tourId+'/photos/'+imageUrl.substring(imageUrl.lastIndexOf('/')+1)));
			const response: AxiosResponse = await client.put('/tours/'+tourId+'/photos/'+photoIndex, data, config);
			console.log("### "+response.data);
			appStore.tour.photos.remove(photoIndex);
			//appStore.vehicle.reset();
			//appStore.vehicles.reset();
			//loadVehicles();
		} catch(err) {
			console.log(err);
		}  	
	};



	

	const uploadFileOnPressHandler= async (result) => {
		
		  await RNFS.readFile(result.uri, 'base64').then(data => {
			photoUpload(result.uri.split('/').pop(),data);
			setPhotoDeleteEnable(true);
			//console.log("photoIndex::"+photoIndex);
			//console.log("Uploading photoIndex::"+(photoIndex+1));
			//console.log("newBusStore.photos.length::"+appStore.bus.photos.length);
			
			//setPhotoIndex(appStore.transportService.findVehicle(vehicleId));
			
		  });
	  };

	
	  const onPhotoDeletePress = async () => {
		  console.log("appStore.tour.photos.length"+appStore.tour.photos.length);
		  errorMessageHandler("");
		  if(update){
			  if(appStore.tour.photos.length == 1){
				errorMessageHandler("One photo is mandatory, Please upload new photo before deleting the last.");
			  }else{	
				onPhotoDeleteLocal();
			  }
		  }else{
			onPhotoDeleteLocal();
		  }
	  }

	const onPhotoDeleteLocal = async () => {
		
		
        if(appStore.vehicle.photos.length == 1){
			//setBase64Image('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwBQTFRF7c5J78kt+/Xm78lQ6stH5LI36bQh6rcf7sQp671G89ZZ8c9V8c5U9+u27MhJ/Pjv9txf8uCx57c937Ay5L1n58Nb67si8tVZ5sA68tJX/Pfr7dF58tBG9d5e8+Gc6chN6LM+7spN1pos6rYs6L8+47hE7cNG6bQc9uFj7sMn4rc17cMx3atG8duj+O7B686H7cAl7cEm7sRM26cq/vz5/v767NFY7tJM78Yq8s8y3agt9dte6sVD/vz15bY59Nlb8txY9+y86LpA5LxL67pE7L5H05Ai2Z4m58Vz89RI7dKr+/XY8Ms68dx/6sZE7sRCzIEN0YwZ67wi6rk27L4k9NZB4rAz7L0j5rM66bMb682a5sJG6LEm3asy3q0w3q026sqC8cxJ6bYd685U5a457cIn7MBJ8tZW7c1I7c5K7cQ18Msu/v3678tQ3aMq7tNe6chu6rgg79VN8tNH8c0w57Q83akq7dBb9Nld9d5g6cdC8dyb675F/v327NB6////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/LvB3QAAAMFJREFUeNpiqIcAbz0ogwFKm7GgCjgyZMihCLCkc0nkIAnIMVRw2UhDBGp5fcurGOyLfbhVtJwLdJkY8oscZCsFPBk5spiNaoTC4hnqk801Qi2zLQyD2NlcWWP5GepN5TOtSxg1QwrV01itpECG2kaLy3AYiCWxcRozQWyp9pNMDWePDI4QgVpbx5eo7a+mHFOqAxUQVeRhdrLjdFFQggqo5tqVeSS456UEQgWE4/RBboxyC4AKCEI9Wu9lUl8PEGAAV7NY4hyx8voAAAAASUVORK5CYII=');
			setImageUrl(BASE_URL+'/no_image.png');
			setPhotoIndex(-1);
			
			setPhotoDeleteEnable(false);
			appStore.tour.deletePhoto(photoIndex);
			//deletePhoto();
			deleteTourPhoto();
		}else{
			let newPhotIndex = photoIndex;
			console.log("photoIndex::"+photoIndex);
			console.log("appStore.tour.photos.length::"+appStore.tour.photos.length);
			if(photoIndex < appStore.tour.photos.length-1){
				//console.log("appStore.bus.getPhoto(photoIndex+1)::"+appStore.vehicle.getPhoto(photoIndex+1));
				setImageUrl(appStore.tour.getPhoto(photoIndex+1));	
				setPhotoIndex(photoIndex);
				console.log("####");
				if(photoIndex == appStore.tour.photos.length-2){
					console.log("setPhotoNextEnable");
					setPhotoNextEnable(false);
				}	
			}else {
				console.log("appStore.tour.getPhoto(photoIndex-1)::"+appStore.tour.getPhoto(photoIndex-1));
				setImageUrl(appStore.tour.getPhoto(photoIndex-1));
				setPhotoIndex(photoIndex-1);	
			}
			appStore.tour.deletePhoto(newPhotIndex);
			//deletePhoto();
			deleteTourPhoto();
		}	
		
	};

	const onImagePressed = (): void => {
		if(appStore.tour.photos.length > photoIndex+1 ){
			setPhotoIndex(photoIndex+1);
			console.log("setting imageurl to::"+appStore.tour.getPhoto(photoIndex+1));
			setImageUrl(appStore.tour.getPhoto(photoIndex+1));
		}else{
			setPhotoIndex(0);
			console.log("setting imageurl to::"+appStore.tour.getPhoto(0));
			setImageUrl(appStore.tour.getPhoto(0));
		}
	};

	

	return (
		<View>
			
			<Button onPress={async () => {
				
				onUploadPress();

				}}  style={{ borderRadius:50, margin: 10 }}>
				Upload
			</Button>
			<View>
				<View style={{ justifyContent: 'center', alignItems: 'center'}}>
					<TouchableOpacity onPress={onImagePressed}>
						<Image style={{width: 400, height: 300 }} source={{uri : imageUrl}} resizeMode='contain'/>
					</TouchableOpacity>
					<Spinner
						visible={spinner}
						textContent={'Uploading...'}
						textStyle={styles.spinnerTextStyle}/>
				</View>
		  
		  
		  {photoDeleteEnable ? (
		  <TouchableOpacity style={styles.deletePhoto} onPress={()=>onPhotoDeletePress()}>
			<Entypo name="circle-with-cross" size={24} color="red" />
		  </TouchableOpacity>
		  ) : null}

		  </View>
		  {errorMessage!="" && (
				<Text style={styles.errorLabel}>{errorMessage}</Text>	
		  )}
		 
		</View>
	);
};

const styles = StyleSheet.create({
	errorLabel: {
		color: "#8B0000", 
		fontSize:12,
		padding: 10
	},
	spinnerTextStyle: {
		color: '#FFF'
	},
	container: {
		
	},
	nextButton: {
		marginVertical: 8,
		borderRadius:50, 
		margin: 10
	},
	logo: {
		width: 400,
		height: 300,
		
	},
	deletePhoto: {
		//backgroundColor: 'red',
		//width: 30,
		//height: 30,
		right: 60,
		marginLeft: 30,
		marginTop: 30,
		position: 'absolute',	
	},
	prevPhoto: {
		left: 30,
		top: '45%',
		marginLeft: 30,
		marginTop: 30,
		position: 'absolute',	
	},
	nextPhoto: {
		right: 60,
		top: '45%',
		marginLeft: 30,
		marginTop: 30,
		position: 'absolute',	
	}

	
});

export default observer(TourPhotosAddCard);
