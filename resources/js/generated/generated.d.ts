declare namespace App {
namespace Data {
namespace Admin {
export type AlbumData = {
id: number,
title: string,
slug: string,
type: App.Enums.AlbumType,
weddingDate: string | null,
location: string | null,
description: string | null,
isPublished: boolean,
isHomepageCarousel: boolean,
coverPhotoId: number | null,
};
export type AlbumFilterData = {
search: string | null,
type: string | null,
};
export type AlbumInputData = {
title: string,
slug: string,
type: App.Enums.AlbumType,
weddingDate: string | null,
location: string | null,
description: string | null,
isPublished: boolean,
isHomepageCarousel: boolean,
coverPhotoId: number | null,
};
export type AlbumRowData = {
id: number,
title: string,
slug: string,
type: App.Enums.AlbumType,
typeLabel: string,
weddingDate: string | null,
location: string | null,
isPublished: boolean,
isHomepageCarousel: boolean,
photosCount: number,
coverThumb: string | null,
};
export type CoverData = {
photoId: number,
};
export type IndexAlbumsData = {
filter: App.Data.Admin.AlbumFilterData,
sort: string | null,
page: number,
};
export type IndexInquiriesData = {
filter: App.Data.Admin.InquiryFilterData,
sort: string | null,
page: number,
};
export type InquiryData = {
id: number,
name: string,
email: string,
phone: string | null,
weddingDate: string | null,
dateUnknown: boolean,
venue: string | null,
guests: string | null,
services: string[],
message: string,
isHandled: boolean,
createdAt: string,
};
export type InquiryFilterData = {
search: string | null,
status: string | null,
};
export type MoveData = {
direction: string,
};
export type OrderData = {
ids: number[],
};
export type PhotoData = {
id: number,
thumb: string | null,
alt: string | null,
focalX: number,
focalY: number,
width: number,
height: number,
isReady: boolean,
originalName: string | null,
};
export type PhotoInputData = {
alt: string | null,
focalX: number,
focalY: number,
};
export type PhotoUploadData = {
photo: undefined,
};
export type ToggleData = {
value: boolean,
};
}
namespace Settings {
export type PasswordData = {
password: string,
};
export type ProfileData = {
name: string,
email: string,
};
}
namespace Site {
export type AlbumCardData = {
title: string,
slug: string,
type: App.Enums.AlbumType,
typeLabel: string,
meta: string | null,
cover: App.Data.Site.ImageData | null,
};
export type AlbumLinkData = {
title: string,
slug: string,
};
export type AlbumPageData = {
title: string,
slug: string,
type: App.Enums.AlbumType,
typeLabel: string,
meta: string | null,
description: string | null,
photos: App.Data.Site.ImageData[],
};
export type ImageData = {
id: number,
src: string,
srcset: string,
width: number,
height: number,
alt: string,
focalX: number,
focalY: number,
};
}
}
namespace Enums {
export type AlbumType = 'wedding' | 'editorial';
export type GuestCount = 'do-30' | '30-60' | '60-100' | '100-150' | 'viac-ako-150';
export type Service = 'svadobne-kytice' | 'vyzdoba-obradu' | 'stolovanie-a-hostina' | 'styling-priestoru';
}
}
