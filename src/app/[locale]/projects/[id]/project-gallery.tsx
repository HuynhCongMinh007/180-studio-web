'use client'

import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import type { ProjectDetail } from '@/lib/types/projects'

const ZOOM_SCALE = 2.5

export function ProjectGallery({
  images,
  projectName,
}: {
  images: ProjectDetail['projectImages']
  projectName: string
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 })
  const totalImages = images.length

  function showPrevious() {
    setIsZoomed(false)
    setOpenIndex((index) =>
      index === null ? null : (index - 1 + totalImages) % totalImages,
    )
  }

  function showNext() {
    setIsZoomed(false)
    setOpenIndex((index) => (index === null ? null : (index + 1) % totalImages))
  }

  function moveZoomOrigin(event: React.MouseEvent<HTMLImageElement>) {
    const box = event.currentTarget.getBoundingClientRect()
    setZoomOrigin({
      x: ((event.clientX - box.left) / box.width) * 100,
      y: ((event.clientY - box.top) / box.height) * 100,
    })
  }

  function toggleZoom(event: React.MouseEvent<HTMLImageElement>) {
    moveZoomOrigin(event)
    setIsZoomed((zoomed) => !zoomed)
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'ArrowLeft') showPrevious()
    if (event.key === 'ArrowRight') showNext()
  }

  const openImage = openIndex === null ? null : images[openIndex]

  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={image.imageUrl}
            type="button"
            onClick={() => {
              setIsZoomed(false)
              setOpenIndex(index)
            }}
            className="cursor-zoom-in"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.imageUrl}
              alt={`${projectName} ${index + 1}`}
              className="aspect-4/3 w-full object-cover"
            />
          </button>
        ))}
      </div>

      <Dialog
        open={openIndex !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpenIndex(null)
        }}
      >
        <DialogContent
          onKeyDown={handleKeyDown}
          showCloseButton={false}
          className="inset-0 top-0 left-0 flex h-full w-full max-w-none translate-x-0 translate-y-0 items-center justify-center rounded-none border-none bg-transparent p-0 ring-0 sm:max-w-none"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpenIndex(null)
          }}
        >
          <DialogTitle className="sr-only">
            {projectName} {openIndex === null ? '' : openIndex + 1}/
            {totalImages}
          </DialogTitle>

          {openImage && (
            <div className="max-h-[calc(100vh-5rem)] max-w-[calc(100%-8rem)] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={openImage.imageUrl}
                alt={`${projectName} ${(openIndex ?? 0) + 1}`}
                onClick={toggleZoom}
                onMouseMove={isZoomed ? moveZoomOrigin : undefined}
                style={{
                  transform: isZoomed ? `scale(${ZOOM_SCALE})` : undefined,
                  transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                }}
                className={`block max-h-[calc(100vh-5rem)] max-w-full object-contain transition-transform duration-200 ${
                  isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                }`}
              />
            </div>
          )}

          {totalImages > 1 && (
            <>
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                <Button
                  variant="secondary"
                  size="icon-lg"
                  onClick={showPrevious}
                  className="pointer-events-auto rounded-full"
                >
                  <ChevronLeftIcon />
                  <span className="sr-only">Previous image</span>
                </Button>
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                <Button
                  variant="secondary"
                  size="icon-lg"
                  onClick={showNext}
                  className="pointer-events-auto rounded-full"
                >
                  <ChevronRightIcon />
                  <span className="sr-only">Next image</span>
                </Button>
              </div>
            </>
          )}

          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
            {(openIndex ?? 0) + 1} / {totalImages}
          </span>
        </DialogContent>
      </Dialog>
    </>
  )
}
