import { OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Check, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../common/customer/Navbar';

function CarModel({ url, rotationSpeed, scale }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();

  useFrame(() => {
    if (modelRef.current && rotationSpeed !== 0) {
      modelRef.current.rotation.y += rotationSpeed;
    }
  });

  return <primitive ref={modelRef} object={scene} scale={scale} position={[0, -1, 0]} />;
}

export default function InteriorCustomization() {
  const [selectedSeatMaterial, setSelectedSeatMaterial] = useState(null);
  const [selectedSeatColor, setSelectedSeatColor] = useState(null);
  const [selectedDashboardTrim, setSelectedDashboardTrim] = useState(null);
  const [selectedSoundSystem, setSelectedSoundSystem] = useState(null);
  const [rotationSpeed, setRotationSpeed] = useState(0);
  const [scale, setScale] = useState([1, 1, 1]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [searchParams] = useSearchParams();

  const makeId = searchParams.get('make');
  const modelId = searchParams.get('model');
  const year = searchParams.get('year');

  const { data: yearData } = useQuery({
    queryKey: ['year', modelId, year],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/api/v1/year/getYearsByModel/${modelId}`);
      const years = res.data.data;
      return years.find(y => y.year.toString() === year) || null;
    },
    enabled: !!modelId && !!year,
  });

  const carModelUrl = yearData?.customizerAsset
    ? `http://localhost:3000/uploads/${yearData.customizerAsset}`
    : null;

  const { data: allOptions = [] } = useQuery({
    queryKey: ['customization-options'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/api/v1/customization-option');
      return res.data.data;
    }
  });

  const seatMaterials = allOptions.filter(opt => opt.type === 'interior-seat-material');
  const seatColors = allOptions.filter(opt => opt.type === 'interior-seat-color');
  const dashboardTrims = allOptions.filter(opt => opt.type === 'interior-dashboard-trim');
  const soundSystems = allOptions.filter(opt => opt.type === 'interior-sound-system');

  const totalPrice =
    (seatMaterials.find(o => o._id === selectedSeatMaterial)?.price || 0) +
    (seatColors.find(o => o._id === selectedSeatColor)?.price || 0) +
    (dashboardTrims.find(o => o._id === selectedDashboardTrim)?.price || 0) +
    (soundSystems.find(o => o._id === selectedSoundSystem)?.price || 0);

  const renderOptionList = (title, options, selectedId, onSelect) => (
    <div className="space-y-4">
      <h2 className="text-[18px] font-semibold">{title}</h2>
      <div className="grid grid-cols-1 gap-4">
        {options.map(opt => {
          const isSelected = selectedId === opt._id;
          return (
            <div
              key={opt._id}
              onClick={() => onSelect(isSelected ? null : opt._id)}
              className="flex items-center bg-[#2A2A2A] p-3 rounded cursor-pointer relative hover:bg-[#333]"
            >
              <div className="relative w-16 h-16 flex-shrink-0">
                <img
                  src={`http://localhost:3000/uploads/${opt.image}`}
                  alt={opt.title}
                  className="w-full h-full object-contain rounded"
                />
                <div className="absolute -top-2 -left-2 bg-[#1E1E1E] text-white rounded-full p-1 shadow">
                  {isSelected ? <Check size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={3} />}
                </div>
              </div>
              <div className="ml-4">
                <p className="text-[16px]">{opt.title}</p>
                <p className="text-sm font-semibold text-white mt-1">Rs. {opt.price}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#101010] text-white font-rajdhani">
        <div className="flex space-x-6 text-[18px] px-8 pt-6 border-b border-gray-700">
          {['Model', 'Exterior', 'Interior', 'Packages', 'Stickers', 'Summary'].map((tab, i) => (
            <button
              key={i}
              className={`pb-2 ${tab === 'Interior' ? 'border-b-2 border-[#FF4500]' : 'text-[#E0E0E0] hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row px-8 py-6 space-y-10 md:space-y-0 md:space-x-10">
          <div className="md:w-1/2 space-y-4">
            <div className="bg-[#1E1E1E] rounded p-4">
              {carModelUrl ? (
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }} style={{ height: '400px' }}>
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[10, 10, 5]} intensity={1} />
                  <CarModel
                    url={carModelUrl}
                    rotationSpeed={rotationSpeed}
                    scale={scale}
                  />
                  <OrbitControls enablePan={false} enableZoom={false} />
                </Canvas>
              ) : (
                <p>Loading car model...</p>
              )}
            </div>

            <div className="bg-[#1E1E1E] rounded p-4">
              <p className="text-[16px] text-gray-400 mb-2">Interior Configuration</p>
              <div className="flex justify-between text-[16px] mt-2">
                <span>Seat Material</span>
                <span className="text-white">{seatMaterials.find(o => o._id === selectedSeatMaterial)?.title || '-'}</span>
              </div>
              <div className="flex justify-between text-[16px] mt-2">
                <span>Seat Color</span>
                <span className="text-white">{seatColors.find(o => o._id === selectedSeatColor)?.title || '-'}</span>
              </div>
              <div className="flex justify-between text-[16px] mt-2">
                <span>Dashboard Trim</span>
                <span className="text-white">{dashboardTrims.find(o => o._id === selectedDashboardTrim)?.title || '-'}</span>
              </div>
              <div className="flex justify-between text-[16px] mt-2">
                <span>Sound System</span>
                <span className="text-white">{soundSystems.find(o => o._id === selectedSoundSystem)?.title || '-'}</span>
              </div>
              <div className="flex justify-between text-[16px] mt-4 pt-2 border-t border-gray-700 font-bold">
                <span>Total:</span>
                <span className="text-white">Rs. {totalPrice}</span>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 bg-[#1E1E1E] p-6 rounded space-y-6">
            {renderOptionList('Seat Material', seatMaterials, selectedSeatMaterial, setSelectedSeatMaterial)}
            {renderOptionList('Seat Color', seatColors, selectedSeatColor, setSelectedSeatColor)}
            {renderOptionList('Dashboard Trim', dashboardTrims, selectedDashboardTrim, setSelectedDashboardTrim)}
            {renderOptionList('Sound System', soundSystems, selectedSoundSystem, setSelectedSoundSystem)}
          </div>
        </div>

        <div className="flex justify-between items-center px-8 py-2 bg-[#FF4500] text-white text-[18px]">
          <button className="flex items-center space-x-1 hover:underline">
            <ChevronLeft size={20} />
            <span>Previous</span>
          </button>
          <button className="flex items-center space-x-1 hover:underline">
            <span>Next</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </>
  );
}
