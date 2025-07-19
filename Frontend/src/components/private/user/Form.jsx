import { useEffect, useRef, useState } from 'react';
import { FaCog, FaEdit, FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import defaultProfile from '/src/assets/images/profile.png';





const Settings = () => {
    const [userData, setUserData] = useState({
        fullName: '',
        phone: '',
        email: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [profilePic, setProfilePic] = useState('');

    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch(`http://localhost:3000/api/v1/auth/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUserData({
                    fullName: `${data.data.fname} ${data.data.lname}` || '',
                    phone: data.data.phone || '',
                    email: data.data.email || '',
                    newPassword: '',
                    confirmPassword: '',
                });
                setProfilePic(data.data.image || '');


                setIsLoading(false);
            } else {
                console.error('Failed to fetch user data');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setIsLoading(false);
        }
    };

    const handleProfilePicChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('profilePicture', file);

            try {
                const userId = localStorage.getItem('userId');
                const response = await fetch(`http://localhost:3000/api/v1/auth/updateCustomer/${userId}`, {
                    method: 'PUT',
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    toast.success("Profile picture updated");
                    setProfilePic(data.data.image);

                } else {
                    toast.error("Failed to upload profile picture");
                }
            } catch (error) {
                console.error('Error uploading profile picture:', error);
            }
        }
    };



    const handleProfileUpdate = async () => {
        setIsLoading(true);
        const userId = localStorage.getItem('userId');
        const updatedData = {
            fname: userData.fullName.split(' ')[0], // Extract first name
            lname: userData.fullName.split(' ')[1], // Extract last name
            phone: userData.phone,
            email: userData.email,
        };

        try {
            const response = await fetch(`http://localhost:3000/api/v1/auth/updateCustomer/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Reached success block');
                setIsLoading(false); // First stop loading
                alert('Profile updated successfully!');
                console.log('Profile updated successfully', data);

            } else {
                console.error('Failed to update profile');
                setIsLoading(false);
                toast.error('Error updating profile!');

            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        // Validate new password length
        if (userData.newPassword.length < 6) {
            setErrorMessage('New password must be at least 6 characters.');
            return;
        }
        // Ensure passwords match
        if (userData.newPassword !== userData.confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }


        setErrorMessage(''); // Clear error message
        setIsLoading(true);

        const userId = localStorage.getItem('userId');
        const passwordData = {
            oldPassword: userData.oldPassword,  // Add old password
            newPassword: userData.newPassword
        };

        try {
            const response = await fetch(`http://localhost:3000/api/v1/auth/updatePassword/${userId}`, {
                method: 'PUT',  // Use PUT for updating
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(passwordData)  // Send both old and new password
            });

            if (response.ok) {
                const data = await response.json();
                alert('Password updated successfully!');

                setUserData((prev) => ({
                    ...prev,
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                }));


                setIsLoading(false);
            } else {
                console.error('Failed to update password');
                alert('Error updating password.');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error updating password:', error);
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>; // Show a loading state while data is being fetched or updated
    }

    return (
        <div className="max-w-7xl p-3">
            <h2 className="text-xl font-medium text-left text-black mb-8 flex items-center space-x-2">
                <FaCog className="text-black" />
                <span>Settings</span>
            </h2>

            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-6 mb-6">
                <h3 className="text-lg font-medium text-left text-black mb-4">Profile Picture</h3>
                <div className="flex justify-center mb-4">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden">
                            <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden">
                                <img
                                    src={
                                        profilePic
                                            ? `http://localhost:3000/uploads/${profilePic}`
                                            : defaultProfile
                                    }
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>


                        </div>
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="absolute bottom-0 right-0 p-2 bg-[#FF4500] text-white rounded-full"
                        >
                            <FaEdit className='bg-[#FF4500]' />
                        </button>
                    </div>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />
            </div>

            {/* Profile Update Form */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-6 mb-6">
                <h3 className="text-lg font-medium text-left text-black mb-4">Profile Information</h3>
                <form>
                    <div className="mb-4">
                        <label htmlFor="fullName" className="block text-sm font-medium text-black">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            value={userData.fullName}
                            onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                            className="mt-1 p-2 w-full text-black border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-black">Phone Number</label>
                        <input
                            type="text"
                            id="phone"
                            value={userData.phone}
                            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                            className="mt-1 p-2 w-full text-black border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-black">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={userData.email}
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                            className="mt-1 p-2 w-full border text-black border-gray-300 rounded-md"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleProfileUpdate}
                        className=" py-2 px-4 bg-[#FF4500] w-[140px] text-white rounded-md"
                    >
                        Update Profile
                    </button>
                </form>
            </div>

            {/* Password Change Form */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-6 mb-6">
                <h3 className="text-lg font-medium text-left text-black mb-4">Change Password</h3>
                <form>
                    <div className="mb-4 relative">
                        <label htmlFor="oldPassword" className="block text-sm font-medium text-black">Old Password</label>
                        <input
                            type={showOldPassword ? "text" : "password"}
                            id="oldPassword"
                            value={userData.oldPassword}
                            onChange={(e) => setUserData({ ...userData, oldPassword: e.target.value })}
                            className="mt-1 p-2 w-full border border-gray-300 text-black rounded-md pr-10"
                        />
                        <div
                            className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                            {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>

                    <div className="mb-4 relative">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-black">New Password</label>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            id="newPassword"
                            value={userData.newPassword}
                            onChange={(e) => setUserData({ ...userData, newPassword: e.target.value })}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md pr-10 text-black"
                        />
                        <div
                            className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>

                    <div className="mb-4 relative">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-black">Confirm Password</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            value={userData.confirmPassword}
                            onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md pr-10 text-black"
                        />
                        <div
                            className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                        {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
                    </div>


                    <button
                        type="button"
                        onClick={handlePasswordChange}
                        className=" py-2 px-4 bg-[#FF4500] text-white rounded-md "
                    >
                        Change Password
                    </button>
                </form>

            </div>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar toastClassName="z-[9999]" />
        </div>
    );
};

export default Settings;