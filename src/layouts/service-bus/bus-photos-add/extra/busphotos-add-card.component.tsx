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

import {launchImageLibrary} from 'react-native-image-picker';
import {launchCamera} from 'react-native-image-picker';
import * as ImagePicker from 'react-native-image-picker';


import Spinner from 'react-native-loading-spinner-overlay';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';



const bus: Bus = Bus.bus1();

const BusPhotosAddCard = ({ navigation , errorMessageHandler, update}): CardElement => {

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


	useEffect(() => {
		
		if(appStore.bus.photos.length > 0){
			setImageUrl(appStore.bus.photos[0]);
			setPhotoDeleteEnable(true);
		}
		if(appStore.bus.photos.length > 1){
			setPhotoNextEnable(true);
		}
		setPhotoIndex(0);

	}, []);
	
	const onPickImage = async (response) => {
	
		setPickedImage(response.assets["0"]);
		console.log(response.assets["0"].uri+" width:"+response.assets["0"].width);
		
		const result = await resize(response.assets["0"].uri);
		console.log(result.uri+":"+result.width);

		await uploadFileOnPressHandler(result);

	};

	const takePhoto = useCallback(() => {
		launchCamera({ mediaType: "photo", cameraType: "front" }, onPickImage);
	  }, []);
	
	  const pickPhotoFromLibrary = async () => {
		launchImageLibrary({ mediaType: "photo" }, onPickImage);
	  }
	
	  const onUploadPress = useCallback(() => {
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
			
			const response: AxiosResponse = await client.post(`/photos/upload`, {id: appStore.bus.id, transportServiceId: appStore.bus.transportServiceId , name: name, image: data} , config);
			console.log(response.status);
			console.log(">>"+response.data.id);
			if(appStore.bus.id == "")
			    console.log("setting Id:"+response.data.id);
				console.log("setting Id:"+response.data.id);
				appStore.bus.setId(response.data.id); 
				appStore.bus.addPhoto(BASE_URL+'/transport-services/'+appStore.bus.transportServiceId+'/buses/'+response.data.id+'/'+name);
				setImageUrl(BASE_URL+'/transport-services/'+appStore.bus.transportServiceId+'/buses/'+response.data.id+'/'+name);
		  } catch(err) {
			console.log(err);
			setSpinner(false);
		  } 
		  setSpinner(false); 
		
	};

	const deletePhoto = async() => {
		console.log("Deleting photo ..."+imageUrl.substring(imageUrl.indexOf('buses')+6));
		try {	
			const response: AxiosResponse = await client.delete('/photos/'+imageUrl.substring(imageUrl.indexOf('buses')+6));
		} catch(err) {
		console.log(err);
		}  	


	};


	const deleteBusPhoto = async() => {
		console.log(imageUrl.substring(imageUrl.lastIndexOf('/')+1));
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			  'token': appStore.user.accessToken
			} as RawAxiosRequestHeaders,
		  };
		try {	
			const response: AxiosResponse = await client.post('/buses/photos/delete', { id: appStore.bus.objectId, busId: appStore.bus.id, transportServiceId: appStore.bus.transportServiceId, photoName: imageUrl.substring(imageUrl.lastIndexOf('/')+1) }, config);
			console.log("### "+response.data);
		} catch(err) {
			console.log(err);
		}  	
	};



	

	const uploadFileOnPressHandler= async (result) => {
		
		  await RNFS.readFile(result.uri, 'base64').then(data => {
			photoUpload(result.name,data);
			setPhotoDeleteEnable(true);
			//console.log("photoIndex::"+photoIndex);
			console.log("Uploading photoIndex::"+(photoIndex+1));
			console.log("newBusStore.photos.length::"+appStore.bus.photos.length);
			
			setPhotoIndex(appStore.bus.photos.length);
			
		  });
	  };

	  const onPhotoDeletePress = async () => {
		  console.log("appStore.bus.photos.length"+appStore.bus.photos.length);
		  errorMessageHandler("");
		  if(update){
			  if(appStore.bus.photos.length == 1){
				errorMessageHandler("One photo is mandatory, Please upload new photo before deleting the last.");
			  }else{
				
				onPhotoDeleteLocal();
			  }
			
		  }else{
			onPhotoDeleteLocal();
		  }
	  }

	const onPhotoDeleteLocal = async () => {
		
		
        if(appStore.bus.photos.length == 1){
			//setBase64Image('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwBQTFRF7c5J78kt+/Xm78lQ6stH5LI36bQh6rcf7sQp671G89ZZ8c9V8c5U9+u27MhJ/Pjv9txf8uCx57c937Ay5L1n58Nb67si8tVZ5sA68tJX/Pfr7dF58tBG9d5e8+Gc6chN6LM+7spN1pos6rYs6L8+47hE7cNG6bQc9uFj7sMn4rc17cMx3atG8duj+O7B686H7cAl7cEm7sRM26cq/vz5/v767NFY7tJM78Yq8s8y3agt9dte6sVD/vz15bY59Nlb8txY9+y86LpA5LxL67pE7L5H05Ai2Z4m58Vz89RI7dKr+/XY8Ms68dx/6sZE7sRCzIEN0YwZ67wi6rk27L4k9NZB4rAz7L0j5rM66bMb682a5sJG6LEm3asy3q0w3q026sqC8cxJ6bYd685U5a457cIn7MBJ8tZW7c1I7c5K7cQ18Msu/v3678tQ3aMq7tNe6chu6rgg79VN8tNH8c0w57Q83akq7dBb9Nld9d5g6cdC8dyb675F/v327NB6////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/LvB3QAAAMFJREFUeNpiqIcAbz0ogwFKm7GgCjgyZMihCLCkc0nkIAnIMVRw2UhDBGp5fcurGOyLfbhVtJwLdJkY8oscZCsFPBk5spiNaoTC4hnqk801Qi2zLQyD2NlcWWP5GepN5TOtSxg1QwrV01itpECG2kaLy3AYiCWxcRozQWyp9pNMDWePDI4QgVpbx5eo7a+mHFOqAxUQVeRhdrLjdFFQggqo5tqVeSS456UEQgWE4/RBboxyC4AKCEI9Wu9lUl8PEGAAV7NY4hyx8voAAAAASUVORK5CYII=');
			setImageUrl(BASE_URL+'/no_image.png');
			setPhotoIndex(-1);
			
			setPhotoDeleteEnable(false);
			appStore.bus.deletePhoto(photoIndex);
			//deletePhoto();
			deleteBusPhoto();
		}else{
			let newPhotIndex = photoIndex;
			console.log("photoIndex::"+photoIndex);
			console.log("appStore.bus.photos.length::"+appStore.bus.photos.length);
			if(photoIndex < appStore.bus.photos.length-1){
				console.log("appStore.bus.getPhoto(photoIndex+1)::"+appStore.bus.getPhoto(photoIndex+1));
				setImageUrl(appStore.bus.getPhoto(photoIndex+1));	
				setPhotoIndex(photoIndex);
				console.log("####");
				if(photoIndex == appStore.bus.photos.length-2){
					console.log("setPhotoNextEnable");
					setPhotoNextEnable(false);
				}	
			}else {
				console.log("appStore.bus.getPhoto(photoIndex-1)::"+appStore.bus.getPhoto(photoIndex-1));
				setImageUrl(appStore.bus.getPhoto(photoIndex-1));
				setPhotoIndex(photoIndex-1);	
			}
			appStore.bus.deletePhoto(newPhotIndex);
			//deletePhoto();
			deleteBusPhoto();
		}	
		
	};
	

	const onImagePressed = (): void => {
		console.log("photos length:"+appStore.bus.photos.length);
		console.log(imageUrl);
		console.log("photoIndex:"+photoIndex);
		if(appStore.bus.photos.length > photoIndex+1 ){
			setPhotoIndex(photoIndex+1);
			setImageUrl(appStore.bus.getPhoto(photoIndex+1));
		}else{
			setPhotoIndex(0);
			setImageUrl(appStore.bus.getPhoto(0));
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

export default observer(BusPhotosAddCard);
