import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUturnLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { getImageUrl } from "../utils/sanity";
import { variants } from "../utils/animationVariants";
import downloadPhoto from "../utils/downloadPhoto";
import { range } from "../utils/range";
import type { ImageProps, SharedModalProps } from "../utils/types";

export default function SharedModal({
  index,
  images,
  changePhotoId,
  closeModal,
  navigation,
  currentPhoto,
  direction,
  totalPhotos,
}: SharedModalProps) {
  const [loaded, setLoaded] = useState(false);

  // Reset loaded state when index changes
  useEffect(() => {
    setLoaded(false);
  }, [index]);

  // For the carousel, show images within a range of the current index
  // Since images is already filtered, we use the index directly
  // Note: range is exclusive at the end, so we add 1 to include the last image
  const startRange = Math.max(0, index - 15);
  const endRange = Math.min(images?.length || 0, index + 16); // +16 because range is exclusive
  let filteredImages = images?.filter((_, imgIndex) =>
    range(startRange, endRange).includes(imgIndex),
  ) || [];

  // Determine max index based on images array or totalPhotos
  const maxIndex = images ? images.length - 1 : (totalPhotos ? totalPhotos - 1 : index);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (index < maxIndex) {
        changePhotoId(index + 1);
      }
    },
    onSwipedRight: () => {
      if (index > 0) {
        changePhotoId(index - 1);
      }
    },
    trackMouse: true,
  });

  let currentImage = images ? images[index] : currentPhoto;

  return (
    <MotionConfig
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      <div
        className="relative z-50 flex flex-col w-full max-w-7xl items-center wide:h-full xl:taller-than-854:h-auto"
        {...handlers}
      >
        {/* Main image */}
        <div className="relative flex aspect-[3/2] w-full items-center justify-center">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute"
              style={{ willChange: 'transform, opacity' }}
            >
              <Image
                src={getImageUrl(currentImage.image, navigation ? 1280 : 1920, 90)}
                width={navigation ? 1280 : 1920}
                height={navigation ? 853 : 1280}
                priority
                alt={currentImage.title || "Photo"}
                onLoad={() => setLoaded(true)}
                style={{ 
                  filter: 'none',
                  backdropFilter: 'none',
                  WebkitBackdropFilter: 'none',
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Photo information */}
        <div className="w-full px-4 py-6 text-white bg-black/40 backdrop-blur-sm">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-2 max-w-7xl mx-auto"
            >
              {currentImage.title && (
                <h2 className="text-2xl font-bold">{currentImage.title}</h2>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/75">
                {currentImage.date && (
                  <span>
                    {new Date(currentImage.date).toLocaleDateString('nl-NL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                )}
                {currentImage.category && (
                  <span className="px-2 py-1 rounded bg-white/10 text-white/90">
                    {currentImage.category}
                  </span>
                )}
              </div>
              {currentImage.description && (
                <p className="text-white/90 leading-relaxed max-w-3xl">
                  {currentImage.description}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Buttons + bottom nav bar */}
        <div className="absolute inset-0 mx-auto flex max-w-7xl items-center justify-center pointer-events-none">
          {/* Buttons */}
          {loaded && (
            <div className="relative aspect-[3/2] max-h-full w-full pointer-events-auto">
              {navigation && (
                <>
                  {index > 0 && (
                    <button
                      className="hidden md:flex absolute left-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none"
                      style={{ transform: "translate3d(0, 0, 0)" }}
                      onClick={() => changePhotoId(index - 1)}
                    >
                      <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                  )}
                  {images && index + 1 < images.length && (
                    <button
                      className="hidden md:flex absolute right-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none"
                      style={{ transform: "translate3d(0, 0, 0)" }}
                      onClick={() => changePhotoId(index + 1)}
                    >
                      <ChevronRightIcon className="h-6 w-6" />
                    </button>
                  )}
                </>
              )}
              <div className="hidden md:flex absolute top-0 right-0 items-center gap-2 p-3 text-white">
                <a
                  href={getImageUrl(currentImage.image)}
                  className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                  target="_blank"
                  title="Open fullsize version"
                  rel="noreferrer"
                >
                  <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                </a>
                <button
                  onClick={() =>
                    downloadPhoto(
                      getImageUrl(currentImage.image),
                      `${index}.jpg`,
                    )
                  }
                  className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                  title="Download fullsize version"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="hidden md:flex absolute top-0 left-0 items-center gap-2 p-3 text-white">
                <button
                  onClick={() => closeModal()}
                  className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                >
                  {navigation ? (
                    <XMarkIcon className="h-5 w-5" />
                  ) : (
                    <ArrowUturnLeftIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          )}
          {/* Bottom Nav bar */}
          {navigation && filteredImages && filteredImages.length > 0 && (
            <div className="fixed inset-x-0 bottom-0 z-40 overflow-hidden bg-gradient-to-b from-black/0 to-black/60">
              <motion.div
                initial={false}
                className="mx-auto mt-6 mb-6 flex aspect-[3/2] h-14"
              >
                <AnimatePresence initial={false}>
                  {filteredImages.map(({ image, id }, imgIndexInFiltered) => {
                    // Find the index in the full images array (which may already be filtered)
                    const actualIndex = images?.findIndex((img) => img.id === id) ?? imgIndexInFiltered;
                    const isActive = actualIndex === index;
                    const isFirst = actualIndex === 0;
                    const isLast = actualIndex === (images?.length || 0) - 1;
                    
                    // Calculate the offset for the carousel scroll
                    const startIndex = Math.max(0, index - 15);
                    const relativeIndex = actualIndex - startIndex;
                    
                    return (
                      <motion.button
                        initial={{
                          width: "0%",
                          x: `${Math.max((index - startIndex - 1) * -100, 15 * -100)}%`,
                        }}
                        animate={{
                          scale: isActive ? 1.25 : 1,
                          width: "100%",
                          x: `${Math.max((index - startIndex) * -100, 15 * -100)}%`,
                        }}
                        exit={{ width: "0%" }}
                        onClick={() => changePhotoId(actualIndex)}
                        key={id}
                        className={`${
                          isActive
                            ? "z-20 rounded-md shadow shadow-black/50"
                            : "z-10"
                        } ${isFirst ? "rounded-l-md" : ""} ${
                          isLast ? "rounded-r-md" : ""
                        } relative inline-block w-full shrink-0 transform-gpu overflow-hidden focus:outline-none`}
                      >
                        <Image
                          alt="small photos on the bottom"
                          width={180}
                          height={120}
                          className={`${
                            isActive
                              ? "brightness-110 hover:brightness-110"
                              : "brightness-50 contrast-125 hover:brightness-75"
                          } h-full transform object-cover transition`}
                          src={getImageUrl(image, 180, 70)}
                        />
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </MotionConfig>
  );
}
