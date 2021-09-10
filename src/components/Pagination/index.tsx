import styles from './pagination.module.scss';
import { PaginationItem } from './PaginationItem';

type PaginationProps = {
  totalCountOfRegisters: number;
  registerPerPage?: number;
  currentPage?: number;
  onPageChange: (page: number) => void;
};

const siblingsCount = 1;

function generatePageArray(from: number, to: number) {
  return [...new Array(to - from)]
    .map((_, index) => from + index + 1)
    .filter((page) => page > 0);
}

export function Pagination({
  totalCountOfRegisters,
  registerPerPage = 5,
  currentPage = 1,
  onPageChange,
}: PaginationProps) {
  const lastPage = Math.ceil(totalCountOfRegisters / registerPerPage);

  console.log(totalCountOfRegisters);
  console.log(currentPage);

  const previousPages = currentPage > 1
    ? generatePageArray(currentPage - 1 - siblingsCount, currentPage - 1)
    : [];

  const nextPages = currentPage < lastPage
    ? generatePageArray(
      currentPage,
      Math.min(currentPage + siblingsCount, lastPage),
    )
    : [];

  function handlePreviousPages() {
    // TODO
  }

  function handleNextPages() {
    // TODO
  }

  return (
    <div className={styles.container}>
      <div>
        <strong>0</strong> - <strong>10</strong> de <strong>10</strong>
      </div>
      <div>
        {currentPage > 1 + siblingsCount && (
          <>
            <PaginationItem
              onPageChange={onPageChange}
              number={1}
              isCurrentPage
            />
            {currentPage > (2 + siblingsCount) && <span>...</span>}
          </>
        )}

        {previousPages.length > 0
          && previousPages.map((page) => (
            <PaginationItem
              key={page}
              number={page}
              onPageChange={onPageChange}
            />
          ))}

        <PaginationItem
          onPageChange={onPageChange}
          number={currentPage}
          isCurrentPage
        />

        {nextPages.length > 0
          && nextPages.map((page) => (
            <PaginationItem
              onPageChange={onPageChange}
              key={page}
              number={page}
            />
          ))}

        {(currentPage + siblingsCount) < lastPage && (
          <>
            {(currentPage + 1 + siblingsCount) < lastPage && <span>...</span>}
            <PaginationItem
              onPageChange={onPageChange}
              number={lastPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
