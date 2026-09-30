import styles from "./CategoryBar.module.css";

// Hooks
import { useEffect, useState, useRef } from "react";

import { useNavigate, useParams } from "react-router";

// Icons
import scrollIcon from "../../assets/icons/rightArrow.svg";

// API
import { fetchCategories } from "../../api/fetchCategories";

export default function CategoryBar() {
  const navigate = useNavigate();

  const { category: categoryParam } = useParams();

  const [categories, setCategories] = useState({
    status: "fetching",
    categoriesArr: [],
  });

  useEffect(() => {
    const fetchFunc = async () => {
      const fetchedCategories = await fetchCategories();

      setCategories({
        status: fetchedCategories.status,
        categoriesArr: [...fetchedCategories.categories],
      });
    };

    fetchFunc();
  }, []);

  const buttonRef = useRef(null);
  useEffect(() => {
    if (!buttonRef.current) return;

    buttonRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
    });
  });

  const scrollCategoryList = (direction) => {
    const categoryList = document.querySelector(".categoryList");

    if (!categoryList) return;

    const rightScrollBtn = document.querySelector(".categoryScrollRight");
    const leftScrollBtn = document.querySelector(".categoryScrollLeft");

    categoryList.scrollLeft =
      direction === "right"
        ? categoryList.scrollLeft - 100
        : categoryList.scrollLeft + 100;

    const maxScrollLeft = categoryList.scrollWidth - categoryList.clientWidth;

    rightScrollBtn.disabled = categoryList.scrollLeft <= 0;
    leftScrollBtn.disabled = categoryList.scrollLeft + 1 >= maxScrollLeft;
  };

  const handleCategoryBtnClick = (id) => {
    navigate(id === Number(categoryParam) ? "/feed" : `/feed/${id}`);
  };

  const renderCategories = () => {
    if (categories.status === "fetching") {
      <div className={`${styles.categoryList} categoryList`}>
        <div
          className={`${styles.categoryBtn} ${styles.categoryBtnPreview}`}
        ></div>
      </div>;
    } else if (categories.status) {
      return (
        <div className={`${styles.categoryList} categoryList`}>
          {categories.categoriesArr.map((category) => {
            return (
              <button
                key={category.id}
                id={`category_${category.id}`}
                className={`${styles.categoryBtn} ${Number(categoryParam) === category.id ? styles.categoryBtnSelected : ""}`}
                onClick={() => {
                  handleCategoryBtnClick(category.id);
                }}
                ref={Number(categoryParam) === category.id ? buttonRef : null}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      );
    } else {
      return (
        <div
          className={`${styles.categoryList} ${styles.categoryListFailed} categoryList`}
        >
          Failed to fetch categories
        </div>
      );
    }
  };

  return (
    <div className={styles.categoryBar}>
      <button
        className={`${styles.categoryMenuScrollBtn} ${styles.categoryScrollRight} categoryScrollRight`}
        title="Scroll right"
        onClick={() => {
          scrollCategoryList("right");
        }}
      >
        <img src={scrollIcon} alt="Scroll right icon" />
      </button>

      {renderCategories()}

      <button
        className={`${styles.categoryMenuScrollBtn} ${styles.categoryScrollLeft} categoryScrollLeft`}
        title="Scroll Left"
        onClick={() => {
          scrollCategoryList("left");
        }}
      >
        <img src={scrollIcon} alt="Scroll left icon" />
      </button>
    </div>
  );
}
