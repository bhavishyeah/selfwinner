import { useEffect } from 'react';

declare global {
  interface Window { adsbygoogle: any[] }
}

interface Props {
  adSlot: string;
  adFormat?: string;
  style?: React.CSSProperties;
}

const GoogleAd = ({ adSlot, adFormat = 'auto', style }: Props) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', ...style }}
      data-ad-client="ca-pub-5027002588401274"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive="true"
    />
  );
};

export default GoogleAd;