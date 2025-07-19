import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../common/customer/Footer';
import Navbar from '../common/customer/Navbar';

export default function CustomizeCar() {
    const [selectedMake, setSelectedMake] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    const { data: makes = [] } = useQuery({
        queryKey: ['makes'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:3000/api/v1/make/getMakes');
            return res.data.data;
        }
    });

    const { data: models = [] } = useQuery({
        queryKey: ['models', selectedMake],
        queryFn: async () => {
            if (!selectedMake) return [];
            const res = await axios.get(`http://localhost:3000/api/v1/model/by-make/${selectedMake}`);
            return res.data.data;
        },
        enabled: !!selectedMake
    });

    const { data: years = [] } = useQuery({
        queryKey: ['years', selectedModel],
        queryFn: async () => {
            if (!selectedModel) return [];
            const res = await axios.get(`http://localhost:3000/api/v1/year/getYearsByModel/${selectedModel}`);
            return res.data.data;
        },
        enabled: !!selectedModel
    });

    return (
        <>
            <Navbar />

            <section className="bg-[#101010] text-white font-rajdhani min-h-screen flex flex-col items-center justify-center px-4 py-16">
                <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* Left Image */}
                    <div className="relative h-[400px] w-full rounded overflow-hidden shadow-lg">
                        <img
                            src="src/assets/images/car-search.jpg"
                            alt="Customize Car"
                            className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Customize Your Car</h2>
                        </div>
                    </div>

                    {/* Right Form */}
                    <div className="bg-[#1E1E1E] rounded-lg p-8 shadow-md w-full">
                        <h3 className="text-xl font-semibold mb-6 text-center border-b border-[#333] pb-2">Select Your Vehicle</h3>

                        <div className="space-y-5">
                            {/* Make Dropdown */}
                            <div className="relative">
                                <select
                                    className="w-full bg-[#2A2A2A] text-white px-4 py-3 rounded-md appearance-none pr-10 text-[16px] focus:outline-none focus:ring-2"
                                    value={selectedMake}
                                    onChange={(e) => {
                                        setSelectedMake(e.target.value);
                                        setSelectedModel('');
                                        setSelectedYear('');
                                    }}
                                >
                                    <option value="" disabled hidden>Select Make</option>
                                    {makes.map((make) => (
                                        <option key={make._id} value={make._id}>{make.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Model Dropdown */}
                            <div className="relative">
                                <select
                                    className="w-full bg-[#2A2A2A] text-white px-4 py-3 rounded-md appearance-none pr-10 text-[16px] focus:outline-none focus:ring-2"
                                    value={selectedModel}
                                    onChange={(e) => {
                                        setSelectedModel(e.target.value);
                                        setSelectedYear('');
                                    }}
                                    disabled={!selectedMake}
                                >
                                    <option value="" disabled hidden>Select Model</option>
                                    {models.map((model) => (
                                        <option key={model._id} value={model._id}>{model.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Year Dropdown */}
                            <div className="relative">
                                <select
                                    className="w-full bg-[#2A2A2A] text-white px-4 py-3 rounded-md appearance-none pr-10 text-[16px] focus:outline-none focus:ring-2"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    disabled={!selectedModel}
                                >
                                    <option value="" disabled hidden>Select Year</option>
                                    {years.map((year) => (
                                        <option key={year._id} value={year.year}>{year.year}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Search Button */}
                        <Link
                            to={`/customization?make=${selectedMake}&model=${selectedModel}&year=${selectedYear}`}
                            className="mt-8 block w-full text-center bg-[#FF4500] hover:bg-[#e63a00] transition rounded-md py-3 font-semibold text-[18px]"
                        >
                            Search
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
