PROMPTS = 	[
				{
					platform: 'Instagram',
					content: 'Your friend posted a new story',
					reactions: ['View Story']
				},
				{
					platform: 'Instagram',
					content: 'Your friend posted a new photo',
					reactions: ['Like']
				},
				{
					platform: 'Instagram',
					content: "Your best friend's awful ex posted a new photo",
					reactions: ['Unfollow'],
					bomb: true
				},
				{
					platform: 'Instagram',
					content: 'You see a funny video you want to share with your best friend',
					reactions: ['Message', 'Tag']
				},
				{
					platform: 'Instagram',
					content: 'Your friend tagged you in a post',
					reactions: ['Reply', 'Like']
				},
				{
					platform: 'Instagram',
					content: 'A stranger sent you a friend request',
					reactions: ['Stalk', 'Allow Following']
				},
				{
					platform: 'Instagram',
					content: 'Someone tagged you in a photo of you drunk at a party last week',
					reactions: ['Reply', 'Like', 'Untag']
				},
				{
					platform: 'Instagram',
					content: "Someone you don't follow sent you a DM",
					reactions: ['Reply', 'Stalk', 'Block']
				},
				{
					platform: 'Snapchat',
					content: 'Your friend posted a new story',
					reactions: ['View Story']
				},
				{
					platform: 'Snapchat',
					content: 'Your friend sent you a snap',
					reactions: ['Reply']
				},
				{
					platform: 'Snapchat',
					content: 'Your friend is typing...',
					reactions: ['Nothing']
				},
				{
					platform: 'Snapchat',
					content: 'An acquaintance took a screenshot of your snap',
					reactions: ['Message']
				},
				{
					platform: 'Snapchat',
					content: 'Your streak with a friend is about to end',
					reactions: ['Send a Snap', 'Reply'],
					bonus: true
				},
				{
					platform: 'Facebook',
					content: 'Your friend posted a new story',
					reactions: ['View Story']
				},
				{
					platform: 'Facebook',
					content: 'Your friend mentioned you in a comment',
					reactions: ['Reply', 'Like']
				},
				{
					platform: 'Facebook',
					content: 'A stranger liked your post',
					reactions: ['Stalk']
				},
				{
					platform: 'Facebook',
					content: 'An acquaintance liked your photo from 10 years ago',
					reactions: ['Stalk']
				},
				{
					platform: 'Facebook',
					content: 'Your friend tagged you in a meme',
					reactions: ['Reply', 'Like']
				},
				{
					platform: 'Facebook',
					content: 'Someone tagged you in a photo of you drunk at a party last week',
					reactions: ['Untag', 'Hide from Timeline']
				},
				{
					platform: 'Facebook',
					content: 'Your 261 group sends you a message telling you to do work',
					reactions: ['Reply'],
					bonus: true
				}
			];

TIME_LIMIT = 5;
var current_index = 0;
var seconds_left = TIME_LIMIT;
var interval;
var followerCount = 0;
var mistakes = [];

$(document).ready(function(){
	$('#startBtn').on('click', function() {
		$('#startBtnSegment').addClass('hidden');
		$('#followerCountSegment').removeClass('hidden');
		shuffle(PROMPTS);
		$('#promptSegment').removeClass('hidden');
		prompt(0);
		//$('#promptSegment').addClass('hidden');
	});

	$('.reactionBtn').on('click', function() {
		if (PROMPTS[current_index].reactions.includes($(this).data('reaction'))) {
			if (PROMPTS[current_index].bonus === true) {
				followerCount += 5;
				$('#followerCount').html('<i class="users icon"></i> ' + followerCount);
				$('#followerCount').transition('jiggle');
				//bonus
			}
			else {
				followerCount++;
				$('#followerCount').html('<i class="users icon"></i> ' + followerCount);
				$('#followerCount').transition('pulse');
			}
		}
		else {
			console.log('prompt: ' + PROMPTS[current_index].content);
			console.log('tapped reaction: ' + $(this).data('reaction'));
			console.log('expected reaction: ' + PROMPTS[current_index].reactions);
			if (PROMPTS[current_index].bomb === true) {
				followerCount = 0;
				$('#followerCount').html('<i class="users icon"></i> ' + followerCount);
				$('#followerCount').transition('flash');
				//bomb
			}
			else {
				if (followerCount > 0) {
					followerCount--;
				}
				$('#followerCount').html('<i class="users icon"></i> ' + followerCount);
				$('#followerCount').transition('shake');
			}
		}

		stopCountdown();
	});
});

function prompt() {
	if (current_index < PROMPTS.length) {
		//$('#promptDimmer').addClass('active');
		$('#promptHeader').html(logo(PROMPTS[current_index].platform) + PROMPTS[current_index].platform);
		$('#promptContent').html(PROMPTS[current_index].content);
		$(reaction(PROMPTS[current_index].platform)).removeClass('hidden');
		countdown(current_index);
	}
	else {
		$('#promptSegment').addClass('hidden');
		$('#resultSegment').removeClass('hidden');
		$('#resultContent').html('You have spent about 3 minutes and gained ' + followerCount + ' followers :D');
	}
}

function countdown() {
	$('#countdown').html("<i class='clock icon'></i>" + seconds_left);
	$('#countdown').removeClass('hidden');
	//$('#promptDimmer').removeClass('active');
	
	interval = setInterval(function() {
		$('#countdown').html("<i class='clock icon'></i>" + seconds_left);	
		seconds_left--;

		if (seconds_left < 0) {
			stopCountdown();
		}
	}, 1000);
}

function stopCountdown() {
	$('#countdown').addClass('hidden');
	$('.reactionPane').addClass('hidden');
	clearInterval(interval);
	current_index++;
	seconds_left = TIME_LIMIT;
	prompt(current_index);
}

function logo(platform) {
	if (platform === 'Facebook') {
		name = 'blue facebook square';
	}

	if (platform === 'Snapchat') {
		name = 'yellow snapchat square';
	}

	if (platform === 'Instagram') {
		name = 'pink instagram';
	}

	return '<i class="' + name + ' icon"></i>';
}

function reaction(platform) {
	if (platform === 'Facebook') {
		name = 'facebook';
	}

	if (platform === 'Snapchat') {
		name = 'snapchat';
	}

	if (platform === 'Instagram') {
		name = 'instagram';
	}

	return '#' + name + 'Reactions';
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}