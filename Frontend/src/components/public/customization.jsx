import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ChevronLeftCircle, ChevronRightCircle, X, Plus, Check, Share2, Download, Wrench, Save } from 'lucide-react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar2 from '../common/customer/Navbar2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as THREE from 'three';

const customerId = localStorage.getItem('userId');

function CarModel({ url, customizationOptions, rotationSpeed, scale, onCapture }) {
  const { scene, error } = useGLTF(url);
  const modelRef = useRef();
  const meshRefs = useRef({
    Hood: [],
    Rim: [],
    Front_Bumper: [],
    Rear_Bumper: [],
    Roof_Panel: [],
    Door: [],
    Mirror: [],
    Spoiler: [],
    Seat_Cushion: [],
    Seat_Base: [],
    Dashboard_Trim: [],
    Handle: [],
  });
  const originalColorsRef = useRef({});

  const meshNameMapping = {
    Hood: ['Hood'],
    Rim: ['Rim'],
    Front_Bumper: ['Front_Bumper'],
    Rear_Bumper: ['Rear_Bumper'],
    Roof_Panel: ['Roof_Panel'],
    Door: ['Door'],
    Mirror: ['Mirror'],
    Spoiler: ['Spoiler'],
    Seat_Cushion: ['Seat_Cushion'],
    Seat_Base: ['Seat_Base'],
    Dashboard_Trim: ['Dashboard_Trim'],
    Handle: ['Handle'],
  };

  useEffect(() => {
    if (error) {
      console.error('Error loading GLTF model:', error);
      return;
    }
    const meshNames = [];
    const hierarchy = [];
    scene.traverse((child) => {
      if (child.isMesh) {
        meshNames.push(child.name);
        let parent = child.parent;
        let path = child.name;
        while (parent && parent.name) {
          path = `${parent.name} > ${path}`;
          parent = parent.parent;
        }
        hierarchy.push(path);
        const expectedName = Object.keys(meshNameMapping).find((name) =>
          meshNameMapping[name].includes(child.name)
        );
        if (expectedName) {
          meshRefs.current[expectedName].push(child);
          originalColorsRef.current[child.uuid] = child.material?.color?.clone() || new THREE.Color(0xffffff);
          console.log(
            `${expectedName} found: ${child.name}, Path: ${path}, Material: ${child.material?.type || 'None'}, ` +
            `Color: ${child.material?.color?.getHexString() || 'N/A'}, Texture: ${child.material?.map?.sourceFile || 'None'}, ` +
            `Material Details: ${JSON.stringify({
              map: !!child.material?.map,
              roughness: child.material?.roughness,
              metalness: child.material?.metalness,
              emissive: child.material?.emissive?.getHexString() || 'None',
            })}`
          );
        }
      }
    });
    console.log('All meshes in scene:', meshNames);
    console.log('Mesh hierarchy:', hierarchy);
    console.log('Found target meshes:', Object.keys(meshRefs.current).filter((name) => meshRefs.current[name].length > 0));
    console.warn('Missing meshes in GLTF model:', Object.keys(meshNameMapping).filter((name) => meshRefs.current[name].length === 0));
  }, [scene, error]);

  useFrame((state) => {
    if (modelRef.current && rotationSpeed !== 0) {
      modelRef.current.rotation.y += rotationSpeed;
    }

    if (!error) {
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          const expectedName = Object.keys(meshNameMapping).find((name) =>
            meshNameMapping[name].includes(child.name)
          );
          if (expectedName && meshRefs.current[expectedName].includes(child)) {
            const option = customizationOptions[expectedName];
            if (option && option.colorCode && /^#[0-9A-F]{6}$/i.test(option.colorCode)) {
              try {
                if (!child.material.isCloned) {
                  child.material = child.material.clone();
                  child.material.isCloned = true;
                }
                child.material.color.set(option.colorCode);
                console.log(`Applied color ${option.colorCode} to ${child.name} (${expectedName})`);
              } catch (e) {
                console.error(`Failed to apply color ${option.colorCode} to ${child.name} (${expectedName}):`, e);
              }
            } else {
              if (originalColorsRef.current[child.uuid]) {
                child.material.color.copy(originalColorsRef.current[child.uuid]);
                console.log(`Restored original color to ${child.name} (${expectedName})`);
              }
            }
            child.material.needsUpdate = true;
          }
        }
      });
    }

    if (onCapture) {
      onCapture();
    }
  });

  

  return (
    <group ref={modelRef} scale={scale} position={[0, -2, 0]}>
      <primitive object={scene} />
    </group>
  );
}

export default function Customization() {
  const [selectedHood, setSelectedHood] = useState(null);
  const [selectedRim, setSelectedRim] = useState(null);
  const [selectedFrontBumper, setSelectedFrontBumper] = useState(null);
  const [selectedRearBumper, setSelectedRearBumper] = useState(null);
  const [selectedRoofPanel, setSelectedRoofPanel] = useState(null);
  const [selectedDoor, setSelectedDoor] = useState(null);
  const [selectedMirror, setSelectedMirror] = useState(null);
  const [selectedSpoiler, setSelectedSpoiler] = useState(null);
  const [selectedSeatCushion, setSelectedSeatCushion] = useState(null);
  const [selectedSeatBase, setSelectedSeatBase] = useState(null);
  const [selectedDashboardTrim, setSelectedDashboardTrim] = useState(null);
  const [selectedHandle, setSelectedHandle] = useState(null);
  const [selectedSoundSystem, setSelectedSoundSystem] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [rotationSpeed, setRotationSpeed] = useState(0);
  const [scale, setScale] = useState([2, 2, 2]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState('Customization');
  const [captureImage, setCaptureImage] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(!!searchParams.get('editConfigId')); // Initial loading state for edit

  const makeId = searchParams.get('make');
  const modelId = searchParams.get('model');
  const year = searchParams.get('year');
  const editConfigId = searchParams.get('editConfigId');

  const sectionRefs = {
    Customization: useRef(null),
    Packages: useRef(null),
    Summary: useRef(null),
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          setRotationSpeed(0.02);
          setTimeout(() => setRotationSpeed(0), 1000);
          break;
        case 'ArrowRight':
          setRotationSpeed(-0.02);
          setTimeout(() => setRotationSpeed(0), 1000);
          break;

      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const { data: savedConfig, isLoading: configLoading } = useQuery({
    queryKey: ['savedConfig', editConfigId],
    queryFn: async () => {
      if (!editConfigId) return null;
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/customization/${editConfigId}`);
        console.log('Fetched savedConfig:', res.data.data);
        return res.data.data;
      } catch (error) {
        console.error('Error fetching saved configuration:', error);
        toast.error('Failed to load saved configuration', {
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: true,
          theme: 'dark',
        });
        return null;
      }
    },
    enabled: !!editConfigId,
    onSuccess: () => setIsLoading(false), // Stop loading when data is fetched
  });

  const { data: allOptions = [], isLoading: optionsLoading, error: optionsError } = useQuery({
    queryKey: ['customization-options'],
    queryFn: async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/customization-option');
        console.log('Fetched customization options:', res.data.data);
        return res.data.data;
      } catch (error) {
        console.error('Error fetching customization options:', error);
        throw new Error('Failed to fetch customization options');
      }
    },
    onSuccess: () => setIsLoading(false), // Stop loading when data is fetched
  });

  const { data: yearData, isLoading: yearLoading, error: yearError } = useQuery({
    queryKey: ['year', modelId, year],
    queryFn: async () => {
      if (!modelId || !year) return null;
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/year/getYearsByModel/${modelId}`);
        console.log('Year API Response:', res.data.data);
        const years = res.data.data;
        const selectedYear = years.find((y) => y.year.toString() === year) || null;
        console.log('Selected Year:', selectedYear);
        return selectedYear;
      } catch (error) {
        console.error('Error fetching year data:', error);
        throw new Error('Failed to fetch year data');
      }
    },
    enabled: !!modelId && !!year,
    onSuccess: () => setIsLoading(false), // Stop loading when data is fetched
  });

  const { data: makeData } = useQuery({
    queryKey: ['make', makeId],
    queryFn: async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/make/getMake/${makeId}`);
        console.log('Make API Response:', res.data.data);
        return res.data.data;
      } catch (error) {
        console.error('Error fetching make data:', error);
        throw new Error('Failed to fetch make data');
      }
    },
    enabled: !!makeId,
    onSuccess: () => setIsLoading(false), // Stop loading when data is fetched
  });

  const { data: modelData } = useQuery({
    queryKey: ['model', modelId],
    queryFn: async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/model/getModel/${modelId}`);
        console.log('Model API Response:', res.data.data);
        return res.data.data;
      } catch (error) {
        console.error('Error fetching model data:', error);
        throw new Error('Failed to fetch model data');
      }
    },
    enabled: !!modelId,
    onSuccess: () => setIsLoading(false), // Stop loading when data is fetched
  });

  const { data: packages = [], isLoading: packagesLoading, error: packagesError } = useQuery({
    queryKey: ['packages', yearData?._id],
    queryFn: async () => {
      if (!yearData?._id) return [];
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/year/getPackagesByYear/${yearData._id}`);
        console.log('Packages API Response:', res.data.data);
        return res.data.data || [];
      } catch (error) {
        console.error('Error fetching packages:', error);
        throw new Error('Failed to fetch packages');
      }
    },
    enabled: !!yearData?._id,
    onSuccess: () => setIsLoading(false), // Stop loading when data is fetched
  });

  const optionTypeToTitle = {
    'exterior-hood': 'Hood',
    'exterior-rim': 'Rim',
    'exterior-front-bumper': 'Front Bumper',
    'exterior-rear-bumper': 'Rear Bumper',
    'exterior-roof-panel': 'Roof Panel',
    'exterior-door': 'Door',
    'exterior-mirror': 'Mirror',
    'exterior-spoiler': 'Spoiler',
    'exterior-handle': 'Handle',
    'interior-seat-cushion': 'Seat Cushion',
    'interior-seat-base': 'Seat Base',
    'interior-dashboard-trim': 'Dashboard Trim',
    'interior-sound-system': 'Sound System',
  };

  useEffect(() => {
    if (savedConfig && savedConfig.selectedOptions && allOptions.length > 0) {
      console.log('Processing savedConfig selectedOptions:', savedConfig.selectedOptions);
      savedConfig.selectedOptions.forEach((opt) => {
        const optionId = opt.option?._id || opt.option;
        const option = allOptions.find((o) => o._id === optionId);
        if (!option) {
          console.warn(`Option ID ${optionId} not found in allOptions`);
          return;
        }
        let normalizedTitle = opt.title?.trim();
        if (!normalizedTitle) {
          normalizedTitle = optionTypeToTitle[option.type] || 'Unknown';
          console.warn(`Option ID ${optionId} has undefined title, using fallback: ${normalizedTitle}`);
        }
        console.log(`Applying option: ${normalizedTitle} -> ${optionId} (type: ${option.type})`);
        switch (normalizedTitle) {
          case 'Hood':
            setSelectedHood(optionId);
            break;
          case 'Rim':
            setSelectedRim(optionId);
            break;
          case 'Front Bumper':
            setSelectedFrontBumper(optionId);
            break;
          case 'Rear Bumper':
            setSelectedRearBumper(optionId);
            break;
          case 'Roof Panel':
            setSelectedRoofPanel(optionId);
            break;
          case 'Door':
            setSelectedDoor(optionId);
            break;
          case 'Mirror':
            setSelectedMirror(optionId);
            break;
          case 'Spoiler':
            setSelectedSpoiler(optionId);
            break;
          case 'Handle':
            setSelectedHandle(optionId);
            break;
          case 'Seat Cushion':
            setSelectedSeatCushion(optionId);
            break;
          case 'Seat Base':
            setSelectedSeatBase(optionId);
            break;
          case 'Dashboard Trim':
            setSelectedDashboardTrim(optionId);
            break;
          case 'Sound System':
            setSelectedSoundSystem(optionId);
            break;
          case 'Package':
            setSelectedPackage(optionId);
            break;
          default:
            console.warn(`Unknown option title: ${normalizedTitle} for option ID ${optionId}`);
            break;
        }
      });
    }
  }, [savedConfig, allOptions]);

  const carModelUrl = yearData?.customizerAsset
    ? `http://localhost:3000/uploads/${yearData.customizerAsset}`
    : null;

  const exteriorHoods = allOptions.filter((opt) => opt.type === 'exterior-hood');
  const exteriorRims = allOptions.filter((opt) => opt.type === 'exterior-rim');
  const exteriorFrontBumpers = allOptions.filter((opt) => opt.type === 'exterior-front-bumper');
  const exteriorRearBumpers = allOptions.filter((opt) => opt.type === 'exterior-rear-bumper');
  const exteriorRoofPanels = allOptions.filter((opt) => opt.type === 'exterior-roof-panel');
  const exteriorDoors = allOptions.filter((opt) => opt.type === 'exterior-door');
  const exteriorMirrors = allOptions.filter((opt) => opt.type === 'exterior-mirror');
  const exteriorSpoilers = allOptions.filter((opt) => opt.type === 'exterior-spoiler');
  const exteriorHandles = allOptions.filter((opt) => opt.type === 'exterior-handle');
  const interiorSeatCushions = allOptions.filter((opt) => opt.type === 'interior-seat-cushion');
  const interiorSeatBases = allOptions.filter((opt) => opt.type === 'interior-seat-base');
  const interiorDashboardTrims = allOptions.filter((opt) => opt.type === 'interior-dashboard-trim');
  const interiorSoundSystems = allOptions.filter((opt) => opt.type === 'interior-sound-system');

  const selectedHoodObj = exteriorHoods.find((opt) => opt._id === selectedHood);
  const selectedRimObj = exteriorRims.find((opt) => opt._id === selectedRim);
  const selectedFrontBumperObj = exteriorFrontBumpers.find((opt) => opt._id === selectedFrontBumper);
  const selectedRearBumperObj = exteriorRearBumpers.find((opt) => opt._id === selectedRearBumper);
  const selectedRoofPanelObj = exteriorRoofPanels.find((opt) => opt._id === selectedRoofPanel);
  const selectedDoorObj = exteriorDoors.find((opt) => opt._id === selectedDoor);
  const selectedMirrorObj = exteriorMirrors.find((opt) => opt._id === selectedMirror);
  const selectedSpoilerObj = exteriorSpoilers.find((opt) => opt._id === selectedSpoiler);
  const selectedHandleObj = exteriorHandles.find((opt) => opt._id === selectedHandle);
  const selectedSeatCushionObj = interiorSeatCushions.find((opt) => opt._id === selectedSeatCushion);
  const selectedSeatBaseObj = interiorSeatBases.find((opt) => opt._id === selectedSeatBase);
  const selectedDashboardTrimObj = interiorDashboardTrims.find((opt) => opt._id === selectedDashboardTrim);
  const selectedSoundSystemObj = interiorSoundSystems.find((opt) => opt._id === selectedSoundSystem);
  const selectedPackageObj = packages.find((pkg) => pkg._id === selectedPackage);

  const customizationOptions = {
    Hood: selectedHoodObj,
    Rim: selectedRimObj,
    Front_Bumper: selectedFrontBumperObj,
    Rear_Bumper: selectedRearBumperObj,
    Roof_Panel: selectedRoofPanelObj,
    Door: selectedDoorObj,
    Mirror: selectedMirrorObj,
    Spoiler: selectedSpoilerObj,
    Seat_Cushion: selectedSeatCushionObj,
    Seat_Base: selectedSeatBaseObj,
    Dashboard_Trim: selectedDashboardTrimObj,
    Handle: selectedHandleObj,
  };

  const totalPrice =
    (selectedHoodObj?.price || 0) +
    (selectedRimObj?.price || 0) +
    (selectedFrontBumperObj?.price || 0) +
    (selectedRearBumperObj?.price || 0) +
    (selectedRoofPanelObj?.price || 0) +
    (selectedDoorObj?.price || 0) +
    (selectedMirrorObj?.price || 0) +
    (selectedSpoilerObj?.price || 0) +
    (selectedSeatCushionObj?.price || 0) +
    (selectedSeatBaseObj?.price || 0) +
    (selectedDashboardTrimObj?.price || 0) +
    (selectedHandleObj?.price || 0) +
    (selectedSoundSystemObj?.price || 0) +
    (selectedPackageObj?.price || 0);

  const handleOptionSelect = (optionId, setter) => {
    console.log(`Selecting option ${optionId}`);
    setter((prev) => {
      const newValue = prev === optionId ? null : optionId;
      console.log(`Updated state to: ${newValue}`);
      return newValue;
    });
  };

  const handleRotateLeft = () => {
    setRotationSpeed(0.02);
    setTimeout(() => setRotationSpeed(0), 1000);
  };

  const handleRotateRight = () => {
    setRotationSpeed(-0.02);
    setTimeout(() => setRotationSpeed(0), 1000);
  };

  const handleExpand = () => {
    setIsFullScreen(true);
    setScale([3, 3, 3]);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreen(false);
    setScale([2, 2, 2]);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    const section = sectionRefs[tab].current;
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  };

  const handlePackageToggle = (packageId) => {
    setSelectedPackage((prev) => (prev === packageId ? null : packageId));
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (const [tab, ref] of Object.entries(sectionRefs)) {
        if (ref.current) {
          const { offsetTop, offsetHeight } = ref.current;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveTab(tab);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    const shareText = `Check out my custom car configuration!\nModel: ${makeData?.name} ${modelData?.name} ${year}\nTotal Price: Rs. ${totalPrice.toFixed(2)}\nShare this link: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: 'Custom Car Configuration',
        text: shareText,
        url: window.location.href,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      alert('Sharing not supported on this browser. Copy the link: ' + window.location.href);
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      try {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL('image/jpeg', 0.7);
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `car_customization_${new Date().toISOString().split('T')[0]}.jpg`;
        link.click();
      } catch (error) {
        console.error('Error downloading image:', error);
        toast.error('Failed to download image', {
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: true,
          theme: 'dark',
        });
      }
    } else {
      toast.error('Unable to capture image', {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: true,
        theme: 'dark',
      });
    }
  };

  const resizeCanvasImage = useCallback((canvas, maxWidth, maxHeight, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = canvas.toDataURL('image/jpeg', quality);
      img.onload = () => {
        const tempCanvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        tempCanvas.width = width;
        tempCanvas.height = height;
        const ctx = tempCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(tempCanvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = (error) => reject(error);
    });
  }, []);

  const captureCanvasImage = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!canvasRef.current) {
        reject(new Error('Canvas reference is not available'));
        return;
      }
      try {
        const canvas = canvasRef.current;
        resizeCanvasImage(canvas, 800, 600, 0.7)
          .then((dataURL) => {
            console.log('Captured compressed image size:', dataURL.length, 'bytes');
            resolve(dataURL);
          })
          .catch((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  }, [resizeCanvasImage]);

  const handleCapture = useCallback(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      resizeCanvasImage(canvas, 800, 600, 0.7)
        .then((dataURL) => {
          setImageData(dataURL);
          setCaptureImage(false);
          console.log('Canvas captured successfully, imageData set:', dataURL.substring(0, 50) + '...');
        })
        .catch((error) => {
          console.error('Error capturing canvas image:', error);
          setCaptureImage(false);
          toast.error('Failed to capture car image', {
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: true,
            theme: 'dark',
          });
        });
    } else {
      console.error('Canvas ref is not available');
      setCaptureImage(false);
      toast.error('Canvas not available for capture', {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: true,
        theme: 'dark',
      });
    }
  }, [resizeCanvasImage]);

  const handleSaveConfiguration = async () => {
    if (!customerId) {
      toast.error('Please login first', {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: true,
        theme: 'dark',
      });
      navigate('/login');
      return;
    }

    if (!modelData?._id || !yearData?._id) {
      toast.error('Please select a valid model and year', {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: true,
        theme: 'dark',
      });
      return;
    }

    const selectedOptions = [
      ...(selectedHoodObj
        ? [{
            option: selectedHoodObj._id,
            title: optionTypeToTitle['exterior-hood'] || selectedHoodObj.title || 'Hood',
            colorCode: selectedHoodObj.colorCode,
            price: selectedHoodObj.price || 0,
          }]
        : []),
      ...(selectedRimObj
        ? [{
            option: selectedRimObj._id,
            title: optionTypeToTitle['exterior-rim'] || selectedRimObj.title || 'Rim',
            colorCode: selectedRimObj.colorCode,
            price: selectedRimObj.price || 0,
          }]
        : []),
      ...(selectedFrontBumperObj
        ? [{
            option: selectedFrontBumperObj._id,
            title: optionTypeToTitle['exterior-front-bumper'] || selectedFrontBumperObj.title || 'Front Bumper',
            colorCode: selectedFrontBumperObj.colorCode,
            price: selectedFrontBumperObj.price || 0,
          }]
        : []),
      ...(selectedRearBumperObj
        ? [{
            option: selectedRearBumperObj._id,
            title: optionTypeToTitle['exterior-rear-bumper'] || selectedRearBumperObj.title || 'Rear Bumper',
            colorCode: selectedRearBumperObj.colorCode,
            price: selectedRearBumperObj.price || 0,
          }]
        : []),
      ...(selectedRoofPanelObj
        ? [{
            option: selectedRoofPanelObj._id,
            title: optionTypeToTitle['exterior-roof-panel'] || selectedRoofPanelObj.title || 'Roof Panel',
            colorCode: selectedRoofPanelObj.colorCode,
            price: selectedRoofPanelObj.price || 0,
          }]
        : []),
      ...(selectedDoorObj
        ? [{
            option: selectedDoorObj._id,
            title: optionTypeToTitle['exterior-door'] || selectedDoorObj.title || 'Door',
            colorCode: selectedDoorObj.colorCode,
            price: selectedDoorObj.price || 0,
          }]
        : []),
      ...(selectedMirrorObj
        ? [{
            option: selectedMirrorObj._id,
            title: optionTypeToTitle['exterior-mirror'] || selectedMirrorObj.title || 'Mirror',
            colorCode: selectedMirrorObj.colorCode,
            price: selectedMirrorObj.price || 0,
          }]
        : []),
      ...(selectedSpoilerObj
        ? [{
            option: selectedSpoilerObj._id,
            title: optionTypeToTitle['exterior-spoiler'] || selectedSpoilerObj.title || 'Spoiler',
            colorCode: selectedSpoilerObj.colorCode,
            price: selectedSpoilerObj.price || 0,
          }]
        : []),
      ...(selectedHandleObj
        ? [{
            option: selectedHandleObj._id,
            title: optionTypeToTitle['exterior-handle'] || selectedHandleObj.title || 'Handle',
            colorCode: selectedHandleObj.colorCode,
            price: selectedHandleObj.price || 0,
          }]
        : []),
      ...(selectedSeatCushionObj
        ? [{
            option: selectedSeatCushionObj._id,
            title: optionTypeToTitle['interior-seat-cushion'] || selectedSeatCushionObj.title || 'Seat Cushion',
            colorCode: selectedSeatCushionObj.colorCode,
            price: selectedSeatCushionObj.price || 0,
          }]
        : []),
      ...(selectedSeatBaseObj
        ? [{
            option: selectedSeatBaseObj._id,
            title: optionTypeToTitle['interior-seat-base'] || selectedSeatBaseObj.title || 'Seat Base',
            colorCode: selectedSeatBaseObj.colorCode,
            price: selectedSeatBaseObj.price || 0,
          }]
        : []),
      ...(selectedDashboardTrimObj
        ? [{
            option: selectedDashboardTrimObj._id,
            title: optionTypeToTitle['interior-dashboard-trim'] || selectedDashboardTrimObj.title || 'Dashboard Trim',
            colorCode: selectedDashboardTrimObj.colorCode,
            price: selectedDashboardTrimObj.price || 0,
          }]
        : []),
      ...(selectedSoundSystemObj
        ? [{
            option: selectedSoundSystemObj._id,
            title: optionTypeToTitle['interior-sound-system'] || selectedSoundSystemObj.title || 'Sound System',
            colorCode: null,
            price: selectedSoundSystemObj.price || 0,
          }]
        : []),
      ...(selectedPackageObj
        ? [{
            option: selectedPackageObj._id,
            title: selectedPackageObj.title || 'Package',
            colorCode: null,
            price: selectedPackageObj.price || 0,
          }]
        : []),
    ];

    if (selectedOptions.length === 0) {
      toast.error('Please select at least one customization option', {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: true,
        theme: 'dark',
      });
      return;
    }

    try {
      const capturedImage = await captureCanvasImage();
      console.log('Captured compressed image size:', capturedImage.length, 'bytes');

      const customizationData = {
        customerId,
        model: modelData._id,
        year: yearData._id,
        selectedOptions,
        image: capturedImage,
        notes: `Custom configuration saved on ${new Date().toLocaleString()}`,
        bookingStatus: 'saved',
        totalAmount: totalPrice,
      };

      if (editConfigId) {
        const response = await axios.put(`http://localhost:3000/api/v1/customization/${editConfigId}`, customizationData);
        toast.success('Configuration updated successfully', {
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: true,
          theme: 'dark',
        });
        console.log('Configuration updated:', response.data);
      } else {
        const response = await axios.post('http://localhost:3000/api/v1/customization', customizationData);
        toast.success('Configuration saved successfully!', {
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: true,
          theme: 'dark',
        });
        console.log('Configuration saved:', response.data);
      }
    } catch (error) {
      setCaptureImage(false);
      toast.error(`Failed to save configuration: ${error.message}`, {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: true,
        theme: 'dark',
      });
      console.error('Error saving configuration:', error);
    }
  };

  const handleBookModification = () => {
    if (!customerId) {
      console.log('User not logged in, redirecting to login');
      toast.error('Please login first', {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: true,
        theme: 'dark',
      });
      navigate('/login');
      return;
    }

    captureCanvasImage()
      .then((capturedImage) => {
        console.log('Captured compressed image size for booking:', capturedImage.length, 'bytes');
        const customizationData = {
          model: modelData,
          year: yearData,
          selectedOptions: [
            ...(selectedHoodObj
              ? [{
                  option: selectedHoodObj._id,
                  title: optionTypeToTitle['exterior-hood'] || selectedHoodObj.title || 'Hood',
                  colorCode: selectedHoodObj.colorCode,
                  price: selectedHoodObj.price || 0,
                }]
              : []),
            ...(selectedRimObj
              ? [{
                  option: selectedRimObj._id,
                  title: optionTypeToTitle['exterior-rim'] || selectedRimObj.title || 'Rim',
                  colorCode: selectedRimObj.colorCode,
                  price: selectedRimObj.price || 0,
                }]
              : []),
            ...(selectedFrontBumperObj
              ? [{
                  option: selectedFrontBumperObj._id,
                  title: optionTypeToTitle['exterior-front-bumper'] || selectedFrontBumperObj.title || 'Front Bumper',
                  colorCode: selectedFrontBumperObj.colorCode,
                  price: selectedFrontBumperObj.price || 0,
                }]
              : []),
            ...(selectedRearBumperObj
              ? [{
                  option: selectedRearBumperObj._id,
                  title: optionTypeToTitle['exterior-rear-bumper'] || selectedRearBumperObj.title || 'Rear Bumper',
                  colorCode: selectedRearBumperObj.colorCode,
                  price: selectedRearBumperObj.price || 0,
                }]
              : []),
            ...(selectedRoofPanelObj
              ? [{
                  option: selectedRoofPanelObj._id,
                  title: optionTypeToTitle['exterior-roof-panel'] || selectedRoofPanelObj.title || 'Roof Panel',
                  colorCode: selectedRoofPanelObj.colorCode,
                  price: selectedRoofPanelObj.price || 0,
                }]
              : []),
            ...(selectedDoorObj
              ? [{
                  option: selectedDoorObj._id,
                  title: optionTypeToTitle['exterior-door'] || selectedDoorObj.title || 'Door',
                  colorCode: selectedDoorObj.colorCode,
                  price: selectedDoorObj.price || 0,
                }]
              : []),
            ...(selectedMirrorObj
              ? [{
                  option: selectedMirrorObj._id,
                  title: optionTypeToTitle['exterior-mirror'] || selectedMirrorObj.title || 'Mirror',
                  colorCode: selectedMirrorObj.colorCode,
                  price: selectedMirrorObj.price || 0,
                }]
              : []),
            ...(selectedSpoilerObj
              ? [{
                  option: selectedSpoilerObj._id,
                  title: optionTypeToTitle['exterior-spoiler'] || selectedSpoilerObj.title || 'Spoiler',
                  colorCode: selectedSpoilerObj.colorCode,
                  price: selectedSpoilerObj.price || 0,
                }]
              : []),
            ...(selectedHandleObj
              ? [{
                  option: selectedHandleObj._id,
                  title: optionTypeToTitle['exterior-handle'] || selectedHandleObj.title || 'Handle',
                  colorCode: selectedHandleObj.colorCode,
                  price: selectedHandleObj.price || 0,
                }]
              : []),
            ...(selectedSeatCushionObj
              ? [{
                  option: selectedSeatCushionObj._id,
                  title: optionTypeToTitle['interior-seat-cushion'] || selectedSeatCushionObj.title || 'Seat Cushion',
                  colorCode: selectedSeatCushionObj.colorCode,
                  price: selectedSeatCushionObj.price || 0,
                }]
              : []),
            ...(selectedSeatBaseObj
              ? [{
                  option: selectedSeatBaseObj._id,
                  title: optionTypeToTitle['interior-seat-base'] || selectedSeatBaseObj.title || 'Seat Base',
                  colorCode: selectedSeatBaseObj.colorCode,
                  price: selectedSeatBaseObj.price || 0,
                }]
              : []),
            ...(selectedDashboardTrimObj
              ? [{
                  option: selectedDashboardTrimObj._id,
                  title: optionTypeToTitle['interior-dashboard-trim'] || selectedDashboardTrimObj.title || 'Dashboard Trim',
                  colorCode: selectedDashboardTrimObj.colorCode,
                  price: selectedDashboardTrimObj.price || 0,
                }]
              : []),
            ...(selectedSoundSystemObj
              ? [{
                  option: selectedSoundSystemObj._id,
                  title: optionTypeToTitle['interior-sound-system'] || selectedSoundSystemObj.title || 'Sound System',
                  colorCode: null,
                  price: selectedSoundSystemObj.price || 0,
                }]
              : []),
            ...(selectedPackageObj
              ? [{
                  option: selectedPackageObj._id,
                  title: selectedPackageObj.title || 'Package',
                  colorCode: null,
                  price: selectedPackageObj.price || 0,
                }]
              : []),
          ],
          image: capturedImage,
          notes: `Custom configuration saved on ${new Date().toLocaleString()}`,
        };

        if (customizationData.selectedOptions.length === 0) {
          toast.error('Please select at least one customization option', {
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: true,
            theme: 'dark',
          });
          setCaptureImage(false);
          return;
        }

        navigate('/modification-booking', { state: { customization: customizationData } });
      })
      .catch((error) => {
        setCaptureImage(false);
        toast.error(`Failed to capture image: ${error.message}`, {
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: true,
          theme: 'dark',
        });
        console.error('Error capturing image for booking:', error);
      });
  };

  useEffect(() => {
    console.log('Selected States:', {
      selectedHood,
      selectedRim,
      selectedFrontBumper,
      selectedRearBumper,
      selectedRoofPanel,
      selectedDoor,
      selectedMirror,
      selectedSpoiler,
      selectedSeatCushion,
      selectedSeatBase,
      selectedDashboardTrim,
      selectedHandle,
      selectedSoundSystem,
      selectedPackage,
    });
    console.log('Customization Options:', customizationOptions);
    console.log('Available Options:', {
      exteriorHoods,
      exteriorRims,
      exteriorFrontBumpers,
      exteriorRearBumpers,
      exteriorRoofPanels,
      exteriorDoors,
      exteriorMirrors,
      exteriorSpoilers,
      exteriorHandles,
      interiorSeatCushions,
      interiorSeatBases,
      interiorDashboardTrims,
      interiorSoundSystems,
      packages,
    });
    console.log('carModelUrl:', carModelUrl);
  }, [
    selectedHood,
    selectedRim,
    selectedFrontBumper,
    selectedRearBumper,
    selectedRoofPanel,
    selectedDoor,
    selectedMirror,
    selectedSpoiler,
    selectedSeatCushion,
    selectedSeatBase,
    selectedDashboardTrim,
    selectedHandle,
    selectedSoundSystem,
    selectedPackage,
    carModelUrl,
    exteriorHoods,
    exteriorRims,
    exteriorFrontBumpers,
    exteriorRearBumpers,
    exteriorRoofPanels,
    exteriorDoors,
    exteriorMirrors,
    exteriorSpoilers,
    exteriorHandles,
    interiorSeatCushions,
    interiorSeatBases,
    interiorDashboardTrims,
    interiorSoundSystems,
    packages,
  ]);

  return (
    <>
      {isFullScreen ? (
        <div className="fixed inset-0 bg-[#101010] z-50 flex flex-col">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleCloseFullScreen}
              className="flex items-center space-x-2 px-4 py-2 rounded bg-[#FFFFFF1A] text-gray-400 hover:text-white backdrop-blur-sm"
            >
              <X size={20} />
              <span className="text-[16px] font-medium">Cancel</span>
            </button>
          </div>
          <Canvas
            ref={canvasRef}
            camera={{ position: [10, 2, 0], fov: 50 }}
            style={{ height: '100vh' }}
            gl={{ preserveDrawingBuffer: true }}
          >
            <ambientLight intensity={4.0} />
            <directionalLight position={[10, 10, 5]} intensity={4.0} />
            <pointLight position={[-5, 5, -5]} intensity={3.0} />
            <Environment preset="sunset" />
            {carModelUrl && !yearError ? (
              <CarModel
                url={carModelUrl}
                customizationOptions={customizationOptions}
                rotationSpeed={rotationSpeed}
                scale={scale}
                onCapture={captureImage ? handleCapture : null}
              />
            ) : (
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="gray" />
              </mesh>
            )}
            <OrbitControls enablePan={false} enableZoom={false} />
          </Canvas>
        </div>
      ) : (
        <>
          <Navbar2 />
          <div className="min-h-screen bg-[#101010] text-white font-rajdhani">
            <div className="sticky top-0 z-10 bg-[#101010] px-8 py-4 border-b border-gray-700 flex justify-between items-center backdrop-blur-sm">
              <div className="flex space-x-6 text-[18px]">
                {['Customization', 'Packages', 'Summary'].map((tab) => (
        <button
        key={tab}
        onClick={() => handleTabClick(tab)}
        className={`pb-7 transition-colors -mb-[26px] ${
  activeTab === tab
    ? 'border-b-[3px] border-[#FF4500] text-white'
    : 'border-b-[3px] border-transparent text-[#E0E0E0] hover:text-white hover:border-[#FF4500]'
}`}

      >
        {tab}
      </button>
    ))}
              </div>
              <div className="text-[16px] text-right">
                <p className="font-semibold text-[#FF4500]">{makeData?.name} {modelData?.name} {year}</p>
                <p>Total: Rs. {totalPrice.toFixed(2)}</p>
              </div>
            </div>

            <div ref={sectionRefs.Customization} className="px-8 py-6">
              <h1 className="text-[24px] font-semibold mb-6">Customization</h1>
              {configLoading ? (
                <div className="flex items-center justify-center h-[500px]">
                  <p>Loading configuration...</p>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row space-y-10 md:space-y-0 md:space-x-10 relative">
                  <div className="md:w-[80%] space-y-4 md:sticky md:top-[100px] h-fit w-full">
                    <div className="bg-[#1E1E1E] rounded p-4">
                      {yearLoading || optionsLoading ? (
                        <div className="flex items-center justify-center h-[500px] bg-[#1E1E1E]">
                          <p>Loading...</p>
                        </div>
                      ) : yearError || optionsError ? (
                        <div className="flex items-center justify-center h-[500px] bg-[#1E1E1E]">
                          <p>Error loading data: {yearError?.message || optionsError?.message}</p>
                        </div>
                      ) : carModelUrl ? (
                        <Canvas
                          ref={canvasRef}
                          camera={{ position: [10, 2, 0], fov: 50 }}
                          style={{ height: '500px' }}
                          className="cursor-pointer"
                          gl={{ preserveDrawingBuffer: true }}
                        >
                          <ambientLight intensity={4.0} />
                          <directionalLight position={[10, 10, 5]} intensity={4.0} />
                          <pointLight position={[-5, 5, -5]} intensity={3.0} />
                          <Environment preset="sunset" />
                          <CarModel
                            url={carModelUrl}
                            customizationOptions={customizationOptions}
                            rotationSpeed={rotationSpeed}
                            scale={scale}
                            onCapture={captureImage ? handleCapture : null}
                          />
                          <OrbitControls enablePan={false} enableZoom={false} />
                        </Canvas>
                      ) : (
                        <div className="flex items-center justify-center h-[500px] bg-[#1E1E1E]">
                          <p className="text-[16px] text-gray-400">
                            No 3D model available. Please select a valid model or check the file path.
                          </p>
                        </div>
                      )}
                      <div className="flex justify-between text-[16px] mt-4 text-gray-400">
                        <button className="flex items-center space-x-1 hover:text-white" onClick={handleRotateLeft}>
                          <ChevronLeftCircle size={18} />
                          <span>Rotate Left</span>
                        </button>
                        <button className="hover:text-white" onClick={handleExpand}>⛶ Expand</button>
                        <button className="flex items-center space-x-1 hover:text-white" onClick={handleRotateRight}>
                          <span>Rotate Right</span>
                          <ChevronRightCircle size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-1/2 bg-[#1E1E1E] p-6 rounded space-y-6 overflow-y-auto">
                    <h2 className="text-[18px] font-semibold mb-4">Choose Your Exterior</h2>
                    <div>
                      <h2 className="text-[16px] font-semibold mb-2">Hood</h2>
                      <div className="flex items-center space-x-4 mb-4">
                        {exteriorHoods.map((opt) => (
                          <button
                            key={opt._id}
                            className="flex flex-col items-center focus:outline-none"
                            onClick={() => handleOptionSelect(opt._id, setSelectedHood)}
                          >
                            <div
                              className={`w-10 h-10 rounded-full border ${
                                selectedHood === opt._id ? 'ring-2 ring-[#FF4500]' : ''
                              }`}
                              style={{ backgroundColor: opt.colorCode || '#FFFFFF' }}
                            />
                            <span className="text-[14px] text-gray-400 mt-1">Rs. {opt.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-[16px] font-semibold mb-2">Rim</h2>
                      <div className="flex items-center space-x-4 mb-4">
                        {exteriorRims.map((opt) => (
                          <button
                            key={opt._id}
                            className="flex flex-col items-center focus:outline-none"
                            onClick={() => handleOptionSelect(opt._id, setSelectedRim)}
                          >
                            <div
                              className={`w-10 h-10 rounded-full border ${
                                selectedRim === opt._id ? 'ring-2 ring-[#FF4500]' : ''
                              }`}
                              style={{ backgroundColor: opt.colorCode || '#FFFFFF' }}
                            />
                            <span className="text-[14px] text-gray-400 mt-1">Rs. {opt.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-[16px] font-semibold mb-2">Front Bumper</h2>
                      <div className="flex items-center space-x-4 mb-4">
                        {exteriorFrontBumpers.map((opt) => (
                          <button
                            key={opt._id}
                            className="flex flex-col items-center focus:outline-none"
                            onClick={() => handleOptionSelect(opt._id, setSelectedFrontBumper)}
                          >
                            <div
                              className={`w-10 h-10 rounded-full border ${
                                selectedFrontBumper === opt._id ? 'ring-2 ring-[#FF4500]' : ''
                              }`}
                              style={{ backgroundColor: opt.colorCode || '#FFFFFF' }}
                            />
                            <span className="text-[14px] text-gray-400 mt-1">Rs. {opt.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-[16px] font-semibold mb-2">Rear Bumper</h2>
                      <div className="flex items-center space-x-4 mb-4">
                        {exteriorRearBumpers.map((opt) => (
                          <button
                            key={opt._id}
                            className="flex flex-col items-center focus:outline-none"
                            onClick={() => handleOptionSelect(opt._id, setSelectedRearBumper)}
                          >
                            <div
                              className={`w-10 h-10 rounded-full border ${
                                selectedRearBumper === opt._id ? 'ring-2 ring-[#FF4500]' : ''
                              }`}
                              style={{ backgroundColor: opt.colorCode || '#FFFFFF' }}
                            />
                            <span className="text-[14px] text-gray-400 mt-1">Rs. {opt.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-[16px] font-semibold mb-2">Roof Panel</h2>
                      <div className="flex items-center space-x-4 mb-4">
                        {exteriorRoofPanels.map((opt) => (
                          <button
                            key={opt._id}
                            className="flex flex-col items-center focus:outline-none"
                            onClick={() => handleOptionSelect(opt._id, setSelectedRoofPanel)}
                          >
                            <div
                              className={`w-10 h-10 rounded-full border ${
                                selectedRoofPanel === opt._id ? 'ring-2 ring-[#FF4500]' : ''
                              }`}
                              style={{ backgroundColor: opt.colorCode || '#FFFFFF' }}
                            />
                            <span className="text-[14px] text-gray-400 mt-1">Rs. {opt.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-[16px] font-semibold mb-2">Door</h2>
                      <div className="flex items-center space-x-4 mb-4">
                        {exteriorDoors.map((opt) => (
                          <button
                            key={opt._id}
                            className="flex flex-col items-center focus:outline-none"
                            onClick={() => handleOptionSelect(opt._id, setSelectedDoor)}
                          >
                            <div
                              className={`w-10 h-10 rounded-full border ${
                                selectedDoor === opt._id ? 'ring-2 ring-[#FF4500]' : ''
                              }`}
                              style={{ backgroundColor: opt.colorCode || '#FFFFFF' }}
                            />
                            <span className="text-[14px] text-gray-400 mt-1">Rs. {opt.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-[16px] font-semibold mb-2">Mirror</h2>
                      <div className="flex items-center space-x-4 mb-4">
                        {exteriorMirrors.map((opt) => (
                          <button
                            key={opt._id}
                            className="flex flex-col items-center focus:outline-none"
                            onClick={() => handleOptionSelect(opt._id, setSelectedMirror)}
                          >
                            <div
                              className={`w-10 h-10 rounded-full border ${
                                selectedMirror === opt._id ? 'ring-2 ring-[#FF4500]' : ''
                              }`}
                              style={{ backgroundColor: opt.colorCode || '#FFFFFF' }}
                            />
                            <span className="text-[14px] text-gray-400 mt-1">Rs. {opt.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-[16px] font-semibold mb-2">Spoiler</h2>
                      <div className="flex items-center space-x-4 mb-4">
                        {exteriorSpoilers.map((opt) => (
                          <button
                            key={opt._id}
                            className="flex flex-col items-center focus:outline-none"
                            onClick={() => handleOptionSelect(opt._id, setSelectedSpoiler)}
                          >
                            <div
                              className={`w-10 h-10 rounded-full border ${
                                selectedSpoiler === opt._id ? 'ring-2 ring-[#FF4500]' : ''
                              }`}
                              style={{ backgroundColor: opt.colorCode || '#FFFFFF' }}
                            />
                            <span className="text-[14px] text-gray-400 mt-1">Rs. {opt.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-[16px] font-semibold mb-2">Handle</h2>
                      <div className="flex items-center space-x-4 mb-4">
                        {exteriorHandles.map((opt) => (
                          <button
                            key={opt._id}
                            className="flex flex-col items-center focus:outline-none"
                            onClick={() => handleOptionSelect(opt._id, setSelectedHandle)}
                          >
                            <div
                              className={`w-10 h-10 rounded-full border ${
                                selectedHandle === opt._id ? 'ring-2 ring-[#FF4500]' : ''
                              }`}
                              style={{ backgroundColor: opt.colorCode || '#FFFFFF' }}
                            />
                            <span className="text-[14px] text-gray-400 mt-1">Rs. {opt.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <h2 className="text-[18px] font-semibold mb-4 mt-8">Choose Your Interior</h2>
                    <div className="space-y-4 mb-6">
                      <h3 className="text-[16px] font-semibold">Seat Cushion</h3>
                      <div className="flex flex-wrap gap-4">
                        {interiorSeatCushions.map((opt) => (
                          <button
                            key={opt._id}
                            className="flex flex-col items-center focus:outline-none"
                            onClick={() => handleOptionSelect(opt._id, setSelectedSeatCushion)}
                          >
                            <div
                              className={`w-10 h-10 rounded-full border ${
                                selectedSeatCushion === opt._id ? 'ring-2 ring-[#FF4500]' : ''
                              }`}
                              style={{ backgroundColor: opt.colorCode || '#FFFFFF' }}
                            />
                            <span className="text-[14px] text-gray-400 mt-1">Rs. {opt.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4 mb-6">
                      <h3 className="text-[16px] font-semibold">Seat Base</h3>
                      <div className="flex flex-wrap gap-4">
                        {interiorSeatBases.map((opt) => (
                          <button
                            key={opt._id}
                            className="flex flex-col items-center focus:outline-none"
                            onClick={() => handleOptionSelect(opt._id, setSelectedSeatBase)}
                          >
                            <div
                              className={`w-10 h-10 rounded-full border ${
                                selectedSeatBase === opt._id ? 'ring-2 ring-[#FF4500]' : ''
                              }`}
                              style={{ backgroundColor: opt.colorCode || '#FFFFFF' }}
                            />
                            <span className="text-[14px] text-gray-400 mt-1">Rs. {opt.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4 mb-6">
                      <h3 className="text-[16px] font-semibold">Dashboard Trim</h3>
                      <div className="flex flex-wrap gap-4">
                        {interiorDashboardTrims.map((opt) => (
                          <button
                            key={opt._id}
                            className="flex flex-col items-center focus:outline-none"
                            onClick={() => handleOptionSelect(opt._id, setSelectedDashboardTrim)}
                          >
                            <div
                              className={`w-10 h-10 rounded-full border ${
                                selectedDashboardTrim === opt._id ? 'ring-2 ring-[#FF4500]' : ''
                              }`}
                              style={{ backgroundColor: opt.colorCode || '#FFFFFF' }}
                            />
                            <span className="text-[14px] text-gray-400 mt-1">Rs. {opt.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-[16px] font-semibold">Sound System</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {interiorSoundSystems.map((system) => {
                          const isSelected = selectedSoundSystem === system._id;
                          return (
                            <div
                              key={system._id}
                              onClick={() => handleOptionSelect(system._id, setSelectedSoundSystem)}
                              className="flex items-center bg-[#2A2A2A] p-3 rounded cursor-pointer relative hover:bg-[#333]"
                            >
                              <div className="relative w-16 h-16 flex-shrink-0">
                                <img
                                  src={
                                    system.image
                                      ? `http://localhost:3000/uploads/${system.image}`
                                      : '/assets/images/placeholder.png'
                                  }
                                  alt={system.title}
                                  className="w-full h-full object-cover rounded"
                                />
                                <div className="absolute -top-2 -left-2 bg-[#1E1E1E] text-white rounded-full p-1 shadow">
                                  {isSelected ? (
                                    <Check size={14} strokeWidth={3} />
                                  ) : (
                                    <Plus size={14} strokeWidth={2} />
                                  )}
                                </div>
                              </div>
                              <div className="ml-4">
                                <p className="text-[16px]">{system.title}</p>
                                <p className="text-sm font-semibold text-white mt-1">Rs. {system.price}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div ref={sectionRefs.Packages} className="px-8 py-6">
              <h1 className="text-[24px] font-semibold mb-6">Packages</h1>
              <div className="bg-[#1E1E1E] p-6 rounded space-y-6">
                <p className="text-[16px] text-gray-400">Choose from available packages like Performance, Luxury, or Technology.</p>
                {packagesLoading ? (
                  <div className="flex items-center justify-center h-[200px]">
                    <p>Loading packages...</p>
                  </div>
                ) : packagesError ? (
                  <div className="flex items-center justify-center h-[200px]">
                    <p>Error loading packages: {packagesError.message}</p>
                  </div>
                ) : packages.length === 0 ? (
                  <p className="text-[16px] text-gray-400">No packages available for this model.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {packages.map((pkg) => {
                      const isSelected = selectedPackage === pkg._id;
                      return (
                        <div
                          key={pkg._id}
                          onClick={() => handlePackageToggle(pkg._id)}
                          className={`bg-[#2A2A2A] p-4 rounded cursor-pointer hover:bg-[#333] relative transition-colors ${
                            isSelected ? 'border-2 border-[#FF4500]' : ''
                          } w-[270px]`}
                        >
                          <div className="flex flex-col items-start">
                            <div className="relative w-50 h-48 mb-4">
                              <img
                                src={
                                  pkg.image
                                    ? `http://localhost:3000/api/v1/uploads/${pkg.image}`
                                    : '/assets/images/placeholder-package.png'
                                }
                                alt={pkg.title}
                                className="w-full h-full object-cover rounded"
                              />
                              <div className="absolute -top-2 -left-2 bg-[#1E1E1E] text-white rounded-full p-1 shadow">
                                {isSelected ? (
                                  <Check size={14} strokeWidth={3} />
                                ) : (
                                  <Plus size={14} strokeWidth={2} />
                                )}
                              </div>
                            </div>
                            <h3 className="text-[18px] font-semibold">{pkg.title}</h3>
                            <p className="text-sm text-gray-400 mt-1">{pkg.description || 'No description available'}</p>
                            <p className="text-sm font-semibold text-white mt-2">Rs. {pkg.price}</p>
                            <div className="mt-2 w-full">
                              <p className="text-sm font-semibold text-gray-300">Features:</p>
                              <ul className="list-disc list-inside text-sm text-gray-400 mt-1">
                                {pkg.features && pkg.features.length > 0 ? (
                                  pkg.features.map((feature, index) => <li key={index}>{feature}</li>)
                                ) : (
                                  <li>No features listed</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div ref={sectionRefs.Summary} className="px-8 py-6">
              <h1 className="text-[24px] font-semibold mb-6">Summary</h1>
              <div className="bg-[#1E1E1E] p-6 rounded">
                <p className="text-[16px] text-gray-400">Review your selected options and finalize your configuration.</p>
                <div className="mt-4 space-y-2">
                  <p className="text-[16px]">
                    <span className="font-semibold">Model:</span> {makeData?.name} {modelData?.name} {year}
                  </p>
                  {selectedHoodObj && (
                    <p className="text-[16px]">
                      <span className="font-semibold">Hood:</span> {selectedHoodObj.title || 'Hood'} (Rs. {selectedHoodObj.price})
                    </p>
                  )}
                  {selectedRimObj && (
                    <p className="text-[16px]">
                      <span className="font-semibold">Rim:</span> {selectedRimObj.title || 'Rim'} (Rs. {selectedRimObj.price})
                    </p>
                  )}
                  {selectedFrontBumperObj && (
                    <p className="text-[16px]">
                      <span className="font-semibold">Front Bumper:</span> {selectedFrontBumperObj.title || 'Front Bumper'} (Rs. {selectedFrontBumperObj.price})
                    </p>
                  )}
                  {selectedRearBumperObj && (
                    <p className="text-[16px]">
                      <span className="font-semibold">Rear Bumper:</span> {selectedRearBumperObj.title || 'Rear Bumper'} (Rs. {selectedRearBumperObj.price})
                    </p>
                  )}
                  {selectedRoofPanelObj && (
                    <p className="text-[16px]">
                      <span className="font-semibold">Roof Panel:</span> {selectedRoofPanelObj.title || 'Roof Panel'} (Rs. {selectedRoofPanelObj.price})
                    </p>
                  )}
                  {selectedDoorObj && (
                    <p className="text-[16px]">
                      <span className="font-semibold">Door:</span> {selectedDoorObj.title || 'Door'} (Rs. {selectedDoorObj.price})
                    </p>
                  )}
                  {selectedMirrorObj && (
                    <p className="text-[16px]">
                      <span className="font-semibold">Mirror:</span> {selectedMirrorObj.title || 'Mirror'} (Rs. {selectedMirrorObj.price})
                    </p>
                  )}
                  {selectedSpoilerObj && (
                    <p className="text-[16px]">
                      <span className="font-semibold">Spoiler:</span> {selectedSpoilerObj.title || 'Spoiler'} (Rs. {selectedSpoilerObj.price})
                    </p>
                  )}
                  {selectedHandleObj && (
                    <p className="text-[16px]">
                      <span className="font-semibold">Handle:</span> {selectedHandleObj.title || 'Handle'} (Rs. {selectedHandleObj.price})
                    </p>
                  )}
                  {selectedSeatCushionObj && (
                    <p className="text-[16px]">
                      <span className="font-semibold">Seat Cushion:</span> {selectedSeatCushionObj.title || 'Seat Cushion'} (Rs. {selectedSeatCushionObj.price})
                    </p>
                  )}
                  {selectedSeatBaseObj && (
                    <p className="text-[16px]">
                      <span className="font-semibold">Seat Base:</span> {selectedSeatBaseObj.title || 'Seat Base'} (Rs. {selectedSeatBaseObj.price})
                    </p>
                  )}
                  {selectedDashboardTrimObj && (
                    <p className="text-[16px]">
                      <span className="font-semibold">Dashboard Trim:</span> {selectedDashboardTrimObj.title || 'Dashboard Trim'} (Rs. {selectedDashboardTrimObj.price})
                    </p>
                  )}
                  {selectedSoundSystemObj && (
                    <p className="text-[16px]">
                      <span className="font-semibold">Sound System:</span> {selectedSoundSystemObj.title || 'Sound System'} (Rs. {selectedSoundSystemObj.price})
                    </p>
                  )}
                  {selectedPackageObj && (
                    <p className="text-[16px]">
                      <span className="font-semibold">Package:</span> {selectedPackageObj.title || 'Package'} (Rs. {selectedPackageObj.price})
                    </p>
                  )}
                  <p className="text-[16px] font-bold mt-4">Total: Rs. {totalPrice.toFixed(2)}</p>
                  <div className="mt-4 flex space-x-4">
                    <button onClick={handleShare} className="flex items-center space-x-1 text-gray-400 hover:text-[#FF4500] hover:underline">
                      <Share2 size={18} />
                      <span>Share</span>
                    </button>
                    <button onClick={handleDownload} className="flex items-center space-x-1 text-gray-400 hover:text-[#FF4500] hover:underline">
                      <Download size={18} />
                      <span>Download</span>
                    </button>
                    <button onClick={handleSaveConfiguration} className="flex items-center space-x-1 text-gray-400 hover:text-[#FF4500] hover:underline">
                      <Save size={18} />
                      <span>Save Configuration</span>
                    </button>
                    <button onClick={handleBookModification} className="flex items-center space-x-1 text-gray-400 hover:text-[#FF4500] hover:underline">
                      <Wrench size={18} />
                      <span>Book Modification</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            theme="dark"
          />
        </>
      )}
    </>
  );
}