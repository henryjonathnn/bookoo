import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, X } from 'react-feather';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import { API_CONFIG } from '../../config/api.config';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    bio: ''
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!loading && user && user.id) {
        try {
          const userData = await userService.getUserById(user.id);
          setProfileData({
            username: userData.username || '',
            email: userData.email || '',
            phone: userData.phone || '',
            address: userData.address || '',
            bio: userData.bio || ''
          });
        } catch (error) {
          toast.error('Failed to fetch profile data');
          console.error(error);
        }
      }
    };
    fetchUserDetails();
  }, [user, loading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      await userService.updateUser(user.id, profileData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    }
  };

  const renderProfileField = (icon, name, value, placeholder) => (
    <div className="flex items-center space-x-4 mb-4">
      {icon}
      {isEditing ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="flex-1 bg-[#1A1A2E] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-purple-500/10"
        />
      ) : (
        <p className="text-gray-300">{value || placeholder}</p>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 mt-20">
      <div className="max-w-2xl mx-auto bg-[#1A1A2E] rounded-2xl shadow-xl border border-purple-500/10 p-8">
        {/* Profile Image */}
        <div className="relative mx-auto w-32 h-32 mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500">
            {user?.profile_img ? (
              <img
                src={`${API_CONFIG.baseURL}${user.profile_img}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-purple-500 flex items-center justify-center">
                <User size={64} className="text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Profile Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">{user?.username}</h1>
          <p className="text-gray-400">{user?.email}</p>
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          {renderProfileField(<User size={20} className="text-purple-400" />, "username", profileData.username, "No username")}
          {renderProfileField(<Mail size={20} className="text-purple-400" />, "email", profileData.email, "No email")}
          {renderProfileField(<Phone size={20} className="text-purple-400" />, "phone", profileData.phone, "No phone number")}
          {renderProfileField(<MapPin size={20} className="text-purple-400" />, "address", profileData.address, "No address")}
          <div className="flex items-start space-x-4 mb-4">
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              placeholder="No bio"
              disabled={!isEditing}
              className={`flex-1 bg-[#1A1A2E] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-purple-500/10 ${isEditing ? '' : 'cursor-default'}`}
              rows={3}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-6">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveProfile}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 rounded-xl font-medium transition-all duration-300 px-6 py-3 flex items-center justify-center"
              >
                <Save size={20} className="mr-2" /> Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-all duration-300 px-6 py-3 flex items-center justify-center"
              >
                <X size={20} className="mr-2" /> Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 rounded-xl font-medium transition-all duration-300 px-6 py-3 flex items-center justify-center"
            >
              <Edit size={20} className="mr-2" /> Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;