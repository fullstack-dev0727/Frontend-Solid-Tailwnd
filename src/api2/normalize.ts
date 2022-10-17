export async function normalizeVideo(bucket: string, path: string) {
	await fetch(
		"https://ml3aac6e6a3a5nyebj223hd5r40wlvqq.lambda-url.us-east-2.on.aws/",
		{
			method: "POST",
			body: JSON.stringify({
				url: "s3://" + bucket + "/" + path,
				inplace: true,
			}),
		}
	)
}
