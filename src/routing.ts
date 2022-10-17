/**
 * IDEA TAKEN FROM
 * https://betterprogramming.pub/the-best-way-to-manage-routes-in-a-react-project-with-typescript-c4e8d4422d64
 */
export enum ROUTE {
	CHECKIN = "/check-in",
	LOUNGE = "/lounge/:email_id/",
	VERIFICATION = "/verify/",
	REGISTRATION = `/register/:access_token/`,
	CONTROLPANEL = `/`,
	WORKSPACE = `/workspace/:workspace_id`,
}

type TArgs =
	| { path: ROUTE.CHECKIN }
	| { path: ROUTE.LOUNGE; params: { email_id: string } }
	| { path: ROUTE.VERIFICATION }
	| { path: ROUTE.REGISTRATION; params: { access_token: string } }
	| { path: ROUTE.CONTROLPANEL }
	| { path: ROUTE.WORKSPACE; params: { workspace_id: string } }

type TArgsWithParams = Extract<TArgs, { path: any; params: any }>

export function createPath(args: TArgs) {
	// Save some CPU power for routes without params
	if (args.hasOwnProperty("params") === false) return args.path

	// Create a path by replacing params in the route definition
	return Object.entries((args as TArgsWithParams).params).reduce(
		(previousValue: string, [param, value]) =>
			previousValue.replace(`:${param}`, "" + value),
		args.path
	)
}
