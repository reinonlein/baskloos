import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import useKeypress from "react-use-keypress";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";
import SharedModal from "./SharedModal";

export default function Carousel({
  index,
  currentPhoto,
  images,
  totalPhotos,
}: {
  index: number;
  currentPhoto: ImageProps;
  images?: ImageProps[];
  totalPhotos: number;
}) {
  const router = useRouter();
  const [, setLastViewedPhoto] = useLastViewedPhoto();
  const [direction, setDirection] = useState(0);
  const prevIndexRef = useRef(index);

  // Update direction when index changes
  useEffect(() => {
    if (prevIndexRef.current !== index) {
      if (index > prevIndexRef.current) {
        setDirection(1);
      } else if (index < prevIndexRef.current) {
        setDirection(-1);
      }
      prevIndexRef.current = index;
    }
  }, [index]);

  function closeModal() {
    setLastViewedPhoto(currentPhoto.id);
    router.push("/", undefined, { shallow: true });
  }

  function changePhotoId(newPhotoId: number) {
    if (!images) {
      return;
    }
    
    // Find the photo with the given ID
    const newPhoto = images.find((img) => img.id === newPhotoId);
    if (!newPhoto) {
      return;
    }
    
    // Find the index of the new photo
    const newIndex = images.findIndex((img) => img.id === newPhotoId);
    
    // Set direction for animation
    if (newIndex > index) {
      setDirection(1);
    } else {
      setDirection(-1);
    }
    
    // Get category from current photo to maintain filter
    const category = currentPhoto.category;
    const query = category && category !== "all" ? { category } : {};
    
    // Navigate to the new photo page with category filter
    router.push({
      pathname: `/p/${newPhotoId}`,
      query,
    });
  }

  useKeypress("Escape", () => {
    closeModal();
  });

  useKeypress("ArrowRight", () => {
    if (images && index + 1 < images.length) {
      const nextPhoto = images[index + 1];
      if (nextPhoto) {
        changePhotoId(nextPhoto.id);
      }
    }
  });

  useKeypress("ArrowLeft", () => {
    if (images && index > 0) {
      const prevPhoto = images[index - 1];
      if (prevPhoto) {
        changePhotoId(prevPhoto.id);
      }
    }
  });

  return (
    <>
      {/* Fixed black background that stays behind everything */}
      <div 
        className="fixed inset-0 z-20 bg-black"
        style={{ 
          backgroundColor: 'black',
          filter: 'none !important',
          backdropFilter: 'none !important',
          WebkitBackdropFilter: 'none !important',
        }}
      />
      <div className="fixed inset-0 flex items-center justify-center z-30" style={{ backgroundColor: 'transparent' }}>
        <button
          className="absolute inset-0 z-30 cursor-default bg-transparent"
          onClick={closeModal}
          style={{ 
            backgroundColor: 'transparent',
            filter: 'none',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
          }}
        />
        <SharedModal
          index={index}
          images={images}
          changePhotoId={changePhotoId}
          currentPhoto={currentPhoto}
          closeModal={closeModal}
          navigation={true}
          direction={direction}
          totalPhotos={totalPhotos}
        />
      </div>
    </>
  );
}
