import { useNavigate } from "react-router-dom";
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import '/src/swiper.css';

const Hero = () => {
  const navigate = useNavigate();

  const slides = [
    {
      bg: '/src/assets/images/hero1.png',
      heading: 'Customize Your Drive,\nElevate Your Experience',
      text: 'Premium modifications to make your ride stand out - wheels, body kits, performance tuning, and more.',
      primaryBtn: {
        text: 'Start Customizing',
        link: '/car-search'
      },
      secondaryBtn: {
        text: 'Explore Services',
        link: '/services'
      }
    },
    {
      bg: '/src/assets/images/hero4.png',
      heading: 'Uniquely Yours,\nStand Out on the Road',
      text: 'Personalize every detail of your car with top-notch accessories, paints, and wraps that reflect your style.',
      primaryBtn: {
        text: 'Browse Products',
        link: '/shop'
      },
      secondaryBtn: {
        text: 'Contact Us',
        link: '/contact'
      }
    },
    {
      bg: '/src/assets/images/hero3.png',
      heading: 'Precision,\nPassion,Perfection',
      text: 'Shop high-quality modification parts, track your wishlist, and upgrade your ride without the guesswork.',
      primaryBtn: {
        text: 'Explore Services',
        link: '/services'
      },
      secondaryBtn: {
        text: 'Learn More',
        link: '/about'
      }
    }
  ];

  return (
    <Swiper
      spaceBetween={0}
      centeredSlides={true}
      effect={'fade'}
      loop={true}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      modules={[Autoplay, Pagination, Navigation, EffectFade]}

      className="mySwiper relative z-[10]"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div
            className="flex items-center justify-between px-6 h-[500px] md:px-24 py-24 bg-[#101010] bg-cover bg-center relative"
            style={{ backgroundImage: `url(${slide.bg})` }}
          >
            <div className="absolute inset-0 z-[1]" />
            <div className="md:w-1/2 text-left text-white z-[2]">
              <h1 className="text-3xl font-extrabold mb-4 whitespace-pre-line">
                {slide.heading}
              </h1>
              <p className="text-lg text-white mb-6">
                {slide.text}
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate(slide.primaryBtn.link)}
                  className="bg-[#FF4500] text-white py-2 px-8 w-[195px] text-[18px] rounded-md "
                >
                  {slide.primaryBtn.text}
                </button>
                <button
                  onClick={() => navigate(slide.secondaryBtn.link)}
                  className="bg-[#171717] text-white py-2 px-8 w-[195px] text-[18px] rounded-md "
                >
                  {slide.secondaryBtn.text}
                </button>
              </div>
            </div>
            <div className="md:w-1/2 hidden md:block" />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Hero;
