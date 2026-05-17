import { TopNavigation, TopNavigationAction ,IconElement} from "@ui-kitten/components";
import React,{useRef} from "react";
import { RefreshIcon } from "../../components/icons";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import { StyleSheet, Text as RNText } from "react-native";
import { ArrowIosBackIcon } from "../../components/icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AppStore from "../../store/AppStore";
import { useStore } from "mobx-store-provider";
import RBSheet from 'react-native-raw-bottom-sheet';
import { useRoute } from "@react-navigation/native";
import ContentView from "../../layouts/round-tour/tour-details";


export const TourDetailsScreen = ({ navigation }): React.ReactElement => {

	const route = useRoute();

	const appStore = useStore(AppStore);

	const ref = useRef<typeof RBSheet>();

	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={onBackPress} />
	);

	const renderMoreAction = (): React.ReactElement => (
		<>
			<TopNavigationAction icon={MenuIcon} onPress={onMorePress} />
		</>
	);

	const MenuIcon = (props): IconElement => (
		<MaterialIcons name="more-vert" size={24} color="black" />
	);


	const onBackPress = () => {
		appStore.bus.reset();		
		var localreload = false;
		var localreload = route.params?.reload;
		console.log("localreload::"+localreload);
		navigation && navigation.navigate("TourList", {reload: localreload});
	};

	const onMorePress = () => {
		ref.current?.open();
	};

	return (
		<SafeAreaLayout style={styles.container} insets="top">
			<TopNavigation title={props => (
				<RNText {...props} style={{fontWeight: "500", fontSize: 18}}>
					Tour Details
				</RNText>)} accessoryLeft={renderBackAction} accessoryRight={renderMoreAction}/>
				<ContentView navigation={navigation} ref={ref}/>
			
		</SafeAreaLayout>	
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
