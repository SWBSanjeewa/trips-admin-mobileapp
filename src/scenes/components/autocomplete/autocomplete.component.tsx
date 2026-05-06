import { AutocompleteElement } from "@ui-kitten/components";
import React from "react";

import { ShowcaseContainer } from "../../../components/showcase-container.component";

import { AutocompleteShowcase } from "./autocomplete-showcase.component";
import { autocompleteSettings, autocompleteShowcase, AutocompletePropsCustom } from "./type";

export const AutocompleteScreen = ({ navigation }): React.ReactElement => {
	const renderItem = (props: AutocompletePropsCustom): AutocompleteElement => (
		<AutocompleteShowcase {...props} />
	);

	return (
		<ShowcaseContainer
			showcase={autocompleteShowcase}
			settings={autocompleteSettings}
			renderItem={renderItem}
			onBackPress={navigation.goBack}
		/>
	);
};
