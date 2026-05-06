

export class RoutesValidationService {
	
	static isValidMobileNumber = (mobileNumber): any => {
		if(mobileNumber!=null){
			if(mobileNumber.startsWith("0")){
				if(mobileNumber && mobileNumber.length == 10){
					return true;
				}
			}
			if(mobileNumber.startsWith("+")){
				if(mobileNumber && mobileNumber.length == 12){
					return true;
				}
			}	
		}
		return false;
	};

	static isValidAccessToken = (token): any => {
		if(token!=null&&token.length > 0){
			return true;
		}
		return false;
	};

	static isValidPassword = (password): any => {
		if(password&&password.length == 6 ){
			return true;
		}
		return false;
	};

	static isValidName = (name): any => {
		if(name&&name.length >0 ){
			return true;
		}
		return false;
	};
}
