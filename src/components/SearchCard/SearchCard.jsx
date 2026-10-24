import styles from "./SearchCard.module.css";

// Hooks
import { useNavigate } from "react-router";

export default function SearchCard({ data }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/posts/${data.id}`);
  };

  return (
    <div className={styles.searchCard} key={data.id} onClick={handleClick}>
      <p className={styles.title}>{data.title}</p>
      <div className={styles.secondary}>
        <p
          className={styles.author}
        >{`${data.author.firstName} ${data.author.lastName}:`}</p>
        <p className={styles.desc}>{data.plain}</p>
      </div>
    </div>
  );
}
