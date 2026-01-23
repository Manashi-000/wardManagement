import React, { useState, useRef } from "react";
import { View, ImageBackground, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const Slider = () => {
  const { width: screenWidth } = Dimensions.get("window");
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const sliderData = [
    { id: "1", image: require("../assets/images/slider1.png") },
    { id: "2", image: require("../assets/images/slide2.png") },
    { id: "3", image: require("../assets/images/slider3.png") },
  ];

  return (
    <View>
      {/* Carousel */}
      <Carousel
        ref={carouselRef}
        loop
        width={screenWidth}
        height={230}
        autoPlay={true}
        autoPlayInterval={3000} // 3 seconds
        scrollAnimationDuration={1000} // smooth scroll animation
        data={sliderData}
        onSnapToItem={(index) => setCurrentIndex(index)}
        renderItem={({ item }) => (
          <ImageBackground
            source={item.image}
            style={{ width: screenWidth, height: 230, borderRadius: 12 }}
            resizeMode="cover"
          />
        )}
      />

      {/* Pagination Dots */}
      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 8 }}>
        {sliderData.map((_, index) => (
          <View
            key={index}
            style={{
              marginHorizontal: 4,
              borderRadius: 6,
              width: index === currentIndex ? 10 : 8,
              height: index === currentIndex ? 10 : 8,
              backgroundColor: index === currentIndex ? "#003083" : "#ccc",
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default Slider;
