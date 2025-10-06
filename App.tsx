import "./global.css"
import { StatusBar, StyleSheet, useColorScheme, View } from "react-native";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import RootNavigator from "./src/navigation/RootNavigator";
import Svg, { Defs, RadialGradient, Path, Stop, LinearGradient, Line, Rect, Ellipse } from "react-native-svg";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

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

  const shiftY = 0.05 * height;

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
              opacity: 0.15
            }
          ]}
        />

        <Svg height="100%" width="100%" viewBox={`0 0 ${width} ${height}`} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="overlayLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <Stop offset="40%" stopColor="#cccccc" stopOpacity="0.18" />
              <Stop offset="100%" stopColor="#666666" stopOpacity="0.1" />
            </LinearGradient>

            <RadialGradient id="fogGlow" cx="50%" cy="50%" r="80%">
              <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
              <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          <Path
            d={`
    M 0 ${height * 0.35 - shiftY}
    Q ${width * 0.25} ${height * 0.25 - shiftY}, ${width * 0.5} ${height * 0.4 - shiftY}
    Q ${width * 0.75} ${height * 0.5 - shiftY}, ${width} ${height * 0.35 - shiftY}
    L ${width} ${height * 0.45 - shiftY}
    Q ${width * 0.75} ${height * 0.6 - shiftY}, ${width * 0.5} ${height * 0.55 - shiftY}
    Q ${width * 0.25} ${height * 0.45 - shiftY}, 0 ${height * 0.45 - shiftY}
    Z
  `}
            fill="url(#overlayLight)"
            opacity={0.65}
          />
          <Path
            d={`
    M 0 ${height * 0.35 - shiftY}
    Q ${width * 0.25} ${height * 0.25 - shiftY}, ${width * 0.5} ${height * 0.4 - shiftY}
    Q ${width * 0.75} ${height * 0.5 - shiftY}, ${width} ${height * 0.35 - shiftY}
    L ${width} ${height * 0.45 - shiftY}
    Q ${width * 0.75} ${height * 0.6 - shiftY}, ${width * 0.5} ${height * 0.55 - shiftY}
    Q ${width * 0.25} ${height * 0.45 - shiftY}, 0 ${height * 0.45 - shiftY}
    Z
  `}
            fill="url(#fogGlow)"
            opacity={0.25}
          />

        </Svg>

        {/* Wave lines across screen */}
        <Svg height="100%" width="100%" viewBox={`0 0 ${width} ${height}`} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="lineGradient" x1="0%" y1="50%" x2="100%" y2="50%">
              <Stop offset="0%" stopColor="#4a4a4a" stopOpacity="0.1" />
              <Stop offset="20%" stopColor="#6a6a6a" stopOpacity="0.3" />
              <Stop offset="50%" stopColor="#8a8a8a" stopOpacity="0.4" />
              <Stop offset="80%" stopColor="#6a6a6a" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#4a4a4a" stopOpacity="0.1" />
            </LinearGradient>
          </Defs>

          {Array.from({ length: 12 }).map((_, i) => {
            // xuất phát từ đáy màn hình, lệch dần lên cao mỗi line
            const startY = height - i * 35;      // mỗi line cao hơn 35px
            const endY = height * 0.5 - 80 + i * 10;  // hội tụ tại giữa, hơi giãn nhẹ
            const controlY = (startY + endY) / 2 - 80; // điểm cong để sóng uốn

            // đường cơ bản: cong từ trái xuống phải
            const pathData = `M 0 ${startY} 
                    Q ${width * 0.33} ${controlY}, ${width * 0.66} ${controlY + 40} 
                    T ${width} ${endY}`;

            return (
              <Path
                key={`wave-${i}`}
                d={pathData}
                stroke="#ffffff"          // tạm cho trắng dễ thấy
                strokeWidth="0.8"
                fill="none"
                opacity={0.3 + i * 0.03}
              />
            );
          })}

        </Svg>
      </View>
      <RootNavigator />
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   container: { flex: 1 },
// });