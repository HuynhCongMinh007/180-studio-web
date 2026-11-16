import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import type { PaginationMeta } from '@/lib/types/generals'

const disabledClass = 'pointer-events-none opacity-50'

export function ListPagination({ pagination }: { pagination: PaginationMeta }) {
  const { page, limit, totalPages, prevPage, nextPage } = pagination

  if (totalPages <= 1) return null

  const items = []
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
      items.push(
        <PaginationItem key={p}>
          <PaginationLink
            href={`?page=${p}&limit=${limit}`}
            isActive={p === page}
          >
            {p}
          </PaginationLink>
        </PaginationItem>,
      )
    } else if (Math.abs(p - page) === 2) {
      items.push(
        <PaginationItem key={p}>
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`?page=${prevPage ?? page}&limit=${limit}`}
            aria-disabled={!prevPage}
            className={prevPage ? undefined : disabledClass}
          />
        </PaginationItem>
        {items}
        <PaginationItem>
          <PaginationNext
            href={`?page=${nextPage ?? page}&limit=${limit}`}
            aria-disabled={!nextPage}
            className={nextPage ? undefined : disabledClass}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
