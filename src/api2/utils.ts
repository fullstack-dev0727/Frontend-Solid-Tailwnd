export function bucket_key(url: string): [string, string] {
	console.log("bucket_key", url)
	const [_, bucket, key] = url.match(/^([\w-]+)\/(.+)$/)
	console.log("bucket_key", bucket, key)
	return [bucket, key]
}
