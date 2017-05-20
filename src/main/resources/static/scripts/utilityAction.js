$(function() {
	$("#leftPane li").draggable({
		appendTo : "#rightPane",
		cursorAt : {
			top : 0,
			left : 0
		},
		helper : function() {
			$('#propPane').css("display", "none");
			var retData = getComponent($(this).text());
			return $(retData)[0];
		},
		scroll : true,
		cursor : "move",
		grid : [ 5, 5 ],
		revert : "invalid"
	});

	/*
	 * $("#rightPane").droppable({ greedy: true, cursor : 'move', accept :
	 * '#leftPane li, .dragitems', tolerance: 'touch', activeClass:
	 * "ui-state-hover", hoverClass: "ui-state-active", drop : dropEvent });
	 */

});

$(document).on('mouseenter', '*', function() {
	$("#rightPane, .dragitems").droppable({
		greedy : true,
		cursor : 'move',
		accept : '#leftPane li, .dragitems',
		tolerance : 'touch',
		activeClass : "ui-state-hover",
		hoverClass : "ui-state-active",
		drop : dropEvent
	});
});

function dropEvent(event, ui) {
	$('#propPane').css("display", "none");
	writeLog('Class : ' + ui.draggable.attr("class") + '<br />');
	var parentPos = $(event.target).offset();
	var position = ui.position;
	writeLog("parentPos left: " + parentPos.left + ", parentPos top: "
			+ parentPos.top + '<br />');
	writeLog("left: " + position.left + ", top: " + position.top + '<br />');
	var displayData = $(ui.helper).clone(false).css({
		position : 'absolute',
		left : ui.offset.left - parentPos.left,
		top : ui.offset.top - parentPos.top
	});
	if (ui.draggable.attr("class").match('^ui-draggable')) {
		/*
		 * $(document).on('mouseover', '*', function(event) {
		 * $(event.target).append(displayData); });
		 */

		writeLog($(event.target).attr("id"));

		$(this).append(displayData);

		$('.dragitems').draggable({
			cancel : '',
			cursor : "move"/*
							 * , revert: "invalid",
							 */
		});

		writeLog('Dropped!!<br />');
		$("textarea").resizable();
	}
	event.stopPropagation();
}

$(document).on('dblclick', '.dragitems', function() {
	$(this).remove();
	$('#propTable').html('');
	$('#propPane').css("display", "none");
});

/*
 * $(document).on('mouseenter', '.dragitems', function() {
 * $(".dragitems").droppable({ greedy: true, cursor : 'move', accept :
 * '#leftPane li, .dragitems', activeClass: "ui-state-hover", hoverClass:
 * "ui-state-active", drop : dropEvent }); });
 */

/*
 * $('*').mouseover(function() { writeLog($(this).attr('id')); });
 */

var curComp = '';

$(document)
		.on(
				'click',
				'.dragitems',
				function(event) {
					var obj = event.target;
					var elementType = $(obj).prop('tagName');
					writeLog('elementType : ' + elementType + '<br />');
					$('#propTable')
							.html('<tr><th>Name</th><th>Value</th></tr>');
					$.each($(obj).get(0).attributes, function(k1, v1) {
						showAttributeTable(v1.nodeName, v1.nodeValue);
					});

					if (elementType == 'SELECT') {
						var values = $(obj).find('option').map(function() {
							return this.value;
						}).get().join(',');
						writeLog('Values : ' + values + '<br />');
						showAttributeTable('value list', values);
					}

					var tFooter = '<tr><td colspan="2" align="center"><input type="button" value="Save" onclick="updateProperties();"/></td></tr>';
					curComp = this;
					$('#propTable').append(tFooter);
					$('#propPane').css("display", "inline");
					event.stopPropagation();
				});

function showAttributeTable(nodeName, nodeValue) {
	$('#propTable').append(
			'<tr><td>' + nodeName + '</td><td><input type="text" value="'
					+ nodeValue + '" /></td></tr>');
}

function updateProperties() {
	var numberOfRows = $('#propTable tr').length;
	$('#propTable tr').each(
			function() {
				if (!this.rowIndex)
					return; // skip first row
				if ((this.rowIndex + 1) == numberOfRows)
					return; // skip last row

				var key = this.cells[0].innerHTML;
				var value = $(this.cells[1]).find("input").val();
				if (key != 'value list') {
					$(curComp).attr(key, value);
				}
				if (key == 'value' && $(curComp).prop('tagName') != 'SELECT') {
					$(curComp).html(value);
				}

				// add options in drop down
				if ($(curComp).prop('tagName') == 'SELECT'
						&& key == 'value list') {
					writeLog('Value List' + value);
					var optionsarray = value.split(',');
					var seloption = "";
					$.each(optionsarray, function(i) {
						seloption += '<option value="' + optionsarray[i] + '">'
								+ optionsarray[i] + '</option>';
					});
					$(curComp).html(seloption);
				}
			});
	$(curComp).focus();
}

// apply keydown event on all dragged items
$(document).on('keydown', '.dragitems', function(event) {
	writeLog('<font color="red"> key down : ' + event.which + '</font><br />');
	if (event.which == 40) {
		var temp_top = $(this).position().top;
		$(this).css('top', temp_top + 5);
	} else if (event.which == 39) {
		var temp_left = $(this).position().left;
		$(this).css('left', temp_left + 5);
	} else if (event.which == 38) {
		var temp_top = $(this).position().top;
		$(this).css('top', temp_top - 5);
	} else if (event.which == 37) {
		var temp_left = $(this).position().left;
		$(this).css('left', temp_left - 5);
	} else if (event.which == 46) {
		if (confirm('Do you really want to delete?')) {
			$(this).remove();
		}
	}
});

function writeLog(message) {
	$('#consolePane').append(message);
	var height = $('#consolePane')[0].scrollHeight;
	$('#consolePane').scrollTop(height);
}

$(document).ready(function() {
	$('#generateFile').click(function() {
		generateFile();
	});
});

function generateFile() {
    alert('Yet to implement server code');
    return;
    //TODO: yet to implement server code
	var request = $.ajax({
		url : "AppController",
		method : "POST",
		data : {
			action : "generateFile",
			content : $('#rightPane').html()
		},
		cache : false
	});

	request.done(function(response) {
		alert(response);
	});

	request.fail(function(jxhr, status) {
		alert("Fail : " + jxhr.STATUS);
	});
}

function toggleMenu() {
	var className = $("#toggle_menu").attr("class");
	if (className == 'open_toggle') {
		$("#leftPane").toggle('slide', {
			percent : 0
		}, 500);
		$("#toggle_menu").toggleClass('open_toggle close_toggle');
		// $('#toggle_menu').removeClass('open_toggle').addClass('close_toggle');
		$('#toggle_menu').attr("src", "images/plus.png");
	} else {
		$("#leftPane").toggle('slide', {
			percent : 0
		}, 500);
		$("#toggle_menu").toggleClass('close_toggle open_toggle');
		$('#toggle_menu').attr("src", "images/minus.png");
	}
}

function toggleMenu2() {
	$('#propPane').css("display", "none");
	var className = $("#toggleMenu").attr("class");
	if (className == 'open_menu') {
		$("#leftPane").toggle('slide', {
			percent : 0
		}, 500);
		$("#toggleMenu").toggle('fade', {
			percent : 0
		}, 100);
		$("#toggleMenu").toggle('fade', {
			percent : 0
		}, 500);
		$("#toggleMenu").toggleClass('open_menu close_menu');
		// $('#toggleMenu').html("&gt;");
	} else {
		$("#toggleMenu").toggle('slide', {
			percent : 0
		}, 400);
		$("#toggleMenu").toggle('fade', {
			percent : 0
		}, 400);
		// $( "#toggleMenu" ).toggle( 'slide', { percent: 0 }, 380 );
		$("#leftPane").toggle('slide', {
			percent : 0
		}, 500);
		$("#toggleMenu").toggleClass('close_menu open_menu');
		// $('#toggleMenu').html("&lt;");
	}
}

function changeTheme() {

	var value = $('#themeId option:selected').val();
	var textColor = $('#themeId option:selected').text();
	$('#leftPane').css('background-color', value);
	$('#leftPane li').css('background-color', value);

	$('#leftPane').css('color', textColor);
	$('#leftPane li').css('color', textColor);

}

function changeTheme2(value) {
	$('#leftPane').css('background-color', value);
	$('#leftPane li').css('background-color', value);
}

function changeTheme3(value) {
	$('#leftPane').css('color', value);
	$('#leftPane li').css('color', value);
}

function getComponent(name) {
	var component = "";

	var attrArr = attrList[name];
	var nodeName = '';
	var innerHTMLData = '';
	var endTagFlag = false;

	for (i in attrArr) {
		var key = i;
		var val = attrArr[i];
		if (key == 'nodeName') {
			component += '<' + val;
			nodeName = val;
		} else if (key == 'endTag') {
			endTagFlag = val == 'yes';
		} else if (key != 'innerHTML') {
			component += ' ' + key + ' = "' + val + '" ';
		} else {
			innerHTMLData = val;
		}
	}

	if (endTagFlag) {
		if (name == 'Text Area') {
			component += ">" + innerHTMLData + "</textarea></span>";
		} else {
			component += ">" + innerHTMLData + "</" + nodeName + ">";
		}
	} else {
		component += "/>";
	}
	return component;
}

function test() {
	alert($('.dragitems').is('.ui-droppable'));
	alert($('#rightPane').html());
}