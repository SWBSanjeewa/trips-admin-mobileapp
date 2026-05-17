import { remove } from "mobx";
import { types } from "mobx-state-tree";
import Stopping from "./Stopping";
import Schedule from "./Schedule";

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






const TourStore = types
  .model({
    id: types.optional(types.string, ""),
    objectId: types.optional(types.string, ""),
    vehicleType: types.optional(types.string, "Luxury Bus"),
    title: types.optional(types.string, ""),
    remarks: types.optional(types.string, ""),
    stoppingsPlaces: types.array(StoppingPlace),
    stoppings: types.array(Stopping),
    noOfSeats: types.optional(types.string, ""),
    noOfDays: types.optional(types.string, "1"),
    countryCode: types.optional(types.string, ""),
    photos: types.array(types.string),
    schedules: types.array(Schedule),
    confirmationStartsBefore: types.optional(types.string, "7 Days"),
    confirmationFinishBefore: types.optional(types.string, "2 Days"),
    vehicleId: types.optional(types.string, ""),  
    driverMobileNumber: types.optional(types.string, "") 
  })
  .actions((self) => ({
    reset() {
      console.log("self::"+self);
      self.id = "";
      self.objectId = "";
      self.title = "";
      self.stoppings= String[0];
      self.schedules= Schedule[0];
    },
    populate(tour) {
      self.id = tour.id;
      self.objectId = tour._id;
      self.title = tour.title;
      self.photos = tour.photos;
      self.stoppingsPlaces = tour.stoppingsPlaces;
    },
    setId(id) {
      self.id = id;
    },
    setObjectId(objectId) {
      self.objectId = objectId;
    },
    setVehicleType(vehicleType) {
      self.vehicleType = vehicleType;
    },
    setNoOfSeats(noOfSeats) {
      self.noOfSeats = noOfSeats;
    },
    setNoOfDays(noOfDays) {
      self.noOfDays = noOfDays;
    },
    setTitle(title) {
      self.title = title;
    },
    addPhoto(photo){
      self.photos.push(photo);
      console.log("No of photo:"+self.photos.length);
    },
    getPhoto(index){
      console.log("getPhotos No of photo:"+self.photos.length);
      console.log("GetPhotos index:"+index);
      return self.photos[index];
    },
    deletePhoto(index){
      console.log("No of photo before deletion:"+self.photos.length);
      console.log("GetPhotos index:"+index);
      self.photos.remove(self.photos[index]);
      console.log("No of photo after deletion:"+self.photos.length);
    },
    addStopping(title,place,latitude,longitude,day,time,waitingTime){
      self.stoppings.push({
        title,
        place,
        latitude,
        longitude,
        day,
        time,
        waitingTime
      })
    },
    updateStopping(oldLatitude, oldLongitude,title,place,latitude, longitude,time, day, waitingTime){
      const oldStopping = self.stoppings.find(s => s.latitude === oldLatitude && s.longitude === oldLongitude);
      oldStopping.latitude = latitude;
      oldStopping.longitude = longitude;
      oldStopping.place = place;
      oldStopping.title = title;
      oldStopping.time = time;
      oldStopping.waitingTime = waitingTime;
      oldStopping.day = day;
    },
    deleteStopping(stopping){
      self.stoppings.remove(stopping);
    },
    deleteStoppingById(latitude, longitude){
      const stopping = self.stoppings.find(s => s.latitude === latitude && s.longitude === longitude);
      console.log("####"+stopping.latitude+","+stopping.longitude);
      self.stoppings.remove(stopping);
    },
    
    addStoppingAtIndex(title,place,latitude,longitude,day,time,waitingTime,index){
      self.stoppings.splice(index, 0, {title,place,latitude,longitude,day,time,waitingTime});
    },
    addStoppingPlace(place,latitude,longitude){
      self.stoppingsPlaces.push({
        place,latitude,longitude
      })
    },
    
    addStoppingPlaceAtIndex(place,latitude,longitude,index){
      self.stoppingsPlaces.splice(index, 0, {place,latitude,longitude});
    },
    deleteStoppingPlace(index){
      //const s = self.stoppings.find(s => s === stopping);
      self.stoppingsPlaces.remove(self.stoppingsPlaces[index]);
    },
    getIndex(stopping){
      return self.stoppings.findIndex(q => q === stopping);
    },
    getStopping(index){
      return self.stoppings[index];
    },
    deleteStopping(index){
      //const s = self.stoppings.find(s => s === stopping);
      self.stoppings.remove(self.stoppings[index]);
    },

   

    addSchedule(id,remarks,tourStartDate,tourStartTime,confirmationStartTime,confirmationEndTime,vehicleId,bookings){
      console.log("Adding schedule"+tourStartDate);
      self.schedules.push({
        id,
        remarks,
        tourStartDate,
        tourStartTime,
        confirmationStartTime,
        confirmationEndTime,
        vehicleId,
        bookings
      })
    },
    addScheduleAtIndex(title,place,latitude,longitude,day,time,waitingTime,index){
      self.stoppings.splice(index, 0, {title,place,latitude,longitude,day,time,waitingTime});
    },
    getSchedule(index){
      return self.schedules[index];
    },
    deleteSchedule(index){
      self.schedules.remove(self.schedules[index]);
    },
  }))
  .views((self) => ({
    getStoppings() {
      return self.stoppings.length;
    }
  })
);

export default TourStore;