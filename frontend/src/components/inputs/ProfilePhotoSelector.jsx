import React, {useState, useRef} from "react";
import {LuUser, LuUpload, LuTrash} from "react-icons/lu";

const ProfilePhotoSelector = ({image, setImage}) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Ketika user memilih file
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  // Hapus gambar yang dipilih
  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  // Buka file explorer
  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex justify-center mb-8 ">
      <input type="file" accept="image/*" ref={inputRef} onChange={handleImageChange} className="hidden" />

      {!image ? (
        <div className="w-24 h-24 flex items-center justify-center bg-blue-100/50 rounded-full relative cursor-pointer">
          <LuUser className="text-5xl text-primary" />
          <button
            type="button"
            onClick={onChooseFile}
            className="w-9 h-9 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 hover:bg-blue-600 transition">
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img src={previewUrl} alt="profile" className="w-24 h-24 rounded-full object-cover" />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="w-9 h-9 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 hover:bg-red-600 transition">
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
