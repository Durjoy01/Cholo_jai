import React, { useState, useEffect } from "react";
import { useUserContext } from "./UserContext";

const ProfileDetails = () => {
    const { user } = useUserContext();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = user?.id;

        if (!userId) {
            alert('User ID is not defined. Please log in again.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/users/update/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                alert('Failed to update profile.');
                return;
            }

            alert('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating the profile.');
        }
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">My Profile</h2>
            <div className="flex items-center mb-6">
                <img
                    src="default-profile.png"
                    alt="Profile"
                    className="h-24 w-24 rounded-full mr-4"
                />
                <div>
                    <p className="text-xl font-semibold">{user?.name}</p>
                    <p className="text-gray-600">{user?.email}</p>
                </div>
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center">
                        <label className="w-1/4 text-gray-700 font-medium">Full Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="text-gray-800 border rounded p-2 w-3/4"
                            required
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="w-1/4 text-gray-700 font-medium">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            className="text-gray-800 border rounded p-2 w-3/4"
                            disabled
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="w-1/4 text-gray-700 font-medium">Phone:</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="text-gray-800 border rounded p-2 w-3/4"
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="w-1/4 text-gray-700 font-medium">Address:</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="text-gray-800 border rounded p-2 w-3/4"
                        />
                    </div>

                    <button type="submit" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Save Changes
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="mt-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                </form>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center">
                        <label className="w-1/4 text-gray-700 font-medium">Phone:</label>
                        <p className="text-gray-800">{user?.phone || "Not provided"}</p>
                    </div>

                    <div className="flex items-center">
                        <label className="w-1/4 text-gray-700 font-medium">Address:</label>
                        <p className="text-gray-800">{user?.address || "Not provided"}</p>
                    </div>

                    <button
                        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Profile
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileDetails;
