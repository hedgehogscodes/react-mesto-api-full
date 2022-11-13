import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ isOpen, onClose, onAddPlace, isLoading}) {
  const [title, setTitle] = React.useState("");
  const [link, setLink] = React.useState("");
  const buttonText = isLoading ? "Создание..." : "Создать";

  React.useEffect(() => {
    setTitle("");
    setLink("");
  }, [isOpen]);

  function handleTitleChange(e) {
    setTitle(e.target.value);
  }

  function handleLinkChange(e) {
    setLink(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({ title, link });
  }

  return (
    <PopupWithForm
      name={"add"}
      title={"Новое место"}
      buttonTitle={buttonText}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
       <label className="popup__form-label">
          <input value={title || ""} onChange={handleTitleChange} name="title" id="title" type="text" className="popup__input popup__input_type_title" autoComplete="off" placeholder="Название" minLength="2" maxLength="30" required/>
          <span id="title-error" className=""></span>
        </label>
        <label className="popup__form-label">
          <input value={link || ""} onChange={handleLinkChange} name="link" id="link" type="url" className="popup__input popup__input_type_link" placeholder="Ссылка на картинку" required />
          <span id="link-error" className=""></span>
        </label>
    </PopupWithForm>
  );
}

export default AddPlacePopup;