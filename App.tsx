import "./global.css"
import { StatusBar, StyleSheet, useColorScheme, View } from "react-native";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import RootNavigator from "./src/navigation/RootNavigator";
import Svg, { Defs, RadialGradient, Path, Stop } from "react-native-svg";

export default function App() {
  return (
    <SafeAreaProvider>
      <AppInner />
    </SafeAreaProvider>
  );
  // const isDarkMode = useColorScheme() === "dark";
  // const insets = useSafeAreaInsets();

  // return (

  //   <SafeAreaProvider>
  //     <StatusBar
  //       translucent
  //       backgroundColor="transparent"
  //       barStyle={isDarkMode ? "light-content" : "dark-content"}
  //     />
  //     <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
  //       <View
  //         pointerEvents="none"
  //         style={{
  //           position: "absolute",
  //           left: 0,
  //           right: 0,
  //           top: insets.top,
  //           bottom: insets.bottom,
  //         }}
  //       >
  //         <LinearGradient
  //           colors={['#1a0b3d', '#6b2d8f', '#c73d8f', '#3d85c6']}
  //           locations={[0, 0.3, 0.6, 1]}
  //           start={{ x: 0, y: 0 }}
  //           end={{ x: 1, y: 1 }}
  //           style={StyleSheet.absoluteFill}
  //         />
  //         {/* <Svg height="100%" width="100%">
  //           <Defs>
  //             <RadialGradient id="gray" cx="50%" cy="50%" r="70%">
  //               <Stop offset="0%" stopColor="#2E2E2E" stopOpacity="1" />
  //               <Stop offset="100%" stopColor="#000" stopOpacity="1" />
  //             </RadialGradient>
  //             <RadialGradient id="whiteHighlight" cx="80%" cy="20%" r="25%">
  //               <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.05" />
  //               <Stop offset="100%" stopColor="#000" stopOpacity="0" />
  //             </RadialGradient>
  //           </Defs>
  //           <Rect x="0" y="0" width="100%" height="100%" fill="url(#gray)" />
  //           <Rect x="0" y="0" width="100%" height="100%" fill="url(#whiteHighlight)" />
  //         </Svg> */}
  //       </View>
  //       {/* <LoginScreenDemo /> */}
  //       <RootNavigator />
  //     </SafeAreaView>
  //   </SafeAreaProvider>
  // );
}

function AppInner() {
  const isDarkMode = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />
      {/* <View style={[StyleSheet.absoluteFill, { backgroundColor: '#0a0a0a' }]} /> */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: insets.top,
          bottom: insets.bottom,
        }}
      >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]} />

        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: '#146C94',
              opacity: 0.25
            }
          ]}
        />

        <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
          <Defs>

            <RadialGradient id="curveGradient1" cx="50%" cy="50%" r="60%">
              <Stop offset="0%" stopColor="#19A7CE" stopOpacity="0.15" />
              <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </RadialGradient>

            <RadialGradient id="curveGradient2" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#F6F1F1" stopOpacity="0.08" />
              <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </RadialGradient>
          </Defs>


          <Path
            d="M0,0 L100,0 L100,40 Q80,60 60,50 Q40,40 20,30 Q0,20 0,0 Z"
            fill="url(#curveGradient1)"
            opacity="0.6"
          />


          <Path
            d="M0,100 L0,70 Q20,50 40,60 Q60,70 80,80 Q100,90 100,100 Z"
            fill="url(#curveGradient1)"
            opacity="0.4"
          />


          <Path
            d="M100,0 L100,100 L70,100 Q50,80 60,60 Q70,40 90,30 Q100,20 100,0 Z"
            fill="url(#curveGradient2)"
            opacity="0.5"
          />


          <Path
            d="M0,0 L30,0 Q50,20 40,40 Q30,60 10,50 Q0,30 0,0 Z"
            fill="url(#curveGradient1)"
            opacity="0.3"
          />
        </Svg>
      </View>
      <RootNavigator />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
});