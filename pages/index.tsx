import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState, useMemo } from "react";
import Modal from "../components/Modal";
import CategoryFilter from "../components/CategoryFilter";
import { getPhotos, getImageUrl } from "../utils/sanity";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";

const Home: NextPage = ({ images }: { images: ImageProps[] }) => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(images.map((img) => img.category).filter(Boolean))
    ).sort();
    return uniqueCategories;
  }, [images]);

  // Filter images based on selected category
  const filteredImages = useMemo(() => {
    if (selectedCategory === "all") {
      return images;
    }
    return images.filter((img) => img.category === selectedCategory);
  }, [images, selectedCategory]);

  // When a photo is opened, ensure it's visible in the filtered list
  useEffect(() => {
    if (photoId) {
      const photoIndex = Number(photoId);
      const photo = images.find((img) => img.id === photoIndex);
      
      // If the opened photo doesn't match the current filter, reset to "all"
      if (photo && selectedCategory !== "all" && photo.category !== selectedCategory) {
        setSelectedCategory("all");
      }
    }
  }, [photoId, images, selectedCategory]);

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  return (
    <>
      <Head>
        <title>Baskloos - Foto Gallery</title>
        <meta
          name="description"
          content="Bekijk de foto's van creatieve projecten en knutselwerken."
        />
        <meta
          property="og:image"
          content="/og-image.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal
            images={filteredImages}
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          <div className="after:content relative mb-5 flex h-[629px] flex-col items-center justify-between overflow-hidden rounded-lg bg-white/10 px-6 py-16 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight">
            <div className="flex flex-col items-center gap-8">
              <h1 className="text-base font-bold uppercase tracking-widest">
                Bas Kloos
              </h1>
              <p className="max-w-[40ch] text-white/75 sm:max-w-[32ch]">
                De verzamelde werken.
              </p>
            </div>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
          
          
          
          {filteredImages.map(({ id, image: imageData, title }) => (
            <Link
              key={id}
              href={`/p/${id}`}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              shallow
              className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              <Image
                alt={title || "Photo"}
                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                style={{ transform: "translate3d(0, 0, 0)" }}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                src={getImageUrl(imageData, 720, 80)}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
              />
            </Link>
          ))}
        </div>
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12">
        Deze website is gemaakt door {" "}
        <a
          href="https://reinonlein.nl/"
          target="_blank"
          className="font-semibold hover:text-white"
        >
          ReinOnlein Studio
        </a>
      </footer>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const results = await getPhotos();
  let reducedResults: ImageProps[] = [];

  let i = 0;
  for (let result of results) {
    reducedResults.push({
      id: i,
      _id: result._id,
      title: result.title,
      image: result.image,
      date: result.date,
      category: result.category,
      description: result.description,
    });
    i++;
  }


  return {
    props: {
      images: reducedResults,
    },
  };
}
