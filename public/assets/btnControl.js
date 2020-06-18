var btnStates = [
	false,
	true,
	false,
	false,
	true,
	false
]

function updateBtn() {
	
	for ( let s of btnStates ) {
		if(!s) {
			$("input[type='Submit']").attr('disabled', true);
			return;
		}
	}
	$("input[type='Submit']").attr('disabled', false);
}

$(document).ready(function(){
	
	$("input[name='1']").on('input', function(){
		btnStates[0] = this.attributes.value != "";
		updateBtn();
	});

	$("[state='checkbox']").click(function(){
		// console.log(this.children[0].children[0].value);
		this.children[0].children[0].checked = true;
	});

	// $("input[type='checkbox']").change(function(){
	// 	btnStates[2] = true;
	// 	updateBtn();
	// });

	$("div[state='radio']").click(function(){
		// console.log(this.children[0].children[0].value);
		this.children[0].checked = true;
		btnStates[2] = true;
		updateBtn();
	});

	$("input[type='radio']").change(function(){
		btnStates[this.name] = true;
		updateBtn();
	});


	$("td[state='radio']").click(function(){
		// console.log(this.children[0].children[0].value);
		this.children[0].checked = true;
		btnStates[3] = true;
		updateBtn();
	});

	$("input[name='6']").on('input', function(){
		btnStates[5] = this.attributes.value != "";
		updateBtn();
	});

	updateBtn();
});