import ExpressConfig from './express/express.config.js';
import { getPhotos } from './services/photo.service.js';
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_SIZE } from './utils/constants.js';
import cors from 'cors';

const app = ExpressConfig();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server Running on Port' + PORT));
app.use(cors());

app.get('/photos', async (req, res) => {
    const {
        title = '',
        albumTitle = '',
        email = '',
        limit = '',
        offset = '',
    } = req.query;
    const formattedTitle = typeof title === 'string' ? title : title.toString();
    const formattedAlbum =
        typeof albumTitle === 'string' ? albumTitle : albumTitle.toString();
    const formattedEmail = typeof email === 'string' ? email : email.toString();
    const formattedLimit = +limit || DEFAULT_PAGE_SIZE;
    const formattedOffset = +offset || DEFAULT_PAGE_OFFSET;

    const photos = await getPhotos({
        title: formattedTitle,
        albumTitle: formattedAlbum,
        email: formattedEmail,
        limit: formattedLimit,
        offset: formattedOffset,
    });

    res.json(photos);
});
