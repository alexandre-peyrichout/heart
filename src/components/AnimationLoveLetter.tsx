import React, { useEffect, useRef } from "react";

import LottieView from "lottie-react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

export default function AnimationLoveLetter() {
  const animationRef = useRef<LottieView>(null);
  const opacityLetter = useSharedValue(1);

  const openLetter = () => {
    setTimeout(() => {
      animationRef.current?.play(0, 78);
    }, 500);
  };

  const opacityFade = useAnimatedStyle(() => {
    return {
      opacity: opacityLetter.value,
    };
  });

  useEffect(() => {
    openLetter();
  }, []);

  const onAnimationFinish = () => {
    opacityLetter.value = withTiming(0, {
      duration: 500,
      easing: Easing.ease,
    });
  };

  return (
    <Animated.View
      style={[opacityFade]}
      className="absolute w-full h-full bg-white"
    >
      <AnimatedLottieView
        ref={animationRef}
        style={{
          width: "100%",
          height: "100%",
        }}
        source={require("../assets/animations/animation_love_letter.json")}
        loop={false}
        onAnimationFinish={onAnimationFinish}
      />
    </Animated.View>
  );
}
