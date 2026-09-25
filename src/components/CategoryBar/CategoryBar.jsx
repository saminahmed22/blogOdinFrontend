import styles from "./CategoryBar.module.css";

// Hooks
import { useEffect, useState } from "react";

import { Link } from "react-router";

// Icons
import scrollIcon from "../../assets/icons/rightArrow.svg";

// API
import { fetchCategories } from "../../api/fetchCategories";

export default function CategoryBar() {
  const [categories, setCategories] = useState({
    status: "fetching",
    categoriesArr: [],
  });

  useEffect(() => {
    const fetchFunc = async () => {
      const fetchedCategories = await fetchCategories();

      setCategories({
        status: fetchedCategories.status,
        categoriesArr: [...fetchedCategories?.categories],
      });
    };

    fetchFunc();
  }, []);

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
          {categories.categoriesArr.map((category) => (
            <Link
              key={category.id}
              className={styles.categoryBtn}
              to={`/feed/category/${category.id}`}
            >
              {category.name}
            </Link>
          ))}
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
