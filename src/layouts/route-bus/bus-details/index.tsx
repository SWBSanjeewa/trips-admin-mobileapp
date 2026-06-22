import React from "react";

import {BusDetailsCard}  from "./extra/busdetails-card.component";

export default React.forwardRef(({ navigation },ref) => {

	return (
		<BusDetailsCard navigation={navigation} ref={ref}/>
	);
});
