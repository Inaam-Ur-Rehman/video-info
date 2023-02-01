<script lang="ts">
	let val: any;
	export let myData: any = null;
	$: myData;
	const handleSubmit = async (event: Event) => {
		const formData = new FormData();
		formData.append('url', val);
		const response = fetch('/api/video', {
			method: 'POST',
			body: formData
		});
		const data = await (await response).json();
		myData = data;
		val = '';
	};
</script>

<input
	required
	placeholder="Enter URL here"
	type="text"
	name="url"
	bind:value={val}
	on:blur={handleSubmit}
/>

<div class="info">
	{#if myData?.videoTitle}
		<h1>{myData?.videoTitle}</h1>
		<img width="600" height="400" src={myData?.videoThumbnail} alt={myData?.videoTitle} />
		<a target="_blank" href={myData?.videoUrl} rel="noreferrer">Video Link</a>
	{/if}
</div>

<style>
	input {
		display: block;
		max-width: 500px;
		width: 100%;
		margin: 2rem auto;
		margin-bottom: 1rem;
		height: 30px;
		border: 1px solid #ccc;
		border-radius: 5px;
		padding: 0.5rem;
		font-size: 1rem;
	}

	.info {
		margin: 3rem auto 0 auto;
		text-align: center;
	}
	.info h1 {
		margin-bottom: 1rem;
		font-family: sans-serif;
	}
	.info img {
		margin-bottom: 1rem;
		width: 600px;
		height: 100%;
		object-fit: cover;
	}
	.info a {
		display: block;
		margin-top: 1rem;
		text-decoration: none;
		color: firebrick;
		font-weight: bolder;
		font-family: sans-serif;
	}
</style>
