import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import useKeypress from "react-use-keypress";
import type { ImageProps } from "../utils/types";
import SharedModal from "./SharedModal";

export default function Modal({
  images,
  onClose,
}: {
  images: ImageProps[];
  onClose?: () => void;
}) {
  let overlayRef = useRef();
  const router = useRouter();

  const { photoId } = router.query;
  const photoIdNum = Number(photoId);
  
  // Find the index of the photo in the images array
  const findIndex = (photoId: number) => {
    const idx = images.findIndex((img) => img.id === photoId);
    return idx >= 0 ? idx : 0;
  };

  const [direction, setDirection] = useState(0);
  const [curIndex, setCurIndex] = useState(() => findIndex(photoIdNum));

  // Update index when photoId or images change
  useEffect(() => {
    const newIndex = findIndex(photoIdNum);
    setCurIndex(newIndex);
  }, [photoIdNum, images]);

  function handleClose() {
    router.push("/");
    onClose();
  }

  function changePhotoId(newPhotoId: number) {
    const newIndex = images.findIndex((img) => img.id === newPhotoId);
    if (newIndex < 0) return;
    
    if (newIndex > curIndex) {
      setDirection(1);
    } else {
      setDirection(-1);
    }
    setCurIndex(newIndex);
    router.push(`/p/${newPhotoId}`, undefined, { shallow: true });
  }

  useKeypress("ArrowRight", () => {
    if (curIndex + 1 < images.length) {
      changePhotoId(images[curIndex + 1].id);
    }
  });

  useKeypress("ArrowLeft", () => {
    if (curIndex > 0) {
      changePhotoId(images[curIndex - 1].id);
    }
  });

  return (
    <Dialog
      static
      open={true}
      onClose={handleClose}
      initialFocus={overlayRef}
      className="fixed inset-0 z-10 flex items-center justify-center"
    >
      <Dialog.Overlay
        ref={overlayRef}
        as={motion.div}
        key="backdrop"
        className="fixed inset-0 z-30 bg-black/70 backdrop-blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <SharedModal
        index={curIndex}
        direction={direction}
        images={images}
        changePhotoId={changePhotoId}
        closeModal={handleClose}
        navigation={true}
      />
    </Dialog>
  );
}
