import { OverflowMenuElement } from "@ui-kitten/components";
import React from "react";

import { ShowcaseContainer } from "../../../components/showcase-container.component";

import { OverflowMenuShowcase } from "./overflow-menu-showcase.component";
import { overflowMenuSettings, overflowMenuShowcase, OverflowMenuPropsCustom } from "./type";

export const OverflowMenuScreen = ({ navigation }): React.ReactElement => {
	const renderItem = (props: OverflowMenuPropsCustom): OverflowMenuElement => (
		<OverflowMenuShowcase {...props} />
	);

	return (
		<ShowcaseContainer
			showcase={overflowMenuShowcase}
			settings={overflowMenuSettings}
			renderItem={renderItem}
			onBackPress={navigation.goBack}
		/>
	);
};
