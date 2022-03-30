import ReactModal from "react-modal";
import { XIcon, TrashIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../api/api";
import LoadingSpinner from "../Common/LoadingSpinner";
import { toast } from "react-toastify";

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
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    position: "absolute",
    minHeight: "fit-content",
    maxHeight: "80%",
    minWidth: "fit-content",
    maxWidth: "40rem",
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

function CommentsModal({
  showModal,
  workoutId,
  cancelHandler,
  currentUserName,
  comments,
  setComments,
}) {
  const [commentInput, setCommentInput] = useState("");
  const [loading, setLoading] = useState(false);

  const postComment = async () => {
    let body = {
      workout_id: workoutId,
      posted_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      body: commentInput.trim(),
    };

    try {
      const { token } = JSON.parse(sessionStorage.getItem("token"));
      const { data } = await api.post(`/comments/${workoutId}`, body, {
        headers: {
          Authorization: "Basic " + token,
        },
      });
      toast.success(`${data.message}`, {
        position: "bottom-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      await getComments(workoutId);
      setCommentInput("");
    } catch (error) {
      console.log(error);
    }
  };

  const getComments = async (workoutId) => {
    try {
      setLoading(true);
      const { token } = JSON.parse(sessionStorage.getItem("token"));
      const { data } = await api.get(`/comments/${workoutId}`, {
        headers: {
          Authorization: "Basic " + token,
        },
      });
      setComments(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (comment_id) => {
    try {
      const { token } = JSON.parse(sessionStorage.getItem("token"));
      const { data } = await api.delete(
        `/comments/${workoutId}/${comment_id}`,
        {
          headers: {
            Authorization: "Basic " + token,
          },
        }
      );
      await getComments(workoutId);
      toast.success(`${data.message}`, {
        position: "bottom-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return (
    <ReactModal isOpen={showModal} ariaHideApp={false} style={modalStyle}>
      <div className="">
        <div className="p-2 font-semibold text-xl flex sticky top-0 bg-white">
          <p className="flex-auto">Comments:</p>
          <button onClick={() => cancelHandler()}>
            <XIcon className="hover:text-blue-500 h-5 w-5" />
          </button>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="p-2">
            {comments.length > 0 ? (
              comments.map((comment) => {
                return (
                  <div
                    key={comment.comment_id}
                    className="flex flex-col border mb-1 p-1"
                  >
                    <div className="flex">
                      <div className="flex gap-2 flex-auto">
                        <Link
                          className="font-semibold hover:text-blue-500"
                          to={`/users/${comment.user_name}`}
                        >
                          {comment.user_name}
                        </Link>{" "}
                        |<p className="font-semibold">{comment.posted_date}</p>
                      </div>
                      {comment.user_name === currentUserName && (
                        <button
                          title="Delete Comment"
                          onClick={() => {
                            deleteComment(comment.comment_id);
                          }}
                        >
                          <TrashIcon className="h-5 w-5 hover:text-blue-500" />
                        </button>
                      )}
                    </div>
                    <p className="font-light">{comment.body}</p>
                  </div>
                );
              })
            ) : (
              <p>No comments have been posted on this workout.</p>
            )}
          </div>
        )}

        <div className="p-2 flex gap-2 sticky bottom-0 bg-white">
          <textarea
            className="flex-auto resize-none light-border"
            rows="2"
            value={commentInput}
            onChange={(event) => {
              setCommentInput(event.target.value);
            }}
          ></textarea>
          <div className="self-end">
            <button
              title="Post Comment"
              className={
                commentInput.trim().length > 0
                  ? "btn shadow-none"
                  : "btn-secondary shadow-none"
              }
              disabled={commentInput.trim().length === 0 ? true : false}
              onClick={() => {
                postComment();
              }}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}

export default CommentsModal;
