async function axiosFetch (func, url, data) {
  try {
    const result = await func(`/api` + url, data);
    return result.data;
  } catch (error) {
    return {success: false, msg: 'Fatal communication error', error}
  }
}

export default axiosFetch;