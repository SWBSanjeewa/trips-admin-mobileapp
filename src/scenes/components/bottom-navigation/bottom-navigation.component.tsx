import { BottomNavigationElement, BottomNavigationProps } from "@ui-kitten/components";
import React from "react";
import { StyleSheet } from "react-native";

import { ShowcaseContainer } from "../../../components/showcase-container.component";

import { BottomNavigationShowcase } from "./bottom-navigation-showcase.component";
import { bottomNavigationSettings, bottomNavigationShowcase } from "./type";

export const BottomNavigationScreen = ({ navigation }): React.ReactElement => {
	const renderItem = (props: BottomNavigationProps): BottomNavigationElement => (
		<BottomNavigationShowcase {...props} style={styles.bottomNavigation} />
	);

	return (
		<ShowcaseContainer
			showcase={bottomNavigationShowcase}
			settings={bottomNavigationSettings}
			renderItem={renderItem}
			onBackPress={navigation.goBack}
		/>
	);
};

const styles = StyleSheet.create({
	bottomNavigation: {
		flex: 1,
	},
});
