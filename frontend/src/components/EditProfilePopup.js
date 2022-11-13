import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isLoading}) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const currentUser = React.useContext(CurrentUserContext);
  const buttonText = isLoading ? "Сохранение..." : "Сохранить";

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateUser({
      name,
      status: description,
    });
  }

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  return (
    <PopupWithForm
      name={"edit"}
      title={"Редактировать профиль"}
      buttonTitle={buttonText}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label className="popup__form-label">
          <input onChange={handleNameChange} value={name || ""} name="name" id="name" type="text" className="popup__input popup__input_type_name" autoComplete="off" placeholder="Имя" minLength="2" maxLength="40" required />
          <span id="name-error" className=""></span>
        </label>
        <label className="popup__form-label">
          <input onChange={handleDescriptionChange} value={description || ""} name="status" id="status" type="text" className="popup__input popup__input_type_status" autoComplete="off" placeholder="Статус" minLength="2" maxLength="200" required />
          <span id="status-error" className=""></span>
        </label>
    </PopupWithForm>
  );
}

export default EditProfilePopup;