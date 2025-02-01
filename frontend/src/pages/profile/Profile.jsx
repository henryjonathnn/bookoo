import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Camera, Calendar, BookOpen, Clock } from 'react-feather';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import { API_CONFIG } from '../../config/api.config';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { usePeminjaman } from '../../hooks/usePeminjaman';
import StatusBadge from '../../components/modules/admin/StatusBadge';
import HistoryContent from './HistoryContent';

const Profile = () => {
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const { getUserPeminjaman } = usePeminjaman();
  const [historyPeminjaman, setHistoryPeminjaman] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    bio: ''
  });

  const fetchHistoryPeminjaman = async () => {
    if (activeTab === 'history')
      setHistoryLoading(true)
    try {
      const response = await getUserPeminjaman();
      setHistoryPeminjaman(response.peminjaman || [])
    } catch (error) {
      toast.error('Failed to fetch history peminjaman');
      console.error(error)
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    fetchHistoryPeminjaman()
  }, [activeTab])


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

  const stats = [
    { icon: <BookOpen className="w-5 h-5" />, label: 'Buku Dipinjam', value: '12' },
    { icon: <Clock className="w-5 h-5" />, label: 'Sedang Dipinjam', value: '3' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Bergabung', value: format(new Date(user?.createdAt || new Date()), 'MMMM yyyy', { locale: id }) }
  ];

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header Card */}
        <div className="relative bg-gradient-to-br from-purple-600/90 to-indigo-600/90 rounded-3xl p-8 mb-6 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/path/to/pattern.svg')] opacity-10"></div>

          <div className="relative flex items-center gap-8">
            {/* Profile Image */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white/20 bg-purple-700">
                {user?.profile_img ? (
                  <img
                    src={`${API_CONFIG.baseURL}${user.profile_img}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={48} className="text-white/70" />
                  </div>
                )}
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{user?.name}</h1>
              <p className="text-white/70 mb-4">{user?.email}</p>
              <div className="flex gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-white/70 mb-1">
                      {stat.icon}
                      <span className="text-sm">{stat.label}</span>
                    </div>
                    <p className="text-white font-semibold">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-[#1A1A2E] rounded-3xl border border-purple-500/10 overflow-hidden">
          <div className="flex border-b border-purple-500/10">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 px-6 py-4 text-sm font-medium ${activeTab === 'profile'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-purple-400'
                }`}
            >
              Informasi Profil
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-6 py-4 text-sm font-medium ${activeTab === 'history'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-purple-400'
                }`}
            >
              Riwayat Peminjaman
            </button>
          </div>

          <div className="p-6">
            {loading ? (
              <LoadingSpinner size="small" />
            ) : activeTab === 'profile' ? (
              <div className="space-y-6">
                {/* Profile Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-sm text-gray-400">Username</span>
                      <div className="mt-1 relative">
                        <input
                          type="text"
                          name="username"
                          value={profileData.username}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full bg-purple-500/5 border border-purple-500/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                        <User className="absolute right-4 top-3.5 w-5 h-5 text-purple-400" />
                      </div>
                    </label>

                    <label className="block">
                      <span className="text-sm text-gray-400">Email</span>
                      <div className="mt-1 relative">
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full bg-purple-500/5 border border-purple-500/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                        <Mail className="absolute right-4 top-3.5 w-5 h-5 text-purple-400" />
                      </div>
                    </label>
                  </div>

                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-sm text-gray-400">Nomor Telepon</span>
                      <div className="mt-1 relative">
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full bg-purple-500/5 border border-purple-500/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                        <Phone className="absolute right-4 top-3.5 w-5 h-5 text-purple-400" />
                      </div>
                    </label>

                    <label className="block">
                      <span className="text-sm text-gray-400">Alamat</span>
                      <div className="mt-1 relative">
                        <input
                          type="text"
                          name="address"
                          value={profileData.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full bg-purple-500/5 border border-purple-500/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                        <MapPin className="absolute right-4 top-3.5 w-5 h-5 text-purple-400" />
                      </div>
                    </label>
                  </div>
                </div>

                {/* Bio Field */}
                <label className="block">
                  <span className="text-sm text-gray-400">Bio</span>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="4"
                    className="mt-1 w-full bg-purple-500/5 border border-purple-500/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </label>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveProfile}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl px-6 py-3 flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                      >
                        <Save className="w-5 h-5" />
                        Simpan Perubahan
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-gray-500/10 text-gray-300 rounded-xl px-6 py-3 flex items-center justify-center gap-2 hover:bg-gray-500/20 transition-all"
                      >
                        <X className="w-5 h-5" />
                        Batal
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 bg-purple-500/10 text-purple-400 rounded-xl px-6 py-3 flex items-center justify-center gap-2 hover:bg-purple-500/20 transition-all"
                    >
                      <Edit2 className="w-5 h-5" />
                      Edit Profil
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <HistoryContent
                historyPeminjaman={historyPeminjaman}
                historyLoading={historyLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;