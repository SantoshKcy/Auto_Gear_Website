import { useEffect, useRef, useState } from 'react';
import { FaEdit, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../common/customer/Footer';
import Navbar from '../common/customer/Navbar';
import SidebarNav from '../common/customer/SidebarNav';
import defaultProfile from '/src/assets/images/profile.png';




export default function Profile() {
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
        <>
            <Navbar />
            <div className="min-h-screen bg-[#101010] text-white font-rajdhani px-6 md:px-10 py-10 flex flex-col md:flex-row gap-10">
                <SidebarNav />

                <div className="bg-[#1E1E1E] rounded p-6 w-full md:w-3/4 space-y-8">
                    {/* Profile Info */}
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
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePicChange}
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                        />
                    </div>


                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
                        <p className="text-gray-400 mb-4 text-sm">Update your profile information below.</p>
                        <form className="space-y-4">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={userData.fullName}
                                onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                                className="w-full p-3 rounded bg-[#101010] border border-gray-600 text-white placeholder-gray-400"
                            />
                            <input
                                type="text"
                                placeholder="Phone Number"
                                value={userData.phone}
                                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                className="w-full p-3 rounded bg-[#101010] border border-gray-600 text-white placeholder-gray-400"
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={userData.email}
                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                className="w-full p-3 rounded bg-[#101010] border border-gray-600 text-white placeholder-gray-400"
                            />
                            <button
                                type="button"
                                onClick={handleProfileUpdate}
                                className="bg-[#FF4500] hover:bg-[#e63b00] text-white py-2 rounded"
                                style={{ width: '160px', fontSize: '18px' }}
                            >
                                Update Profile
                            </button>
                        </form>

                    </div>


                    {/* Change Password */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
                        <p className="text-gray-400 mb-4 text-sm">Update your password securely.</p>
                        <form className="space-y-4">
                            {/* Old Password */}
                            <div className="relative">
                                <input
                                    type={showOldPassword ? "text" : "password"}
                                    placeholder="Current Password"
                                    value={userData.oldPassword}
                                    onChange={(e) => setUserData({ ...userData, oldPassword: e.target.value })}
                                    className="w-full p-3 rounded bg-[#101010] border border-gray-600 text-white placeholder-gray-400 pr-10"
                                />
                                <div
                                    className="absolute right-3 top-3.5 cursor-pointer text-gray-400"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                >
                                    {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>

                            {/* New Password */}
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    value={userData.newPassword}
                                    onChange={(e) => setUserData({ ...userData, newPassword: e.target.value })}
                                    className="w-full p-3 rounded bg-[#101010] border border-gray-600 text-white placeholder-gray-400 pr-10"
                                />
                                <div
                                    className="absolute right-3 top-3.5 cursor-pointer text-gray-400"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm New Password"
                                    value={userData.confirmPassword}
                                    onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                                    className="w-full p-3 rounded bg-[#101010] border border-gray-600 text-white placeholder-gray-400 pr-10"
                                />
                                <div
                                    className="absolute right-3 top-3.5 cursor-pointer text-gray-400"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </div>
                                {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
                            </div>

                            <button
                                type="button"
                                onClick={handlePasswordChange}
                                className="bg-[#FF4500] hover:bg-[#e63b00] text-white py-2 rounded"
                                style={{ width: '160px', fontSize: '18px' }}
                            >
                                Change Password
                            </button>
                        </form>

                    </div>
                </div>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar toastClassName="z-[9999]" />
            </div>
            <Footer />
        </>
    );
}
