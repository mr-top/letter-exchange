import axios from "axios";

async function getGeo() {
  try {
    const geoResult = await axios.get('http://ip-api.com/json', { withCredentials: false });
    let geo = { countryCode: 'XX' };
    if (geoResult.status !== 200) throw Error;
    geo = geoResult.data;
    return geo;
  } catch (error) {
    console.log(error);
    return { countryCode: 'XX' }
  }

}

export default getGeo;