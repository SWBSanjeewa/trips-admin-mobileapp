import { RadioGroupElement, RadioGroupProps } from "@ui-kitten/components";
import React from "react";

import { ShowcaseContainer } from "../../../components/showcase-container.component";

import { RadioGroupShowcase } from "./radio-group-showcase.component";
import { radioGroupShowcase } from "./type";

export const RadioGroupScreen = ({ navigation }): React.ReactElement => {
	const renderItem = (props: RadioGroupProps): RadioGroupElement => (
		<RadioGroupShowcase {...props} />
	);

	return (
		<ShowcaseContainer
			showcase={radioGroupShowcase}
			renderItem={renderItem}
			onBackPress={navigation.goBack}
		/>
	);
};
