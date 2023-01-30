import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Vimeo } from 'vimeo';
import { env } from '$env/dynamic/private';
import Tiktok from 'tiktok-scraper';
// AIzaSyD9JK4RljJt2NMHk6_rIXMMU0l1pWoHOO4
const client = new Vimeo(env.CLIENT_ID || '', env.CLIENT_SECRET || '', env.ACCESS_TOKEN || '');
let videoUrl = '';
let videoId = '';
let videoTitle = '';
let videoThumbnail = '';
const options = {
	// Number of posts to scrape: {int default: 20}
	number: 50,

	// Scrape posts published since this date: { int default: 0}
	since: 0,

	// Set session: {string[] default: ['']}
	// Authenticated session cookie value is required to scrape user/trending/music/hashtag feed
	// You can put here any number of sessions, each request will select random session from the list
	sessionList: ['sid_tt=21312213'],

	// Set proxy {string[] | string default: ''}
	// http proxy: 127.0.0.1:8080
	// socks proxy: socks5://127.0.0.1:8080
	// You can pass proxies as an array and scraper will randomly select a proxy from the array to execute the requests
	proxy: '',

	// Set to {true} to search by user id: {boolean default: false}
	by_user_id: false,

	// How many post should be downloaded asynchronously. Only if {download:true}: {int default: 5}
	asyncDownload: 5,

	// How many post should be scraped asynchronously: {int default: 3}
	// Current option will be applied only with current types: music and hashtag
	// With other types it is always 1 because every request response to the TikTok API is providing the "maxCursor" value
	// that is required to send the next request
	asyncScraping: 3,

	// File path where all files will be saved: {string default: 'CURRENT_DIR'}
	filepath: `CURRENT_DIR`,

	// Custom file name for the output files: {string default: ''}
	fileName: `CURRENT_DIR`,

	// Output with information can be saved to a CSV or JSON files: {string default: 'na'}
	// 'csv' to save in csv
	// 'json' to save in json
	// 'all' to save in json and csv
	// 'na' to skip this step
	filetype: `na`,

	// Set custom headers: user-agent, cookie and etc
	// NOTE: When you parse video feed or single video metadata then in return you will receive {headers} object
	// that was used to extract the information and in order to access and download video through received {videoUrl} value you need to use same headers
	headers: {
		'user-agent': 'BLAH',
		referer: 'https://www.tiktok.com/',
		cookie: `tt_webid_v2=68dssds`
	},

	// Download video without the watermark: {boolean default: false}
	// Set to true to download without the watermark
	// This option will affect the execution speed
	noWaterMark: false,

	// Create link to HD video: {boolean default: false}
	// This option will only work if {noWaterMark} is set to {true}
	hdVideo: false,

	// verifyFp is used to verify the request and avoid captcha
	// When you are using proxy then there are high chances that the request will be
	// blocked with captcha
	// You can set your own verifyFp value or default(hardcoded) will be used
	verifyFp: '',

	// Switch main host to Tiktok test enpoint.
	// When your requests are blocked by captcha you can try to use Tiktok test endpoints.
	useTestEndpoints: false
};
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
