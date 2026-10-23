import styles from "./PostCreatePage.module.css";
import "quill/dist/quill.snow.css";

// Hooks
import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router";

// Components
import Editor from "./Editor";

// API
import { fetchCategories } from "../../api/categoriesAPI";
import { createPost } from "../../api/postsAPI";

// Icon
import addDraftIcon from "../../assets/icons/addDraft.svg";
import addPostIcon from "../../assets/icons/addPost.svg";
import loadingIcon from "../../assets/icons/loading.svg";

export default function PostCreatePage() {
  // Context
  const { categoryState, setCategoryState, categoryStateRef } =
    useOutletContext();

  // States
  const [titleLen, setTitleLen] = useState(0);
  const [selectBGColor, setSelectBGColor] = useState(
    categoryState?.categories?.[0]?.color || null,
  );
  const [draftingStatus, setDraftingStatus] = useState("halt");
  const [publishingStatus, setPublishingStatus] = useState("halt");

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

    const data = new FormData(e.target);

    const dataObj = Object.fromEntries(data);

    dataObj["ops"] = quillRef.current.editor.delta.ops;
    dataObj["plain"] = quillRef.current.getText();
    dataObj["published"] = publishBtnClicked;

    const formData = JSON.stringify(dataObj);

    const response = await createPost(formData);

    console.log(dataObj);

    response.success
      ? handleSuccess(response.result, publishBtnClicked)
      : handleFail(response, publishBtnClicked);
  };

  const handleSuccess = (result, publishBtnClicked) => {
    publishBtnClicked ? setPublishingStatus("halt") : setDraftingStatus("halt");

    console.log(result);
  };

  const handleFail = (result, publishBtnClicked) => {
    publishBtnClicked
      ? setPublishingStatus("error")
      : setDraftingStatus("error");

    console.log(result);
  };

  return (
    <div className={styles.postCreatePage}>
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
        ></textarea>
        <p className={styles.titleLen}>{titleLen}/200</p>

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

        <Editor ref={quillRef} readOnly={true} />

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
    </div>
  );
}
