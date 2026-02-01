export const schedule = {
	days: [
		{
			date: 'January 31, 2026',
			title: 'Day 1 - Saturday, January 31',
			sessions: [
				{ time: '08:00', title: '📝 Registration', type: 'break' },
				{ time: '09:00', title: 'Opening address, Bangkok.rb', speaker: 'Bill Sendewicz', image: '/images/shared/logo/logo-square.png', type: 'session' },
				{ time: '09:10', title: 'Opening keynote: Startups on Rails in 2026', speaker: 'Irina Nazarova', image: '/images/speakers/irina_nazarova_1.png', type: 'keynote' },
				{ time: '10:00', title: '15 years of Rails with Domain Driven Design - lessons learnt', speaker: 'Andrzej Krzywda', image: '/images/speakers/2026/andrzej_krzywda.jpg', type: 'session' },
				{ time: '10:30', title: '☕ Coffee break', type: 'break' },
				{ time: '10:50', title: "Don't rewrite your framework", speaker: 'Vinícius Alonso', image: '/images/speakers/2026/vinicius_alonso.jpg', type: 'session' },
				{ time: '11:25', title: 'SOLID Golden Hammer', speaker: 'Arkadiy Zabazhanov', image: '/images/speakers/2026/arkadiy_zabazhanov.jpg', type: 'session' },
				{ time: '12:00', title: 'Breaking Rules to Ship Products: A Beginner\'s Rails Journey', speaker: 'Onur Ozer', image: '/images/speakers/2026/onur_ozer.jpg', type: 'session' },
				{ time: '12:30', title: '🍽️ Buffet lunch', type: 'break' },
				{ time: '13:30', title: 'Typesense Workshop: Hands-on workshop on building search with Typesense', speaker: 'Typesense', image: '/images/sponsors/vector/typesense.svg', type: 'workshop' },
				{ time: '14:00', title: 'operating rails: what about after you deploy?', speaker: 'André Arko', image: '/images/speakers/2026/andre_arko.jpg', type: 'session' },
				{ time: '14:35', title: 'If You Didn\'t Record It, It Didn\'t Happen: Practical Observability for Rails', speaker: 'Aaron Cruz', image: '/images/speakers/2026/aaron-cruz.jpg', type: 'session' },
				{ time: '15:05', title: '☕ Coffee break', type: 'break' },
				{ time: '15:35', title: 'Ruby in the 8 bit world - a small mruby VM for the Zilog Z80', speaker: 'Yuji Yokoo', image: '/images/speakers/2026/yuji_yokoo.jpg', type: 'session' },
				{ time: '16:10', title: 'Closing keynote: Herb to ReActionView: A New Foundation for the View Layer', speaker: 'Marco Roth', image: '/images/speakers/marco_roth.jpeg', type: 'keynote' },
				{ time: '17:00', title: 'Official Party @ The Deck', description: 'Join us for the official party at the end of day 1! All ticketholders are welcome to a relaxed evening of food, drinks, and conversation at The Deck, just a five minute walk from the conference venue. Please note due to circumstances beyond our control, there is a alcohol ban in Thailand due to upcoming elections from 6pm Saturday to 6pm Sunday, so we\'ll be unable to serve alcohol at the party after 6pm.', image: '/images/2026/thedeck.jpg', type: 'event' }
			]
		},
		{
			date: 'February 1, 2026',
			title: 'Day 2 - Sunday, February 1',
			sessions: [
				{ time: '08:00', title: '📝 Registration', type: 'break' },
				{ time: '09:10', title: 'Opening keynote: The Architecture of Understanding: Building Clarity in Complex Ruby Systems', speaker: 'Ridhwana Khan', image: '/images/speakers/ridhwana_khan_1.jpeg', type: 'keynote' },
				{ time: '10:00', title: 'Building a Rails Engine from Scratch: Lessons from Active Storage Dashboard', speaker: 'Giovanni Panasiti', image: '/images/speakers/2026/giovanni_panasiti.jpg', type: 'session' },
				{ time: '10:30', title: '☕ Coffee break', type: 'break' },
				{ time: '10:50', title: 'Ethical AI Push Forward: Turning One-Off Originals into Infinite Prints', speaker: 'Alex Timofeev', image: '/images/speakers/2026/alex_timofeev.jpg', type: 'session' },
				{ time: '11:25', title: 'Cell-based Architecture with Ruby on Rails', speaker: 'Roonglit Chareonsupkul', image: '/images/speakers/2026/roonglit_chareonsupkul.jpg', type: 'session' },
				{ time: '12:00', title: 'Metaprogramming isn\'t real, it can\'t hurt you', speaker: 'Okura Masafumi', image: '/images/speakers/2026/okura_masafumi.jpg', type: 'session' },
				{ time: '12:30', title: '🍽️ Buffet lunch', type: 'break' },
				{ time: '14:00', title: 'From 9-to-5 to Pull Requests: Sustainable Open Source Contribution', speaker: 'Joshua Young', image: '/images/speakers/2026/joshua_young.jpg', type: 'session' },
				{ time: '14:35', title: 'Simulation Testing for Background Jobs', speaker: 'Stephen Margheim', image: '/images/speakers/2026/stephen_margheim.jpg', type: 'session' },
				{ time: '15:05', title: '☕ Coffee break', type: 'break' },
				{ time: '15:35', title: 'What software engineers can learn from the Chernobyl disaster', speaker: 'Frederick Cheung', image: '/images/speakers/2026/frederick_cheung.jpg', type: 'session' },
				{ time: '16:10', title: 'Closing keynote: Ruby Is the Best Language for Building AI Web Apps', speaker: 'Carmine Paolino', image: '/images/speakers/carmine_paolino_1.jpeg', type: 'keynote' },
				{ time: '17:00', title: 'Closing remarks', speaker: 'Bangkok.rb Team', image: '/images/shared/logo/logo-square.png', type: 'session' }
			]
		}
	]
};

export function getCurrentAndNextSessions(scheduleData) {
	const now = new Date();
	
	for (const day of scheduleData.days) {
		const sessions = day.sessions;
		let currentSession = null;
		let nextSession = null;
		
		for (let i = 0; i < sessions.length; i++) {
			const session = sessions[i];
			const sessionTime = new Date(`${day.date} ${session.time}`);
			const nextSessionTime = i < sessions.length - 1 
				? new Date(`${day.date} ${sessions[i + 1].time}`)
				: null;
			
			// Only treat as current if we're on the same day
			const dayDate = new Date(day.date);
			const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			const sessionDate = new Date(sessionTime.getFullYear(), sessionTime.getMonth(), sessionTime.getDate());
			
			if (now >= sessionTime && (!nextSessionTime || now < nextSessionTime) && nowDate.getTime() === sessionDate.getTime()) {
				currentSession = { ...session, dayIndex: scheduleData.days.indexOf(day), sessionIndex: i };
				nextSession = nextSessionTime 
					? { ...sessions[i + 1], dayIndex: scheduleData.days.indexOf(day), sessionIndex: i + 1 }
					: null;
				return { currentSession, nextSession, day };
			}
		}
	}
	
	// If no current session, find the first upcoming session
	for (const day of scheduleData.days) {
		const sessions = day.sessions;
		
		for (let i = 0; i < sessions.length; i++) {
			const session = sessions[i];
			const sessionTime = new Date(`${day.date} ${session.time}`);
			
			if (now < sessionTime) {
				return { 
					currentSession: null, 
					nextSession: { ...session, dayIndex: scheduleData.days.indexOf(day), sessionIndex: i }, 
					day 
				};
			}
		}
	}
	
	return { currentSession: null, nextSession: null, day: null };
}
