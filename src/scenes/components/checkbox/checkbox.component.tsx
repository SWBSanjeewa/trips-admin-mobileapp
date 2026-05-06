import { CheckBoxElement, CheckBoxProps } from "@ui-kitten/components";
import React from "react";

import { ShowcaseContainer } from "../../../components/showcase-container.component";

import { CheckBoxShowcase } from "./checkbox-showcase.component";
import { checkboxSettings, checkboxShowcase } from "./type";

export const CheckBoxScreen = ({ navigation }): React.ReactElement => {
	const renderItem = (props: CheckBoxProps): CheckBoxElement => <CheckBoxShowcase {...props} />;

	return (
		<ShowcaseContainer
			showcase={checkboxShowcase}
			settings={checkboxSettings}
			renderItem={renderItem}
			onBackPress={navigation.goBack}
		/>
	);
};
