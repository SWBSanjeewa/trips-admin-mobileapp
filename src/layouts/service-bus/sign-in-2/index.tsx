import {
	Button,
	Input,
	Layout,
	StyleService,
	Text,
	useStyleSheet,
	Icon,
} from "@ui-kitten/components";
import React, { ReactElement } from "react";
import { View, TouchableWithoutFeedback } from "react-native";

import { KeyboardAvoidingView } from "./extra/3rd-party";
import PhoneInput from 'react-native-international-phone-number';
import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';



export default ({ navigation }): React.ReactElement => {
	const [mobileNumber, setMobileNumber] = React.useState<string>();
	const [selectedCountry, setSelectedCountry] = React.useState<null>();
	const [password, setPassword] = React.useState<string>();
	const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);

	const styles = useStyleSheet(themedStyles);

	const client = axios.create({
		baseURL: 'https://routes.lk:7007'
	});

	const onSignUpButtonPress = (): void => {
		navigation && navigation.navigate("SignUp2");
	};

	
	const onSignInButtonPress = async() => {
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			} as RawAxiosRequestHeaders,
		  };
		  console.log("mobileNumber:"+selectedCountry.callingCode+mobileNumber);
		  console.log("selectedCountry:"+selectedCountry.callingCode);
		  try {
			  const response: AxiosResponse = await client.post(`/users/login`, {
				"mobileNumber": selectedCountry.callingCode+mobileNumber,
				"verificationCode": password
			} , config);
			  navigation && navigation.navigate("BusHome");
		  } catch(err) {
			console.log(err);
		  }
	};

	const onForgotPasswordButtonPress = (): void => {
		navigation && navigation.navigate("ForgotPassword");
	};

	const onPasswordIconPress = (): void => {
		setPasswordVisible(!passwordVisible);
	};

	const renderPasswordIcon = (props): ReactElement => (
		<TouchableWithoutFeedback onPress={onPasswordIconPress}>
			<Icon {...props} name={passwordVisible ? "eye-off" : "eye"} />
		</TouchableWithoutFeedback>
	);

	const handleInputValue = (value): void => {
		setMobileNumber(value);
	};

	const handleSelectedCountry = (country): void => {
		setSelectedCountry(country);
	};

	

	return (
		<View>
		
		<KeyboardAvoidingView style={styles.container}>
			<View style={styles.headerContainer}>
				<Text category="h1" status="control">
					Hello
				</Text>
				<Text style={styles.signInLabel} category="s1" status="control">
					Sign in to your account
				</Text>
			</View>
			<Layout style={styles.formContainer} level="1">
					<PhoneInput
				defaultValue="+94772149179"
				value={mobileNumber}
				onChangePhoneNumber={handleInputValue}
				selectedCountry={selectedCountry}
				onChangeSelectedCountry={handleSelectedCountry}
				/>
				
				<Input
					style={styles.passwordInput}
					placeholder="Password"
					accessoryRight={renderPasswordIcon}
					value={password}
					secureTextEntry={!passwordVisible}
					onChangeText={setPassword}
				/>
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
			</Layout>
			<Button style={styles.signInButton} size="giant" onPress={onSignInButtonPress}>
				SIGN IN
			</Button>
			<Button
				style={styles.signUpButton}
				appearance="ghost"
				status="basic"
				onPress={onSignUpButtonPress}
			>
				Don't have an account? Create
			</Button>
		</KeyboardAvoidingView>
		</View>
	);
};

const themedStyles = StyleService.create({
	container: {
		backgroundColor: "background-basic-color-1",
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
		marginHorizontal: 16,
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
	},
});
