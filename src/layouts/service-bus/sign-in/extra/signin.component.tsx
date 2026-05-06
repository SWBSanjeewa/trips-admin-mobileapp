import {
	Button,
	Input,
	Layout,
	StyleService,
	Text,
	useStyleSheet,
	Icon,
} from "@ui-kitten/components";

import React, { ReactElement, useEffect, useRef, useState } from "react";
import { View, TextInput, TouchableWithoutFeedback, ImageBackground, TouchableOpacity} from "react-native";


import { KeyboardAvoidingView } from "./../extra/3rd-party";
import PhoneInput, {
	ICountry,
	IPhoneInputRef,
  } from 'react-native-international-phone-number';
import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import AppStore from "../../../../store/AppStore";
import { toJS } from "mobx";
import { observer} from "mobx-react";
import { useStore } from "mobx-store-provider";

import * as Keychain from 'react-native-keychain';

import Ionicons from '@expo/vector-icons/Ionicons';
import { MobileIcon} from "../../../../components/icons";

import RBSheet from 'react-native-raw-bottom-sheet';

import { OtpInput } from "react-native-otp-entry";

//import Spinner from 'react-native-loading-spinner-overlay';	
import { showMessage } from "react-native-flash-message";


const SignInComponent = ({ navigation }): React.ReactElement => {


	const appStore = useStore(AppStore);

	const refRBSheet = useRef();

	const [loading, setLoading] = useState(true);

	const refVerifyButton = useRef();

	const phoneInputRef = useRef<IPhoneInputRef>(null);

	const [fullMobileNumber, setFullMobileNumber] = React.useState<string>();
	const [mobileNumber, setMobileNumber] = React.useState<string>();
	const [accessToken, setAccessToken] = React.useState<string>();
	const [selectedCountry, setSelectedCountry] = React.useState<null>();
	const [password, setPassword] = React.useState<string>();
	const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);

	const [forgotPasswordMessage, setForgotPasswordMessage] = React.useState<string>("");

	const [phoneInputBackgroudColor, setPhoneInputBackgroudColor] = React.useState<string>("#ddd");

	const styles = useStyleSheet(themedStyles);

	const [phoneNumberCorrect, setPhoneNumberCorrect] = React.useState<boolean>(true);

	const [passwordCorrect, setPasswordCorrect] = React.useState<boolean>(true);

	const [disableOTPVerify, setDisableOTPVerify] = React.useState<boolean>(true);
	
	const [otpVerification, setOtpVerification] = React.useState<string>("");

	const [successMessage, setSuccessMessage] = React.useState<string>("");

	const [errorMessage, setErrorMessage] = React.useState<string>("");

	const [mobileNumberFocus, setMobileNumberFocus] = React.useState<boolean>(false);

	const mobileNumberCustomStyle = mobileNumberFocus ? styles.phoneInputFocus : styles.phoneInput;

	const [passwordFocus, setPasswordFocus] = React.useState<boolean>(false);

	const passwordCustomStyle = passwordFocus ? styles.inputContainerFocus : styles.inputContainer;


	
	const client = axios.create({
		baseURL: 'https://routes.lk:7007'
	});

	const config: AxiosRequestConfig = {
		headers: {
		  'Accept': 'application/json',
		} as RawAxiosRequestHeaders,
	};

	const resetValues = (): void => {
		setForgotPasswordMessage("");
		setSuccessMessage("");
		setErrorMessage("");
	};

	const onSignUpButtonPress = (): void => {
		resetValues();
		navigation && navigation.navigate("SignUp");
	};

	const isValidMobileNumber = (mobileNumber): any => {
		console.log("mobileNumber::"+mobileNumber);
		if(mobileNumber!=null){
			if(mobileNumber && mobileNumber.length == 9){
				setPhoneNumberCorrect(true);
				return true;
			}else{
				setPhoneNumberCorrect(false);
				return false;
			}	
		}
		
	};

	const isValidMobileNumberForCreds = (mobileNumber): any => {
		if(mobileNumber!=null){
			if(mobileNumber && mobileNumber.length == 12){
				return true;
			}
		}
		return false;
	};

	const isValidAccessToken = (token): any => {
		if(token!=null&&token.length > 0){
			return true;
		}
		return false;
	};

	const isValidPassword = (): any => {
		console.log("Password ###"+password);
		if(password&&password.length == 6 ){
			return true;
		}
		setPasswordCorrect(false);
		return false;
	};

	
	const getCredentials = async() => {
		try {
			// Retrieve the credentials
			const credentials = await Keychain.getGenericPassword();
			if (credentials) {
			  console.log(
				'Credentials successfully loaded for user ' + credentials.username
			  );

			} else {
			  console.log('No credentials stored');
			}
			return credentials;
		  } catch (error) {
			console.error("Failed to access Keychain", error);
		  }
	};

	const setCredentials = async(username,password) => {
		await Keychain.setGenericPassword(username, password);
	};

	useEffect(() => {
			console.log("########");
			getCredentials().then((credentials) => {
				console.log(credentials.username+","+credentials.password);
				if(isValidMobileNumberForCreds(credentials.username) && isValidAccessToken(credentials.password)){
					console.log("onSignInUsingAccessToken validation success");
					onSignInUsingAccessToken(credentials.username, credentials.password);
				}
			}).catch((err) => {
				console.log(err);
			});

			setLoading(false);
		
		
	}, []);


	

	const onSignInUsingAccessToken = async(mobileNumber,accessToken) => {

		
		  console.log("acceesToken:"+accessToken);
		  console.log("mobileNumber:"+mobileNumber);
		 
		  try {
			  const response: AxiosResponse = await client.post(`/users/loginWithAccessToken`, {
				"mobileNumber": mobileNumber,
				"accessToken": accessToken
			} , config);
			
			  //appStore.bus.setOwner(mobileNumber);
			  console.log("response.data.success:::"+response.data.success);
			  if(response.data.success == "true"){
				appStore.user.setMobileNumber(response.data.mobileNumber);
				appStore.user.setAccessToken(accessToken);
				appStore.user.setName(response.data.name);
				appStore.user.setRole(response.data.role);
				appStore.user.setCountryCode(response.data.countryCode);
				console.log("response.data.countryCode:"+response.data.countryCode)
			  	navigation && navigation.navigate("BusHome", {reload: true});
			  }{
				setLoading(false);
				//setErrorMessage(response.data.message);
			  }
		  } catch(err) {
			console.log(err);
			showMessage({message: "Network error",type: "danger"});
		  }
	};

	
	const onSignInButtonPress = async() => {

		resetValues();

		if(isValidMobileNumber(mobileNumber) && isValidPassword()){
			try {

			  
				const response: AxiosResponse = await client.post(`/users/login`, {
				  "mobileNumber": selectedCountry.callingCode+""+mobileNumber,
				  "verificationCode": password } , config);
			   
				if(response.data.success == "true"){
					appStore.user.setMobileNumber(response.data.mobileNumber);
					appStore.user.setName(response.data.name);
					appStore.user.setAccessToken(response.data.accessToken);
					appStore.user.setRole(response.data.role);
					appStore.user.setCountryCode(response.data.countryCode);
					console.log("response.data.role:"+response.data.role)
					//const userData = {"acceesToken": response.data.accessToken, "mobileNumber": selectedCountry.callingCode+""+mobileNumber};
	
					setCredentials(selectedCountry.callingCode+""+mobileNumber,response.data.accessToken).then(() => {
						console.log("Saved creds");
					}).catch((err) => {
						console.log(err);
					});
					navigation && navigation.navigate("BusHome", {reload: true});
				}{
				  setErrorMessage(response.data.message);
				}
				
			} catch(err) {
			  console.log(err);
			  showMessage({message: "Network error",type: "danger"});
			}
		}
		

	}


	

	const onForgotPasswordButtonPress = async () => {
		
		if(isValidMobileNumber(mobileNumber)){
			
			try {
				const response: AxiosResponse = await client.post(`/users/forgotPassword`, {"mobileNumber": selectedCountry.callingCode+""+mobileNumber } , config);
				console.log(response.data);
				if(response.data.success=="true"){
					refRBSheet.current.open();
				}else{
					setForgotPasswordMessage(response.data.message);
				}
				
			} catch(err) {
				console.log(err);
			}
		}else{
			setForgotPasswordMessage("Please enter valid phone number first.");
		}
	};

	const onPasswordIconPress = (): void => {
		setPasswordVisible(!passwordVisible);
	};

	const onOTPVerifyButtonPress = async () => {
		if(otpVerification.length == 6){
			try {
				const response: AxiosResponse = await client.post(`/users/forgotPassowrdMobileNumberVerify`, {"mobileNumber": selectedCountry.callingCode+""+mobileNumber, verificationCode: otpVerification } , config);
				
				if(response.data.success=="true"){
					setSuccessMessage("");
					setErrorMessage("");
					navigation && navigation.navigate("BusHome");
				}else{
					setSuccessMessage("");
					setErrorMessage(response.data.message);
				}
				refRBSheet.current.close();
				
			} catch(err) {
				console.log(err);
			}
		}
	};

	const renderPasswordIcon = (props): ReactElement => (
		<TouchableWithoutFeedback onPress={onPasswordIconPress}>
			<Ionicons name={passwordVisible ? "eye-off" : "eye"} size={24} color="black" />
		</TouchableWithoutFeedback>
	);

	const onMobileNumberChange = (value): void => {
		console.log("handleInputValue:"+value+"##");
		resetValues();
		if(isValidMobileNumber(value)){
			setPhoneNumberCorrect(true);
		}else{
			setPhoneNumberCorrect(false);
		}
		setMobileNumber(value);
	};

	const otpInputValueChange = (value): void => {
		console.log("otpInputValue:"+value);
		setOtpVerification(value);
	}

	const onPasswordChange = (value): void => {
		resetValues();
		setPassword(value);
	}

	const phoneInputOnFocus = (): void => {
		setMobileNumberFocus(true);
	}

	const phoneInputOnBlur = (): void => {
		setMobileNumberFocus(false);
	}
	

	const handleInputValue = (value): void => {
		setMobileNumber(value);
	};

	const handleSelectedCountry = (country): void => {
		setSelectedCountry(country);
	};


	return (
		<View>
			
		<KeyboardAvoidingView style={styles.container}>
			<View style={styles.logoContainer}>
				<ImageBackground style={styles.logo} source={require("../../../../assets/images/logo.png")} />
			</View>
			<Layout style={styles.formContainer} level="1">	
			<View style={mobileNumberCustomStyle}>
				<View style={styles.labelContainer}>
					<Text style={styles.label}>Mobile Number</Text>
				</View>
			
				<PhoneInput
							
							placeholder="777XXXXXX"
							value={mobileNumber}
							onFocus={phoneInputOnFocus}
							onBlur={phoneInputOnBlur}
							onChangePhoneNumber={handleInputValue}
							selectedCountry={selectedCountry}
							defaultCountry="LK"
							onChangeSelectedCountry={handleSelectedCountry}
							customMask={['########', '#########']}
							phoneInputStyles={{
								container: {
									backgroundColor: 'white',
									borderWidth: 0,
									borderStyle: 'solid',
									borderColor: '#ddd',
								},
								flagContainer: {
									borderTopLeftRadius: 7,
									borderBottomLeftRadius: 7,
									backgroundColor: 'white',
									justifyContent: 'center',
								},
								callingCode: {
									fontSize: 14,
									fontFamily: 'opensans-regular',
									color: '#333',
								},
								input: {
									color: '#333',
									fontSize: 14,
									fontFamily: 'opensans-regular',
								},

							}}
							>
							
						</PhoneInput>
					
			</View>
			<View style={{ marginLeft: 10, marginBottom: 10}}>
				{!phoneNumberCorrect && (
						<Text style={styles.errorLabel}>Phone number is incorrect</Text>	
				)}
			</View>
			<View style={{ margin: 10}}>
				<View style={styles.labelContainer}>
					<Text style={styles.label}>Password</Text>
				</View>
				<View style={passwordCustomStyle}>
					<TextInput  style={styles.captionText}  keyboardType='numeric' placeholder="XXXXXX"secureTextEntry={!passwordVisible}  onChangeText={(text) => onPasswordChange(text)} onFocus={() => setPasswordFocus(true)} onBlur={() => setPasswordFocus(false)}  value={password}/>
					<TouchableWithoutFeedback onPress={onPasswordIconPress}>
						<Ionicons name={passwordVisible ? "eye-off" : "eye"} size={24} color="black" />
					</TouchableWithoutFeedback>
				</View>	
				{!passwordCorrect && (
						<Text style={styles.errorLabel}>Password should have 6 digits</Text>	
				)}	
			</View>
				
				
				<View style={styles.forgotPasswordContainer}>
					<Button
						style={styles.forgotPasswordButton}
						appearance="ghost"
						status="basic"
						onPress={onForgotPasswordButtonPress}
					>
						Forgot your password?
					</Button>
				</View>
				{forgotPasswordMessage!="" && (
						<Text style={styles.errorLabel}>{forgotPasswordMessage}</Text>	
				)}
				{successMessage!="" && (
						<Text style={styles.succesLabel}>{successMessage}</Text>	
				)}
				{errorMessage!="" && (
						<Text style={styles.errorLabel}>{errorMessage}</Text>	
				)}
			</Layout>
			<Button style={styles.signInButton} size="giant" onPress={onSignInButtonPress}>
				SIGN IN
			</Button>
			<Button
				style={styles.signUpButton}
				appearance="ghost"
				status="basic"
				onPress={onSignUpButtonPress}>
				Don't have an account? <Text style={{color: "green"}}>Sign Up</Text> 
			</Button>
			
		</KeyboardAvoidingView>

		
			<RBSheet draggable dragOnContent key="forgotPassword" ref={refRBSheet} height={400}>
				<View>
					<Text style={{padding: 10, paddingHorizontal: 20}}>Please enter the new PIN sent to {fullMobileNumber}</Text>
					<OtpInput
						numberOfDigits={6}
						focusColor="green"
						onTextChange={(text) => otpInputValueChange(text)} 
						autoFocus={false}
						hideStick={true}
						placeholder="******"
						blurOnFilled={true}
						disabled={false}
						type="numeric"
						theme={{
							containerStyle: {padding: 10, paddingHorizontal: 20}
						}}
					
						/>
					<View style={{flex: 1,flexDirection: "row", justifyContent: "space-between"}}>
					<Button style={{ flex: 1, borderRadius:50, margin: 10}} size="giant" onPress={onOTPVerifyButtonPress}>Verify</Button>
					</View>
				</View>
			</RBSheet>
			
		</View>
		
	);
	
};

const themedStyles = StyleService.create({

	phoneInput:{
		margin: 10, 
		borderWidth:1 , 
		borderColor: "#ddd", 
		borderRadius: 8
	},
	phoneInputFocus:{
		margin: 10, 
		borderWidth:1 , 
		borderColor: "#142169", 
		borderRadius: 8
	},
	errorLabel: {
		color: "#8B0000", 
		fontSize:12 
	},
	succesLabel: {
		color: "#013220", 
		fontSize:12 
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
	container: {
		backgroundColor: "background-basic-color-1",
	},
	logoContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	  },
	logo: {
		width: 200,
		height: 160,
		marginTop: 100,
		align: "center"
	},
	spinnerTextStyle: {
		color: '#FFF'
	},
	contentContainerStyle: {
		
	},
	headerContainer: {
		justifyContent: "center",
		alignItems: "center",
		minHeight: 216,
		backgroundColor: "color-primary-default",
	},
	formContainer: {
		flex: 1,
		paddingTop: 32,
		paddingHorizontal: 16,
	},
	signInLabel: {
		marginTop: 16,
	},
	signInButton: {
		borderRadius:50, 
		margin: 10
	},
	signUpButton: {
		marginVertical: 12,
		marginHorizontal: 16,
	},
	forgotPasswordContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	passwordInput: {
		marginTop: 16,
	},
	forgotPasswordButton: {
		paddingHorizontal: 0,
		borderRadius: 20
	},
});

export default observer(SignInComponent);