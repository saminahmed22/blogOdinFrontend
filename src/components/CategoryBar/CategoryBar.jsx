import styles from "./CategoryBar.module.css";

// Hooks
import { useEffect, useState } from "react";

import { Link } from "react-router";

// Icons
import scrollIcon from "../../assets/icons/rightArrow.svg";

// API
import { fetchCategories } from "../../api/fetchCategories";

export default function CategoryBar() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories().then((response) => {
      setCategories(response);
    });
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

    //FeedHeader.jsx:28 4558.181640625
    console.clear();
    console.log(`maxScrollLeft: ${maxScrollLeft}`);
    console.log(`categoryList.scrollLeft: ${categoryList.scrollLeft}`);
    console.log(`categoryList.scrollWidth: ${categoryList.scrollWidth}`);
    console.log(`categoryList.clientWidth: ${categoryList.clientWidth}`);

    console.log(`rightScrollBtn.disabled: ${rightScrollBtn.disabled}`);
    console.log(`leftScrollBtn.disabled ${leftScrollBtn.disabled}`);
  };

  const renderCategories = () => {
    return (
      <div className={`${styles.categoryList} categoryList`}>
        {categories.map((category) => (
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
