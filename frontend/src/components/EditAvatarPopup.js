import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, isLoading }) {
  const avatarRef = React.useRef();
  const buttonText = isLoading ? "Сохранение..." : "Сохранить";

  React.useEffect(() => {
    avatarRef.current.value = "";
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar({
      link: avatarRef.current.value,
    });
  }

  return (
    <PopupWithForm
      name={"avatar"}
      title={"Обновить аватар"}
      buttonTitle={buttonText}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label className="popup__form-label">
          <input ref={avatarRef} name="link" id="avatarlink" type="url" className="popup__input popup__input_type_link" placeholder="Ссылка на аватар" required />
          <span id="avatarlink-error" className=""></span>
      </label>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;