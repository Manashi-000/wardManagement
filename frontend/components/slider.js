import React, { useState } from "react";
import { View, ImageBackground, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const Slider = () => {
  const { width: screenWidth } = Dimensions.get("window");
  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderData = [
    { id: "1", image: require("../assets/images/slider1.png") },
    { id: "2", image: require("../assets/images/slide2.png") },
    { id: "3", image: require("../assets/images/slider3.png") },
  ];

  return (
    <View>
      {/* Carousel */}
      <Carousel
        loop
        width={screenWidth}
        height={230}
        autoPlay={true}
        autoPlayInterval={3000} 
        scrollAnimationDuration={1000} 
        data={sliderData}
        onSnapToItem={(index) => setCurrentIndex(index)}
        renderItem={({ item }) => (
          <ImageBackground
            source={item.image}
            className="w-full h-64 rounded-lg overflow-hidden justify-center items-center"
            resizeMode="cover"
          />
        )}
      />

      {/* Pagination Dots */}
      <View className="flex-row justify-center mt-3">
        {sliderData.map((_, index) => (
          <View
            key={index}
            className={`mx-1 rounded-full ${
              index === currentIndex
                ? "bg-blue-900 w-3 h-3"
                : "bg-gray-400 w-3 h-3" 
            }`}
          />
        ))}
      </View>
    </View>
  );
};

export default Slider;
