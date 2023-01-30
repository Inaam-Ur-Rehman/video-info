import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Vimeo } from 'vimeo';
import { env } from '$env/dynamic/private';

let videoId = '';

function extractYoutubeId(url: any) {
	const queryParams = url.split('?')[1];
	const id = queryParams
		.split('&')
		.filter((param: any) => param.startsWith('v='))[0]
		.split('=')[1];

	return id;
}

function extractVimeoId(url: any) {
	const id = url.split('/').pop();
	return id;
}

function extractTwitchId(url: any) {
	const id = url.split('/').pop();
	return id;
}

function extractTikTokId(url: any) {
	const id = url.split('/').pop();
	return id;
}

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();
	const res = Object.fromEntries(data);
	const url = res.url.toString();

	if (url.includes('youtube.com')) {
		videoId = extractYoutubeId(url);
		const data = fetch(
			`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyD9JK4RljJt2NMHk6_rIXMMU0l1pWoHOO4`
		);
		const response = await (await data).json();
		return json({
			videoTitle: response?.items[0]?.snippet?.title,
			videoThumbnail: response?.items[0]?.snippet?.thumbnails?.high?.url,
			videoUrl: url
		});
	} else if (url.includes('vimeo.com')) {
		videoId = extractVimeoId(url);
		const vimeoApi = 'https://vimeo.com/api/v2/video/{video_id}.json';

		const response = await fetch(vimeoApi.replace('{video_id}', videoId));
		const data = await response.json();

		return json({
			videoTitle: data[0].title,
			videoThumbnail: data[0].thumbnail_large,
			videoUrl: data[0].url
		});
	} else if (url.includes('twitch.tv')) {
		videoId = extractTwitchId(url);

		const data = await fetch(`https://api.twitch.tv/helix/videos?id=${videoId}`, {
			headers: {
				'Client-ID': 'vdsqv7peymxi12vb3pgut0lk4ca9oc',
				Authorization: `Bearer ${env.TWITCH_TOKEN}`
			}
		});
		const response = await data.json();
		if (response?.status === 400) {
			return json({
				videoTitle: 'Invalid URL',
				videoThumbnail: '',
				videoUrl: ''
			});
		} else {
			return json({
				videoTitle: response?.data[0]?.title,
				videoThumbnail: response?.data[0]?.thumbnail_url,
				videoUrl: response?.data[0]?.url
			});
		}
	} else {
		return json({
			videoTitle: 'Invalid URL',
			videoThumbnail: ''
		});
	}
};
