import { PUBLIC_ENVIRONMENT } from '$env/static/public';
import { pb } from '$lib/pocketbase';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// before
	pb.authStore.loadFromCookie(event.request.headers.get('cookie') as string);
	if (pb.authStore.isValid) {
		try {
			await pb.collection('users').authRefresh();
		} catch (_) {
			pb.authStore.clear();
		}
	}

	event.locals.pb = pb;
	event.locals.user = structuredClone(pb.authStore.model);

	const response = await resolve(event);
	const isProd = PUBLIC_ENVIRONMENT === 'production' ? true : false;

	// after
	response.headers.set(
		'set-cookie',
		pb.authStore.exportToCookie({ httpOnly: false, secure: isProd, sameSite: 'Lax' })
	);

	return response;
};
