export const isProduction = false;

// for live
export const baseUrlProd = "https://v2.tapday.com/api";
export const freePlansProd = false;
export const intercomProd = true;
export const appUrlProd = "https://app.tapday.com/";
// for dev
export const baseUrlDev = "https://tapdaydev-99bca5867247.herokuapp.com/api";
// export const baseUrlDev = 'https://dev-v2.tapday.com/api'
export const freePlansDev = true;
export const intercomDev = false;
export const appUrlDev = "https://tapday-2-pi.vercel.app/";

// toggling between live and dev
export const baseUrl = isProduction ? baseUrlProd : baseUrlDev;
export const freePlans = isProduction ? freePlansProd : freePlansDev;
export const intercom = isProduction ? intercomProd : intercomDev;
export const appUrl = isProduction ? appUrlProd : appUrlDev;
