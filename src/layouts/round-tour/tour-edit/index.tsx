import React from "react";

import TourEditCard  from "./extra/touredit-card.component";
import { observer, inject} from "mobx-react";

const TourEdit = React.forwardRef(({ navigation }, ref) => {

	return (
		<TourEditCard navigation={navigation} ref={ref}/>
	);
});

export default observer(TourEdit);
