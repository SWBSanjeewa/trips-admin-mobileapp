import { TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import React from "react";
import { StyleSheet ,Text} from "react-native";

import { ArrowIosBackIcon } from "../../components/icons";
import { PlusOutlineIcon } from "../../components/icons";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import ContentView from "../../layouts/service-bus/location-add";
import AppStore from "../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";

export const LocationAddScreen = ({ navigation }): React.ReactElement => {

	const appStore = useStore(AppStore);

	const onAddDriverPress = () => {
		//appStore.bus.reset();		
		navigation.goBack();
	};

	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={onAddDriverPress} />
	);


	return (
		<SafeAreaLayout style={styles.container} insets="top">
			<SafeAreaLayout style={styles.container} insets="bottom">
				<ContentView navigation={navigation} />
			</SafeAreaLayout>
		</SafeAreaLayout>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});