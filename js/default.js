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

var TIME_LIMIT = 5;
var current_index = 0;
var seconds_left = TIME_LIMIT;
var interval;
var followerCount = 0;
var reacted = false;

var instruction_img_dir_prefix = 'img/instructions/intro-';
var instruction_img_dir_suffix = '.jpg';
var instruction_img_index = 1;
var instruction_img_last_index = 8;

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

$(document).ready(function(){
	var correct_sound = new sound('sound/correct.flac');
	var incorrect_sound = new sound('sound/incorrect.mp3');
	var bonus_sound = new sound('sound/bonus.mp3');
	var bomb_sound = new sound('sound/bomb.wav');

	$('#startBtn').on('click', function() {
		$('#startBtnSegment').addClass('hidden');
		$('#followerCountSegment').removeClass('hidden');
		shuffle(PROMPTS);
		$('#promptSegment').removeClass('hidden');
		prompt();
		//$('#promptSegment').addClass('hidden');
	});

	/*
	$('#helpBtn').popup({
		content: ''
	});
*/

	$('#helpBtn').on('click', function() {
		$('#instructions').modal({
			blurring: true,
			onHidden: function() {
				$('#helpBtn').popup('fchange content', 'hello');
			}
		}).modal('show');
		$('#instructions').modal()
		$('#instructionNav_prev').transition('fade');
		$('#instructionNav_next').on('click', function() {
			if (instruction_img_index < instruction_img_last_index) {
				$('#instruction_img_'+instruction_img_index).addClass('hidden');
				instruction_img_index++;
				$('#instruction_img_'+instruction_img_index).removeClass('hidden');

				if (instruction_img_index === 2) {
					$('#instructionNav_prev').transition('fade');
				}

				if (instruction_img_index === instruction_img_last_index) {
					$('#instructionNav_next').transition('fade');
				}
			}
		});

		$('#instructionNav_prev').on('click', function() {
			if (instruction_img_index > 1) {
				
				$('#instruction_img_'+instruction_img_index).addClass('hidden');
				instruction_img_index--;
				$('#instruction_img_'+instruction_img_index).removeClass('hidden');
				
				/*
				$('#instruction_img').transition({
					animation : 'fade',
				    duration  : 100
				  })
				.transition({
					animation : 'fade',
				    duration  : 100
				});
				*/

				if (instruction_img_index === 1) {
					$('#instructionNav_prev').transition('fade');
				}

				if (instruction_img_index === instruction_img_last_index - 1) {
					$('#instructionNav_next').transition('fade');
				} 
			}
		});

	});

	$('.reactionBtn').on('click', function() {
		if (!reacted) {
			var THIS = this;
			reacted = true;
			var iconName = null;
			var sound = null;

			var current_prompt = PROMPTS[current_index];
			var reaction = $(this).data('reaction');

			if (current_prompt.reactions.includes(reaction)) {
				if (PROMPTS[current_index].bonus === true) {
					followerCount += 5;
					$('#followerCount').html('<i class="users icon"></i> ' + followerCount);
					$('#followerCount').transition('jiggle');
					iconName = 'star';
					sound = bonus_sound;
				}
				else {
					followerCount++;
					$('#followerCount').html('<i class="users icon"></i> ' + followerCount);
					$('#followerCount').transition('pulse');
					iconName = 'check';
					sound = correct_sound;
				}
			}
			else {
				if (PROMPTS[current_index].bomb === true) {
					followerCount = 0;
					$('#followerCount').html('<i class="users icon"></i> ' + followerCount);
					$('#followerCount').transition('flash');
					iconName = 'bomb';
					sound = bomb_sound;
				}
				else {
					if (followerCount > 0) {
						followerCount--;
					}
					$('#followerCount').html('<i class="users icon"></i> ' + followerCount);
					$('#followerCount').transition('shake');
					iconName = 'times';
					sound = incorrect_sound;
				}

				appendToDashboard(current_prompt, reaction);
			}

			stopCountdown();
			
			$('.reactionBtn').addClass('disabled');
			$(THIS).removeClass('disabled');

			$(THIS).popup({
				html: '<i class="' + iconName + ' icon"></i>',
				variation: 'mini inverted',
				on: 'manual',
				position: 'top right',
				offset: 2
			}).popup('show');

			sound.play();

			setTimeout(function() {
				$(THIS).popup('destroy');
				$('.reactionBtn').removeClass('disabled');
				prompt();
			}, 1500);
		}
	});
});

function prompt() {
	$('.reactionPane').addClass('hidden');

	if (current_index < PROMPTS.length) {
		$('#promptHeader').html(logo(PROMPTS[current_index].platform) + PROMPTS[current_index].platform);
		$('#promptContent').html(PROMPTS[current_index].content);
		$(reaction(PROMPTS[current_index].platform)).removeClass('hidden');
		reacted = false;
		countdown(current_index);
	}
	else {
		$('#promptSegment').addClass('hidden');
		$('#resultSegment').removeClass('hidden');
		$('#resultContent').html('You spent 3 minutes and gained ' + followerCount + ' followers :D');	
		if (dashboardCount > 0) {
			$('#dashboardIntro').removeClass('hidden');
			$('#dashboard').html(dashboardContent);
		}
	}
}

function countdown() {
	$('#countdown').html("<i class='clock icon'></i>" + seconds_left);
	$('#countdown').removeClass('hidden');
	
	interval = setInterval(function() {
		$('#countdown').html("<i class='clock icon'></i>" + seconds_left);	
		seconds_left--;

		if (seconds_left < 0) {
			stopCountdown();
			prompt();
		}
	}, 1000);
}

function stopCountdown() {
	$('#countdown').addClass('hidden');
	clearInterval(interval);
	current_index++;
	seconds_left = TIME_LIMIT;
}

function logo(platform) {
	return '<i class="' + platformIconName(platform) + ' icon"></i>';
}

function platformIconName(platform) {
	if (platform === 'Facebook') {
		return 'blue facebook square';
	}

	if (platform === 'Snapchat') {
		return 'yellow snapchat square';
	}

	if (platform === 'Instagram') {
		return 'pink instagram';
	}
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

var dashboardCount = 0;
var dashboardContent = '';
function appendToDashboard(prompt, reaction) {
	dashboardCount++;

	dashboardContent += '<div class="item">'
						+ '<i class="large '
						+ platformIconName(prompt.platform)
						+ ' middle aligned icon"></i>'
					    + '<div class="content">'
					    + '<h2 class="header">'
					    + prompt.content
					    + '</h2>'
					    + '<div class="description">'
					    + 'Your reaction: '
					    + reaction
					    + '<br />'
					    + 'Appropriate reaction(s): '
					    + prompt.reactions.join(', ')
					    + '</div></div></div>';
}