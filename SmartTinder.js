function hasBlacklistKeywords(bio) {
	const blacklist = [
		'ladyboy',
		'banci',
		'bencong',
		'lady boy',
		'not a lady',
		'not lady',
		'not a girl',
		'not girl',
		'trans',
		'shemale',
		'chubby',
		'barn',
		'børn'
	];

	for (item of blacklist) {
		if (bio.toLowerCase().indexOf(item) !== -1) {
			console.log('skipping profile, matched blacklist keyword ' + item);
			return true;
		}
	}
	return false;
}

function hasValidProfile() {
	try {
		const bioName = 'Px(16px) Py(12px) Us(t) C($c-ds-text-secondary) BreakWord Whs(pl) Typs(body-1-regular)'
		const bioP = document.getElementsByClassName(bioName);
		if (!bioP[0] === undefined) return true;
		const bio = bioP[0].textContent;
		console.log(bio);
		return !hasBlacklistKeywords(bio);
	} catch (e) {
		return true; // possible empty bio
	}
}

function checkTinder() {
	const base = "https://tinder.com/";
	return window.location.href.startsWith(base + "app/recs") || window.location.href.startsWith(base + "app/matches");
}

function isMatch() {
	return document.querySelector('a.active');
}

// prevent async execution
function pause(milliseconds) {
	const dt = new Date();
	while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
}

function trickTinder() {
	const infoClassName = 'P(0) Trsdu($normal) Sq(28px) Bdrs(50%) Cur(p) Ta(c) Scale(1.2):h Mb(12px)--ml Mb(8px) focus-button-style';
	const nbButtons = document.getElementsByClassName("button").length;
	const buttons = document.getElementsByClassName("button")

	const dislike = nbButtons === 5 ? buttons[1] : buttons[0];
	const like = nbButtons === 5 ? buttons[3] : buttons[2];

	// Open profile bio
	const info = document.getElementsByClassName(infoClassName)[0];
	if (info) {
		console.log("info click");
		info.click();
	}
	pause(600);

	// Like or deslike depending on validation
	if (hasValidProfile()) {
		like.click();
		console.log("like clicked");
		const thereIsMatch = isMatch();
		if (thereIsMatch) {
			console.log('------------- IT\'S A MATCH ! -------------');
			thereIsMatch.click();
		}
	} else {
		dislike.click();
	}

	// If reached max likes per day then show modal and get it's content...
	// Check if there is any subscription button...
	if (document.getElementsByClassName('productButton__subscriptionButton').length > 0) {
		// We get the counter thing
		const hms = document.getElementsByClassName('Fz($ml)')[0].textContent;
		// Split it at the colons
		const a = hms.split(':');
		// Minutes are worth 60 seconds. Hours are worth 60 minutes. 1 second = 1kmilliseconds.
		// Genius... rocket science...
		const seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])

		return seconds * 1000;
	}
}


// There is a lot more fun that can be achieved
// Need to add socket puppetry (VPNs solutions? several accounts?) - :D
// TODO: Need to accept automatically permissions except for
// TODO: Need to add ANN for fake pics
// TODO: Need to add RNN for fake messages

function getRandomPeriod() {
	return Math.round(Math.random() * (2000 - 500)) + 500;
}

(function loopSasori() {
	// A random period between 500ms and 2secs
	let randomPeriod = getRandomPeriod();

	setTimeout(function () {
		randomPeriod = undefined;

		if (checkTinder()) {
			const delay = trickTinder();

			if (delay) {
				console.log('Too many likes for now, have to wait: ' + delay + ' ms');
				randomPeriod = delay;
			}
		}

		if (!randomPeriod) {
			loopSasori();
		} else {
			setTimeout(loopSasori, randomPeriod);
		}
	}, randomPeriod);
}());