$(function() {
	new Pack(document.getElementById("pack"));
});

function Pack(elem) {
	var self = this;
	
	init();
	
	function init() {
		initVarsAndElems();
		makeHtml();
		handleEvents();
	}
	
	function initVarsAndElems() {
		self.$elem = $(elem);
		self.$elem.data("object", self);
		self.$nextButton = $("#next-button");
		self.$shuffleButton = $("#shuffle-button");
		self.group = [];
		self.cards = [];
		self.$current;
	}

	function makeHtml() {
		self.group = vocabulary.italian.lesson1;
		self.group = shuffleGroup();
		makeCards();
		showFirstCard();
	}

	function shuffleGroup(groupArray) {
		var group = groupArray || self.group;
		var result = [];
		var length = group.length;
		for(var i = 0; i < length; i++) {
			var rand = Math.round(Math.random() * (group.length - 1));
			result.push(group[rand]);
			group.splice(rand, 1);
		}

		return result;
	}

	function makeCards(groupArray) {
		var group = groupArray || self.group;
		self.$elem.empty();
		for(var i = 0; i < group.length; i++) {
			var $card = $('<div class="b-card"><div class="b-card__item">' + group[i].item + '</div><div class="b-card__translation">' + group[i].translation + '</div></div>');
			self.$elem.append($card);
		}
		self.cards = self.$elem.find(".b-card");
	}

	function showFirstCard() {
		self.$current = $(self.cards[0]);
		self.$current.addClass("i-current");
	}
	
	function handleEvents() {
		self.$elem.delegate(".b-card", "click", clickCard);
		self.$nextButton.click(clickNextButton);
		self.$shuffleButton.click(clickShuffleButton);

		function clickCard() {
			$(this).find(".b-card__translation").slideDown();
		}

		function clickNextButton() {
			if(!self.$current) return;
			hideCurrentCard();
			showNextCard();
		}

		function hideCurrentCard() {
			self.$current.removeClass("i-current");
		}

		function showNextCard() {
			self.$current = self.$current.next(".b-card");
			self.$current.addClass("i-current");
			if(!self.$current || !self.$current.is("div")) clickShuffleButton();
		}

		function clickShuffleButton() {
			self.group = shuffleGroup();
			makeCards();
			showFirstCard();
		}
	}
}

var vocabulary = {
	"italian": {
		"lesson1": [
			{
				"item": "Ciao!",
				"translation": "привет, пока"
			},
			{
				"item": "Come stai?",
				"translation": "Как дела?"
			},
			{
				"item": "Buongiorno!",
				"translation": "Доброе утро!"
			},
			{
				"item": "Buona sera!",
				"translation": "Добрый вечер!"
			},
			{
				"item": "Come ti chiami?",
				"translation": "Как тебя зовут?"
			},
			{
				"item": "Il mio nome è ...",
				"translation": "Меня зовут…"
			},
			{
				"item": "Di dove sei?",
				"translation": "Откуда ты?"
			}
		]
	}
};