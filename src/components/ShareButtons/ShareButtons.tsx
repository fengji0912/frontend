'use client';

import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterShareButton,
  XIcon,
} from 'react-share';

type ShareButtonsProps = {
  url: string;
};

export default function ShareButtons({ url }: ShareButtonsProps) {
  return (
    <>
      <LinkedinShareButton url={url}>
        <LinkedinIcon round size={32} />
      </LinkedinShareButton>
      <TwitterShareButton url={url}>
        <XIcon size={32} round />
      </TwitterShareButton>
      <FacebookShareButton url={url}>
        <FacebookIcon round size={32} />
      </FacebookShareButton>
      <EmailShareButton url={url}>
        <EmailIcon round size={32} />
      </EmailShareButton>
    </>
  );
}
