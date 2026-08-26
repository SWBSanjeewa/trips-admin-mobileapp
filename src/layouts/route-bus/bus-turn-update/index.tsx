import React from "react";

import BusTurnUpdateCard  from "./extra/busturnupdate-card.component"
import { observer, inject} from "mobx-react";

const BusTurnUpdate = React.forwardRef(({ navigation }, ref) => {

	return (
		<BusTurnUpdateCard navigation={navigation} ref={ref}/>
	);
});

export default observer(BusTurnUpdate);
