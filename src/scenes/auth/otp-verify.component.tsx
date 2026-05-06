import React from "react";

import { TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { StyleSheet } from "react-native";

import { ArrowIosBackIcon } from "../../components/icons";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import ContentView from "../../layouts/service-bus/otp-verify";


export const OTPVerifyScreen = ({ navigation }): React.ReactElement => {
	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
	);

	return (
		<SafeAreaLayout style={styles.container} insets="top">
			<TopNavigation title="OTP Verify" accessoryLeft={renderBackAction} />
			<ContentView navigation={navigation} />
		</SafeAreaLayout>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
