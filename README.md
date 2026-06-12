https://www.sprpta.lk/schedulebyrouteall.php?routenumber=350
undefined

## Set node version
$ nvm use v16.14.0

## Run for IOS
$ npm run ios 


# Recrteate ios folder after deletion
(if you delete whole ios folder you need to run yarn ios)
$ yarn ios
$ npm run ios

Run google maps for iOS
===
Use changes in follwing files
docs/Podfile
docs/AppDelegate.mm
https://github.com/react-native-maps/react-native-maps/blob/master/docs/installation.md


Add Icons
===

https://akveo.github.io/eva-icons/#/


Image Picker
===

https://www.educative.io/answers/how-to-use-react-native-image-picker


Save passwords
===
Could not use "rn-secure-storage":  "3.0.1" becasue android was not working, so that had to use react-native-keychain 8.1.3


react-native-geolocation-service
===
https://stackoverflow.com/questions/77274148/could-not-invoke-rnfusedlocation-getcurrentposition-react-native-geolocation-s

In android/build.gradle:
buildscript {
ext {
    //..
    googlePlayServicesVersion = "21.0.1" //add this line
}
}

In android/app/build.gradle:

dependencies {
//..
implementation 'com.google.android.gms:play-services-location:21.0.1' // add this 


Gallery view
===
Can not use @georstat/react-native-image-gallery since zoom functionality is not implemented yet.
Custom image viewer implemented in bus-details


Bottom view
====
react-native-raw-bottom-sheet does not support scrollview
had to use "@gorhom/bottom-sheet"

Maps Key
====
https://console.cloud.google.com/apis/credentials/key/58539f96-578f-41a4-837d-5f5af3a4eeeb?project=routeslk


Push Notifications
====
https://docs.expo.dev/push-notifications/what-you-need-to-know/

https://docs.expo.dev/push-notifications/push-notifications-setup/

https://www.youtube.com/watch?v=BCCjGtKtBjE



In android 
Constants?.expoConfig?.extra?.eas?.projectId  is Undefined
https://github.com/expo/expo/issues/33692
find node_modules/expo-constants/ -name app.config -delete

$ eas credentials
$ eas build -p android

Add google-services.json to root folder
Update app.json
"googleServicesFile": "./google-services.json"
$ npx expo prebuild to include google-services.json in android/app

google-services.json into its home in the android/app
https://github.com/expo/expo/issues/9926
$ npx expo prebuild

A15 expo token
 ExponentPushToken[OyLQqtNccNC_aSC5SchhdR]

Tool to test
https://expo.dev/notifications




EAS Build
====

Configure app.json
https://docs.expo.dev/versions/latest/config/app/#intentfilters

$ npm install -g eas-cli && eas login

$ eas build --platform android --profile production

$ eas submit --platform android
(https://expo.fyi/creating-google-service-account)

Ask for Build Number and google service account file

https://github.com/expo/fyi/blob/main/creating-google-service-account.md

https://support.google.com/googleplay/android-developer/answer/9214102?hl=en&ref_topic=7072031&sjid=3065899476961295923-NC

https://support.google.com/googleplay/android-developer/answer/9888170?sjid=3065899476961295923-NC

Your APK or Android App Bundle is using permissions that require a privacy policy: (android.permission.READ_CONTACTS).

https://play.google.com/console/u/0/developers/7803701176018749663/app/4974515309899828730/policy-center?pli=1


GoogleAutoComplete
===

https://stackoverflow.com/questions/63142638/googleplacesautocomplete-styling-on-the-list-content-of-places-is-not-working-no



https://github.com/expo/expo/issues/31885


As far as I know, GoogleMLKit still doesn't support arm64 for simulator. You can see it in its podspec that arm64 is specified as an excluded arch: https://github.com/CocoaPods/Specs/blob/9112c3f116e69204c91a4c480a58b6738e522788/Specs/b/e/b/GoogleMLKit/3.2.0/GoogleMLKit.podspec.json#L18

Which means that Xcode is probably trying to build your project in x86_64 architecture and then run the simulator in the Rosetta mode. I'm guessing that precompiled version of some modules (including ExpoModulesCore) are cached on your machine and thus Xcode couldn't find it. Have you tried removing the ~/Library/Developer/Xcode/DerivedData folder?

You can also try forcing Xcode to run the simulator in Rosetta mode, see this post that explains how to do it: https://stackoverflow.com/a/78631095


Verification

Please enter the OTP sent to your mobile (+94772149179) or email (swbsanjeewa@gmail.com)




Time remaining: 1m 14s seconds



https://stackoverflow.com/questions/71265042/what-is-usecallback-in-react-and-when-to-use-it


https://github.com/kolking/react-native-crossfade-image/tree/main


https://icons.expo.fyi/Index

Eva custom color selector
https://akveo.github.io/react-native-ui-kitten/docs/guides/branding#primary-color

https://reactnativepaper.com



//{
//  "_id": {
//    "$oid": "675c0ae1b55615964fa18b92"
//  },
//  "mobileNumber": "+94772149179",
//  "name": "Buddhika Sanjeewa",
 // "verificationCode": "805054",
 //// "__v": 0
//}


{props.data.map(function(passenger){
			<View style={{ flexDirection: "row",  justifyContent: 'flex-start', margin: 2}} key={"journeyPassengerItem"+item.mobileNumber}>	
					<View style={{ padding: 0}}>
						<Avatar source={{uri : "https://routes.lk:7007/users/"+passenger.mobileNumber+"/profile-photo.jpg"}} ImageComponent={ImageBackground} size="small"/>
					</View>
					
				</View>
			})}


@@ -64,7 +64,7 @@
     "react-native-svg": "13.5.0",
     "react-native-tab-view": "^3.3.4",
     "react-native-web": "^0.18.10",
-    "react-native-image-picker": "7.2.3",
+    "react-native-image-picker": "5.7.0",
     "@bam.tech/react-native-image-resizer": "3.0.11",
     "react-native-virtualized-view": "1.0.0",
     "react-native-flash-message": "0.4.2",
@@ -72,8 +72,8 @@
     "react-native-raw-bottom-sheet": "3.0.0",
     "@expo/vector-icons": "14.0.4",
     "react-native-paper": "5.12.5",
-    "rn-secure-storage": "3.0.1",
-    "@georstat/react-native-image-cache": "3.1.0",
+    "rn-secure-storage": "2.0.8",
+    "@georstat/react-native-image-cache": "1.6.0",
     "react-native-file-access": "3.1.1"




"expo": "52.0.24",
"react": "18.2.0",
"react-dom": "18.2.0",
"react-native": "0.76.5",

FAILURE: Build failed with an exception.

* Where:
Build file '/Users/buddhikasanjeewa/Documents/Development/workspace_copy/pickndropservice-mobileapp/android/app/build.gradle' line: 1

* What went wrong:
A problem occurred evaluating project ':app'.
> Failed to apply plugin 'com.android.internal.application'.
   > Android Gradle plugin requires Java 17 to run. You are currently using Java 11.
      Your current JDK is located in /Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home
      You can try some of the following options:
       - changing the IDE settings.
       - changing the JAVA_HOME environment variable.
       - changing `org.gradle.java.home` in `gradle.properties`.


buddhikasanjeewa@Buddhikas-MBP pickndropservice-mobileapp % npm run ios    

> kitten-tricks@2.7.0 ios
> expo run:ios

⚠️  Something went wrong running `pod install` in the `ios` directory.
Command `pod install` failed.
└─ Cause: Invalid `Podfile` file: Please upgrade XCode.

Current 
xcode 14.3.1
MacOS         13.5.2

Latest
xcode 16.2 requires MacOS 14.5 or later

const [imageIndex, setImageIndex] = useState(0);

const onImagePressed = (): void => {
		if(appStore.bus.photos.length > imageIndex+1 ){
			setImageIndex(imageIndex+1);
		}else{
			setImageIndex(0);
		}
	};

<TouchableOpacity onPress={onImagePressed}>
				<CachedImage			
					resizeMode="cover"
					source={appStore.bus.photos[imageIndex]}
					style={styles.itemHeader}/>
			</TouchableOpacity>