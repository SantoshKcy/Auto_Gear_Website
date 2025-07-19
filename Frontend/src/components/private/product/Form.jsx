import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddProduct() {
  const [dimensions, setDimensions] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    materials: [],
    colors: [],
    dimensions: [],
    price: '',
    quantity: '', // Added quantity to state
    brand: '',
    warranty: '',
    tags: [],
    images: []
  });
  const [errors, setErrors] = useState({});

  const materialOptions = [
    { value: 'Aluminum', label: 'Aluminum' },
    { value: 'Cotton', label: 'Cotton' },
    { value: 'Leather', label: 'Leather' },
    { value: 'Rubber', label: 'Rubber' },
    { value: 'Metal', label: 'Metal' },
    { value: 'Carbon Fiber', label: 'Carbon Fiber' },
    { value: 'Stainless Steel', label: 'Stainless Steel' },
    { value: 'Aluminum Alloy', label: 'Aluminum Alloy' },
    { value: 'LED', label: 'LED' },
     {value: 'Steel', label: 'Steel' },
     {value: 'Neoprene', label: 'Neoprene' },
     {value: 'Polyester Blend', label: 'Polyester Blend'},
     {value: 'Polycarbonate', label: 'Polycarbonate' },
     {value: 'ABS Plastic', label: 'ABS Plastic' },
     {value: 'Polycarbonate Lens', label: 'Polycarbonate Lens' },
    

    
  ];

  const colorsList = [
    { value: 'Matte Black', label: 'Matte Black', color: '#1C1C1C' },
    { value: 'Silver', label: 'Silver', color: '#C0C0C0' },
    { value: 'Gloss Black', label: 'Gloss Black', color: '#000000' },
    { value: 'Red', label: 'Red', color: '#FF0000' },
    { value: 'Green', label: 'Green', color: '#39FF14' },
    { value: 'Blue', label: 'Blue', color: '#00BFFF' },
    { value: 'Black', label: 'Black', color: '#000000' },
    { value: 'White', label: 'White', color: '#ffffff' },
    { value: "Gunmetal Grey", label: "Gunmetal Grey", color: "#4B4B4B" },
  ];

  const customColorOption = ({ data, innerRef, innerProps }) => (
    <div ref={innerRef} {...innerProps} className="flex items-center gap-2 p-2">
      <span style={{ backgroundColor: data.color }} className="w-4 h-4 rounded-full border" />
      {data.label}
    </div>
  );

  // Fetch categories, subcategories, and brands
  const { data: categories = [] } = useQuery({
    queryKey: ['all-categories'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/api/v1/category/getCategories', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      return res.data?.data || [];
    }
  });

  const { data: subcategories = [] } = useQuery({
    queryKey: ['all-subcategories'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/api/v1/subcategory/getSubcategories', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      return res.data?.data || [];
    }
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['all-brands'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/api/v1/brand/getBrands', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      return res.data?.data || [];
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setProduct((prev) => {
        const newTags = checked
          ? [...prev.tags, value]
          : prev.tags.filter((tag) => tag !== value);
        return { ...prev, tags: newTags };
      });
    } else if (type === 'file') {
      setProduct((prev) => ({ ...prev, images: Array.from(files) }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!product.name.trim()) newErrors.name = 'Product name required.';
    if (!product.description.trim()) newErrors.description = 'Description required.';
    if (!product.category) newErrors.category = 'Category required.';
    if (!product.subcategory) newErrors.subcategory = 'Subcategory required.';
    if (!product.brand) newErrors.brand = 'Brand required.';
    if (!product.price) newErrors.price = 'Price required.';
    if (!product.quantity && product.quantity !== '0') newErrors.quantity = 'Quantity required.'; // Added quantity validation
    if (!product.images.length) newErrors.images = 'At least one image is required.';
    if (dimensions.length > 0 && !dimensions.some(d => d.length && d.width && d.height)) {
      newErrors.dimensions = 'At least one complete dimension (length, width, height) is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createProductMutation = useMutation({
    mutationKey: ['CREATE_PRODUCT'],
    mutationFn: async () => {
      const formData = new FormData();
      Object.entries(product).forEach(([key, value]) => {
        if (key === 'images') {
          value.forEach((file) => formData.append('images', file));
        } else if (['materials', 'colors', 'tags'].includes(key)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      const dimensionArray = dimensions
        .filter(d => d.length && d.width && d.height)
        .map(d => `${d.length}x${d.width}x${d.height}`);
      formData.set('dimensions', JSON.stringify(dimensionArray));

      return axios.post('http://localhost:3000/api/v1/product/createProduct', formData, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    onSuccess: () => {
      toast.success('Product added successfully.');
      setProduct({
        name: '',
        description: '',
        category: '',
        subcategory: '',
        materials: [],
        colors: [],
        dimensions: [],
        price: '',
        quantity: '', // Reset quantity
        brand: '',
        warranty: '',
        tags: [],
        images: []
      });
      setDimensions([]);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to add product';
      toast.error(msg);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log('Submitting product:', product);
    console.log('Submitting dimensions:', dimensions.filter(d => d.length && d.width && d.height));
    createProductMutation.mutate();
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen text-black">
      <h1 className="font-semibold text-black text-xl font-bold mb-6">Add New Product</h1>
      <div className="space-y-6">
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4">1. Basic Product Information</h2>
          <div className="grid gap-4">
            <div>
              <input
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="border border-gray-300 p-3 rounded placeholder-black w-full"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Short Description"
                className="border border-gray-300 p-3 rounded h-24 placeholder-black w-full"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4">2. Category & Subcategory</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded w-full"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
            <div>
              <select
                name="subcategory"
                value={product.subcategory}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded w-full"
              >
                <option value="">Select Subcategory</option>
                {subcategories.map(sub => (
                  <option key={sub._id} value={sub._id}>{sub.name}</option>
                ))}
              </select>
              {errors.subcategory && <p className="text-red-500 text-sm mt-1">{errors.subcategory}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4">3. Product Variants & Options</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Select
              isMulti
              name="materials"
              options={materialOptions}
              value={product.materials.map(m => ({ value: m, label: m }))}
              onChange={(selected) =>
                setProduct(prev => ({
                  ...prev,
                  materials: selected.map(opt => opt.value)
                }))
              }
              isCreatable
              placeholder="Select or type materials"
              classNamePrefix="select"
              styles={{
                control: (provided) => ({
                  ...provided,
                  minHeight: '35px',
                  padding: '8px',
                  fontSize: '16px'
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  padding: '0 8px'
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: 'black'
                })
              }}
            />
            <Select
              isMulti
              name="colors"
              options={colorsList}
              value={colorsList.filter(opt => product.colors.includes(opt.value))}
              onChange={(selected) =>
                setProduct(prev => ({
                  ...prev,
                  colors: selected.map(opt => opt.value)
                }))
              }
              components={{ Option: customColorOption }}
              className="basic-multi-select text-black"
              classNamePrefix="select"
              styles={{
                control: (provided) => ({
                  ...provided,
                  minHeight: '35px',
                  padding: '8px',
                  fontSize: '16px'
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  padding: '0 8px'
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: 'black'
                })
              }}
            />
            <div>
              {dimensions.map((dim, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                  <input
                    type="text"
                    value={dim.length}
                    onChange={(e) =>
                      setDimensions((prev) => {
                        const updated = [...prev];
                        updated[index].length = e.target.value;
                        return updated;
                      })
                    }
                    placeholder="Length (cm)"
                    className="border border-gray-300 p-3 rounded placeholder-black"
                  />
                  <input
                    type="text"
                    value={dim.width}
                    onChange={(e) =>
                      setDimensions((prev) => {
                        const updated = [...prev];
                        updated[index].width = e.target.value;
                        return updated;
                      })
                    }
                    placeholder="Width (cm)"
                    className="border border-gray-300 p-3 rounded placeholder-black"
                  />
                  <input
                    type="text"
                    value={dim.height}
                    onChange={(e) =>
                      setDimensions((prev) => {
                        const updated = [...prev];
                        updated[index].height = e.target.value;
                        return updated;
                      })
                    }
                    placeholder="Height (cm)"
                    className="border border-gray-300 p-3 rounded placeholder-black"
                  />
                </div>
              ))}
              {errors.dimensions && <p className="text-red-500 text-sm mt-1">{errors.dimensions}</p>}
              <button
                type="button"
                onClick={() => {
                  const last = dimensions[dimensions.length - 1];
                  if (last && (!last.length || !last.width || !last.height)) {
                    toast.warn('Please fill the current dimension before adding a new one');
                    return;
                  }
                  setDimensions(prev => [...prev, { length: '', width: '', height: '' }]);
                }}
                className="text-blue-600 text-sm mt-2"
              >
                + Add Dimension
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4">4. Inventory & Pricing</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="Price"
                className="border border-gray-300 p-3 rounded placeholder-black w-full"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
            <div>
              <input
                type="number"
                name="quantity"
                value={product.quantity}
                onChange={handleChange}
                placeholder="Quantity"
                className="border border-gray-300 p-3 rounded placeholder-black w-full"
                min="0"
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4">5. Brand & Warranty</h2>
          <div className="grid gap-4">
            <div className="w-full md:w-1/2">
              <select
                name="brand"
                value={product.brand}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded w-full"
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand._id} value={brand._id}>{brand.name}</option>
                ))}
              </select>
              {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
            </div>
            <textarea
              name="warranty"
              value={product.warranty}
              onChange={handleChange}
              placeholder="Warranty Info"
              className="border border-gray-300 p-3 rounded h-20 placeholder-black w-full"
            />
          </div>
        </div>

        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4">6. Product Media</h2>
          <div className="flex flex-wrap gap-4">
            {product.images.map((file, index) => (
              <div key={index} className="relative w-32 h-32 border border-gray-300 rounded overflow-hidden">
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updatedImages = product.images.filter((_, i) => i !== index);
                    setProduct((prev) => ({ ...prev, images: updatedImages }));
                  }}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
            <div className="w-32 h-32 border-2 border-dashed border-gray-400 rounded flex items-center justify-center cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  setProduct((prev) => ({
                    ...prev,
                    images: [...prev.images, ...files]
                  }));
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="text-3xl text-gray-400">+</span>
            </div>
            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
          </div>
        </div>

        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4">7. Tags</h2>
          <div>
            {['Featured', 'Trending', 'Best Seller'].map((tag) => (
              <div className="mb-2" key={tag}>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    value={tag}
                    checked={product.tags.includes(tag)}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {tag}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          className="mt-4 bg-[#FF4500] text-white text-[16px] px-6 py-3 rounded flex items-center gap-2"
          disabled={createProductMutation.isLoading}
        >
          {createProductMutation.isLoading ? 'Adding...' : 'Add Product'}
        </button>
      </div>
      <ToastContainer hideProgressBar />
    </div>
  );
}