import { Deta } from 'deta';
import { DETA_KEY } from '$env/static/private';

const deta = Deta(DETA_KEY);

export const cyoaDatabase = deta.Base('cyoa_database');
export const cyoaDrive = deta.Drive('cyoa_drive');
export const cyoaImages = deta.Drive('cyoa_images');

export default deta;
