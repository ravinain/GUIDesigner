function createNewRow(id, numberOfRows) {
	var totalRows = $('#'+id+' tr').length;
	var rowIndex = totalRows;
	
	var rowData = '';
	
	for(var counter = 0; counter < numberOfRows; counter++) {
		rowData += '<tr><td><input type="text" value="" name="column_name_'+rowIndex+'" id="column_name_'+rowIndex+'" /></td>';
		rowData += '<td><select name="data_type_'+rowIndex+'" id="data_type_'+rowIndex+'">';
		rowData += '<option value="string">string</option><option value="integer">integer</option></select></td>';
		rowData += '<td><input type="text" value="" name="size_'+rowIndex+'" id="size_'+rowIndex+'" /></td></tr>';
		rowIndex++;
	}
	$('#'+id).append(rowData);
}

$(document).ready(function(){
	$('#addMoreColumn').click(function(){
		createNewRow('colTable', 1);
	});
	
	$('#createTable').click(function() {
		createNewTable('colTable');
	});
});

function createNewTable(colTableId) {
	var tableName = $('#tableId').val();
	var numberOfRows = $('#'+colTableId+' tr').length;
	
	var requestData = '[';
	
	for(var index=1; index < numberOfRows; index++) {
		requestData += '{"COL_NAME":'+'"'+$('#column_name_'+index).val()+'",';
		requestData += '"DATA_TYPE":'+'"'+$('#data_type_'+index+' option:selected').val()+'",';
		if(index+1 == numberOfRows) {
			requestData += '"SIZE":"'+$('#size_'+index).val()+'"}';
		} else {
			requestData += '"SIZE":"'+$('#size_'+index).val()+'"},';
		}
	}
	requestData += ']';
	alert(requestData);
	//requestData = eval(requestData);
	
	var request = $.ajax({
			url : 'AppController?action=createTable&tableName='+tableName, 
			data : requestData,
			contentType : 'application/json',
			processData : false,
			type : 'POST',
			success: function(response){
             alert('Success : '+response);
            },
            error: function(response) {
              alert('Error:'+response);
            }
		});

	/*var request = $.ajax({
						url : "AppController",
						method : "POST",
						data : {action:"createTable"}
					});
	
	request.done(function(response){
		alert(response);
	});
	
	request.fail(function(jxhr, status){
		alert('Fail : '+jxhr.status);
	});*/
	
}

