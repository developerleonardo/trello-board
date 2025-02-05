import { useContext, useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import "./EditProfileModal.css";
import { TrelloBoardContext } from "../../Context";

interface EditProfileModalProps {
  closeEditProfileModal: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  closeEditProfileModal,
}: EditProfileModalProps) => {
  const {updateUsername, profileImage, updateProfileImage} = useContext(TrelloBoardContext);
  const [newProfileImage, setNewProfileImage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateUsername(name);
    updateProfileImage(newProfileImage);
    closeEditProfileModal();
  };

  return (
    <div className="overlay" onClick={closeEditProfileModal}>
      <div
        className="edit__profile__modal"
        onClick={(event) => event.stopPropagation()}
      >
        <h1 className="">Edit Profile</h1>
        <form action="" className="edit__profile__form" onSubmit={handleSave}>
          <div className="edit__profile__image">
            <img src={newProfileImage || profileImage|| "./blank-profile.png"} alt="" />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: "none" }}
              maxLength={1}
            />
            <button className="edit__profile__image__button" type="button">
              <CiEdit onClick={handleIconClick} />
            </button>
          </div>
          <label htmlFor="" className="edit__profile__name-label">
            New username
          </label>
          <input
            type="text"
            placeholder="Username"
            className="edit__profile__name"
            value={name}
            onChange={handleNameChange}
            maxLength={16}
          />
          <div className="confirmation-modal__buttons">
            <button
              type="button"
              className="button cancel-button"
              onClick={closeEditProfileModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button save-button save__button-edit"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { EditProfileModal };
