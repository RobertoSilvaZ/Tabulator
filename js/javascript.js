
function calculateTotal() {
	/*colocar aquí cálculos*/
}

function validPage1() {
	//Colocar aquí tu validación
	return true;
}

function validPage2() {
	//Colocar aquí tu validación
	return true;
}

function validPage3() {
	//Colocar aquí tu validación
	return true;
}

function validPage4() {
	//Colocar aquí tu validación
	return true;
}

function validPage5() {
	//Colocar aquí tu validación
	return true;
}

function generateNumbersTable() {

}

/*******************/
/*     CONFIG      */
/*******************/
$(document).ready(function() {
    var page1 = $('#page-1');
    var page2 = $('#page-2');
    var page3 = $('#page-3');
    var page4 = $('#page-4');
    var page5 = $('#page-5');

	function searchCustomer() {
		/*Aquí va tu condicional si encuentra al cliente*/
		var existCustomer = true;
		if(existCustomer) {
		    page2.find('.body').find('#search-content').fadeIn(300, function() {
		        page2.find('.body').find('#search-result-content').fadeIn(300);
		        page2.find('.footer').find('#btn-next').removeAttr('disabled')
		    });
		}
	}

	/*Navigation*/
	page1.find('.footer').find("#btn-next").click(function(event){
	    event.preventDefault(); 
	    if(validPage1()) { 
	    	activePageTab(page2); 
	    	activePageTabHeader(page2);
	    }
	});

	page2.find('.footer').find("#btn-next").click(function(event){
	    event.preventDefault();  
	    if(validPage2()) { 
	    	activePageTab(page3); 
	    	activePageTabHeader(page3);
	    }
	});

	page3.find('.footer').find("#btn-next").click(function(event){
	    event.preventDefault();  
	    if(validPage3()) { 
	    	activePageTab(page4); 
	    	activePageTabHeader(page4);
	    } 
	});

	page4.find('.footer').find("#btn-next").click(function(event){
	    event.preventDefault();  
		var rows = getCountProduct();	
	    if(validPage4() && rows > 0) { 
	    	activePageTab(page5);
	    	activePageTabHeader(page5);
		} else {
	    	alert('Para continuar debes agregar productos a tu pedido')
	    }
	});

	page5.find('.footer').find("#btn-ordernow").click(function(event){
	    event.preventDefault();  
	    if(validPage5()) {
	    	alert('Pedido realizado!')
	    }
	});

	page2.find('.body').find("#searchCustomer").click(function(event){
	    event.preventDefault(); 
	    searchCustomer()
	});

})




