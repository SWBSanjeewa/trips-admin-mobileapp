import { RangeDatepickerElement, RangeDatepickerProps } from "@ui-kitten/components";
import React from "react";

import { ShowcaseContainer } from "../../../components/showcase-container.component";

import { RangeDatepickerShowcase } from "./range-datepicker-showcase.component";
import { rangeDatepickerShowcase } from "./type";

export const RangeDatepickerScreen = ({ navigation }): React.ReactElement => {
	const renderItem = (props: RangeDatepickerProps): RangeDatepickerElement => (
		<RangeDatepickerShowcase {...props} />
	);

	return (
		<ShowcaseContainer
			showcase={rangeDatepickerShowcase}
			renderItem={renderItem}
			onBackPress={navigation.goBack}
		/>
	);
};
