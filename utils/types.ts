/* eslint-disable no-unused-vars */
export interface ImageProps {
  id: number;
  _id: string;
  title: string;
  image: {
    asset?: {
      _ref?: string;
      _type?: string;
    };
    url?: string;
  };
  date: string;
  category: string;
  description: string;
  width?: number;
  height?: number;
}

export interface SharedModalProps {
  index: number;
  images?: ImageProps[];
  currentPhoto?: ImageProps;
  changePhotoId: (newVal: number) => void;
  closeModal: () => void;
  navigation: boolean;
  direction?: number;
  totalPhotos?: number;
}
