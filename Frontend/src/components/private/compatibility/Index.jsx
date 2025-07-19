import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { FaEdit, FaTrash, FaWrench } from 'react-icons/fa';

const api = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    },
});

export default function ManageCompatibility() {
    const [activeTab, setActiveTab] = useState('makes');
    const [makeInput, setMakeInput] = useState('');
    const [modelInput, setModelInput] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedMake, setSelectedMake] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedYears, setSelectedYears] = useState([]);

    const [selectedMakeForModel, setSelectedMakeForModel] = useState('');
    const [selectedMakeForYear, setSelectedMakeForYear] = useState('');
    const [selectedModelForYear, setSelectedModelForYear] = useState('');
    const [yearInput, setYearInput] = useState('');

    const queryClient = useQueryClient();

    // Fetch Makes
    const { data: makes = [] } = useQuery({
        queryKey: ['makes'],
        queryFn: async () => (await api.get('/make/getMakes')).data.data,
    });

    // Fetch Models for selected make in year tab
    const { data: models = [] } = useQuery({
        queryKey: ['models', selectedMakeForYear],
        queryFn: async () => {
            if (!selectedMakeForYear) return [];
            const res = await api.get(`/model/by-make/${selectedMakeForYear}`);

            return res.data.data;
        },
        enabled: !!selectedMakeForYear,
    });
    // Fetch products
    const { data: products = [] } = useQuery({
        queryKey: ['products'],
        queryFn: async () => (await api.get('/product/')).data.data,
    });

    // Fetch models for selectedMake
    const { data: compatibilityModels = [] } = useQuery({
        queryKey: ['compatibility-models', selectedMake],
        queryFn: async () => {
            if (!selectedMake) return [];
            const res = await api.get(`/model/by-make/${selectedMake}`);
            return res.data.data;
        },
        enabled: !!selectedMake,
    });

    // Fetch years for selectedModel
    const { data: years = [] } = useQuery({
        queryKey: ['years', selectedModel],
        queryFn: async () => {
            if (!selectedModel) return [];
            const res = await api.get(`/year/getYearsByModel/${selectedModel}`);
            return res.data.data;
        },
        enabled: !!selectedModel,
    });


    // Add Make
    const addMake = useMutation({
        mutationFn: () => api.post('/make/createMake', { name: makeInput }),
        onSuccess: () => {
            queryClient.invalidateQueries(['makes']);
            setMakeInput('');
            alert('Make added successfully!');
        },
    });

    // Delete Make
    const deleteMake = useMutation({
        mutationFn: (id) => api.delete(`/make/deleteMake/${id}`),
        onSuccess: () => queryClient.invalidateQueries(['makes']),
    });

    // Add Model
    const addModel = useMutation({
        mutationFn: () => api.post('/model/createModel', {
            name: modelInput,
            makeId: selectedMakeForModel,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['makes']);
            setModelInput('');
            alert('Model added successfully!');
        },
    });

    // Add Year
    const addYear = useMutation({
        mutationFn: () => api.post('/year/createYear', {
            modelId: selectedModelForYear,
            year: yearInput,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['models', selectedMakeForYear]);
            setYearInput('');
            alert('Year added successfully!');
        },
    });
    const addCompatibility = useMutation({
        mutationFn: () => api.post('/compatibility/createCompatibility', {
            product: selectedProduct,
            make: selectedMake,
            model: selectedModel,
            years: selectedYears,
        }),
        onSuccess: () => {
            setSelectedMake('');
            setSelectedModel('');
            setSelectedYears([]);
            setSelectedProduct('');
            alert('Compatibility added successfully!');
        },
    });


    return (
        <div className="p-6 min-h-screen bg-white text-gray-800">
            <h1 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FaWrench /> Manage Compatibility
            </h1>

            <div className="flex gap-4 mb-6">
                <button onClick={() => setActiveTab('makes')} className={`px-4 py-2 w-[130px] rounded border ${activeTab === 'makes' ? 'bg-[#FF4500] text-white' : 'bg-gray-100'}`}>Makes</button>
                <button onClick={() => setActiveTab('models')} className={`px-4 py-2 w-[130px] rounded border ${activeTab === 'models' ? 'bg-[#FF4500] text-white' : 'bg-gray-100'}`}>Models</button>
                <button onClick={() => setActiveTab('years')} className={`px-4 py-2  w-[130px] rounded border ${activeTab === 'years' ? 'bg-[#FF4500] text-white' : 'bg-gray-100'}`}>Years</button>
                <button onClick={() => setActiveTab('compatibility')} className={`px-4 py-2 w-[130px] rounded border ${activeTab === 'compatibility' ? 'bg-[#FF4500] text-white' : 'bg-gray-100'}`}>Compatibility</button>

            </div>

            {activeTab === 'makes' && (
                <div>
                    <div className="flex gap-2 mb-4">
                        <input value={makeInput} onChange={(e) => setMakeInput(e.target.value)} type="text" placeholder="Enter Make (e.g. Toyota)" className="p-2 rounded border w-1/2" />
                        <button onClick={() => addMake.mutate()} className="bg-[#FF4500] text-white px-4 py-2 rounded">Add Make</button>
                    </div>
                    <div className="bg-gray-100 p-4 rounded shadow-sm">
                        <h2 className="font-semibold mb-2">Existing Makes</h2>
                        <ul>
                            {makes.map((make) => (
                                <li key={make._id} className="flex justify-between items-center border-b py-2">
                                    <span>{make.name}</span>
                                    <div className="flex gap-3">
                                        <FaEdit className="cursor-pointer text-blue-600" />
                                        <FaTrash onClick={() => deleteMake.mutate(make._id)} className="cursor-pointer text-red-500" />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {activeTab === 'models' && (
                <div>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <select onChange={(e) => setSelectedMakeForModel(e.target.value)} className="p-2 rounded border">
                            <option value="">Select Make</option>
                            {makes.map((make) => <option key={make._id} value={make._id}>{make.name}</option>)}
                        </select>
                        <input value={modelInput} onChange={(e) => setModelInput(e.target.value)} type="text" placeholder="Model Name (e.g. Supra)" className="p-2 rounded border" />
                        <div></div>
                        <button onClick={() => addModel.mutate()} className="bg-[#FF4500] text-white px-4 py-2 rounded">Add Model</button>
                    </div>

                </div>
            )}

            {activeTab === 'years' && (
                <div>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <select onChange={(e) => {
                            setSelectedMakeForYear(e.target.value);
                            setSelectedModelForYear('');
                        }} className="p-2 rounded border">
                            <option value="">Select Make</option>
                            {makes.map((make) => <option key={make._id} value={make._id}>{make.name}</option>)}
                        </select>
                        <select value={selectedModelForYear} onChange={(e) => setSelectedModelForYear(e.target.value)} className="p-2 rounded border">
                            <option value="">Select Model</option>
                            {models.map((model) => <option key={model._id} value={model._id}>{model.name}</option>)}
                        </select>
                        <input value={yearInput} onChange={(e) => setYearInput(e.target.value)} type="number" placeholder="Add Year (e.g. 2024)" className="p-2 rounded border" />
                        <button onClick={() => addYear.mutate()} className="bg-[#FF4500] text-white px-4 py-2 rounded">Add Year</button>
                    </div>
                </div>
            )}
            {activeTab === 'compatibility' && (
                <div>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <select onChange={(e) => setSelectedProduct(e.target.value)} className="p-2 rounded border">
                            <option value="">Select Product</option>
                            {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>

                        <select onChange={(e) => {
                            setSelectedMake(e.target.value);
                            setSelectedModel('');
                            setSelectedYears([]);
                        }} className="p-2 rounded border">
                            <option value="">Select Make</option>
                            {makes.map((make) => <option key={make._id} value={make._id}>{make.name}</option>)}
                        </select>

                        <select onChange={(e) => {
                            setSelectedModel(e.target.value);
                            setSelectedYears([]);
                        }} className="p-2 rounded border">
                            <option value="">Select Model</option>
                            {compatibilityModels.map((model) => <option key={model._id} value={model._id}>{model.name}</option>)}
                        </select>

                        <select multiple value={selectedYears} onChange={(e) => {
                            const options = Array.from(e.target.selectedOptions).map(o => o.value);
                            setSelectedYears(options);
                        }} className="p-2 rounded border">
                            {years.map((y) => <option key={y._id} value={y._id}>{y.year}</option>)}
                        </select>
                    </div>

                    <button
                        onClick={() => addCompatibility.mutate()}
                        disabled={!selectedProduct || !selectedMake || !selectedModel || selectedYears.length === 0}
                        className="bg-[#FF4500] text-white px-4 py-2 rounded"
                    >
                        Add Compatibility
                    </button>
                </div>
            )}

        </div>
    );
}
