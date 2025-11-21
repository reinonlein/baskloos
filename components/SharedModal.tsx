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

  // Images prop should already be filtered by category when passed from parent
  // Show all filtered images in thumbnails (not just a window)
  const filteredImages = images || [];

  // Determine max index based on images array or totalPhotos
  const maxIndex = images ? images.length - 1 : (totalPhotos ? totalPhotos - 1 : index);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (images && index + 1 < images.length) {
        changePhotoId(images[index + 1].id);
      }
    },
    onSwipedRight: () => {
      if (images && index > 0) {
        changePhotoId(images[index - 1].id);
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
                  {images && index > 0 && (
                    <button
                      className="absolute left-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none"
                      style={{ transform: "translate3d(0, 0, 0)" }}
                      onClick={() => {
                        const prevPhoto = images[index - 1];
                        if (prevPhoto) {
                          changePhotoId(prevPhoto.id);
                        }
                      }}
                    >
                      <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                  )}
                  {images && index + 1 < images.length && (
                    <button
                      className="absolute right-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none"
                      style={{ transform: "translate3d(0, 0, 0)" }}
                      onClick={() => {
                        const nextPhoto = images[index + 1];
                        if (nextPhoto) {
                          changePhotoId(nextPhoto.id);
                        }
                      }}
                    >
                      <ChevronRightIcon className="h-6 w-6" />
                    </button>
                  )}
                </>
              )}
              <div className="absolute top-0 right-0 flex items-center gap-2 p-3 text-white">
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
              <div className="absolute top-0 left-0 flex items-center gap-2 p-3 text-white">
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
          {navigation && filteredImages && filteredImages.length > 0 && images && (
            <div className="fixed inset-x-0 bottom-0 z-40 overflow-hidden bg-gradient-to-b from-black/0 to-black/60">
              <motion.div
                initial={false}
                className="mx-auto mt-6 mb-6 flex aspect-[3/2] h-14"
                animate={{
                  x: `${index * -100}%`,
                }}
              >
                <AnimatePresence initial={false}>
                  {filteredImages.map(({ image, id }, thumbIndex) => {
                    // thumbIndex is the index in the filtered array
                    const isActive = thumbIndex === index;
                    
                    return (
                      <motion.button
                        initial={{
                          width: "0%",
                        }}
                        animate={{
                          scale: isActive ? 1.25 : 1,
                          width: "100%",
                        }}
                        exit={{ width: "0%" }}
                        onClick={() => changePhotoId(id)}
                        key={id}
                        className={`${
                          isActive
                            ? "z-20 rounded-md shadow shadow-black/50"
                            : "z-10"
                        } ${thumbIndex === 0 ? "rounded-l-md" : ""} ${
                          thumbIndex === filteredImages.length - 1 ? "rounded-r-md" : ""
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
