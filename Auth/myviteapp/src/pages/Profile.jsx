import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../component/Layout';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/user/profile", { withCredentials: true })
      .then((res) => {
          setUser(res.data.user);
      })
      .catch((e) => {
        console.error("Error while getting data", e);
        navigate('/login');

      });
  }, []);

  return (
  
    <Layout>

        <div className="bg-gradient-to-br from-gray-100 to-white py-20 sm:py-28">
  <div className="mx-auto max-w-6xl px-6 lg:px-8">
    <div className="grid xl:grid-cols-3 gap-10">
      {user ? (
        <div className="group relative bg-white border border-gray-200 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition duration-300">
          <div className="flex items-center gap-6">
            <img
              alt="User"
              src="https://tse4.mm.bing.net/th/id/OIP.cEie_pmgXcu1Blpul3mrfgHaFj?rs=1&pid=ImgDetMain&o=7&rm=3"
              className="w-24 h-24 rounded-full object-cover border-4 border-teal-500 group-hover:scale-105 transition duration-300"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
                {user.name}
              </h3>
              <p className="text-sm font-medium text-teal-600">
                {user.email}
              </p>
            </div>
          </div>

        </div>
      ) : (
        <p className="text-center text-gray-500 text-base col-span-full">No user found.</p>
      )}
    </div>
  </div>
</div>

</Layout>

  );
};

export default Profile;
