import { IconElement, IconProps } from "@ui-kitten/components";
import React from "react";

import { ShowcaseContainer } from "../../../components/showcase-container.component";

import { IconShowcase } from "./icon-showcase.component";
import { iconSettings, iconShowcase } from "./type";

export const IconScreen = ({ navigation }): React.ReactElement => {
	const renderItem = (props: IconProps): IconElement => <IconShowcase {...props} />;

	return (
		<ShowcaseContainer
			showcase={iconShowcase}
			settings={iconSettings}
			renderItem={renderItem}
			onBackPress={navigation.goBack}
		/>
	);
};
