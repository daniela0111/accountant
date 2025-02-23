import { v2 as cloudinary } from 'cloudinary';
import { cdConf } from './cd.config';


export const cloudyUpl = async (pathname: string) => {
    cloudinary.config({
        cloud_name: cdConf.cloud_name,
        api_key: cdConf.API_key,
        api_secret: cdConf.API_secret
    });
    // Upload an image
    const uploadResult = await cloudinary.uploader
        .upload(
            pathname, {
            public_id: 'shoes',
        }
        )
        .catch((error) => {
            console.log(error);
        });
    console.log(">result >upload>", uploadResult)
}