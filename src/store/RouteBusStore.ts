import { remove } from "mobx";
import { types } from "mobx-state-tree";
import { cast } from "mobx-state-tree"

/*
id: String,
   routeNumber: String, //Eg: Colombo - Kandy 01
   title: String,
   stoppings: [String],
   vehicleType: String, // Luxury, Semi-Luxury, Normal,
   timetableType: String,
   distance: String,
   runningTime: String,
   timetableType: String,  //whether it is everyday, odd-even etc
   everyDayTimetable: Timetable,
   oddDayTimetable: Timetable,
   evenDayTimetable: Timetable,
   selectedDayTimetables: [Timetable],
   selectedDateTimetables: [Timetable],   // 2
   countryCode: String,

   journey: [Journey],
    returnJourney: [Journey],
    runningDays: [String],
    validUntil: Date


    const Journey = new Schema({ 
    start: String,
    end: String,
    transportServiceType: String,  //SLTB, PVT
    roadType: String,  // ExpressWay, Normal
    depot: String,
    ntcNumber: String,
    busRunningNumber: String,
    busRegistrationNumber: String,
    stoppings: [Stopping]
});

   */
const Stopping = types.model({
  place: types.optional(types.string, ""),
  latitude: types.optional(types.string, "0.0"),
  longitude: types.optional(types.string, "0.0"),
  duration: types.string 
})
.actions((self) => ({
  
})
);

const StoppingTime = types.model({
  place: types.optional(types.string, ""),
  plusDays: types.optional(types.number, 0),
  time: types.string 
})
.actions((self) => ({
  setTime(time) {
    self.time = time;
  },
  setPlusDays(plusDays) {
    self.plusDays = plusDays;
  }
})
);

const StoppingPlace = types.model({
  place: types.optional(types.string, ""),
  latitude: types.optional(types.string, ""),
  longitude: types.optional(types.string, ""),
})
.actions((self) => ({
  setPlace(place,latitude,longitude) {
    self.place = place;
    self.latitude = latitude;
    self.longitude = longitude;
  }
})
);

/*

const Stopping = new Schema({ 
    place: String,
    location: String,
	  latitude: String,
	  longitude: String,
    time: String
});

//Eg: Colombo - Trincomalee have 2 busses assgned the same time 
// today - From colombo 
// tomorrow - From trinco
const AssignedBus = new Schema({ 
    ntcNumber: String, // Optional: 12400 
    busRegNo: String.  // NE-1234
});


const Turn = new Schema({ 
    onboardStartTime: String, // 4.45AM
    startTime: String,  // 5.00AM
    runningNo: String,  // Optional: Makumbura-Galle M1, SLTB
    assignedBuses: [AssignedBus],  
    busRegNo: String,  
    stoppings: [Stopping],
});


const Timetable = new Schema({ 
    type: String, // Odd Days, Even Days, SelectedDays, Everyday, Weekdays, Weekends
    turns: [Turn],
    selectedRunningDays: [String]
});

*/

const AllowedBus = types.model({
  regNo: types.string,
  licenseNo: types.string,
  date: types.optional(types.string, ""),
})
.actions((self) => ({
  
  reset(){
    
  },
  setRegNo(regNo){
    self.regNo = regNo;
  },
  setLicenseNo(licenseNo){
    self.licenseNo = licenseNo;
  },
  setDate(date){
    self.date = date;
  },
}))

const Turn = types.model({
  onboardStartTime: types.string,
  startTime: types.string,
  runningNo: types.string,
  stoppingTimes: types.array(StoppingTime),
  registrationNo: types.string,
  licenseNo: types.string,
  allowedBuses: types.array(AllowedBus),

  //onboardStartTime,startTime,runningNo,registrationNo,licenseNo,stoppings
})
.actions((self) => ({
  
  reset(){
    
  },
  addStoppingTime(place,days,time){
    self.stoppingTimes.push({place,days,time})
  },
  updateStoppingTime(place,days,time){
    var stoppingTime = self.stoppingTimes.find(s => s.place === place);
    stoppingTime?.setTime(time);
    stoppingTime?.setPlusDays(days);
  },
  getStoppingTimeByPlace(place){
    return self.stoppingTimes.find(s => s.place === place);
  },
  deleteStoppingTimeByPlace(place){
    var stoppingTime = self.stoppingTimes.find(s => s.place === place);
    self.stoppingTimes.remove(stoppingTime);
  },
  updateOnboardStartTime(time){
    self.onboardStartTime=time;
  },
  setRunningNo(runningNo){
    self.runningNo=runningNo;
  }

  ,
   setRegistrationNo(registrationNo){
    self.registrationNo=registrationNo;
  },
   setLicenseNo(licenseNo){
    self.licenseNo=licenseNo;
  },
   addAllowedBus(regNo,licenseNo,date){
      self.allowedBuses.push({regNo,licenseNo,date})
    },
    addAllowedBusAtIndex(regNo,licenseNo,date,index){
      self.allowedBuses.splice(index, 0, {regNo,licenseNo,date});
    },
    deleteAllowedBusByIndex(index){
      console.log("deleteAllowedBusByIndex:"+index);
      self.allowedBuses.remove(self.allowedBuses[index]);
    },
    updateAllowedBusByIndex(regNo,licenseNo,date,index){
      const allowedBus = self.allowedBuses[index];
     // console.log("####"+stopping.latitude+","+stopping.longitude);
     allowedBus.setRegNo(regNo);
     allowedBus.setLicenseNo(licenseNo);
     allowedBus.setDate(date);
    }
    
  
}))



export const Timetable = types.model({
  type: types.optional(types.string, ""),
  runningDays: types.optional(types.string, ""),
  turns: types.array(Turn)
})
.actions((self) => ({
  
  reset(){
    self.type = "";
    self.runningDays = "";
    self.turns=Turn[0];
  },
  addTurn(onboardStartTime,startTime,runningNo,stoppings){
    console.log("Add turns");
    self.turns.push({onboardStartTime,startTime,runningNo,stoppings})
  },
  setTimetableType(timetableType){
    self.type = timetableType;
  },
  setRunningDays(runningDays){
    self.runningDays = runningDays;
  }
}))

const Route = types.model({
  runningTime: types.optional(types.string, ""),
  onBoardDuration: types.optional(types.string, ""),
  distance: types.optional(types.string, ""),
  stoppings: types.array(Stopping),
  timetables: types.array(Timetable)
})
.actions((self) => ({
  
  reset(){  

  },
  setRunningTime(runningTime){
    self.runningTime = runningTime;
  },
  setDistance(distance){
    self.distance = distance;
  },
  addTimetable(type,runningDays){
    console.log("addTimetable"+type);
    self.timetables.push({type,runningDays});
   
  },
  addTurn(onboardStartTime,startTime,runningNo,stoppings){
    var timetable = self.timetables.pop();
    timetable?.addTurn(onboardStartTime,startTime,runningNo,stoppings)
  },
  deleteTurnByIndex(timetableIndex, index){
     var timetable = self.timetables[timetableIndex];
     var turn = timetable.turns[index];
     timetable.turns.remove(turn);
  },

  addTurnAfterIndex(timetableIndex,previousTurnIndex,onboardStartTime,startTime,runningNo,stoppingTimes,registrationNo,licenseNo){
    console.log("previousTurnIndex:"+previousTurnIndex+" startTime:"+startTime);
    var timetable = self.timetables[timetableIndex];
    //const turn = timetable.turns.find(s => s.startTime === previousStartTime);
   // console.log("## turn startTime:"+turn?.startTime);
   // var index = timetable.turns.findIndex(turn);
    
    console.log("## index:"+previousTurnIndex);
    console.log(previousTurnIndex+1+"0"+onboardStartTime+":"+startTime+":"+runningNo+":"+stoppingTimes);
    timetable.turns.splice(previousTurnIndex+1, 0, {
        onboardStartTime,startTime,runningNo,stoppingTimes,registrationNo,licenseNo
    })
  },
  addStopping(place,latitude, longitude,duration){
      console.log("storing:"+place+","+latitude);
      self.stoppings.push({
        place,
        latitude,
        longitude,
        duration,
      })
  },
  updateStopping(oldLatitude, oldLongitude,place,latitude, longitude,duration){
      const oldStopping = self.stoppings.find(s => s.latitude === oldLatitude && s.longitude === oldLongitude);
      oldStopping.latitude = latitude;
      oldStopping.longitude = longitude;
      oldStopping.place = place;
      oldStopping.duration = duration;
  },
  deleteStopping(stopping){
      self.stoppings.remove(stopping);
  },
  deleteStoppingById(latitude, longitude){
    const stopping = self.stoppings.find(s => s.latitude === latitude && s.longitude === longitude);
    console.log("####"+stopping.latitude+","+stopping.longitude);
    self.stoppings.remove(stopping);
  },
  addStoppingAtIndex(place,latitude, longitude,index,duration){
    self.stoppings.splice(index, 0, {
      place,
      latitude,
      longitude,
      duration,
    });
  },

}))





const NewRouteVirtualBusStore = types
  .model({
    objectId: types.optional(types.string, ""),
    title: types.optional(types.string, ""),  // Colombo to Kandy
    routeNo: types.optional(types.string, ""),   // 636 Kandy matale (via Wattegama)
    operator: types.optional(types.string, ""),   // SLTB, Private, Combined
    transportAuthority: types.optional(types.string, ""),   // NTC, CP-TSA, SP-RPSA
    typeOfService: types.optional(types.string, ""),   // Normal, Luxury, Super Luxury
    duration: types.optional(types.string, ""), // 90 Minutes - Makumbura-Galle
    stoppingPlaces: types.array(StoppingPlace),
    journey: types.optional(Route, {
      timetables: []
    }),
    returnJourney: types.optional(Route, {
      timetables: []
    }),
    
  })
  .actions((self) => ({
    reset() {
      console.log("self::"+self);
      self.objectId = "";
      self.title = "";
      self.routeNo = "";
      self.operator = "";
      self.transportAuthority = "";
      self.typeOfService = "";
      self.stoppingPlaces= StoppingPlace[0];
    },
    populate(bus) {
      self.objectId = bus._id;
      self.title = bus.title;
      self.routeNo = bus.routeNo;
      self.operator = bus.operator;
      self.transportAuthority = bus.transportAuthority;
      self.typeOfService = bus.typeOfService;
      self.routeNo = bus.routeNo;
      console.log(">>"+bus.journey);
      console.log(JSON.stringify(bus.journey[0]));	
      
      //bus.journey[0].timetables?.forEach(timetable => {
      //  console.log("###"+timetable);
      //  self.journey.addTimetable(timetable.type,timetable.runningDays, timetable.turns);
      //});
      self.journey = bus.journey[0];
    },
    setTitle(title) {
      self.title = title;
    },
    setRouteNo(routeNo) {
      self.routeNo = routeNo;
    },
    setObjectId(objectId) {
      self.objectId = objectId;
    },
    setOperator(operator) {
      self.operator = operator;
    },
    setTransportAuthority(transportAuthority) {
      self.transportAuthority = transportAuthority;
    },
    setTypeOfService(typeOfService) {
      self.typeOfService = typeOfService;
    },
    addStoppingPlace(place,latitude,longitude){
      self.stoppingPlaces.push({
        place,
        latitude,
        longitude
      })
    },
    addStoppingPlaceAtIndex(place,latitude,longitude,index){
      self.stoppingPlaces.splice(index, 0, {place,latitude,longitude});
    },
    getIndex(stoppingPlace){
      return self.stoppingPlaces.findIndex(q => q === stoppingPlace);
    },
    getStopping(index){
      return self.stoppingPlaces[index];
    },
    deleteStoppingPlaceByIndex(index){
      //const s = self.stoppings.find(s => s === stopping);
      self.stoppingPlaces.remove(self.stoppingPlaces[index]);
    },
    deleteStoppingPlaceByPlace(place){
       const stoppingPlace = self.stoppingPlaces.find(p => p.place === place);
       self.stoppingPlaces.remove(stoppingPlace);
    },
    addTimetable(type,runningDays){
      console.log("addTimetable::"+type);
     // self.journey.timetables.push({type,runningDays,turns});
      self.journey.addTimetable(type,runningDays);
      console.log("end addTimetable"+self.journey.timetables.length);
    }
  }))
  .views((self) => ({
    
  })
);

export default NewRouteVirtualBusStore;