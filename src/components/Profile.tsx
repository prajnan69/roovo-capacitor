"use client";

import { useState, useEffect, useRef } from 'react';
import supabase from '@/services/api';
import { motion } from 'framer-motion';
import { useNavigation } from '@/hooks/useNavigation';
import { usePreloadedData } from '@/context/PreloadContext';

const Profile = () => {
  const { profileData, updateProfileData } = usePreloadedData();
  const { navigate } = useNavigation();
  const [profile, setProfile] = useState({
    name: '',
    dob: '',
    gender: '',
    address: '',
    email: '',
    phone: '',
    about: ''
  });
  const [hostProfilePicture, setHostProfilePicture] = useState('');
  const [travelingProfilePicture, setTravelingProfilePicture] = useState('');
const [travelingProfilePictureFile] = useState<File | null>(null);
  const [hostProfilePictureFile, setHostProfilePictureFile] = useState<File | null>(null);
  const [kycVerified, setKycVerified] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profileData) {
      setProfile({
        name: profileData.name || '',
        dob: profileData.dob || '',
        gender: profileData.gender || '',
        address: profileData.address || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        about: profileData.about || ''
      });
      setHostProfilePicture(profileData.host_profile_picture_url);
      setKycVerified(profileData.kyc_verified);
    }
  }, [profileData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleSaveProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      if (travelingProfilePictureFile) {
        await supabase.storage
          .from('profile-pictures')
          .upload(`${session.user.id}/traveling`, travelingProfilePictureFile, {
            cacheControl: '3600',
            upsert: true
          });
      }
      if (hostProfilePictureFile) {
        await supabase.storage
          .from('profile-pictures')
          .upload(`${session.user.id}/hosting`, hostProfilePictureFile, {
            cacheControl: '3600',
            upsert: true
          });
      }

      const { error } = await supabase
        .from('users')
        .update({
          name: profile.name,
          dob: profile.dob,
          gender: profile.gender,
          address: profile.address,
          email: profile.email,
          phone: profile.phone,
          about: profile.about
        })
        .eq('id', session.user.id);
      if (error) {
        console.error('Error updating profile:', error);
      } else {
        const updatedProfileData = {
          ...profileData,
          ...profile,
          host_profile_picture_url: hostProfilePicture,
          kyc_verified: kycVerified,
        };
        updateProfileData(updatedProfileData);
        setSaveStatus('Thank you!');
        setTimeout(() => {
          navigate('/hosting');
        }, 2000);
      }
    }
  };

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHostProfilePicture(reader.result as string);
        setHostProfilePictureFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSamePicture = () => {
    setTravelingProfilePicture(hostProfilePicture);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
        </header>

        {/* Profile Info */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="md:col-span-1 flex flex-col items-center">
            <input type="file" ref={fileInputRef} onChange={handleProfilePictureUpload} className="hidden" />
            <div className="flex space-x-4 mb-4">
              <div className="text-center">
                <motion.div 
                  className="w-32 h-32 bg-gray-200 border-2 border-gray-300 rounded-full flex items-center justify-center text-4xl font-bold text-gray-500 cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {travelingProfilePicture ? (
                    <img src={travelingProfilePicture} alt="Traveling Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    profile.name.charAt(0)
                  )}
                </motion.div>
                <p className="mt-2 text-sm font-medium text-gray-600">Travelling</p>
              </div>
              <div className="text-center">
                <motion.div 
                  className="w-32 h-32 bg-gray-200 border-2 border-gray-300 rounded-full cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {hostProfilePicture ? (
                    <img src={hostProfilePicture} alt="Host Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-200" />
                  )}
                </motion.div>
                <p className="mt-2 text-sm font-medium text-gray-600">Hosting</p>
              </div>
            </div>
            <button className="w-full bg-indigo-500 text-white py-2 hover:bg-indigo-600 rounded-lg" onClick={handleUseSamePicture}>
              Use same picture
            </button>
            <div className="mt-6 w-full">
              <h3 className="font-bold text-lg mb-2">Identity Verification</h3>
              <div className="p-4 border border-gray-300 bg-white rounded-lg">
                {kycVerified ? (
                  <div className="flex items-center text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>KYC Verified</span>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-2">
                      Verify your identity to build trust and enhance security.
                    </p>
                    <button className="w-full bg-indigo-500 text-white py-2 hover:bg-indigo-600 rounded-lg">
                      Get Verified
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="border border-gray-300 p-6 bg-white rounded-lg">
              <h2 className="text-2xl font-bold mb-4">{profile.name}</h2>
              <p className="text-gray-500 mb-6">Joined in 2024</p>

              <div>
                <h3 className="font-bold text-lg mb-4">Personal Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Full Name</label>
                    <input type="text" name="name" value={profile.name} onChange={handleInputChange} className="w-full bg-gray-100 border border-gray-300 p-2 mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                    <input type="text" name="dob" value={profile.dob} onChange={handleInputChange} className="w-full bg-gray-100 border border-gray-300 p-2 mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Gender</label>
                    <input type="text" name="gender" value={profile.gender} onChange={handleInputChange} className="w-full bg-gray-100 border border-gray-300 p-2 mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Address</label>
                    <input type="text" name="address" value={profile.address} onChange={handleInputChange} className="w-full bg-gray-100 border border-gray-300 p-2 mt-1" />
                  </div>
                  {profile.email !== 'imorted@roovo.com' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Email Address</label>
                      <input type="email" name="email" value={profile.email} onChange={handleInputChange} className="w-full bg-gray-100 border border-gray-300 p-2 mt-1" />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                    <input type="tel" name="phone" value={profile.phone} onChange={handleInputChange} className="w-full bg-gray-100 border border-gray-300 p-2 mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">About You</label>
                    <textarea name="about" value={profile.about} onChange={handleInputChange} rows={4} className="w-full bg-gray-100 border border-gray-300 p-2 mt-1" placeholder="Tell us something about yourself..."></textarea>
                  </div>
                </div>
                <button 
                  className="mt-6 w-full bg-indigo-500 text-white py-2 font-bold hover:bg-indigo-600 rounded-lg"
                  onClick={handleSaveProfile}
                >
                  {saveStatus || 'Save Profile'}
                </button>
                <button 
                  className="mt-4 w-full text-red-500 py-2 font-bold hover:bg-red-50 rounded-lg"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
