import { SelectElement, SelectProps } from "@ui-kitten/components";
import React from "react";

import { ShowcaseContainer } from "../../../components/showcase-container.component";

import { MultiselectShowcase } from "./multiselect-showcase.component";
import { SelectShowcase } from "./select-showcase.component";
import { selectSettings, selectShowcase } from "./type";

interface ShowcaseProps extends SelectProps {
	data: any[];
}

export const SelectScreen = ({ navigation }): React.ReactElement => {
	const renderItem = (props: ShowcaseProps): SelectElement => {
		return props.multiSelect ? <MultiselectShowcase {...props} /> : <SelectShowcase {...props} />;
	};

	return (
		<ShowcaseContainer
			showcase={selectShowcase}
			settings={selectSettings}
			renderItem={renderItem}
			onBackPress={navigation.goBack}
		/>
	);
};
