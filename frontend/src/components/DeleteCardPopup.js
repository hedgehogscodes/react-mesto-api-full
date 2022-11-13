import React from "react";
import PopupWithForm from "./PopupWithForm";

function DeleteCardPopup({ card, isOpen, onClose, onCardDelete, isLoading }) {
  const buttonText = isLoading ? "Удаление..." : "Да";

  const handleSubmit = (e) => {
    e.preventDefault();
    onCardDelete(card);
  };

  return (
    <PopupWithForm
      name={"confirm"}
      title={"Вы уверены?"}
      buttonTitle={buttonText}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    />
  );
}

export default DeleteCardPopup;