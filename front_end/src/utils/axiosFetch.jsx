async function axiosFetch (func, url, data) {
  try {
    const result = await func(`https://${import.meta.env.VITE_BACKEND_IP}` + url, data);
    return result.data;
  } catch (error) {
    return {success: false, msg: 'Fatal communication error', error}
  }
}

export default axiosFetch;