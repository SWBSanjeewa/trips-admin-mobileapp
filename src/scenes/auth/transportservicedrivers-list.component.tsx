import { TopNavigation, TopNavigationAction,Button } from "@ui-kitten/components";
import React from "react";
import { StyleSheet ,Text} from "react-native";

import { ArrowIosBackIcon } from "../../components/icons";
import { PlusOutlineIcon } from "../../components/icons";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import ContentView from "../../layouts/service-bus/transportservice-driver-list";

export const TransportServiceDriversListScreen = ({ navigation }): React.ReactElement => {

	return (
			<ContentView navigation={navigation} />	
	);
};

