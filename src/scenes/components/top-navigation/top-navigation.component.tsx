import { TopNavigationElement, TopNavigationProps } from "@ui-kitten/components";
import React from "react";
import { StyleSheet } from "react-native";

import { ShowcaseContainer } from "../../../components/showcase-container.component";

import { TopNavigationShowcase } from "./top-navigation-showcase.component";
import { topNavigationSettings, topNavigationShowcase } from "./type";

export const TopNavigationScreen = ({ navigation }): React.ReactElement => {
	const renderItem = (props: TopNavigationProps): TopNavigationElement => (
		<TopNavigationShowcase {...props} style={[styles.component, props.style]} />
	);

	return (
		<ShowcaseContainer
			showcase={topNavigationShowcase}
			settings={topNavigationSettings}
			renderItem={renderItem}
			onBackPress={() => navigation.goBack()}
		/>
	);
};

const styles = StyleSheet.create({
	component: {
		flex: 1,
	},
});
