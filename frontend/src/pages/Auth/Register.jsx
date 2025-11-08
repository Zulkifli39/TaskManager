import React, {useState, useContext} from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import {validateEmail} from "../../utils/helper";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import Input from "../../components/inputs/Input";
import {Link, useNavigate} from "react-router-dom";

import axiosInstance from "../../utils/axiosInstance";
import uploadImage from "../../utils/uploadImage";
import {API_PATHS} from "../../utils/apiPaths";
import {UserContext} from "../../context/useContext";

const Register = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const {updateUser} = useContext(UserContext);

  const handleRegister = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter a full name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setError("");

    // Register Api Call
    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken,
      });

      const {token, role} = response.data;

      if (token) {
        localStorage.setItem("accessToken", token);
        updateUser(response.data);

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <AuthLayout>
        <div className="lg:w-full h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center ">
          <h3 className="text-xl font-semibold text-black">Create an Account</h3>
          <p className="text-xs text-slate-700 mt-[5px] mb-6">Join us today by entering your details below</p>

          <form onSubmit={handleRegister}>
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              <Input
                value={fullName}
                onChange={({target}) => setFullName(target.value)}
                label="Full Name"
                type="text"
                placeholder="Muhamad Zulkifli"
              />

              <Input
                value={email}
                onChange={({target}) => setEmail(target.value)}
                label="Email Address"
                type="text"
                placeholder="john@placeholder.com"
              />

              <Input
                value={password}
                onChange={({target}) => setPassword(target.value)}
                label="Password"
                type="password"
                placeholder="Min 8 Characters"
              />

              <Input
                value={adminInviteToken}
                onChange={({target}) => setAdminInviteToken(target.value)}
                label="Admin Invite Token"
                type="text"
                placeholder="6 Digit Token"
              />
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <button
              type="submit"
              className="btn-primary w-full text-white py-2 rounded-md mt-4 hover:bg-blue-600 transition">
              Register
            </button>
            <p className="text-[13px] text-slate-800 mt-3">
              Already an account?
              <Link to="/login" className="font-medium text-primary underline ml-1">
                Login
              </Link>
            </p>
          </form>
        </div>
      </AuthLayout>
    </>
  );
};

export default Register;
