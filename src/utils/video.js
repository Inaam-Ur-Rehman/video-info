// getVideoInfo

const getVideoInfo = async (videoId) => {
	const videoInfo = await ytdl.getInfo(videoId);
	return videoInfo;
};
