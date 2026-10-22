import styles from "./CategoryBar.module.css";

// Hooks
import { useEffect, useRef } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router";

// Components
import LoadingMessage from "../LoadingMessage/LoadingMessage";

// Icons
import scrollIcon from "../../assets/icons/rightArrow.svg";

// API
import { fetchCategories } from "../../api/categoriesAPI";

export default function CategoryBar() {
  const navigate = useNavigate();

  const { category: categoryParam } = useParams();

  const { categoryState, setCategoryState, categoryStateRef } =
    useOutletContext();

  useEffect(() => {
    if (categoryStateRef.current === "success") return;

    const fetchFunc = async () => {
      const response = await fetchCategories();

      categoryStateRef.current = "success";

      setCategoryState({
        status: response?.success ? "success" : "error",

        categories: response?.result?.content,
      });
    };

    fetchFunc();
  }, [setCategoryState, categoryStateRef]);

  const buttonRef = useRef(null);
  const firstButtonRef = useRef(null);
  useEffect(() => {
    if (!buttonRef.current) {
      firstButtonRef.current?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }

    buttonRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  });

  const scrollCategoryList = (direction) => {
    const categoryList = document.querySelector(".categoryList");

    if (!categoryList) return;

    categoryList.scrollLeft =
      direction === "right"
        ? categoryList.scrollLeft - 100
        : categoryList.scrollLeft + 100;
  };

  const handleCategoryBtnClick = (id) => {
    navigate(id === Number(categoryParam) ? "/feed" : `/feed/${id}`);
  };

  const renderCategories = () => {
    switch (categoryState.status) {
      case "fetching":
        return (
          <LoadingMessage
            message={"Loading categories"}
            customStylings={{ gridColumn: "1/4" }}
          />
        );

      case "success":
        return (
          <>
            <button
              className={`${styles.categoryMenuScrollBtn} ${styles.categoryScrollRight} categoryScrollRight`}
              title="Scroll right"
              onClick={() => {
                scrollCategoryList("right");
              }}
            >
              <img src={scrollIcon} alt="Scroll right icon" />
            </button>

            <div className={`${styles.categoryList} categoryList`}>
              {categoryState.categories.map((category) => {
                return (
                  <button
                    key={category.id}
                    id={`category_${category.id}`}
                    className={`${styles.categoryBtn} ${Number(categoryParam) === category.id ? styles.categoryBtnSelected : ""}`}
                    onClick={() => {
                      handleCategoryBtnClick(category.id);
                    }}
                    ref={
                      category.id === 1
                        ? firstButtonRef
                        : Number(categoryParam) === category.id
                          ? buttonRef
                          : null
                    }
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>

            <button
              className={`${styles.categoryMenuScrollBtn} ${styles.categoryScrollLeft} categoryScrollLeft`}
              title="Scroll Left"
              onClick={() => {
                scrollCategoryList("left");
              }}
            >
              <img src={scrollIcon} alt="Scroll left icon" />
            </button>
          </>
        );

      case "error":
        return (
          <div className={styles.messageContainer}>
            <p className={styles.message}>Failed to fetch categories</p>
          </div>
        );
    }
  };

  return <div className={styles.categoryBar}>{renderCategories()}</div>;
}
