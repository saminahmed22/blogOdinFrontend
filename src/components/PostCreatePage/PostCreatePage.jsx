import styles from "./PostCreatePage.module.css";
import "quill/dist/quill.snow.css";

// Hooks
import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate, useParams } from "react-router";

// Components
import Editor from "./Editor";

// API
import { fetchCategories } from "../../api/categoriesAPI";
import { createPost, editPost, fetchPost } from "../../api/postsAPI";

// Icon
import addDraftIcon from "../../assets/icons/addDraft.svg";
import addPostIcon from "../../assets/icons/addPost.svg";
import loadingIcon from "../../assets/icons/loading.svg";
import LoadingMessage from "../LoadingMessage/LoadingMessage";

export default function PostCreatePage({ editMode = false }) {
  const navigator = useNavigate();
  const { postId } = useParams();

  // Context
  const {
    userData,
    categoryState,
    setCategoryState,
    categoryStateRef,
    feedPosts,
    setFeedPosts,
    searchPosts,
  } = useOutletContext();

  // States
  const [titleLen, setTitleLen] = useState(0);
  const [selectBGColor, setSelectBGColor] = useState(
    categoryState?.categories?.[0]?.color || null,
  );
  const [draftingStatus, setDraftingStatus] = useState("halt");
  const [publishingStatus, setPublishingStatus] = useState("halt");
  const [validationStatus, setValidationStatus] = useState({
    title: true,
    desc: true,
  });

  const [fetchStatus, setFetchStatus] = useState(
    editMode ? "fetching" : "success",
  );

  const [defaultPost, setDefaultPost] = useState({});

  // Ref
  const quillRef = useRef();
  const clickedBtnRef = useRef();

  // Effects
  useEffect(() => {
    if (categoryStateRef.current === "success") return;

    const fetchFunc = async () => {
      const response = await fetchCategories();

      categoryStateRef.current = response?.success ? "success" : "error";

      setCategoryState({
        status: response?.success ? "success" : "error",

        categories: response?.result?.content,
      });

      setSelectBGColor(
        response?.success ? response?.result?.content?.[0]?.color : null,
      );

      categoryStateRef.current = response?.success ? "success" : "error";
    };

    fetchFunc();
  }, [setCategoryState, categoryStateRef]);

  // set default values on editMode=true
  useEffect(() => {
    if (!editMode || !postId) return;

    const redirect = (postObj) => {
      if (userData?.personalData?.id !== postObj?.author?.id) {
        navigator("/");
      }
    };

    const getPost = async () => {
      let postObj;

      postObj = feedPosts?.content?.[postId];
      if (postObj) {
        setFetchStatus("success");

        redirect(postObj);

        setDefaultPost({
          title: postObj.title,
          desc: postObj.ops,
          category: postObj.categoryId,
        });

        setSelectBGColor(postObj?.category?.color);

        return;
      }

      postObj = searchPosts?.content?.[postId];
      if (postObj) {
        setFetchStatus("success");

        redirect(postObj);

        setDefaultPost({
          title: postObj.title,
          desc: postObj.ops,
          category: postObj.categoryId,
        });

        setSelectBGColor(postObj?.category?.color);

        return;
      }

      const response = await fetchPost(postId);

      if (response.success) {
        if (response?.result?.content) {
          setFetchStatus("success");

          redirect(response?.result?.content);

          setDefaultPost({
            title: response?.result?.content?.title,
            desc: response?.result?.content?.ops,
            category: response?.result?.content?.categoryId,
          });

          setSelectBGColor(postObj?.category?.color);

          return;
        } else {
          setFetchStatus("noPost");

          return;
        }
      } else {
        setFetchStatus("error");

        return;
      }
    };

    getPost();
  }, [
    editMode,
    postId,
    feedPosts?.content,
    searchPosts?.content,
    navigator,
    userData?.personalData?.id,
  ]);

  // Handler
  const handleTitleInput = (e) => {
    const len = e?.target?.value?.length;

    setTitleLen(len);
  };

  const handleSelect = (e) => {
    const selectedId = e.target.value;

    const bgColor = categoryState?.categories[selectedId - 1]?.color;

    setSelectBGColor(bgColor || "transparent");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const publishBtnClicked = clickedBtnRef.current === "publishBtn";

    publishBtnClicked
      ? setPublishingStatus("publishing")
      : setDraftingStatus("drafting");

    setValidationStatus({ title: true, desc: true });

    const data = new FormData(e.target);

    const dataObj = Object.fromEntries(data);

    dataObj["ops"] = quillRef.current.editor.delta.ops;
    dataObj["plain"] = quillRef.current.getText();
    dataObj["published"] = publishBtnClicked;

    const status = validateSubmit(dataObj.title, dataObj.plain);

    if (!status) {
      publishBtnClicked
        ? setPublishingStatus("error")
        : setDraftingStatus("error");

      return;
    }

    if (editMode) {
      dataObj["postId"] = postId;
    }

    const formData = JSON.stringify(dataObj);

    const response = editMode
      ? await editPost(formData)
      : await createPost(formData);

    response.success
      ? handleSuccess(response.result, publishBtnClicked)
      : handleFail(response, publishBtnClicked);
  };

  const handleSuccess = (result, publishBtnClicked) => {
    publishBtnClicked ? setPublishingStatus("halt") : setDraftingStatus("halt");

    console.log(result);

    setFeedPosts((prev) => {
      const { [result.content.id]: _old, ...others } = prev.content;

      return {
        ...prev,
        config: {
          ...prev.config,
          totalContentFetched:
            prev.config.totalContentFetched + (editMode ? 0 : 1),
        },
        content: {
          [result.content.id]: { ...result.content },
          ...others,
        },
      };
    });

    navigator(`/posts/${result.content.id}`);
  };

  const handleFail = (result, publishBtnClicked) => {
    publishBtnClicked
      ? setPublishingStatus("error")
      : setDraftingStatus("error");

    const errObj = { title: true, desc: true };

    if (result.validationErrors) {
      result.validationErrors.map((err) => {
        if (err.path === "title") {
          if (err.msg === "titleLen") {
            errObj.title = "len";
          } else {
            errObj.title = false;
          }
        } else if (err.path === "plain") {
          errObj.desc = false;
        }
      });

      setValidationStatus(errObj);
    } else if (result?.error === "unauthorize") {
      setValidationStatus("unauthorize");
    } else {
      setValidationStatus("error");
    }
  };

  const validateSubmit = (title, desc) => {
    let status = true;
    const errObj = { title: true, desc: true };

    if (title?.length < 1) {
      status = false;

      errObj.title = false;
    } else if (title?.length > 200) {
      status = false;

      errObj.title = "len";
    }

    if (desc === "\n") {
      status = false;

      errObj.desc = false;
    }

    setValidationStatus(errObj);

    return status;
  };

  const getContent = () => {
    switch (fetchStatus) {
      case "success":
        return (
          <form onSubmit={handleFormSubmit} className={styles.postForm}>
            <textarea
              className={styles.title}
              name="title"
              id="title"
              aria-label="Give your post a title"
              title="Give your post a title"
              placeholder="Give your post a title"
              onChange={handleTitleInput}
              maxLength={200}
              defaultValue={defaultPost.title || null}
            ></textarea>

            <div className={styles.primary}>
              {(!validationStatus.title ||
                validationStatus.title === "len" ||
                validationStatus === "error" ||
                validationStatus === "unauthorize") && (
                <div className={styles.messageArea}>
                  <div className={styles.errorMessageContainer}>
                    <p className={styles.errorMessage}>
                      {validationStatus === "error"
                        ? "An error occured, please try again."
                        : validationStatus === "unauthorize"
                          ? "You are not authorized to make this action."
                          : validationStatus.title === "len"
                            ? "Maximum title length is 200 characters."
                            : "Please enter a title."}
                    </p>
                  </div>
                </div>
              )}

              <p className={styles.titleLen}>{titleLen}/200</p>
            </div>

            <div className={styles.secondary}>
              <select
                className={styles.categorySelect}
                name="categoryId"
                id="categorySelect"
                onChange={handleSelect}
                style={{ backgroundColor: selectBGColor }}
              >
                {selectBGColor ? (
                  categoryState?.categories?.map((category) => (
                    <option
                      className={styles.categoryOption}
                      style={{ backgroundColor: category.color }}
                      value={category.id}
                      key={`Category_Option_${category.id}`}
                      selected={category.id === defaultPost.category}
                    >
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option
                    className={styles.categoryOption}
                    style={{ backgroundColor: "gray" }}
                    value={null}
                    key={`Category_Option_error`}
                  >
                    Error
                  </option>
                )}
              </select>

              {(!validationStatus.desc ||
                validationStatus === "error" ||
                validationStatus === "unauthorize") && (
                <div className={styles.messageArea}>
                  <div className={styles.errorMessageContainer}>
                    <p className={styles.errorMessage}>
                      {validationStatus === "error"
                        ? "An error occured, please try again."
                        : validationStatus === "unauthorize"
                          ? "You are not authorized to make this action."
                          : "Please enter a description."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Editor ref={quillRef} defaultValue={defaultPost.desc || null} />

            <div className={styles.buttonContainer}>
              <button
                className={`${styles.draftBtn} ${styles.actBtn}`}
                type="submit"
                id="draftBtn"
                onClick={() => {
                  clickedBtnRef.current = "draftBtn";
                }}
                disabled={
                  !(draftingStatus === "halt" || publishingStatus === "halt") &&
                  !(draftingStatus === "error" || publishingStatus === "error")
                }
              >
                {draftingStatus === "halt" || draftingStatus === "error" ? (
                  <>
                    <img src={addDraftIcon} alt="Add draft icon" />
                    {draftingStatus === "error" ? "Error" : "Draft"}
                  </>
                ) : (
                  <>
                    <img src={loadingIcon} alt="Loading icon" />
                    Drafting
                  </>
                )}
              </button>

              <button
                className={`${styles.submitBtn} ${styles.actBtn}`}
                type="submit"
                id="publishBtn"
                onClick={() => {
                  clickedBtnRef.current = "publishBtn";
                }}
                disabled={
                  !(draftingStatus === "halt" || publishingStatus === "halt") &&
                  !(draftingStatus === "error" || publishingStatus === "error")
                }
              >
                {publishingStatus === "halt" || publishingStatus === "error" ? (
                  <>
                    <img src={addPostIcon} alt="Add post icon" />
                    {publishingStatus === "error" ? "Error" : "Publish"}
                  </>
                ) : (
                  <>
                    <img src={loadingIcon} alt="Loading icon" />
                    Publishing
                  </>
                )}
              </button>
            </div>
          </form>
        );

      case "fetching":
        return <LoadingMessage message={"Loading your post"} />;

      case "noPost":
        return (
          <LoadingMessage
            hideLoaderIcon={true}
            message={`No post found with the ID: ${postId}`}
          />
        );

      case "error":
        return (
          <LoadingMessage hideLoaderIcon={true} message={"An error occured."} />
        );
    }
  };

  return <div className={styles.postCreatePage}>{getContent()}</div>;
}
