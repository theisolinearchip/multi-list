/**
* multi-list.js is a jQuery plugin to turn a <ul> element into a multiple selectable list
*
* Author: Albert Gonzalez - http://www.albertgonzalez.coffee
* 
* Under a UNLICENSE (http://unlicense.org/)
*
*
* Init: $("<ul>").multiList();
* Remove: $("<ul>").multiList("remove");
*
* Get the selected values from the ul (the "value" attr from the li items): $("<ul>").multiList("getSelected");
* Get both the selected values and their full text field (the "value" attr from the li items and their text): $("<ul>").multiList("getSelectedFull");
*
* Get the unselected values from the ul (the "value" attr from the li items): $("<ul>").multiList("getUnselected");
* Get both the unselected values and their full text field (the "value" attr from the li items and their text): $("<ul>").multiList("getUnselectedFull");
*
* Select an element: $("<ul>").multiList("select", "<li> value");
* Unselect an element: $("<ul>").multiList("unselect", "<li> value");
*
* Select ALL the elements: $("<ul>").multiList("selectAll");
* Unelect ALL the elements: $("<ul>").multiList("unselectAll");
*
* Hide an element (accepts an ARRAY, this doesn't affect the selected/unselected property): $("<ul>").multiList("hide", "<li> value");
* Show an element (accepts an ARRAY): $("<ul>").multiList("show", "<li> value");
*
* Hide ALL the elements: $("<ul>").multiList("hideAll");
* Show ALL the elements: $("<ul>").multiList("showAll");
*
* Disable an element: $("<ul>").multiList("disable");
* Enable an element: $("<ul>").multiList("enable");
*
* Change an element name: $("<ul>").multiList("setName", "<li> value", "<li> new name");
*
* Events:
* "multiList.elementUnchecked": Triggered when unchecking an item. Params passed: "value" (the "value" attr from the li items) and "text (the full text)
* "multiList.elementChecked": Triggered when checking an item. Params passed: "value" (the "value" attr from the li items) and "text (the full text)
* 
*
*/

(function ($) {

	"use strict";

	$.fn.multiList = function(action, option, option2) {

		var response = undefined;
		var main_id = this.attr("id");

		// Event trigger aux vars
		var trigger_unchecked;
		var trigger_checked;

		if (action === undefined) {

			// Change the <ul>
			if (this[0].tagName == "UL" && $(this[0]).data("ml-setted") == undefined ) {

				// Create the container
				$("<div id='" + main_id + "_container' class='ml-container'></div>").insertAfter(this[0]);

				// Add the hidden input
				$("#" + main_id + "_container").append("<input id='" + main_id + "_input_values' type='hidden' />")

				// Add the filter box
				$("#" + main_id + "_container").append("<div class='ml-input-container'>"
														+ 	"<input id='" + main_id + "_input_filter' class='ml-input-filter' type='text' placeholder='Filter' onkeydown='if (event.keyCode == 13) return false;' >"
														+ "</div>");

				// Bind the filter box
				$("#" + main_id + "_input_filter").keyup(function() {
					var search = $(this).val();

					if (search == "") {
						$("." + main_id + "_list_item").show();
					} else {
						$("." + main_id + "_list_item").each(function() {
							if ( (($(this).text()).toLowerCase()).indexOf(search.toLowerCase()) > -1 ) {
								$(this).show();
							} else {
								$(this).hide();
							}
						});
					}

				});


				// Add the <ul> and change it
				this.detach().appendTo($("#" + main_id + "_container"));
				this.addClass("ml-ul");
				
				// Change the <li> 

				$.each(
					$("#" + main_id).children("li"),
					function(index, element) {

						// Add the custom class to the <li> (ml-li) and one unique for this list
						$(element).addClass("ml-li");
						$(element).addClass(main_id + "_list_item");

						// Append the checkbox inside the <li>
						$(element).html("<input type='checkbox' data-full_text='" + $(element).text() + "' id='" + main_id + "_checkbox_" + $(element).attr("value") + "'>"
										+ "<span>" + $(element).text() + "</span>");
						$(element).wrap("<label style='display: inherit !important;'></label>");

						// Bind the onclick event on the <li> element
						$(element).find("input").change(function() {

							var selected_array = ($("#" + main_id + "_input_values").val() != "" ? $("#" + main_id + "_input_values").val().split(",") : []);

							var position = $.inArray($(element).attr("value"), selected_array);
							if (position > -1) {
								// it's in the array
								if (!$(this).is(":checked")) {
									// only do stuff if it's in the array and not checked (must remove)
									selected_array.splice(position, 1);

									//Trigger the "element removed" event
									trigger_unchecked = true;
								}
							} else {
								//it's not in the array
								if ($(this).is(":checked")) {
									// only do stuff if it's not in the array and checked (must add)
									selected_array.push($(element).attr("value"));

									//Trigger the "element removed" added
									trigger_checked = true;
								}
							}

							$("#" + main_id + "_input_values").val(selected_array.toString());

							// Trigger events if proceed
							// (we do it BEFORE the _input_values field is set, so the events will work
							// with the current array and not with the old one)

							if (trigger_unchecked) {
								$("#" + main_id).trigger("multiList.elementUnchecked", [$(element).attr("value"), $(this).data("full_text")]);
								trigger_unchecked = false;
							}

							if (trigger_checked) {
								$("#" + main_id).trigger("multiList.elementChecked", [$(element).attr("value"), $(this).data("full_text")]);
								trigger_checked = false;
							}

						});

					}
				);

				$(this).data("ml-setted", 1);

			}

			response = this;

		} else if (action === "remove") {
			if ($("#" + main_id + "_container").length > 0) {
				$("#" + main_id + "_container").parent().append("<ul id='" + main_id + "'></ul>");
				$("#" + main_id + "_container").remove();
			}

			response = this;

		} else if (action === "getSelected") {
			if ($("#" + main_id + "_input_values").length != 0) {
				response = ($("#" + main_id + "_input_values").val() != "" ? $("#" + main_id + "_input_values").val().split(",") : []);
			}
		} else if (action === "getSelectedFull") {
			if ($("#" + main_id + "_input_values").length != 0) {
				response = [];
				var selected_array = ($("#" + main_id + "_input_values").val() != "" ? $("#" + main_id + "_input_values").val().split(",") : []); 
				for (var i = 0; i < selected_array.length; i++) {
					response.push([selected_array[i], $("#" + main_id + "_checkbox_" + selected_array[i]).data("full_text")]);
				}
			}
		} else if (action == "getUnselected") {
			response = [];
			$.each($("#" + main_id + " li"), function(index, value) {
				if (!$(value).find("input").prop('checked') ) {
					response.push($(value).attr("value"));
				}
			});
		} else if (action == "getUnselectedFull") {
			response = [];
			$.each($("#" + main_id + " li"), function(index, value) {
				if (!$(value).find("input").prop('checked') ) {
					response.push([$(value).attr("value"), $("#" + main_id + "_checkbox_" + $(value).attr("value")).data("full_text")]);
				}
			});
		} else if (action === "select" && option !== undefined) {
			if ($("#" + main_id + "_input_values").length != 0 && !$("#" + main_id + " li[value='" + option + "']").hasClass('ml-hide') ) {
				if (!$("#" + main_id + " li[value='" + option + "']").find("input").prop("disabled")) {
					$("#" + main_id + " li[value='" + option + "']").find("input").prop('checked', true);
					$("#" + main_id + " li[value='" + option + "']").find("input").trigger("change");
				}
			}
		} else if (action === "unselect" && option !== undefined) {
			if ($("#" + main_id + "_input_values").length != 0  && !$("#" + main_id + " li[value='" + option + "']").hasClass('ml-hide')) {
				if (!$("#" + main_id + " li[value='" + option + "']").find("input").prop("disabled")) {
					$("#" + main_id + " li[value='" + option + "']").find("input").prop('checked', false);
					$("#" + main_id + " li[value='" + option + "']").find("input").trigger("change");
				}
			}
		} else if (action === "selectAll") {
			if ($("#" + main_id + "_input_values").length != 0) {
				$("#" + main_id + " li:not(.ml-hide) input:enabled:not(:checked)").each(function(index, value) {
					$(value).prop('checked', true).trigger("change");
				});
			}
		} else if (action === "unselectAll") {
			if ($("#" + main_id + "_input_values").length != 0) {
				$("#" + main_id + " li:not(.ml-hide) input:enabled:checked").each(function(index, value) {
					$(value).prop('checked', false).trigger("change");
				});
			}
		} else if (action === "hide") {
			if ($("#" + main_id + "_input_values").length != 0) {
				if (typeof(option) == "string") {
					$("#" + main_id + " li[value='" + option + "']").addClass('ml-hide');
				} else if (typeof(option) == "object") {
					$.each(option, function(index, value) {
						$("#" + main_id + " li[value='" + value + "']").addClass('ml-hide');
					});
				}
			}
		} else if (action === "show") {
			if ($("#" + main_id + "_input_values").length != 0) {
				if (typeof(option) == "string") {
					$("#" + main_id + " li[value='" + option + "']").removeClass('ml-hide');
				} else if (typeof(option) == "object") {
					$.each(option, function(index, value) {
						$("#" + main_id + " li[value='" + value + "']").removeClass('ml-hide');
					});
				}

				typeof(option); 
			}
		} else if (action === "hideAll") {
			if ($("#" + main_id + "_input_values").length != 0) {
				$("#" + main_id + " li").addClass('ml-hide');
			}
		} else if (action === "showAll") {
			if ($("#" + main_id + "_input_values").length != 0) {
				$("#" + main_id + " li").removeClass('ml-hide');
			}
		} else if (action === "disable") {
			if ($("#" + main_id + "_input_values").length != 0) {
				if (typeof(option) == "string") {
					$("#" + main_id + " li[value='" + option + "']").addClass('ml-disabled-element-li');
					$("#" + main_id + " li[value='" + option + "']").find("input").addClass('ml-hide');
					$("#" + main_id + " li[value='" + option + "']").find("input").attr('disabled', true);
					$("#" + main_id + " li[value='" + option + "']").find("input").attr('checked', false);
				} else if (typeof(option) == "object") {
					$.each(option, function(index, value) {
						$("#" + main_id + " li[value='" + value + "']").addClass('ml-disabled-element-li');
						$("#" + main_id + " li[value='" + value + "']").find("input").addClass('ml-hide');
						$("#" + main_id + " li[value='" + value + "']").find("input").attr('disabled', true);
					$("#" + main_id + " li[value='" + value + "']").find("input").attr('checked', false);
					});
				}
			}
		} else if (action === "enable") {
			if ($("#" + main_id + "_input_values").length != 0) {
				if (typeof(option) == "string") {
					$("#" + main_id + " li[value='" + option + "']").removeClass('ml-disabled-element-li');
					$("#" + main_id + " li[value='" + option + "']").find("input").removeClass('ml-hide');
					$("#" + main_id + " li[value='" + option + "']").find("input").attr('disabled', false);
				} else if (typeof(option) == "object") {
					$.each(option, function(index, value) {
						$("#" + main_id + " li[value='" + value + "']").removeClass('ml-disabled-element-li');
						$("#" + main_id + " li[value='" + value + "']").find("input").removeClass('ml-hide');
						$("#" + main_id + " li[value='" + value + "']").find("input").attr('disabled', false);
					});
				}

				typeof(option); 
			}
		} else if (action === "setName") {
			if ($("#" + main_id + "_input_values").length != 0 && typeof(option2) != "undefined") {
				$("#" + main_id + " li[value='" + option + "']").find("input").data("full_text", option2);
				$("#" + main_id + " li[value='" + option + "'] label span").html(option2);
			}
		}

		return response;

	}


}(jQuery));
