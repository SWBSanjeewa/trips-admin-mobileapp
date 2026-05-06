import { TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import React from "react";
import { StyleSheet,  Text as RNText } from "react-native";

import { ArrowIosBackIcon } from "../../components/icons";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import ContentView from "../../layouts/service-bus/user-profile";

export const UserProfileScreen = ({ navigation }): React.ReactElement => {
	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={onBackPress} />
	);
	
	const onBackPress = () => {
		navigation && navigation.navigate("BusHome", {reload: false});
	};

	return (
		<SafeAreaLayout style={styles.container} insets="top">
			<TopNavigation title={props => (
				<RNText style={{fontWeight: '500', fontSize: 18}}>
					Profile
				</RNText>)} accessoryLeft={renderBackAction} />
			<ContentView navigation={navigation} />
		</SafeAreaLayout>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});