import {
	Button,
	CheckBox,
	Datepicker,
	Divider,
	Input,
	StyleService,
	Layout,
	Text,
	useStyleSheet,
} from "@ui-kitten/components";
import React from "react";
import { View } from "react-native";

import { useRoute } from "@react-navigation/native"

import { KeyboardAvoidingView } from "./extra/3rd-party";
import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

export default ({ navigation }): React.ReactElement => {

	const route = useRoute();

	const client = axios.create({
		baseURL: 'https://routes.lk:7007'
	});

	const [verifyCode1, setVerifyCode1] = React.useState<string>();
	const [verifyCode2, setVerifyCode2] = React.useState<string>();
	const [verifyCode3, setVerifyCode3] = React.useState<string>();
	const [verifyCode4, setVerifyCode4] = React.useState<string>();
	const [verifyCode5, setVerifyCode5] = React.useState<string>();
	const [verifyCode6, setVerifyCode6] = React.useState<string>();
	

	const styles = useStyleSheet(themedStyles);

	const onVerifyButtonPress1 = (): void => {
		console.log("navigation:"+navigation);
		navigation && navigation.navigate("BusList");
	};

	const onVerifyButtonPress = async() => {
		const config: AxiosRequestConfig = {
			headers: {
			  'Accept': 'application/json',
			} as RawAxiosRequestHeaders,
		  };
		  let verificationCode = verifyCode1+""+verifyCode2+""+verifyCode3+""+verifyCode4+""+verifyCode5+""+verifyCode6;
		  console.log("mobileNumber"+route.params.mobileNumber+" verifyCode:"+verificationCode);

		  
		  try {
			  const response: AxiosResponse = await client.post(`/users/mobileNumberVerify`, {"mobileNumber": route.params.mobileNumber,"verificationCode": verificationCode } , config);
			  if(response.data.success == "true") {
			  	navigation && navigation.navigate("SignIn");
			  } else{
				  console.log("Verification Failed!");
			  }

		  } catch(err) {
			console.log(err);
		  }
		  
	};

	

	return (
		<Layout style={styles.container}>
		<KeyboardAvoidingView style={styles.container}>
			<View style={styles.itemscontainer}>
			<View>
				<Text style={styles.emailSignLabel}>Please enter the verification code here we just send you on +94*****179</Text>
			</View>
			<View style={[styles.container, styles.formContainer]}>
				<Input
					style={styles.formInput}
					autoCapitalize="words"
					value={verifyCode1}
					onChangeText={setVerifyCode1}
				/>
				<Input
					style={styles.formInput}
					autoCapitalize="words"
					value={verifyCode2}
					onChangeText={setVerifyCode2}
				/>
				<Input
					style={styles.formInput}
					autoCapitalize="words"
					value={verifyCode3}
					onChangeText={setVerifyCode3}
				/>
				<Input
					style={styles.formInput}
					autoCapitalize="words"
					value={verifyCode4}
					onChangeText={setVerifyCode4}
				/>
				<Input
					style={styles.formInput}
					autoCapitalize="words"
					value={verifyCode5}
					onChangeText={setVerifyCode5}
				/>
				<Input
					style={styles.formInput}
					autoCapitalize="words"
					value={verifyCode6}
					onChangeText={setVerifyCode6}
				/>
			</View>
			<View>
				<Text style={styles.emailSignLabel}>Haven't you rececived the verification code</Text>
				<Text style={styles.emailSignLabel}>Resend</Text>
			</View>
			<Button style={styles.verifyButton} size="large" onPress={onVerifyButtonPress}>
				Verify
			</Button>
			</View>
		</KeyboardAvoidingView>
		</Layout>
	);
};

const themedStyles = StyleService.create({
	container: {
		backgroundColor: "background-basic-color-1",
		flex: 1,
		
	},
	itemscontainer: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "space-evenly",
		marginTop: 32,
	},
	headerContainer: {
		minHeight: 216,
		paddingHorizontal: 16,
		paddingTop: 24,
		paddingBottom: 44,
	},
	signUpContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 32,
	},
	emailSignLabel: {
		alignSelf: "center",
		marginTop: 8,
	},
	orLabel: {
		marginHorizontal: 8,
	},
	formContainer: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		marginTop: 48,
		paddingHorizontal: 32,
	},
	verifyButton: {
		marginVertical: 24,
		marginHorizontal: 16,
	},
	formInput: {
		marginTop: 16,
	},
});
