import axios from "axios";

async function getGeo() {
  try {
    const geoResult = await axios.get(`https://api.ipstack.com/check?access_key=${import.meta.env.VITE_IPSTACK_API_KEY}`, { withCredentials: false });
    let geo = { country_code: 'XX' };
    if (geoResult.status !== 200) throw Error;
    geo = geoResult.data;
    return geo;
  } catch (error) {
    return { country_code: 'XX' }
  }

}

export default getGeo;