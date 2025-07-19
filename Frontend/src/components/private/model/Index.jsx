import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Car } from 'lucide-react';

// Add this for model-viewer if not already in your project
// <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>

const AllCarModels = () => {
    const { data: carModels = [], isLoading } = useQuery({
        queryKey: ['all-years'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:3000/api/v1/year/getYears');
            return res.data.data;
        }
    });

    if (isLoading) return <div className="p-6">Loading car models...</div>;

    return (
        <div className="p-8 bg-white min-h-screen text-black">
            <div className="flex items-center gap-2 mb-6">
                <Car className="text-black" />
                <h2 className="text-2xl font-semibold">All Car Models</h2>
            </div>

            <div className="overflow-x-auto text-[16px]">
                <table className="w-full border border-gray-300 text-[16px]">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 border">Make</th>
                            <th className="px-4 py-2 border">Model</th>
                            <th className="px-4 py-2 border">Year</th>
                            <th className="px-4 py-2 border">Vehicle Image</th>
                            <th className="px-4 py-2 border">3D Asset</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carModels.map((entry) => (
                            <tr key={entry._id} className="text-center">
                                <td className="px-4 py-2 border">{entry.make?.name || 'N/A'}</td>
                                <td className="px-4 py-2 border">{entry.model?.name || 'N/A'}</td>
                                <td className="px-4 py-2 border">{entry.year}</td>
                                <td className="px-4 py-2 border">
                                    {entry.vehicleImage ? (
                                        <img
                                            src={`http://localhost:3000/uploads/${entry.vehicleImage}`}
                                            alt="Vehicle"
                                            className="w-24 h-16 object-cover mx-auto rounded"
                                        />
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                                <td className="px-6 py-2 border">
                                    {entry.customizerAsset ? (
                                        <div className="flex justify-center items-center">
                                            <model-viewer
                                                src={`http://localhost:3000/uploads/${entry.customizerAsset}`}
                                                alt="3D model"
                                                auto-rotate
                                                camera-controls
                                                style={{ width: '120px', height: '130px' }}
                                            ></model-viewer>
                                        </div>
                                    ) : (
                                        'N/A'
                                    )}
                                </td>

                            </tr>
                        ))}
                        {carModels.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center py-4">
                                    No car models found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllCarModels;
