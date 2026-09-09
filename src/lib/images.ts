import catalogue from "./image-catalogue.json";
import localImages from "./local-images.json";

type LocalPhoto = { file: string; variants: { file: string; width: number }[] };
const local = localImages as Record<string, LocalPhoto>;
const assetPath = (file: string) => `${import.meta.env.BASE_URL}${file}`;

function photo(key: keyof typeof catalogue) {
  const item = catalogue[key];
  const remoteUrl = (width: number) =>
    `https://images.pexels.com/photos/${item.id}/pexels-photo-${item.id}.jpeg?auto=compress&cs=tinysrgb&fm=webp&fit=crop&w=${width}&h=${Math.round(width * item.height / item.width)}`;
  const widths = [...new Set([480, 800, 1200, item.width].filter((width) => width <= item.width))];
  const remoteSrc = remoteUrl(item.width);
  const remoteSrcSet = widths.map((width) => `${remoteUrl(width)} ${width}w`).join(", ");
  return {
    ...item,
    src: local[key] ? assetPath(local[key].file) : remoteSrc,
    srcSet: local[key]
      ? local[key].variants.map((variant) => `${assetPath(variant.file)} ${variant.width}w`).join(", ")
      : remoteSrcSet,
    remoteSrc,
    remoteSrcSet,
  };
}

export const IMG = {
  hero: photo("hero"),
  menuAtuacao: photo("menu-atuacao"),
  menuSobre: photo("menu-sobre"),
  menuInsights: photo("menu-insights"),
  menuContato: photo("menu-contato"),
  practice: [photo("empresarial"), photo("contratos"), photo("civil"), photo("patrimonial"), photo("familia")],
  portrait: photo("portrait"),
  aboutDetail: photo("about-detail"),
  city: photo("city"),
  work: [photo("work-01"), photo("work-02"), photo("work-03")],
  insights: photo("insights"),
  contact: photo("contact"),
};

const allPhotos = Object.values(IMG).flat();
export function imageMetadata(src: string) {
  return allPhotos.find((image) => image.src === src);
}
