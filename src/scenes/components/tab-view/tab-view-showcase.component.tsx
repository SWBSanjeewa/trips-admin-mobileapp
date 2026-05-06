import { TabView, TabViewElement, TabViewProps } from "@ui-kitten/components";
import React from "react";

export const TabViewShowcase = (props: TabViewProps): TabViewElement => {
	const [selectedIndex, setSelectedIndex] = React.useState(props.selectedIndex);

	return <TabView {...props} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />;
};
