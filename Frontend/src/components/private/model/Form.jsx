import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Car } from 'lucide-react';
import { useState } from 'react';
import Select from 'react-select';
import "react-toastify/dist/ReactToastify.css";

const AddCarModel = () => {
    const [selectedMake, setSelectedMake] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [vehicleImage, setVehicleImage] = useState(null);
    const [customizerAsset, setCustomizerAsset] = useState(null);
    const [exteriorHood, setExteriorHood] = useState([]);
    const [exteriorFrontBumper, setExteriorFrontBumper] = useState([]);
    const [exteriorRearBumper, setExteriorRearBumper] = useState([]);
    const [exteriorRoofPanel, setExteriorRoofPanel] = useState([]);
    const [exteriorDoor, setExteriorDoor] = useState([]);
    const [exteriorHandle, setExteriorHandle] = useState([]);
    const [exteriorMirror, setExteriorMirror] = useState([]);
    const [exteriorSpoiler, setExteriorSpoiler] = useState([]);
    const [interiorSeatCushion, setInteriorSeatCushion] = useState([]);
    const [interiorSeatBase, setInteriorSeatBase] = useState([]);
    const [interiorDashboardTrim, setInteriorDashboardTrim] = useState([]);
    const [interiorSoundSystem, setInteriorSoundSystem] = useState([]);
    const [selectedPackages, setSelectedPackages] = useState([]);
    const [selectedStickers, setSelectedStickers] = useState([]);

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

    const { data: allCustomizationOptions = [] } = useQuery({
        queryKey: ['customization-options'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:3000/api/v1/customization-option');
            return res.data.data;
        }
    });

    const { data: allPackages = [] } = useQuery({
        queryKey: ['packages'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:3000/api/v1/package');
            return res.data.data;
        }
    });

    const { data: allStickers = [] } = useQuery({
        queryKey: ['stickers'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:3000/api/v1/sticker');
            return res.data.data;
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const yearObj = years.find((y) => y.year.toString() === selectedYear);
        if (!yearObj) {
            alert("Selected year not found. Please add it in 'Manage Compatibility' first.");
            return;
        }

        const formData = new FormData();
        if (vehicleImage) formData.append('vehicleImage', vehicleImage);
        if (customizerAsset) formData.append('customizerAsset', customizerAsset);

        const exteriorOptions = [
            ...exteriorHood,
            ...exteriorFrontBumper,
            ...exteriorRearBumper,
            ...exteriorRoofPanel,
            ...exteriorDoor,
            ...exteriorHandle,
            ...exteriorMirror,
            ...exteriorSpoiler
        ];
        const interiorOptions = [
            ...interiorSeatCushion,
            ...interiorSeatBase,
            ...interiorDashboardTrim,
            ...interiorSoundSystem
        ];

        formData.append('exteriorOptions', JSON.stringify(exteriorOptions));
        formData.append('interiorOptions', JSON.stringify(interiorOptions));
        formData.append('packages', JSON.stringify(selectedPackages));
        formData.append('stickers', JSON.stringify(selectedStickers));

        try {
            await axios.put(`http://localhost:3000/api/v1/year/updateYear/${yearObj._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            window.alert('Car model added successfully!');
            setSelectedMake('');
            setSelectedModel('');
            setSelectedYear('');
            setVehicleImage(null);
            setCustomizerAsset(null);
            setExteriorHood([]);
            setExteriorFrontBumper([]);
            setExteriorRearBumper([]);
            setExteriorRoofPanel([]);
            setExteriorDoor([]);
            setExteriorHandle([]);
            setExteriorMirror([]);
            setExteriorSpoiler([]);
            setInteriorSeatCushion([]);
            setInteriorSeatBase([]);
            setInteriorDashboardTrim([]);
            setInteriorSoundSystem([]);
            setSelectedPackages([]);
            setSelectedStickers([]);
        } catch (err) {
            console.error(err);
            alert('Error uploading data');
        }
    };

    return (
        <div className="flex justify-start px-8 py-6 bg-white min-h-screen text-gray-800">
            <div className="w-full">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <Car /> Add Car Model
                </h2>

                <form className="space-y-6 w-full" onSubmit={handleSubmit}>
                    <Dropdown label="Make" value={selectedMake} setValue={setSelectedMake} options={makes} />
                    <Dropdown label="Model" value={selectedModel} setValue={setSelectedModel} options={models} disabled={!selectedMake} />
                    <Dropdown label="Year" value={selectedYear} setValue={setSelectedYear} options={years.map(y => ({ _id: y.year, name: y.year }))} disabled={!selectedModel} />

                    <MultiSelect
                        label="Exterior Hood"
                        value={exteriorHood}
                        setValue={setExteriorHood}
                        options={allCustomizationOptions
                            .filter(opt => opt.type === 'exterior-hood')
                            .map(opt => ({
                                value: opt._id,
                                label: opt.colorCode,
                                colorCode: opt.colorCode,
                                price: opt.price
                            }))}
                    />
                    <MultiSelect
                        label="Exterior Front Bumper"
                        value={exteriorFrontBumper}
                        setValue={setExteriorFrontBumper}
                        options={allCustomizationOptions
                            .filter(opt => opt.type === 'exterior-front-bumper')
                            .map(opt => ({
                                value: opt._id,
                                label: opt.colorCode,
                                colorCode: opt.colorCode,
                                price: opt.price
                            }))}
                    />
                    <MultiSelect
                        label="Exterior Rear Bumper"
                        value={exteriorRearBumper}
                        setValue={setExteriorRearBumper}
                        options={allCustomizationOptions
                            .filter(opt => opt.type === 'exterior-rear-bumper')
                            .map(opt => ({
                                value: opt._id,
                                label: opt.colorCode,
                                colorCode: opt.colorCode,
                                price: opt.price
                            }))}
                    />
                    <MultiSelect
                        label="Exterior Roof Panel"
                        value={exteriorRoofPanel}
                        setValue={setExteriorRoofPanel}
                        options={allCustomizationOptions
                            .filter(opt => opt.type === 'exterior-roof-panel')
                            .map(opt => ({
                                value: opt._id,
                                label: opt.colorCode,
                                colorCode: opt.colorCode,
                                price: opt.price
                            }))}
                    />
                    <MultiSelect
                        label="Exterior Door"
                        value={exteriorDoor}
                        setValue={setExteriorDoor}
                        options={allCustomizationOptions
                            .filter(opt => opt.type === 'exterior-door')
                            .map(opt => ({
                                value: opt._id,
                                label: opt.colorCode,
                                colorCode: opt.colorCode,
                                price: opt.price
                            }))}
                    />
                    <MultiSelect
                        label="Exterior Door Handle"
                        value={exteriorHandle}
                        setValue={setExteriorHandle}
                        options={allCustomizationOptions
                            .filter(opt => opt.type === 'exterior-handle')
                            .map(opt => ({
                                value: opt._id,
                                label: opt.colorCode,
                                colorCode: opt.colorCode,
                                price: opt.price
                            }))}
                    />
                    <MultiSelect
                        label="Exterior Mirror"
                        value={exteriorMirror}
                        setValue={setExteriorMirror}
                        options={allCustomizationOptions
                            .filter(opt => opt.type === 'exterior-mirror')
                            .map(opt => ({
                                value: opt._id,
                                label: opt.colorCode,
                                colorCode: opt.colorCode,
                                price: opt.price
                            }))}
                    />
                    <MultiSelect
                        label="Exterior Spoiler"
                        value={exteriorSpoiler}
                        setValue={setExteriorSpoiler}
                        options={allCustomizationOptions
                            .filter(opt => opt.type === 'exterior-spoiler')
                            .map(opt => ({
                                value: opt._id,
                                label: opt.colorCode,
                                colorCode: opt.colorCode,
                                price: opt.price
                            }))}
                    />
                    <MultiSelect
                        label="Interior Seat Cushion"
                        value={interiorSeatCushion}
                        setValue={setInteriorSeatCushion}
                        options={allCustomizationOptions
                            .filter(opt => opt.type === 'interior-seat-cushion')
                            .map(opt => ({
                                value: opt._id,
                                label: opt.colorCode,
                                colorCode: opt.colorCode,
                                price: opt.price
                            }))}
                    />
                    <MultiSelect
                        label="Interior Seat Base"
                        value={interiorSeatBase}
                        setValue={setInteriorSeatBase}
                        options={allCustomizationOptions
                            .filter(opt => opt.type === 'interior-seat-base')
                            .map(opt => ({
                                value: opt._id,
                                label: opt.colorCode,
                                colorCode: opt.colorCode,
                                price: opt.price
                            }))}
                    />
                    <MultiSelect
                        label="Interior Dashboard Trim"
                        value={interiorDashboardTrim}
                        setValue={setInteriorDashboardTrim}
                        options={allCustomizationOptions
                            .filter(opt => opt.type === 'interior-dashboard-trim')
                            .map(opt => ({
                                value: opt._id,
                                label: opt.colorCode,
                                colorCode: opt.colorCode,
                                price: opt.price
                            }))}
                    />
                    <MultiSelect
                        label="Interior Sound System"
                        value={interiorSoundSystem}
                        setValue={setInteriorSoundSystem}
                        options={allCustomizationOptions
                            .filter(opt => opt.type === 'interior-sound-system')
                            .map(opt => ({
                                value: opt._id,
                                label: opt.title,
                                image: opt.image ? `http://localhost:3000/uploads/${opt.image}` : null,
                                price: opt.price
                            }))}
                    />
                    <MultiSelect
                        label="Packages"
                        value={selectedPackages}
                        setValue={setSelectedPackages}
                        options={allPackages.map(pkg => ({
                            value: pkg._id,
                            label: pkg.title,
                            image: pkg.image ? `http://localhost:3000/uploads/${pkg.image}` : null,
                            price: pkg.price
                        }))}
                    />
                    <MultiSelect
                        label="Stickers"
                        value={selectedStickers}
                        setValue={setSelectedStickers}
                        options={allStickers.map(stk => ({
                            value: stk._id,
                            label: stk.text || 'Sticker',
                            image: stk.image ? `http://localhost:3000/uploads/${stk.image}` : null
                        }))}
                    />
                    <FileUpload label="Vehicle Image" accept="image/*" onChange={setVehicleImage} />
                    <FileUpload label="3D Customizer Asset (.glb/.fbx)" accept=".glb,.fbx" onChange={setCustomizerAsset} />
                    <button type="submit" className="bg-[#FF4500] text-white px-6 py-2 rounded-md">Add Car Model</button>
                </form>
            </div>
        </div>
    );
};

// Standard dropdown
const Dropdown = ({ label, value, setValue, options, disabled }) => (
    <div>
        <label className="block mb-1 font-medium">{label}</label>
        <select
            className="border rounded p-2 w-full"
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={disabled}
        >
            <option value="">Select {label}</option>
            {options.map((opt) => (
                <option key={opt._id} value={opt._id}>{opt.name}</option>
            ))}
        </select>
    </div>
);

// Multi-select with react-select
const MultiSelect = ({ label, value, setValue, options }) => {
    const selected = options.filter((opt) => value.includes(opt.value));

    const getOptionLabel = (e) => {
        if (e.colorCode) {
            return (
                <div className="flex items-center gap-3">
                    <span
                        className="w-5 h-5 rounded-full border"
                        style={{ backgroundColor: e.colorCode }}
                    ></span>
                    <div>
                        <div className="font-medium">{e.colorCode}</div>
                        {e.price && (
                            <div className="text-sm text-gray-600">Rs. {e.price}</div>
                        )}
                    </div>
                </div>
            );
        }
        if (e.image || e.price) {
            return (
                <div className="flex items-center gap-3">
                    {e.image && (
                        <img
                            src={e.image}
                            alt={e.label}
                            className="w-10 h-10 object-contain border rounded"
                        />
                    )}
                    <div>
                        <div className="font-medium">{e.label}</div>
                        {e.price && (
                            <div className="text-sm text-gray-600">Rs. {e.price}</div>
                        )}
                    </div>
                </div>
            );
        }
        return e.label;
    };

    return (
        <div className="mb-4">
            <label className="block mb-1 font-medium">{label}</label>
            <Select
                isMulti
                options={options}
                value={selected}
                onChange={(selected) => setValue(selected.map((opt) => opt.value))}
                getOptionLabel={getOptionLabel}
                classNamePrefix="select"
                placeholder={`Select ${label}`}
                styles={{
                    control: (base) => ({
                        ...base,
                        minHeight: '42px',
                        fontSize: '16px',
                    }),
                    valueContainer: (base) => ({
                        ...base,
                        padding: '0 8px',
                    }),
                }}
            />
        </div>
    );
};

// File upload component
const FileUpload = ({ label, accept, onChange }) => (
    <div>
        <label className="block mb-1 font-medium">{label}</label>
        <input
            type="file"
            accept={accept}
            className="border rounded p-2 w-full"
            onChange={(e) => onChange(e.target.files[0])}
        />
    </div>
);

export default AddCarModel;