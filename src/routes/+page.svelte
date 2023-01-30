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
	<input type="text" name="url" />
	<button type="submit">Submit</button>
</form>

<div>
	{#if response?.videoTitle}
		<h1>{response?.videoTitle}</h1>
		<img width="600" height="400" src={response?.videoThumbnail} alt={response?.videoTitle} />
		<a target="_blank" href={response?.videoUrl} rel="noreferrer">Video Link</a>
	{/if}
</div>
