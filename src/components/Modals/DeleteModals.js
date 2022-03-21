import ReactModal from "react-modal";

function DeleteModal({
  showModal,
  title,
  itemName,
  itemId,
  deleteHandler,
  cancelHandler,
}) {
  const modalStyle = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(243, 244, 246, 0.75)",
    },
    content: {
      position: "absolute",
      height: "fit-content",
      minWidth: "fit-content",
      maxWidth: "30rem",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      margin: "auto",
      marginLeft: "auto",
      marginRight: "auto",
      border: "1px solid #ccc",
      background: "#fff",
      overflow: "auto",
      WebkitOverflowScrolling: "touch",
      borderRadius: "4px",
      outline: "none",
      padding: "0",
    },
  };

  return (
    <ReactModal isOpen={showModal} ariaHideApp={false} style={modalStyle}>
      <div className="">
        <div className="p-2 bg-red-500 text-white font-semibold text-xl">
          <p>{title}</p>
        </div>
        <div className="my-11 p-2">
          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{itemName}</span> ?
          </p>
        </div>
        <div className="p-2 flex justify-end gap-2 border-t">
          <button
            className="rounded p-1 bg-gray-400 hover:bg-gray-500 text-white"
            onClick={() => {
              cancelHandler();
            }}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 rounded p-1 text-white"
            onClick={() => {
              deleteHandler(itemId);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </ReactModal>
  );
}

export default DeleteModal;
