import {
	Button,
	CheckBox,
	Input,
	Layout,
	StyleService,
	useStyleSheet,
	Text,
	Icon,
} from "@ui-kitten/components";
import React, { ReactElement, useRef } from "react";
import { View, ImageBackground,TextInput } from "react-native";

import { KeyboardAvoidingView } from "./extra/3rd-party";
import { PersonIcon , MobileIcon} from "../../../components/icons";
import { PlusOutlineIcon } from "../../../components/icons";
import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import PhoneInput, { ICountry } from 'react-native-international-phone-number';

import RBSheet from 'react-native-raw-bottom-sheet';

import { OtpInput } from "react-native-otp-entry";
import Entypo from '@expo/vector-icons/Entypo';

export default ({ navigation }): React.ReactElement => {
	const [name, setName] = React.useState<string>();
	const [mobileNumber, setMobileNumber] = React.useState<string>();
	const [selectedCountry, setSelectedCountry] = React.useState<ICountry>(null);
	const [mobileNumberCorrect, setMobileNumberCorrect] = React.useState<boolean>(true);
	const [usernameCorrect, setUsernameCorrect] = React.useState<boolean>(true);
	
	const styles = useStyleSheet(themedStyles);

	const [otpVerification, setOtpVerification] = React.useState<string>("");

	const [successMessage, setSuccessMessage] = React.useState<string>("");

	const [errorMessage, setErrorMessage] = React.useState<string>("");

	const refRBSheet = useRef();

	const [userNameFocus, setUserNameFocus] = React.useState<boolean>(false);

	const userNameCustomStyle = userNameFocus ? styles.inputContainerFocus : styles.inputContainer;

	const [mobileNumberFocus, setMobileNumberFocus] = React.useState<boolean>(false);

	const mobileNumberCustomStyle = mobileNumberFocus ? styles.phoneInputFocus : styles.phoneInput;



	const client = axios.create({
		baseURL: 'https://routes.lk:7007'
	});

	const config: AxiosRequestConfig = {
		headers: {
		  'Accept': 'application/json',
		} as RawAxiosRequestHeaders,
	};

	const resetValues = (): void => {
		setSuccessMessage("");
		setErrorMessage("");
	};

	const isValidMobileNumber = (mobileNumber): any => {
		if(mobileNumber!=null){
			if(mobileNumber.length == 9){
				return true;
			}	
		}
		setMobileNumberCorrect(false);
		return false;
	};


	const isValidUsername = (): any => {
		if(name!=null && name != ""){
			return true;
		}
		setUsernameCorrect(false);
		return false;
	};


	const onSignUpButtonPress1 = async() => {
		console.log(">>> "+selectedCountry.callingCode+""+mobileNumber);
	}

	const onSignUpButtonPress = async() => {
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			} as RawAxiosRequestHeaders,
		  };
		 
		  if(isValidUsername() && isValidMobileNumber(mobileNumber)){
			  console.log("Inputs are valid");
			try {
				const response: AxiosResponse = await client.post(`/users/signup`, {"mobileNumber": selectedCountry.callingCode+""+mobileNumber,"name": name , "countryCode" : selectedCountry.callingCode} , config);
				if(response.data.success == "true"){
					refRBSheet.current.open();
					//navigation && navigation.navigate("OTPVerify",{ mobileNumber: selectedCountry.callingCode+mobileNumber});
				}else{
					setErrorMessage(response.data.message);
				}
				
			} catch(err) {
				console.log(err);
			}
		  }
	};

	const onSignInButtonPress = (): void => {
		navigation && navigation.navigate("SignIn");
	};

	
	const renderEditAvatarButton = (): React.ReactElement => (
		<Button style={styles.editAvatarButton} status="basic" accessoryRight={PlusOutlineIcon} />
	);

	const onMobileNumberChange = (value): void => {
		console.log("handleInputValue:"+value+"##");
		resetValues();
		if(isValidMobileNumber(value)){
			setMobileNumberCorrect(true);
		}else{
			setMobileNumberCorrect(false);
		}
		setMobileNumber(value);
	};

	const otpInputValueChange = (value): void => {
		console.log("otpInputValue:"+value);
		setOtpVerification(value);
	}

	const onOTPVerifyButtonPress = async () => {
		if(otpVerification.length == 6){
			try {
				const response: AxiosResponse = await client.post(`/users/mobileNumberVerify`, {"mobileNumber": selectedCountry.callingCode+""+mobileNumber, verificationCode: otpVerification } , config);
				
				if(response.data.success=="true"){
					setSuccessMessage(response.data.message);
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

	const handleInputValue = (value): void => {
		setMobileNumber(value);
	};

	const handleSelectedCountry = (country): void => {
		setSelectedCountry(country);
	};

	const phoneInputOnFocus = (): void => {
		setMobileNumberFocus(true);
	}

	const phoneInputOnBlur = (): void => {
		setMobileNumberFocus(false);
	}

	
	const onNameChange = (value): void => {
		resetValues();
		if(value.length>0)
			setUsernameCorrect(true)
		setName(value);
	}

	

	return (
		<View>
			<View style={styles.logoContainer}>
				<ImageBackground style={styles.logo} source={require("../../../assets/images/logo.png")} />
			</View>
		<KeyboardAvoidingView style={styles.container}>
			<Layout style={styles.formContainer} level="1">
				
				<View style={{ margin: 10}}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>User Name</Text>
					</View>

					
						<View style={userNameCustomStyle}>
							<TextInput style={styles.captionText}  placeholder="Name" onChangeText={(text) => onNameChange(text)} onFocus={() => setUserNameFocus(true)} onBlur={() => setUserNameFocus(false)}  value={name}/>
							
						</View>	
						{!usernameCorrect && (
								<Text style={styles.errorLabel}>Username should be non empty.</Text>	
						)}
					</View>

					<View style={mobileNumberCustomStyle}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>Mobile Number</Text>
					</View>
						<PhoneInput
							placeholder="777XXXXXX"
							value={mobileNumber}
							onChangePhoneNumber={handleInputValue}
							selectedCountry={selectedCountry}
							onFocus={phoneInputOnFocus}
							onBlur={phoneInputOnBlur}
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
				{!mobileNumberCorrect && (
								<Text style={styles.errorLabel}>Phone number is incorrect</Text>	
						)}	
						{successMessage!="" && (
							<Text style={styles.succesLabel}>{successMessage}</Text>	
						)}
						{errorMessage!="" && (
								<Text style={styles.errorLabel}>{errorMessage}</Text>	
						)}
				</View>
				
					
			</Layout>
			<Button style={styles.signUpButton} size="giant" onPress={onSignUpButtonPress}>
				SIGN UP
			</Button>
			<Button
				style={styles.signInButton}
				appearance="ghost"
				status="basic"
				onPress={onSignInButtonPress}
			>
				Already have an account? <Text style={{color: "green"}}>Sign In</Text> 
			</Button>
		</KeyboardAvoidingView>
		<RBSheet draggable dragOnContent key="forgotPassword" ref={refRBSheet} height={400}>
		<View>
			<Text style={{padding: 10, paddingHorizontal: 20}}>Please enter the PIN sent</Text>
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
	container: {
		backgroundColor: "background-basic-color-1",
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
	headerContainer: {
		justifyContent: "center",
		alignItems: "center",
		minHeight: 216,
		backgroundColor: "color-primary-default",
	},
	profileAvatar: {
		width: 116,
		height: 116,
		borderRadius: 58,
		alignSelf: "center",
		backgroundColor: "background-basic-color-1",
		tintColor: "color-primary-default",
	},
	editAvatarButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
	},
	formContainer: {
		flex: 1,
		paddingTop: 32,
		paddingHorizontal: 16,
	},
	emailInput: {
		marginTop: 16,
	},
	passwordInput: {
		marginTop: 16,
	},
	termsCheckBox: {
		marginTop: 24,
	},
	termsCheckBoxText: {
		color: "text-hint-color",
		marginLeft: 10,
	},
	signUpButton: {
		borderRadius:50, 
		margin: 10
	},
	signInButton: {
		marginVertical: 12,
		marginHorizontal: 16,
	},
});
