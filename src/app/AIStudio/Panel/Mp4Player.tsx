// ANCHOR Solid
import {
  createSignal,
  createEffect,
  JSX,
  ComponentProps,
  PropsWithChildren,
  children as solidifyChildren,
  splitProps,
} from 'solid-js';

// ANCHOR Plyr
import { SourceInfo } from 'plyr';

// ANCHOR Solid Plyr
import createPlyr from './VideoPlaySrc/createPlyr';
import UncontrolledPlyr from './VideoPlaySrc/UncontrolledPlyr';

let mp4Src: SourceInfo = {
  type: 'video',
  sources: [
    {
      src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4',
      type: 'video/mp4',
      size: 720,
    },
    {
      src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4',
      type: 'video/mp4',
      size: 1080,
    },
  ],
};
type VideoProps<P = {}> = P & {
  url: string,
  styled?: boolean
}
export default function Mp4Demo(
  props: PropsWithChildren<VideoProps<ComponentProps<"div">>>
): JSX.Element {

  const children = solidifyChildren(() => props.children)
  const [local, { url, ...others }] = splitProps(props, ["class", "styled", "children"])
  mp4Src = {
    type: 'video',
    sources: [
      {
        src: url,
        type: 'video/mp4',
        size: 720,
      },
      {
        src: url,
        type: 'video/mp4',
        size: 1080,
      },
    ],
  };
  const OPTIONS = {
    autoplay: true,
    muted: false,
  }
  const [plyr, setPlyr] = createPlyr({
    source: mp4Src,
    options: OPTIONS
  });
  const [loading, setLoading] = createSignal(true);

  createEffect(() => {
    const mp4Player = plyr()?.plyr;

    if (mp4Player) {
      setLoading(false);
      mp4Player.on('timeupdate', (event) => {
        const instance = event.detail.plyr;
        // eslint-disable-next-line no-console
        console.log('timeupdate', instance.currentTime);
      });
    }
  });

  return (
    <div>
      <UncontrolledPlyr
        ref={setPlyr}
        isLoading={loading()}
      />
    </div>
  );
}
