<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import '../app.css';
	import { currentUser, pb } from '$lib/pocketbase';
	import { getImageURL } from '$lib/utils';
	import { goto } from '$app/navigation';

	function enhanceLogout() {
		return async ({ result }: { result: any }) => {
			menuShow = false;
			pb.authStore.clear();
			await applyAction(result);
		};
	}

	let menuShow: boolean = false;

	function pageName(path: string) {
		switch (path) {
			case '/':
				return 'Home';
			case '/wins':
				return 'Slays for the day';
			case '/profile':
				return 'Profile';
			default:
				return '';
		}
	}

	const activeTab = 'bg-indigo-700 text-white rounded-md py-2 px-3 text-sm font-medium';
	const inactiveTab =
		'text-white hover:bg-indigo-500 hover:bg-opacity-75 rounded-md py-2 px-3 text-sm font-medium';

	const activeDropdownTab = 'block px-4 py-2 text-sm text-gray-700 bg-gray-200';
	const inactiveDropdownTab = 'block px-4 py-2 text-sm text-gray-700';

	const activeMobileTab =
		'bg-indigo-700 text-white block rounded-md py-2 px-3 text-base font-medium';
	const inactiveMobileTab =
		'text-white hover:bg-indigo-500 hover:bg-opacity-75 block rounded-md py-2 px-3 text-base font-medium';
</script>

<div class="flex flex-col min-h-full h-screen">
	<div class="bg-indigo-600 pb-32">
		<nav class="border-b border-indigo-300 border-opacity-25 bg-indigo-600 lg:border-none">
			<div class="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
				<div
					class="relative flex h-16 items-center justify-between lg:border-b lg:border-indigo-400 lg:border-opacity-25"
				>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						on:click={() => goto('/')}
						class="flex items-center px-2 lg:px-0 hover:cursor-pointer"
					>
						<div class="flex-shrink-0">
							<img
								class="block h-8 w-8"
								src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=300"
								alt="Your Company"
							/>
						</div>
						<h1 class="text-xl font-bold pl-2 text-white">Thirak</h1>
						{#if $currentUser}
							<div class="hidden lg:ml-10 lg:block">
								<div class="flex space-x-4">
									<a href="/" class={$page.url.pathname === '/' ? activeTab : inactiveTab}>
										Home
									</a>
									<a href="/wins" class={$page.url.pathname === '/wins' ? activeTab : inactiveTab}>
										Wins
									</a>
								</div>
							</div>
						{/if}
					</div>
					<div class="hidden lg:flex lg:flex-1 lg:px-2 lg:ml-6 lg:justify-end">
						{#if $currentUser}
							<div class="relative ml-3">
								<div>
									<button
										type="button"
										class={menuShow
											? 'flex rounded-full text-sm outline-none ring-2 ring-offset-2'
											: 'flex rounded-full text-sm'}
										id="user-menu-button"
										aria-expanded="false"
										aria-haspopup="true"
										on:mouseenter={() => {
											menuShow = true;
										}}
									>
										{#if $currentUser?.avatar}
											<span class="sr-only">Open user menu</span>
											<img
												class="inline-block object-cover h-10 w-10 rounded-full"
												src={getImageURL(
													$currentUser?.collectionId,
													$currentUser?.id,
													$currentUser.avatar,
													'500x500'
												)}
												alt="User Avatar"
											/>
										{:else}
											<svg
												class="h-10 w-10 text-gray-300"
												viewBox="0 0 24 24"
												fill="currentColor"
												aria-hidden="true"
											>
												<path
													fill-rule="evenodd"
													d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
													clip-rule="evenodd"
												/>
											</svg>
										{/if}
									</button>
								</div>

								<!--
									Dropdown menu, show/hide based on menu state.
								-->
								{#if menuShow}
									<div
										class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
										role="menu"
										aria-orientation="vertical"
										aria-labelledby="user-menu-button"
										tabindex="-1"
										on:mouseleave={() => (menuShow = false)}
									>
										<a
											href="/profile"
											class={$page.url.pathname === '/profile'
												? activeDropdownTab
												: inactiveDropdownTab}
											role="menuitem"
											tabindex="-1"
											id="user-menu-item-0">Profile</a
										>
										{#if $currentUser.partner === ''}
											<a
												href="/requests"
												class={$page.url.pathname === '/requests'
													? activeDropdownTab
													: inactiveDropdownTab}
												role="menuitem"
												tabindex="-1"
												id="user-menu-item-1">Requests</a
											>
										{/if}
										<form method="POST" action="/logout" use:enhance={enhanceLogout}>
											<button class={inactiveDropdownTab}> Logout </button>
										</form>
									</div>
								{/if}
							</div>
						{:else}
							<a href="/login" class={$page.url.pathname === '/login' ? activeTab : inactiveTab}>
								Login
							</a>
						{/if}
					</div>
				</div>
			</div>

			<!-- Mobile menu, show/hide based on menu state. -->
			<div class="lg:hidden" id="mobile-menu">
				{#if !$currentUser}
					<div class="space-y-1 px-2 pb-3 pt-2">
						<a
							href="/login"
							class={$page.url.pathname === '/login' ? activeMobileTab : inactiveMobileTab}
						>
							Login
						</a>
					</div>
				{/if}
				{#if $currentUser}
					<div class="space-y-1 px-2 pb-3 pt-2">
						<a href="/" class={$page.url.pathname === '/' ? activeMobileTab : inactiveMobileTab}
							>Home</a
						>
						<a
							href="/wins"
							class={$page.url.pathname === '/wins' ? activeMobileTab : inactiveMobileTab}>Wins</a
						>
					</div>

					<div class="border-t border-indigo-700 pb-3 pt-4">
						<div class="flex items-center px-4">
							<div class="flex-shrink-0">
								{#if $currentUser.avatar}
									<img
										src={getImageURL(
											$currentUser?.collectionId,
											$currentUser?.id,
											$currentUser.avatar,
											'500x500'
										)}
										class="inline-block object-cover h-20 w-20 rounded-full"
										alt="user avatar"
										id="avatar-preview"
									/>
								{:else}
									<svg
										class="h-10 w-10 text-gray-300"
										viewBox="0 0 24 24"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
											clip-rule="evenodd"
										/>
									</svg>
								{/if}
							</div>
							{#if $currentUser.first_name}
								<div class="ml-3">
									<div class="text-base font-medium text-white">{$currentUser.first_name}</div>
									<div class="text-sm font-medium text-indigo-300">{$currentUser.username}</div>
								</div>
							{/if}
						</div>
					</div>
					<div class="mt-3 space-y-1 px-2">
						<a
							href="/profile"
							class={$page.url.pathname === '/profile' ? activeMobileTab : inactiveMobileTab}
							>Profile</a
						>
						{#if $currentUser.partner === ''}
							<a
								href="/requests"
								class={$page.url.pathname === '/requests' ? activeMobileTab : inactiveMobileTab}
							>
								Requests
							</a>
						{/if}
						<form
							class={inactiveMobileTab}
							method="POST"
							action="/logout"
							use:enhance={enhanceLogout}
						>
							<button class="w-full text-start">Logout</button>
						</form>
					</div>
				{/if}
			</div>
		</nav>
		<header class="py-10">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<h1 class="text-3xl font-bold tracking-tight text-white">
					{pageName($page.url.pathname)}
				</h1>
			</div>
		</header>
	</div>

	<main class="-mt-32 mb-auto">
		<div class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
			<!-- Your content -->
			<slot />
		</div>
	</main>

	<footer class="bg-white">
		<div class="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
			<div class="flex justify-center space-x-6 md:order-2">
				<a href="#" class="text-gray-400 hover:text-gray-500">
					<span class="sr-only">Instagram</span>
					<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path
							fill-rule="evenodd"
							d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
							clip-rule="evenodd"
						/>
					</svg>
				</a>
				<a href="#" class="text-gray-400 hover:text-gray-500">
					<span class="sr-only">Twitter</span>
					<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path
							d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
						/>
					</svg>
				</a>
				<a href="#" class="text-gray-400 hover:text-gray-500">
					<span class="sr-only">YouTube</span>
					<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path
							fill-rule="evenodd"
							d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
							clip-rule="evenodd"
						/>
					</svg>
				</a>
			</div>
			<div class="mt-8 md:order-1 md:mt-0">
				<p class="text-center text-xs leading-5 text-gray-500">
					&copy; {new Date().getFullYear()} Thirak. All rights reserved.
				</p>
			</div>
		</div>
	</footer>
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
