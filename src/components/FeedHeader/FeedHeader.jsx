import styles from "./FeedHeader.module.css";

// Icons
import searchIcon from "../../assets/icons/search.svg";

import scrollIcon from "../../assets/icons/rightArrow.svg";

export default function FeedHeader() {
  return (
    <div className={styles.feedHeader}>
      <div className={styles.headerPrimary}>
        <div className={styles.searchBarContainer}>
          <input
            className={styles.searchBox}
            type="text"
            placeholder="Search by title, category or author name"
          />
          <button
            className={styles.searchButton}
            type="submit"
            popoverTarget="searchPreview"
          >
            <img src={searchIcon} alt="Search icon" />
          </button>
        </div>
        <div
          className={styles.searchPreview}
          id="searchPreview"
          popover="auto"
        ></div>
      </div>

      <div className={styles.headerSecondary}>
        <div className={styles.headerSecondaryCategoryMenu}>
          <div className={`${styles.categoryList} categoryList`}>
            <button className={styles.feedHeaderCategoryBtn}>Tech</button>
            <button className={styles.feedHeaderCategoryBtn}>
              Programming
            </button>
            <button className={styles.feedHeaderCategoryBtn}>
              Web Development
            </button>
            <button className={styles.feedHeaderCategoryBtn}>
              AI &amp; Machine Learning
            </button>
            <button className={styles.feedHeaderCategoryBtn}>
              Cybersecurity
            </button>
            <button className={styles.feedHeaderCategoryBtn}>Gadgets</button>
            <button className={styles.feedHeaderCategoryBtn}>Science</button>
            <button className={styles.feedHeaderCategoryBtn}>Space</button>
            <button className={styles.feedHeaderCategoryBtn}>
              Environment
            </button>
            <button className={styles.feedHeaderCategoryBtn}>Health</button>
            <button className={styles.feedHeaderCategoryBtn}>Fitness</button>
            <button className={styles.feedHeaderCategoryBtn}>
              Mental Health
            </button>
            <button className={styles.feedHeaderCategoryBtn}>Lifestyle</button>
            <button className={styles.feedHeaderCategoryBtn}>Fashion</button>
            <button className={styles.feedHeaderCategoryBtn}>Beauty</button>
            <button className={styles.feedHeaderCategoryBtn}>Food</button>
            <button className={styles.feedHeaderCategoryBtn}>Cooking</button>
            <button className={styles.feedHeaderCategoryBtn}>Travel</button>
            <button className={styles.feedHeaderCategoryBtn}>
              Photography
            </button>
            <button className={styles.feedHeaderCategoryBtn}>Design</button>
            <button className={styles.feedHeaderCategoryBtn}>Art</button>
            <button className={styles.feedHeaderCategoryBtn}>Music</button>
            <button className={styles.feedHeaderCategoryBtn}>Movies</button>
            <button className={styles.feedHeaderCategoryBtn}>TV Shows</button>
            <button className={styles.feedHeaderCategoryBtn}>Books</button>
            <button className={styles.feedHeaderCategoryBtn}>Writing</button>
            <button className={styles.feedHeaderCategoryBtn}>Gaming</button>
            <button className={styles.feedHeaderCategoryBtn}>Sports</button>
            <button className={styles.feedHeaderCategoryBtn}>Business</button>
            <button className={styles.feedHeaderCategoryBtn}>Startups</button>
            <button className={styles.feedHeaderCategoryBtn}>Finance</button>
            <button className={styles.feedHeaderCategoryBtn}>Marketing</button>
            <button className={styles.feedHeaderCategoryBtn}>Career</button>
            <button className={styles.feedHeaderCategoryBtn}>Education</button>
            <button className={styles.feedHeaderCategoryBtn}>
              Productivity
            </button>
            <button className={styles.feedHeaderCategoryBtn}>
              Self Improvement
            </button>
            <button className={styles.feedHeaderCategoryBtn}>
              Relationships
            </button>
            <button className={styles.feedHeaderCategoryBtn}>Parenting</button>
            <button className={styles.feedHeaderCategoryBtn}>Politics</button>
            <button className={styles.feedHeaderCategoryBtn}>News</button>
            <button className={styles.feedHeaderCategoryBtn}>History</button>
            <button className={styles.feedHeaderCategoryBtn}>Culture</button>
            <button className={styles.feedHeaderCategoryBtn}>
              Religion &amp; Spirituality
            </button>
            <button className={styles.feedHeaderCategoryBtn}>Philosophy</button>
            <button className={styles.feedHeaderCategoryBtn}>Humor</button>
            <button className={styles.feedHeaderCategoryBtn}>
              DIY &amp; Crafts
            </button>
            <button className={styles.feedHeaderCategoryBtn}>
              Home &amp; Garden
            </button>
            <button className={styles.feedHeaderCategoryBtn}>Cars</button>
            <button className={styles.feedHeaderCategoryBtn}>Pets</button>
            <button className={styles.feedHeaderCategoryBtn}>
              Personal Stories
            </button>
          </div>

          <button
            className={styles.feedHeaderCategoryMenuScrollBtn}
            onClick={() => {
              const list = document.querySelector(".categoryList");
              list.scroll(100, 0);
            }}
          >
            <img src={scrollIcon} alt="Scroll icon" />
          </button>
        </div>
        <div className={styles.headerSecondaryActions}>
          <select
            name="sortFeed"
            id="sortFeedSelector"
            className={styles.sortFeedSelector}
          >
            <option value="recent" selected>
              Recent
            </option>
            <option value="like">Most Liked</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
    </div>
  );
}
