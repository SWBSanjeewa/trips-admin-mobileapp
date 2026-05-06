import { TopNavigation, TopNavigationAction,IconElement } from "@ui-kitten/components";
import React,{useRef} from "react";
import { StyleSheet,Text,SafeAreaView} from "react-native";
import { ArrowIosBackIcon } from "../../components/icons";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import ContentView from "../../layouts/round-tour/tour-schedule";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import RBSheet from 'react-native-raw-bottom-sheet';

export const TourScheduleScreen = ({ navigation }): React.ReactElement => {

	const ref = useRef<typeof RBSheet>();

	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
	);

	const renderMoreAction = (): React.ReactElement => (
			<>
				<TopNavigationAction icon={MenuIcon} onPress={onMorePress} />
			</>
	);

	const MenuIcon = (props): IconElement => (
		<MaterialIcons name="more-vert" size={24} color="black" />
	);

	const onMorePress = () => {
		ref.current?.open();
	};

	return (		
		
		<SafeAreaLayout style={{ flex: 1}} insets="top">
			<SafeAreaLayout style={{ flex: 1}} insets="bottom">
			<TopNavigation title={props => (
				<Text {...props} style={{fontWeight: "500", fontSize: 18}}>
				 Tour Schedule
				</Text>)} accessoryLeft={renderBackAction}  accessoryRight={renderMoreAction}/>
				<ContentView navigation={navigation} ref={ref}/>
			</SafeAreaLayout>
		</SafeAreaLayout>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});