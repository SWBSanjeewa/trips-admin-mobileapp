import { TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import React from "react";
import { StyleSheet ,Text} from "react-native";

import { ArrowIosBackIcon } from "../../components/icons";
import { PlusOutlineIcon } from "../../components/icons";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import ContentView from "../../layouts/service-bus/transportservice";
import AppStore from "../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";

export const TransportServiceScreen = ({ navigation }): React.ReactElement => {

	const appStore = useStore(AppStore);

	const onAddDriverPress = () => {
		appStore.transportService.reset();		
		navigation.goBack();
	};

	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={onAddDriverPress} />
	);


	return (
		<SafeAreaLayout style={styles.container} insets="top">
			<TopNavigation title={props => (
				<Text {...props} style={{fontWeight: "500", fontSize: 18}}>
					Transport Service
				</Text>)} accessoryLeft={renderBackAction} />
			<ContentView navigation={navigation} />
		</SafeAreaLayout>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});