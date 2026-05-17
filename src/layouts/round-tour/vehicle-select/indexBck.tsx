import React from "react";

import {BusListCard}  from "./extra/bus-list";

export default React.forwardRef(({ navigation, search },ref) => {

	return (
		<BusListCard navigation={navigation} search={search} ref={ref}/>
	);
});
