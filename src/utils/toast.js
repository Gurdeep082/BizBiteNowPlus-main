import { toast } from "react-toastify";



const withKey = (opts = {}) =>
  opts.key ? { toastId: opts.key, ...opts } : opts;

export const notifySuccess = (message, opts) =>
  toast.success(message, withKey(opts));

export const notifyError = (message, opts) =>
  toast.error(message, withKey(opts));

export const notifyWarning = (message, opts) =>
  toast.warning(message, withKey(opts));

export const notifyInfo = (message, opts) =>
  toast.info(message, withKey(opts));

//error message extractor for axios errors
export const getApiErrorMessage = (error, fallback = "Something went wrong — please try again.") =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;

export default { notifySuccess, notifyError, notifyWarning, notifyInfo, getApiErrorMessage };
