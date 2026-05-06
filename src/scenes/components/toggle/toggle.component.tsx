import { ToggleElement, ToggleProps } from "@ui-kitten/components";
import React from "react";

import { ShowcaseContainer } from "../../../components/showcase-container.component";

import { ToggleShowcase } from "./toggle-showcase.component";
import { toggleSettings, toggleShowcase } from "./type";

export const ToggleScreen = ({ navigation }): React.ReactElement => {
	const renderItem = (props: ToggleProps): ToggleElement => <ToggleShowcase {...props} />;

	return (
		<ShowcaseContainer
			showcase={toggleShowcase}
			settings={toggleSettings}
			renderItem={renderItem}
			onBackPress={navigation.goBack}
		/>
	);
};
