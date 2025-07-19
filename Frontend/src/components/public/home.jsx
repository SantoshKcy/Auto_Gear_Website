import { Car, Disc, Gauge, Paintbrush } from "lucide-react";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import FeaturedCategories from "../common/customer/FeaturedCategories";
import Footer from "../common/customer/Footer";
import Hero from "../common/customer/Hero";
import Navbar from "../common/customer/Navbar";
import Product from "../common/customer/Product";



const Home = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <FeaturedCategories />
            <Product tag="Trending" />
            <Product tag="Featured" />
            <Product tag="Best Seller" />

            {/* Premium Services */}
            <section className="bg-[#171717] text-white py-16 px-8">
                <h2 className="text-center text-2xl font-semibold mb-2">Our Premium Services</h2>
                <p className="text-center text-gray-400 mb-8">
                    Discover how we can transform your vehicle with our professional customization services
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            title: "Exterior Customization",
                            desc: "Transform the look of your vehicle with premium paint jobs, wraps, and body kits.",
                            icon: <Paintbrush className="w-8 h-8 mb-2 text-white" />,
                        },
                        {
                            title: "Interior Upgrades",
                            desc: "Elevate your driving experience with custom upholstery and lighting modifications.",
                            icon: <Car className="w-8 h-8 mb-2 text-white" />,
                        },
                        {
                            title: "Performance Tuning",
                            desc: "Boost your vehicle's performance with engine modifications, exhaust upgrades, and more.",
                            icon: <Gauge className="w-8 h-8 mb-2 text-white" />,
                        },
                        {
                            title: "Wheel & Tire Packages",
                            desc: "Stand out with custom wheels, performance tires, and suspension upgrades.",
                            icon: <Disc className="w-8 h-8 mb-2 text-white" />,
                        },
                    ].map((service) => (
                        <div
                            key={service.title}
                            className="bg-[#101010] p-6 rounded shadow hover:shadow-xl transition flex flex-col items-center text-center"
                        >
                            {service.icon}
                            <h3 className="text-xl font-medium mb-2">{service.title}</h3>
                            <p className="text-sm text-gray-400 mb-4">{service.desc}</p>
                            <Link
                                to="/services"
                                className="bg-[#FFFFFF1A] text-[18px] text-white px-6 py-2 rounded hover:text-white transition"
                            >
                                Learn More
                            </Link>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <Link to="/services" className="bg-[#FF4500] text-[18px] text-white px-6 py-2 rounded hover:bg-orange-600 transition">
                        View All Services
                    </Link>
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-[#171717] text-white py-16 px-8 text-center">
                <h2 className="text-2xl font-semibold mb-2">How It Works</h2>
                <p className="text-gray-400 mb-12">Customizing your car with AutoGear is simple and straightforward</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {[
                        { num: 1, title: "Choose Your Vehicle", desc: "Select your car model from our extensive database of supported vehicles" },
                        { num: 2, title: "Customize Online", desc: "Use our interactive tool to visually customize your car with various modifications" },
                        { num: 3, title: "Book & Transform", desc: "Schedule an appointment and let our experts bring your vision to life" },
                    ].map((step) => (
                        <div key={step.num} className="flex flex-col items-center">
                            <div className="bg-white text-black w-12 h-12 flex items-center justify-center rounded-full mb-2 font-bold">
                                {step.num}
                            </div>
                            <h3 className="font-medium text-xl mb-1">{step.title}</h3>
                            <p className="text-sm text-gray-400 max-w-xs">{step.desc}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-8">
                    <Link to="/customize" className="bg-[#FF4500] text-[18px] text-white px-6 py-2 rounded hover:bg-orange-600 transition">
                        Start Your Project
                    </Link>
                </div>
            </section>

            {/* Ready to Transform */}
            <section className="bg-[#171717] text-white py-16 px-8 flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-1/2 mb-8 md:mb-0">
                    <h2 className="text-2xl font-semibold mb-2">Ready to Transform Your Car?</h2>
                    <p className="text-gray-400 max-w-md">
                        Join our community of car enthusiasts who have elevated their driving experience with AutoGear's premium customization services.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-6 md:w-1/2">
                    {[
                        { value: 500, suffix: "+", label: "Completed Projects" },
                        { value: 50, suffix: "+", label: "Car Models" },
                        { value: 20, suffix: "+", label: "Expert Technicians" },
                        { value: 100, suffix: "%", label: "Satisfaction" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-[#FFFFFF1A] p-4 text-center rounded"
                        >
                            <h3 className="text-xl font-bold mb-1">
                                <CountUp
                                    end={stat.value}
                                    suffix={stat.suffix}
                                    duration={8}
                                />
                            </h3>
                            <p className="text-sm text-[#E0E0E0]">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>
            <Footer />
        </>
    );
};

export default Home;
