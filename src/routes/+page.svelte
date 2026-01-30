<script>
	import { schedule, getCurrentAndNextSessions } from '$lib/schedule.js';
	import { onMount, onDestroy } from 'svelte';

	let currentSession = getCurrentAndNextSessions(schedule).currentSession;
	let nextSession = getCurrentAndNextSessions(schedule).nextSession;
	let day = getCurrentAndNextSessions(schedule).day;
	let interval;
	let progressInterval;
	let sessionProgress = 0;
	let deferredPrompt;
	let canInstall = false;

	function isCurrentOrNext(session, sessionIndex, dayIndex) {
		if (currentSession && dayIndex === currentSession.dayIndex && sessionIndex === currentSession.sessionIndex) {
			return 'current';
		}
		if (nextSession && dayIndex === nextSession.dayIndex && sessionIndex === nextSession.sessionIndex) {
			return 'next';
		}
		return '';
	}

	function calculateProgress(currentSess, currentDay) {
		if (!currentSess || !currentDay) return 0;
		
		const now = new Date();
		const sessionStart = new Date(`${currentDay.date} ${currentSess.time}`);
		
		const sessions = currentDay.sessions;
		const sessionIdx = currentSess.sessionIndex;
		const nextSessionTime = sessionIdx < sessions.length - 1 
			? new Date(`${currentDay.date} ${sessions[sessionIdx + 1].time}`)
			: null;
		
		if (nextSessionTime) {
			const totalDuration = nextSessionTime - sessionStart;
			const elapsed = now - sessionStart;
			return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
		}
		return 100;
	}

	onMount(() => {
		scrollToSession();
		
		interval = setInterval(() => {
			const result = getCurrentAndNextSessions(schedule);
			currentSession = result.currentSession;
			nextSession = result.nextSession;
			day = result.day;
			scrollToSession();
		}, 60000);

		progressInterval = setInterval(() => {
			if (currentSession && day) {
				sessionProgress = calculateProgress(currentSession, day);
			}
		}, 1000);
		
		if (currentSession && day) {
			sessionProgress = calculateProgress(currentSession, day);
		}

		const handleBeforeInstallPrompt = (e) => {
			e.preventDefault();
			deferredPrompt = e;
			canInstall = true;
		};

		window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

		return () => {
			window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
		};
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
		if (progressInterval) clearInterval(progressInterval);
	});

	async function installApp() {
		if (deferredPrompt) {
			deferredPrompt.prompt();
			const { outcome } = await deferredPrompt.userChoice;
			deferredPrompt = null;
			canInstall = false;
		}
	}

	function scrollToSession() {
		const currentEl = document.querySelector('[data-session="current"]');
		const nextEl = document.querySelector('[data-session="next"]');
		
		if (currentEl) {
			setTimeout(() => {
				currentEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}, 100);
		} else if (nextEl) {
			setTimeout(() => {
				nextEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}, 100);
		}
	}

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});

	function getSessionStyles(session, sessionIndex, dayIndex, currentDayIndex, currentSessionIndex, nextSessionIndex, nextDayIndex) {
		if (currentSession) {
			if (dayIndex === currentDayIndex && sessionIndex === currentSessionIndex) {
				return 'border-2 border-green-500 bg-green-900/30 ring-2 ring-green-500 ring-opacity-50';
			}
			if (nextSession && dayIndex === nextDayIndex && sessionIndex === nextSessionIndex) {
				return 'border-2 border-blue-500 bg-blue-900/30 ring-2 ring-blue-500 ring-opacity-50';
			}
		}

		switch (session.type) {
			case 'keynote':
				return 'border-l-4 border-yellow-500 from-yellow-900/30';
			case 'workshop':
				return 'border-l-4 border-blue-500 from-blue-900/30';
			case 'break':
				return 'border-l-4 border-slate-600';
			default:
				return 'border-l-4 border-red-600';
		}
	}

	function getTimeColor(session, sessionIndex, dayIndex, currentDayIndex, currentSessionIndex, nextSessionIndex, nextDayIndex) {
		if (currentSession) {
			if (dayIndex === currentDayIndex && sessionIndex === currentSessionIndex) {
				return 'text-green-400';
			}
			if (nextSession && dayIndex === nextDayIndex && sessionIndex === nextSessionIndex) {
				return 'text-blue-400';
			}
		}

		switch (session.type) {
			case 'keynote':
				return 'text-yellow-400';
			case 'workshop':
				return 'text-blue-400';
			case 'break':
				return 'text-slate-400';
			default:
				return 'text-red-400';
		}
	}

	function getSessionBadge(session) {
		switch (session.type) {
			case 'keynote':
				return '⭐ Keynote';
			case 'workshop':
				return '🔧 Workshop';
			default:
				return '';
		}
	}

	function getBadgeColor(session) {
		switch (session.type) {
			case 'keynote':
				return 'bg-yellow-500 text-slate-900';
			case 'workshop':
				return 'bg-blue-500 text-white';
			default:
				return '';
		}
	}
</script>

<div class="min-h-screen bg-slate-900 text-white pb-48">
	<div class="max-w-[1440px] mx-auto px-3 py-4 md:px-8 md:py-8">
		<header class="mb-6">
			{#if canInstall}
				<button
					onclick={installApp}
					class="absolute top-4 right-4 md:top-8 md:right-8 bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold px-3 py-2 sm:px-4 rounded-lg shadow-lg transition-all flex items-center gap-2 z-50"
				>
					<svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
					</svg>
					Add to Home
				</button>
			{/if}
			<h1 class="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-extrabold text-red-600 uppercase mb-1">
				RubyConf TH 2026
			</h1>
			<p class="text-base sm:text-xl text-slate-300">Conference Schedule</p>
			<p class="text-sm md:text-lg text-slate-400 mt-1">Jan 31 - Feb 1, 2026</p>
		</header>

		{#if currentSession}
			<div class="mb-6 space-y-3">
				<div class="border-2 border-green-500 rounded-lg p-3 md:p-6 bg-green-900/20 shadow-lg">
					<div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
						<span class="bg-green-500 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full inline-block w-fit">● LIVE NOW</span>
						<span class="text-green-400 font-semibold text-xs sm:text-base">{day?.title || 'Current Session'}</span>
					</div>
					<h2 class="text-base sm:text-2xl font-bold mb-1 sm:mb-2">{currentSession.title}</h2>
					{#if currentSession.speaker}
						<p class="text-slate-300 text-sm sm:text-lg">{currentSession.speaker}</p>
					{/if}
					<p class="text-green-400 font-semibold mt-1 sm:mt-2 text-sm sm:text-lg">{currentSession.time}</p>
					<div class="mt-2 sm:mt-3">
						<div class="h-2 bg-green-900/50 rounded-full overflow-hidden">
							<div 
								class="h-full bg-green-500 transition-all duration-1000 ease-linear"
								style="width: {sessionProgress}%"
							></div>
						</div>
						<p class="text-green-400 text-xs mt-1">{Math.round(sessionProgress)}% complete</p>
					</div>
				</div>

				{#if nextSession}
					<div class="border-2 border-blue-500 rounded-lg p-3 md:p-6 bg-blue-900/20 shadow-lg">
						<div class="flex items-center gap-3 mb-2">
							<span class="bg-blue-500 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full inline-block w-fit">● UP NEXT</span>
						</div>
						<h2 class="text-base sm:text-2xl font-bold mb-1 sm:mb-2">{nextSession.title}</h2>
						{#if nextSession.speaker}
							<p class="text-slate-300 text-sm sm:text-lg">{nextSession.speaker}</p>
						{/if}
						<p class="text-blue-400 font-semibold mt-1 sm:mt-2 text-sm sm:text-lg">{nextSession.time}</p>
					</div>
				{/if}
			</div>
		{/if}

		<div class="space-y-6">
			{#each schedule.days as day, dayIndex}
				<div class="bg-slate-800 border border-slate-700 rounded-xl p-3 md:p-8 shadow-lg">
					<h2 class="text-xl sm:text-3xl font-bold mb-4 md:mb-6 text-red-600">{day.title}</h2>

					<div class="space-y-3">
						{#each day.sessions as session, sessionIndex}
							<div
								data-session={isCurrentOrNext(session, sessionIndex, dayIndex)}
								data-day={dayIndex}
								data-index={sessionIndex}
								class="pl-3 sm:pl-6 py-2 sm:py-3 rounded {getSessionStyles(
									session,
									sessionIndex,
									dayIndex,
									currentSession?.dayIndex,
									currentSession?.sessionIndex,
									nextSession?.sessionIndex,
									nextSession?.dayIndex
								)} {session.type === 'keynote' || session.type === 'workshop'
									? 'bg-gradient-to-r to-slate-900/50 shadow-lg'
									: session.type === 'break'
										? 'bg-slate-900/30'
										: 'bg-slate-900/50'}"
							>
								<div class="flex flex-row items-start gap-2 sm:flex-row sm:items-start sm:gap-4">
									<div class="{getTimeColor(
										session,
										sessionIndex,
										dayIndex,
										currentSession?.dayIndex,
										currentSession?.sessionIndex,
										nextSession?.sessionIndex,
										nextSession?.dayIndex
									)} font-bold text-sm sm:text-lg min-w-[60px] sm:min-w-[80px] flex-shrink-0 pt-1">
										{session.time}
									</div>

									<div class="flex items-start gap-2 sm:gap-4 w-full">
										{#if session.image}
											<img
												src={session.image}
												alt={session.speaker || session.title}
												class="w-10 h-10 sm:w-16 sm:h-16 {session.type === 'keynote' ? 'sm:w-20 sm:h-20' : ''} rounded-full border-2 {session.type === 'keynote'
												? 'border-yellow-500'
												: session.type === 'workshop'
													? 'border-blue-500'
													: 'border-red-600'} flex-shrink-0 object-cover {session.type === 'workshop'
												? 'bg-white p-0.5 sm:p-2'
												: ''}"
											/>
										{/if}

										<div class="flex-1 min-w-0">
											<div class="flex flex-wrap items-center gap-1.5 mb-1">
												{#if getSessionBadge(session)}
													<span
														class="{getBadgeColor(
															session
														)} text-[9px] sm:text-xs font-bold px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase"
													>
														{getSessionBadge(session)}
													</span>
												{/if}
												{#if currentSession && dayIndex === currentSession.dayIndex && sessionIndex === currentSession.sessionIndex}
													<span class="bg-green-500 text-white text-[9px] sm:text-xs font-bold px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full">● LIVE</span>
												{/if}
												{#if nextSession && dayIndex === nextSession.dayIndex && sessionIndex === nextSession.sessionIndex}
													<span class="bg-blue-500 text-white text-[9px] sm:text-xs font-bold px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full">UP NEXT</span>
												{/if}
											</div>

											<h3
												class="{session.type === 'keynote' || session.type === 'workshop'
													? 'text-sm sm:text-2xl font-bold'
													: 'text-sm sm:text-xl font-semibold'} {session.type === 'keynote'
													? 'text-yellow-400'
													: session.type === 'workshop'
														? 'text-blue-400'
														: ''} line-clamp-2 leading-snug"
											>
												{session.title}
											</h3>

											{#if session.speaker}
												<p class="text-slate-300 text-xs sm:text-base line-clamp-1">{session.speaker}</p>
											{/if}

											{#if session.description}
												<p class="text-slate-300 text-xs sm:text-base line-clamp-2 mt-1">{session.description}</p>
											{/if}
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
