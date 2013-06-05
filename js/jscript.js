$(function() {
	new Pack(document.getElementById("pack"));
	new SettingsPanel(document.getElementById("settings-panel"));
});

function SettingsPanel(elem) {
	var self = this;
	
	init();
	
	function init() {
		initVarsAndElems();
		makeHtml();
		handleEvents();
	}
	
	function initVarsAndElems() {
		self.$elem = $(elem);
		self.$elem.data("OptionsPanel", self);
		//self.$translation = self.$elem.find(".")
	}

	function makeHtml() {
		if(!window.vocabulary) return;
		self.$elem.append(getVocabularyLists(vocabulary));
	}

	function handleEvents() {
		self.$elem.delegate("li", "click", clickItem);

		function clickItem(e) {
			self.$elem.find("li").removeClass("i-checked");
			$(this).addClass("i-checked");
			$("#pack").data("Pack")._resetGroupArray();
			e.stopPropagation();
		}
	}

	function getVocabularyLists(json) {
		var html = "";
		if(typeof json == "object" && !json.item) {
			html += '<ul class="b-settings__checkbox-list">';
			for(var key in json) {
				html += '<li class="b-settings__checkbox-list__item" data-key="' + key + '">' + key;
				if(typeof json[key] == "object" && !json[key][0]) {
					html += getVocabularyLists(json[key]);
				}
				html += '</li>';
			}
			html += '</ul>';
		}

		return html;
	}

}

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
		self.$elem.data("Pack", self);
		self.$nextButton = $("#next-button");
		self.$shuffleButton = $("#shuffle-button");
		self.group = [];
		self.cards = [];
		self.$current;
	}

	function makeHtml() {
		self.group = vocabulary.italiano;
		self.group = shuffleGroup();
		makeCards();
		showFirstCard();
	}

	function shuffleGroup(groupArray) {
		var array = groupArray || self.group;
		var group = [];

		for(var i = 0; i < array.length; i++) {
			group[i] = array[i];
		}

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
		self.$elem
			.delegate(".b-card", "click", clickCard)
			.delegate(".b-card", "swipeleft", swipeleftCard);
		self.$nextButton.click(clickNextButton);
		self.$shuffleButton.click(clickShuffleButton);

		function clickCard() {
			$(this).find(".b-card__translation").slideDown();
		}

		function swipeleftCard() {
			clickNextButton();
		}

		function clickNextButton() {
			if(!self.$current) return;
			hideCurrentCard();
			showNextCard();
		}

		function hideCurrentCard() {
			//self.$current.removeClass("i-current");
			var $card = self.$current;
			$card.animate({marginLeft: -750}, function() {console.log("");
				$card.animate({marginLeft: 0, opacity: 0.5});
			}, function() {
				$card.removeClass("i-current");
			});
		}

		function showNextCard() {
			self.$current = self.$current.next(".b-card");
			self.$current.addClass("i-current");
			if(!self.$current || !self.$current.is("div")) clickShuffleButton();
		}
	}

	function clickShuffleButton() {
		self.group = shuffleGroup();
		makeCards();
		showFirstCard();
	}

	function resetGroupArray() {
		self.group = [];
		var key = $("#settings-panel .i-checked").attr("data-key");
		if(key) {
			self.group = vocabulary[key];
		}
		clickShuffleButton();
	}

	/*-- public methods --*/

	this._resetGroupArray = function() {
		resetGroupArray();
	};
}