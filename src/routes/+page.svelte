<script lang="ts">
	let response: any = null;
	$: response;
	const handleSubmit = async (event: Event) => {
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const res = await fetch(form.action, {
			method: 'POST',
			body: formData
		});
		const data = await res.json();
		console.log(data);

		response = data;
		form.reset();
	};
</script>

<form on:submit|preventDefault={handleSubmit} method="post">
	<input placeholder="Enter URL here" type="text" name="url" />
	<button type="submit">Submit</button>
</form>

<div class="info">
	{#if response?.videoTitle}
		<h1>{response?.videoTitle}</h1>
		<img width="600" height="400" src={response?.videoThumbnail} alt={response?.videoTitle} />
		<a target="_blank" href={response?.videoUrl} rel="noreferrer">Video Link</a>
	{/if}
</div>

<style>
	form {
		display: flex;
		flex-direction: column;
		margin: 3rem auto 0 auto;
	}
	input {
		max-width: 500px;
		width: 100%;
		margin: 0 auto;
		margin-bottom: 1rem;
		height: 30px;
		border: 1px solid #ccc;
		border-radius: 5px;
		padding: 0.5rem;
		font-size: 1rem;
	}
	button {
		width: 120px;
		margin: 0 auto;
		display: block;
		background-color: firebrick;
		color: white;
		border: none;
		border-radius: 5px;
		padding: 0.5rem;
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
