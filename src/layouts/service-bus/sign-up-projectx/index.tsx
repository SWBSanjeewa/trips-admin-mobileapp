import {
	Button,
	CheckBox,
	Datepicker,
	Divider,
	Input,
	StyleService,
	Text,
	useStyleSheet,
} from "@ui-kitten/components";
import React from "react";
import { View } from "react-native";

import { KeyboardAvoidingView } from "./extra/3rd-party";

import { ImageOverlay } from "./extra/image-overlay.component";

export default ({ navigation }): React.ReactElement => {
	const [fullName, setFullName] = React.useState<string>();
	const [mobileNumber, setMobileNumber] = React.useState<string>();
	const [termsAccepted, setTermsAccepted] = React.useState<boolean>(false);

	const styles = useStyleSheet(themedStyles);

	const onVerifyButtonPress = (): void => {
		navigation && navigation.navigate("OTPVerify");
	};

	const renderCheckboxLabel = React.useCallback(
		evaProps => (
			<Text {...evaProps} style={styles.termsCheckBoxText}>
				By creating an account, I agree to the Ewa Terms of\nUse and Privacy Policy
			</Text>
		),
		[],
	);

	return (
		<KeyboardAvoidingView style={styles.container}>
			<ImageOverlay
				style={styles.headerContainer}
				source={require("./assets/image-background.png")}
			/>
			<View>
				<Text style={styles.orLabel} category="h5">
					Welcome to Staffservice
				</Text>
			</View>
			<View>
				<Text style={styles.emailSignLabel}>Enter your phone number to continue</Text>
			</View>
			<View style={[styles.container, styles.formContainer]}>
				<Input
					label="Full Name"
					autoCapitalize="words"
					value={fullName}
					onChangeText={setFullName}
				/>
				<Input
					style={styles.formInput}
					label="Mobile Number"
					autoCapitalize="words"
					value={mobileNumber}
					onChangeText={setMobileNumber}
				/>
				<CheckBox
					style={styles.termsCheckBox}
					checked={termsAccepted}
					onChange={(checked: boolean) => setTermsAccepted(checked)}
				>
					{renderCheckboxLabel}
				</CheckBox>
			</View>
			<Button style={styles.verifyButton} size="large" onPress={onVerifyButtonPress}>
				Verify mobile number via whatsapp
			</Button>
		</KeyboardAvoidingView>
	);
};

const themedStyles = StyleService.create({
	container: {
		backgroundColor: "background-basic-color-1",
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
	formContainer: {
		marginTop: 48,
		paddingHorizontal: 16,
	},
	verifyButton: {
		marginVertical: 24,
		marginHorizontal: 16,
	},
	formInput: {
		marginTop: 16,
	},
	termsCheckBox: {
		marginTop: 20,
	},
	termsCheckBoxText: {
		fontSize: 11,
		lineHeight: 14,
		color: "text-hint-color",
		marginLeft: 10,
	},
});
