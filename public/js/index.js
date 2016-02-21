String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function newTopicRow(className, probability) {
	var tmpInt = Math.round(probability * 100);
	var tmpDiv = document.createElement('div')
	var tmpSpan = document.createElement('span');
	tmpDiv.className = 'col-sm-12';
	tmpSpan.innerHTML = className + ' (About ' + tmpInt + '%)';
	tmpDiv.setAttribute('style', 'padding:0px;');
	tmpDiv.appendChild(tmpSpan);
								
	var tmpProgress = document.createElement('div');
	tmpProgress.className = 'progress';
	tmpProgress.setAttribute('style', 'margin-top:5px;');
								
	var tmpProgressBar = document.createElement('div');
	tmpProgressBar.className= 'progress-bar';
	tmpProgressBar.setAttribute('role','progressbar');
	tmpProgressBar.setAttribute('aria-valuenow', tmpInt);
	tmpProgressBar.setAttribute('aria-valuemin', 0);
	tmpProgressBar.setAttribute('aria-valuemax', 100);
	tmpProgressBar.setAttribute('style', 'width: ' + tmpInt + '%;');
								
	tmpProgress.appendChild(tmpProgressBar);
	tmpDiv.appendChild(tmpProgress);
	return tmpDiv;								
}

function sortArray(arr, prop) {
	for (var a = 0; a < arr.length; a++)
		for (var b = a + 1; b < arr.length; b++)
			if (arr[a][prop] < arr[b][prop]) {
				var tg = arr[a];
				arr[a] = arr[b];
				arr[b] = tg;
			}	
}

function arrayAllTrues(arr) {
	for (var i = 0; i < arr.length; i++)
		if (arr[i] === false)
			return false;
	return true;
}

function arrayObjectIndexOf(myArray, searchTerm) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i] === searchTerm) return i;
    }
    return -1;
}

function onClickCheckbox(cb) {
	if (cb.checked) {
		$('#topics-container').addClass('hidden');
		$('#subtopics-container').removeClass('hidden');
	}
	else {
		$('#topics-container').removeClass('hidden');
		$('#subtopics-container').addClass('hidden');
	}
}

function loadSampleDocument() {
	var sampletext = "For many Americans who talked to John Oliver on Last Week Tonight, the answer is no.\n\nIt’s been almost two years since the world was captivated by Snowden’s leaks to The Guardian and The Washington Post about American surveillance programs. For weeks it seemed there was a new headline everyday about another previously classified surveillance program or another government official calling for action on this issue. Presidential review groups were called. President Obama called for major changes to the programs.\n\nAlthough the Snowden leaks certainly proved to be much more than a “three-day story,” American surveillance practices remain largely the same two years later. The main difference is this issue no longer dominates our political discourse. In November, the FREEDOM Act — legislation under development for two years that would have overhauled NSA surveillance programs — died in a Senate procedural vote to little display.\n\nLast night we found out Oliver’s HBO program was off last week because he was in Russia interviewing “the most famous hero and/or traitor in recent American history.” Oliver hit on many points that have been lacking in past interviews with the former government contractor — from whether Snowden misses Hot Pockets to whether he’s actually read all of the documents he’s released to reporters (Snowden maintained he understands the scope of the documents).\n\nOliver’s interview is timely as we approach an important deadline for surveillance reform on June 1. In response to the public outcry that followed the Snowden revelations, President Obama stipulated that congress must renew or reform the Patriot Act provision authorizing the bulk collection of Americans’ phone records by that date, or else the program will expire.\n\nOnline this morning, Twitter, Reddit and the expected publications were abuzz with how “John Oliver killed it” and or “slayed it” in this new segment.\n\nDespite what network news chose to lead with, the interview’s significance extends beyond Snowden saying you should keep sending dirty pictures. It’s important because millions of people who haven’t thought about surveillance reform in months are going to click on this YouTube video and care about it again.\n\nLast summer we saw Oliver’s ability to captivate the public’s attention when it came to the complex, technical issue of net neutrality. His commentary prompted tens of thousands to submit comments to the Federal Communications Commission, helping net neutrality receive more public input than any other FCC docket item that came before it. In just 13 minutes, Oliver helped change the future of the Internet.\n\nSo what will the 33 minutes he spent on government surveillance reform do?\n\nThe FREEDOM Act’s failure last year can largely be attributed to a lack of public support and understanding. If the average voter doesn’t know the name Edward Snowden, how can they be expected to know about Section 215 of the Patriot Act?\n\nEver able to make us laugh about even the driest news topics, Oliver changed the topic of discussion from vague hypotheticals about civil liberties to something tangible he knew many Americans would care about — dick pics.\n\n“Well the good news is there’s no program named, ‘the dick pic program,'” Snowden said.  “The bad news is they are still collecting everybody’s information, including your dick pics.”\n\nSnowden then went on to explain how the government uses different programs to access those pictures, from Executive Order 12333 to Section 702 of the Foreign Intelligence Surveillance Act. He was able to explain confusing provisions of American surveillance law in just a few sentences.\n\nHopefully as this debate returns to Washington and we turn to more serious conversations about surveillance reform, Oliver’s jokes will keep Americans engaged and calling on their representatives to act on surveillance reform.";
    document.getElementById("textdocument").value = sampletext;
}

function resetDocumentTxtArea() {
	document.getElementById("textdocument").value = "";
}

function onSubmitButtonClicked() {
    var textdata =  document.getElementById("textdocument").value;
    if (textdata.replace(/\s/g, "").length === 0) 
        sweetAlert("Oops...", "Your text document is empty !!!", "error");
    else {
		$('#myPleaseWait').modal('show');
		$.ajax({
			type: "POST",
			url: "/api/summarize",
			data: JSON.stringify({
				text: textdata
			}),
			contentType: "application/json",
			dataType:'json',
			success: function (data) {
				data_payload = JSON.parse(data.payload);
				$('#summary-container').find('tbody').empty();
				for (var i = 0; i < data_payload.length; i++) {
					var tmpTr = document.createElement('tr');
					var tmpTh = document.createElement('th');
					var tmpTd = document.createElement('td');
					tmpTd.innerHTML = (data_payload[i]);
					tmpTh.innerHTML = (i+1);
					tmpTr.appendChild(tmpTh);
					tmpTr.appendChild(tmpTd);
					$('#summary-container').find('tbody').append(tmpTr);
				}
				$.ajax({
					type: "POST",
					url: "/api/classify",
					data: JSON.stringify({
						text: textdata
					}),
					contentType: "application/json",
					dataType:'json',
					success: function (data) {
						data_payload = JSON.parse(data.payload).uclassify.readCalls.classify.classification.class;
						
						data_payload.forEach(function (e) {
							e.p = parseFloat(e.p);
						});
						
						sortArray(data_payload, 'p');
						
						topic_p = [];
						topic_names = [];
						tmp_booleans_arr = [];
						$('#topics-container').empty();
						for (var j = 0; j < data_payload.length; j++) 
							if (Math.round(parseFloat(data_payload[j].p) * 100) > 0 ) {
								var className = data_payload[j].className;
								var probability = data_payload[j].p;
								
								topic_names.push(className);
								topic_p.push(probability);
								tmp_booleans_arr.push(false);
								
								$('#topics-container').append(newTopicRow(className, probability));
							}

						var subtopicsdata = [];
						topic_names.forEach(function (topic_name) {
							$.ajax({
								type: "POST",
								url: "/api/classifybysubtopics",
								data: JSON.stringify({
									text: textdata,
									topicname: topic_name
								}),
								contentType: "application/json",
								dataType:'json',
								success: function (data) {
									data_payload = JSON.parse(data.payload).uclassify.readCalls.classify.classification.class;
									var tmpIdx = arrayObjectIndexOf(topic_names, topic_name);
									tmp_booleans_arr[tmpIdx] = true;
									data_payload.forEach(function (subtopicdata) {
										subtopicdata.p = parseFloat(subtopicdata.p) * topic_p[tmpIdx];
										subtopicdata.className = subtopicdata.className.replaceAll('_',' ');
									});
									subtopicsdata = subtopicsdata.concat(data_payload);

									if (arrayAllTrues(tmp_booleans_arr)) {
										sortArray(subtopicsdata, 'p');
											
										$('#subtopics-container').empty();
										for (var j = 0; j < subtopicsdata.length; j++) 
											if (Math.round(subtopicsdata[j].p * 100) > 0 ) {
												var className = subtopicsdata[j].className;
												var probability = subtopicsdata[j].p;
												$('#subtopics-container').append(newTopicRow(className, probability));
											}
										$('#myPleaseWait').modal('hide');
										$('#checkbox1').attr('checked', false); // Unchecks it
										$('#summary-container').removeClass('hidden');
										$('#topics-and-subtopics-container').removeClass('hidden');
										$('#subtopics-container').addClass('hidden');
										$('#topics-container').removeClass('hidden');
										document.getElementById('summary-container').scrollIntoView();
									}
								}
							});		
						});
					}
				});				
			}
		});
    }
}