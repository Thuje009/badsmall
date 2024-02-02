// MyEditor.js

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../context/authContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import Draggable from "react-draggable";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import * as noteActions from "../../actions/user";
import "./MyEditor.css"; // Import styles from a separate file
import PropTypes from 'prop-types';

const EditorHeader = ({ onCloseModal }) => (
  <div className="header">
    <ArrowBackIcon
      onClick={onCloseModal}
      color="secondary"
      variant="contained"
      className="arrowBack"
    >
      Close
    </ArrowBackIcon>
    <h1>Note Editor</h1>
  </div>
);

const EditorInput = ({ title, onChange, formattedDate }) => (
  <div className="inputContainer">
    <input
      type="text"
      name="title"
      value={title}
      onChange={onChange}
      placeholder="Enter title"
      className="inputStyle"
    />
    <p>{formattedDate}</p>
  </div>
);

const EditorButtons = ({ editorId, onSaveClick, onUpdateClick }) => (
  <div className="buttonContainer">
    {editorId ? (
      <Button
        onClick={onUpdateClick}
        color="primary"
        variant="contained"
        className="buttonStyle"
      >
        Update
      </Button>
    ) : (
      <Button
        onClick={onSaveClick}
        color="primary"
        variant="contained"
        className="buttonStyle"
      >
        Save
      </Button>
    )}
  </div>
);

const MyEditor = ({ isModalOpen, handleClose, editorId, dateTime }) => {
  const { user } = useAuth();
  const [editorHtml, setEditorHtml] = useState("");
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const fetchContent = async () => {
      try {
        if (user?.data?._id) {
          const userData = user.data;
          const response = await dispatch(
            noteActions.fetchContent(userData._id, editorId)
          );
          const data = response;
          if (isMounted) {
            setEditorHtml(data?.content ?? ""); 
            setTitle(data?.title ?? ""); 
          }
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    if (editorId && isModalOpen) {
      fetchContent();
    }

    return () => {
      isMounted = false;
    };
  }, [user, editorId, isModalOpen]);

  const handleEditorChange = (html) => {
    setEditorHtml(html);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleSaveClick = async () => {
    try {
      const response = await dispatch(
        noteActions.saveContent(editorHtml, title, user.data._id)
      );

      if (response.success) {
        setEditorHtml("");
        setTitle("");
        handleClose();
      }
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  const handleUpdateClick = async () => {
    try {
      const response = await dispatch(
        noteActions.updateContent(editorHtml, title, user.data._id, editorId)
      );

      if (response.success) {
        setEditorHtml("");
        setTitle("");
        handleClose();
      }
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };

  const handleCloseModal = () => {
    setTitle("");
    setEditorHtml("");
    handleClose();
  };

  const formattedDate = new Date(dateTime).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  return (
    <Draggable handle=".header">
      <div className={`contentEditor ${isModalOpen ? "open" : ""}`}>
        <div className="contentStyle">
          <EditorHeader onCloseModal={handleCloseModal} />
          <EditorInput
            title={title}
            onChange={handleTitleChange}
            formattedDate={formattedDate}
          />
          <ReactQuill
            theme="snow"
            value={editorHtml}
            onChange={handleEditorChange}
            modules={modules}
            formats={formats}
            placeholder="Write something..."
            className="quillStyle"
          />
          <EditorButtons
            editorId={editorId}
            onSaveClick={handleSaveClick}
            onUpdateClick={handleUpdateClick}
          />
        </div>
      </div>
    </Draggable>
  );
};


MyEditor.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  editorId: PropTypes.string, // Update the type accordingly
  dateTime: PropTypes.string.isRequired,
}

EditorButtons.propTypes = {
  editorId: PropTypes.string, // Update the type accordingly
  onSaveClick: PropTypes.func.isRequired,
  onUpdateClick: PropTypes.func.isRequired,
};

EditorInput.propTypes = {
  title: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  formattedDate: PropTypes.string.isRequired, // Add this line for formattedDate
};

EditorHeader.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
};

export default MyEditor;
