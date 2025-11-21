import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import Carousel from "../../components/Carousel";
import { getPhotos, getImageUrl } from "../../utils/sanity";
import type { ImageProps } from "../../utils/types";

const Home: NextPage = ({ currentPhoto, images, totalPhotos }: { currentPhoto: ImageProps; images: ImageProps[]; totalPhotos: number }) => {
  const router = useRouter();
  const { photoId, category } = router.query;
  let index = Number(photoId);

  // Filter images based on category query parameter
  // Wait for router to be ready to ensure category is available
  const filteredImages = useMemo(() => {
    if (!router.isReady) {
      return images; // Return all images while router is loading
    }
    if (!category || category === "all") {
      return images;
    }
    return images.filter((img) => img.category === category);
  }, [images, category, router.isReady]);

  // Find the index of the current photo in the filtered images
  const filteredIndex = useMemo(() => {
    return filteredImages.findIndex((img) => img.id === index);
  }, [filteredImages, index]);

  const currentPhotoUrl = getImageUrl(currentPhoto.image, 2560, 90);

  // Ensure body background is black immediately
  useEffect(() => {
    document.body.style.backgroundColor = 'black';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <>
      <Head>
        <title>{`${currentPhoto.title || "Foto"} - Baskloos`}</title>
        <meta
          name="description"
          content={currentPhoto.description || `Bekijk ${currentPhoto.title || "deze foto"} op Baskloos.`}
        />
        <meta property="og:title" content={`${currentPhoto.title || "Foto"} - Baskloos`} />
        <meta property="og:image" content={currentPhotoUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${currentPhoto.title || "Foto"} - Baskloos`} />
        <meta name="twitter:image" content={currentPhotoUrl} />
      </Head>
      <div className="fixed inset-0 bg-black z-0" />
      <main className="mx-auto max-w-[1960px] p-4 relative z-10">
        <Carousel 
          currentPhoto={currentPhoto} 
          images={filteredImages} 
          index={filteredIndex >= 0 ? filteredIndex : 0} 
          totalPhotos={filteredImages.length} 
        />
      </main>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
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

  const currentPhotoIndex = Number(context.params.photoId);
  const currentPhoto = reducedResults.find(
    (img) => img.id === currentPhotoIndex,
  );
  
  if (!currentPhoto) {
    return {
      notFound: true,
    };
  }
  

  return {
    props: {
      currentPhoto: currentPhoto,
      images: reducedResults,
      totalPhotos: reducedResults.length,
    },
  };
};

export async function getStaticPaths() {
  const results = await getPhotos();

  // If no photos exist, return empty paths with blocking fallback
  if (!results || results.length === 0) {
    return {
      paths: [],
      fallback: 'blocking',
    };
  }

  let fullPaths = [];
  for (let i = 0; i < results.length; i++) {
    fullPaths.push({ params: { photoId: i.toString() } });
  }

  return {
    paths: fullPaths,
    fallback: 'blocking',
  };
}
