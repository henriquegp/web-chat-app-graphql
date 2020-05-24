import React, { useState, useRef, ChangeEvent } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import ReactCrop, { PercentCrop, Crop } from 'react-image-crop';
import {
  Dialog, DialogActions, DialogTitle, DialogContent, Button,
} from '@material-ui/core';
import 'react-image-crop/dist/ReactCrop.css';

import getCroppedImage from '../../../../utils/getCroppedImage';
import { Container, StyledAvatar } from './styles';

const { REACT_APP_API_URL } = process.env;

interface FileImage {
  src: string;
  fileName: string;
  crop: Crop;
  cropped: File | null;
}

const initialState: FileImage = {
  src: '',
  fileName: '',
  crop: {
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  },
  cropped: null,
};

const SET_PICTURE = gql`
  mutation SET_PICTURE($file: Upload!) {
    setUserPicture(file: $file)
  }
`;

interface Props {
  src: string;
  reload(): void;
}

function Picture({ src, reload }: Props) {
  const [setUserPicture] = useMutation(SET_PICTURE);
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<FileImage>(initialState);

  function handleInitial() {
    setImage(initialState);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }

  function handleChange({ target }: ChangeEvent<HTMLInputElement>) {
    if (!target.files?.length) { return; }
    setImage({
      ...image,
      fileName: target.files[0].name,
      src: window.URL.createObjectURL(target.files[0]),
    });
  }

  async function handleComplete(crop: Crop, percentCrop: PercentCrop) {
    try {
      const cropped = await getCroppedImage(image.src, percentCrop, image.fileName);
      setImage({ ...image, cropped });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmit() {
    if (image.cropped) {
      try {
        await setUserPicture({
          variables: {
            file: image.cropped,
          },
        });
        reload();
        handleInitial();
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <>
      <Container onClick={() => inputRef.current?.click()}>
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onClick={handleInitial}
          onChange={handleChange}
        />
        <StyledAvatar src={`http://${REACT_APP_API_URL}/files/${src}`} />
      </Container>

      <Dialog
        open={!!image.src}
        onClose={handleInitial}
      >
        <DialogTitle>Edit Picture</DialogTitle>

        <DialogContent>
          <ReactCrop
            src={image.src}
            crop={image.crop}
            onChange={(crop) => setImage({ ...image, crop })}
            onComplete={handleComplete}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleInitial}>Cancel</Button>
          <Button
            color="primary"
            disabled={!image.cropped}
            onClick={handleSubmit}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Picture;
