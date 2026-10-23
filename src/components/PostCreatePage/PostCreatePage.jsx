import styles from "./PostCreatePage.module.css";
import "quill/dist/quill.snow.css";

// Hooks
import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router";

// Components
import Editor from "./Editor";

// API
import { fetchCategories } from "../../api/categoriesAPI";

// Icons

export default function PostCreatePage() {
  // Context
  const { categoryState, setCategoryState, categoryStateRef } =
    useOutletContext();

  // States
  const [titleLen, setTitleLen] = useState(0);
  const [selectBGColor, setSelectBGColor] = useState(
    categoryState?.categories[0]?.color,
  );

  // Ref
  const quillRef = useRef();

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
        response?.success
          ? response?.result?.content?.[0]?.color
          : "transparent",
      );
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

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const data = new FormData(e.target);

    const dataObj = Object.fromEntries(data);

    console.log(quillRef.current.editor.delta.ops);
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
          name="category"
          id="categorySelect"
          onChange={handleSelect}
          style={{ backgroundColor: selectBGColor }}
        >
          {categoryState?.categories?.map((category) => (
            <option
              className={styles.categoryOption}
              style={{ backgroundColor: category.color }}
              value={category.id}
              key={`Category_Option_${category.id}}`}
            >
              {category.name}
            </option>
          ))}
        </select>

        <Editor ref={quillRef} />

        <button className={styles.submitBtn} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
