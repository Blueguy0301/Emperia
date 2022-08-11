//* Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// *Import Swiper style

import "../../styles/slideshow.scss";

//* import Swiper core and required modules
import SwiperCore, {Autoplay } from 'swiper';
// *install Swiper modules
SwiperCore.use([Autoplay]);

function Slideshow (){
    return(
        <div className="slideshow">
            <Swiper  autoplay={{
                    delay: 5000,
                    disableOnInteraction: true
                }} grabCursor={true} loop={true} 
            className="mySwiper">
                <SwiperSlide>Slide 1</SwiperSlide>
                <SwiperSlide>Slide 2</SwiperSlide>
                <SwiperSlide>Slide 3</SwiperSlide>
                <SwiperSlide>Slide 4</SwiperSlide>
                <SwiperSlide>Slide 5</SwiperSlide>
                <SwiperSlide>Slide 6</SwiperSlide>
                <SwiperSlide>Slide 7</SwiperSlide>
                <SwiperSlide>Slide 8</SwiperSlide>
                <SwiperSlide>Slide 9</SwiperSlide>
            </Swiper>
        </div>
    )
}
export default Slideshow