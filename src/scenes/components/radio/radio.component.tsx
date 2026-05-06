import { RadioElement, RadioProps } from "@ui-kitten/components";
import React from "react";

import { ShowcaseContainer } from "../../../components/showcase-container.component";

import { RadioShowcase } from "./radio-showcase.component";
import { radioSettings, radioShowcase } from "./type";

export const RadioScreen = ({ navigation }): React.ReactElement => {
	const renderItem = (props: RadioProps): RadioElement => <RadioShowcase {...props} />;

	return (
		<ShowcaseContainer
			showcase={radioShowcase}
			settings={radioSettings}
			renderItem={renderItem}
			onBackPress={navigation.goBack}
		/>
	);
};
