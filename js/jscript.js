$(function() {
	new SettingsPanel(document.getElementById("settings-panel"));
	new Pack(document.getElementById("pack"));
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
		self.$elem.data("SettingsPanel", self);
		self.$translation = self.$elem.find("#translation");
	}

	function makeHtml() {
		if(!window.vocabulary) return;
		self.$elem.append(getVocabularyLists(vocabulary));
	}

	function handleEvents() {
		self.$elem.delegate("li", "click", clickItem);
		self.$translation.change(changeTranslation);
		
		function changeTranslation() {
			$("#pack").data("Pack")._inverseLanguages();
		}
	
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
		self.$cards = [];
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
		self.$cards = self.$elem.find(".b-card");
		if($("#settings-panel").data("SettingsPanel").$translation.val() == "from") {
			inverseLanguages();
		}
	}

	function showFirstCard() {
		self.$current = $(self.$cards[0]);
		self.$current.addClass("i-current");
	}
	
	function handleEvents() {
		self.$elem
			.delegate(".b-card", "click", clickCard)
			.delegate(".b-card", "swipeleft", swipeleftCard);
		self.$nextButton.click(clickNextButton);
		self.$shuffleButton.click(clickShuffleButton);

		function clickCard() {
			$(this).find("div:hidden").fadeIn();
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
			$card
				.addClass("i-animated")
				.removeClass("i-current")
				.animate({marginLeft: -450, opacity: 0.5}, 200, function() {
					$card.removeClass("i-animated");
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
	
	function inverseLanguages() {
		self.$cards.each(function() {
			var $this = $(this);
			var $div0 = $this.find("div:eq(0)");
			var $div1 = $this.find("div:eq(1)");
			$this.toggleClass("i-inverse");
			$div0.before($div1);
		});
	}

	/*-- public methods --*/

	this._resetGroupArray = function() {
		resetGroupArray();
	};
	
	this._inverseLanguages = function() {
		inverseLanguages();
	};
}