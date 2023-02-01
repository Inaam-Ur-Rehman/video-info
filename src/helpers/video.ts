import { env } from '$env/dynamic/private';
import cheerio from 'cheerio';

export async function youtube(id: string) {
	const response = await fetch(
		`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${env.GOOGLE_API_KEY}`
	);
	const data = await response.json();
	if (!(data?.items.length > 0)) {
		return {
			videoTitle: 'Invalid URL',
			videoThumbnail: '',
			videoUrl: ''
		};
	} else {
		return {
			videoTitle: data?.items[0]?.snippet?.title,
			videoThumbnail: data?.items[0]?.snippet?.thumbnails?.high?.url,
			videoUrl: `https://www.youtube.com/watch?v=${id}`
		};
	}
}

export async function vimeo(id: string) {
	const vimeoApi = 'https://vimeo.com/api/v2/video/{video_id}.json';

	const response = await fetch(vimeoApi.replace('{video_id}', id));

	if (!response.ok) {
		return {
			videoTitle: 'Invalid URL',
			videoThumbnail: '',
			videoUrl: ''
		};
	}
	const data = await response.json();

	return {
		videoTitle: data[0].title,
		videoThumbnail: data[0].thumbnail_large,
		videoUrl: data[0].url
	};
}

export async function twitch(id: string) {
	const response = await fetch(`https://api.twitch.tv/helix/videos?id=${id}`, {
		headers: {
			'Client-ID': 'vdsqv7peymxi12vb3pgut0lk4ca9oc',
			Authorization: `Bearer ${env.TWITCH_TOKEN}`
		}
	});
	const data = await response.json();
	if (!(data?.data.length > 0)) {
		return {
			videoTitle: 'Invalid URL',
			videoThumbnail: '',
			videoUrl: ''
		};
	} else {
		return {
			videoTitle: data?.data[0]?.title,
			videoThumbnail: data?.data[0]?.thumbnail_url,
			videoUrl: `https://www.twitch.tv/videos/${id}`
		};
	}
}

export async function tiktok(url: string) {
	const response = await fetch(url);
	const data = await response.text();

	if (response.status === 404) {
		return {
			videoTitle: 'Invalid URL',
			videoThumbnail: '',
			videoUrl: ''
		};
	}
	const $ = cheerio.load(data);

	const videoTitle = $('title').text();

	const videoThumbnail = $('.tiktok-j6dmhd-ImgPoster')?.attr('src');

	return {
		videoTitle: videoTitle,
		videoThumbnail: videoThumbnail,
		videoUrl: url
	};
}
