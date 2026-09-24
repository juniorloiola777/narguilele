let banners = [];
export const setBanners = rows => { banners = Array.isArray(rows) ? rows : []; };
export const getBanners = () => banners;
