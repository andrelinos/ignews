import styles from './paginationItem.module.scss';

type PaginationItemProps = {
  number: number;
  isCurrentPage?: boolean;
  onPageChange: (page: number) => void;
};

export function PaginationItem({
  isCurrentPage = false,
  onPageChange,
  number,
}: PaginationItemProps) {
  return isCurrentPage ? (
    <button type="button" className={styles.currentButton} disabled>
      {number}
    </button>
  ) : (
    <button
      type="button"
      className={styles.buttonItem}
      onClick={() => onPageChange(number)}
    >
      {number}
    </button>
  );
}
