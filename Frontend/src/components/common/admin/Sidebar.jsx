import { Button } from '@/components/common/ui/button';
import { cn } from '@/lib/utils';
import { CarFront, Info, ListOrdered, ListPlus, SlidersHorizontal, Tags, Wrench } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaBoxes, FaCar, FaChevronDown, FaChevronRight, FaClipboardList, FaCog, FaHome, FaListAlt, FaPlusCircle, FaTags, FaThList, FaUser } from 'react-icons/fa'; // Add any other icons you need
import { useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
    {
        title: 'Dashboard',
        icon: FaHome,
        path: '/admin/dashboard',
    },

    {
        title: 'Products',
        icon: FaBoxes,
        subMenu: [
            { title: 'All Products', icon: FaListAlt, path: '/admin/product/all-products' },
            { title: 'Add Product', icon: FaPlusCircle, path: '/admin/product/add-product' },
        ],
    },

    {
        title: 'Categories',
        icon: Tags,
        subMenu: [
            { title: 'All Categories', icon: FaThList, path: '/admin/category/all-categories' },
            { title: 'Add Category', icon: ListPlus, path: '/admin/category/add-category' },
        ],
    },

    {
        title: 'Subcategories',
        icon: SlidersHorizontal,
        subMenu: [
            { title: 'All Subcategories', icon: ListOrdered, path: '/admin/subcategory/all-subcategories' },
            { title: 'Add Subcategory', icon: FaPlusCircle, path: '/admin/subcategory/add-subcategory' },
        ],
    },

    {
        title: 'Brands',
        icon: FaTags,
        subMenu: [
            { title: 'All Brands', icon: FaListAlt, path: '/admin/brand/all-brands' },
            { title: 'Add Brand', icon: FaPlusCircle, path: '/admin/brand/add-brand' },
        ],
    },

    {
        title: 'Manage Compatibility',
        icon: Wrench,
        path: '/admin/manage-compatibility',
    },

    {
        title: 'Car Models',
        icon: CarFront,
        subMenu: [
            { title: 'All Models', icon: FaCar, path: '/admin/model/all-models' },
            { title: 'Add Model', icon: FaPlusCircle, path: '/admin/model/add-model' },
        ],
    },

    {
        title: 'Orders',
        icon: FaClipboardList,
        path: '/admin/total-orders',


    },
    {
        title: 'Bookings',
        icon: FaClipboardList,
        path: '/admin/all-booking',


    },
    { title: 'Support', icon: Info, path: '/admin/support' },
    { title: 'Users', icon: FaUser, path: '/admin/users' },
    { title: 'Setting', icon: FaCog, path: '/admin/setting' },


];

export default function Sidebar({ collapsed, setCollapsed }) {
    const navigate = useNavigate();
    const location = useLocation();  // Get the current path
    const [openSubMenu, setOpenSubMenu] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedSubMenu, setSelectedSubMenu] = useState(null);

    useEffect(() => {
        // Update selectedItem and selectedSubMenu based on the current location (path)
        const path = location.pathname;
        const foundItem = menuItems.find((item, index) => item.path === path || item.subMenu?.some(subItem => subItem.path === path));

        if (foundItem) {
            setSelectedItem(menuItems.indexOf(foundItem));
            // Optionally, set selectedSubMenu if it's a submenu
            const foundSubMenu = foundItem.subMenu?.find((subItem, subIndex) => subItem.path === path);
            if (foundSubMenu) {
                setSelectedSubMenu(foundItem.subMenu.indexOf(foundSubMenu));
            }
        }
    }, [location]);

    const toggleSubMenu = (index) => {
        setOpenSubMenu(openSubMenu === index ? null : index);
    };

    const handleItemClick = (index, path) => {
        setSelectedItem(index);
        setSelectedSubMenu(null);
        toggleSubMenu(index);
        if (path) navigate(path); // Navigate to the path
    };

    const handleSubMenuClick = (index, subIndex, path) => {
        setSelectedSubMenu(subIndex);
        setSelectedItem(index);
        if (path) navigate(path); // Navigate to the path
    };

    return (
        <div className={cn('fixed h-screen bg-gray-900 text-white flex flex-col', { 'w-64': !collapsed, 'w-20': collapsed })}>
            <div className="flex items-center justify-between p-4">
                {!collapsed && <span className="text-lg font-semibold">Admin Panel</span>}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className="transition-transform ml-auto"
                >
                    {collapsed ? <FaArrowRight /> : <FaArrowLeft />}
                </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
                {menuItems.map((item, index) => (
                    <div key={index}>
                        <Button
                            variant="ghost"
                            className={cn('w-full flex items-center justify-between p-3', {
                                'text-[#FF4500] bg-gray-800': selectedItem === index,
                                'text-white bg-transparent': selectedItem !== index,
                                'hover:text-[#FF4500] hover:bg-transparent': true,
                            })}
                            onClick={() => handleItemClick(index, item.path)}
                        >
                            <div className="flex items-center">
                                <item.icon className={cn('text-xl mr-3', { 'text-[#FF4500]': selectedItem === index })} />
                                {!collapsed && <span>{item.title}</span>}
                            </div>
                            {!collapsed && item.subMenu && (
                                <span>
                                    {openSubMenu === index ? <FaChevronDown /> : <FaChevronRight />}
                                </span>
                            )}
                        </Button>
                        {item.subMenu && openSubMenu === index && (
                            <div className="ml-6 border-l border-gray-600">
                                {item.subMenu.map((subItem, subIndex) => (
                                    <Button
                                        key={subIndex}
                                        variant="ghost"
                                        className={cn('w-full flex items-center justify-start p-2', {
                                            'text-[#FF4500] bg-gray-800': selectedSubMenu === subIndex,
                                            'text-white bg-transparent': selectedSubMenu !== subIndex,
                                            'hover:text-[#FF4500] hover:bg-transparent': true,
                                        })}
                                        onClick={() => handleSubMenuClick(index, subIndex, subItem.path)}
                                    >
                                        <subItem.icon className="text-xl mr-3" />
                                        {!collapsed && <span>{subItem.title}</span>}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}